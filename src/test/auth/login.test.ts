import request from 'supertest';
import { createApp } from '../../app';
import prisma from '../../lib/prisma';

const app = createApp();

beforeEach(async () => {
  await prisma.user.deleteMany({
    where: {
      email: 'loginuser@example.com',
    },
  });

  await prisma.user.create({
    data: {
      username: 'loginuser',
      email: 'loginuser@example.com',
      password: await require('bcryptjs').hash('Password123!', 10),
    },
  });
});

describe('POST /api/auth/login', () => {
  it('should login successfully with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'loginuser@example.com',
      password: 'Password123!',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('loginuser@example.com');
  });

  it('should fail with incorrect password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'loginuser@example.com',
      password: 'WrongPassword',
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
