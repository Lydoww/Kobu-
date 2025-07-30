import request from 'supertest';
import { createApp } from '../../app';
import prisma from '../../lib/prisma';

const app = createApp();

beforeEach(async () => {
  await prisma.user.deleteMany({
    where: {
      email: {
        in: ['testuser@example.com', 'duplicate@example.com'],
      },
    },
  });
});

describe('POST /api/auth/register', () => {
  it('should register a user with valid data', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'TestPassword123!',
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe('testuser@example.com');
  });

  it('should fail if email is already taken', async () => {
    await request(app).post('/api/auth/register').send({
      username: 'duplicate',
      email: 'duplicate@example.com',
      password: 'TestPassword123!',
    });

    const res = await request(app).post('/api/auth/register').send({
      username: 'other',
      email: 'duplicate@example.com',
      password: 'TestPassword123!',
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
