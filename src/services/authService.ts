import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { BadRequestError, UnauthorizedError } from '../errors/AppError';

interface RegisterUserInput {
  username: string;
  email: string;
  password: string;
}

interface LoginUserInput {
  email: string;
  password: string;
}

type LoginResponse = {
  message: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
  token: string;
};

export const registerUser = async ({
  username,
  email,
  password,
}: RegisterUserInput) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (existingUser) {
    throw new BadRequestError('Username or email already exists');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Store the new user
  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });
  return {
    message: 'User registered successfully !',
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    },
    token,
  };
};

export const loginUser = async ({
  email,
  password,
}: LoginUserInput): Promise<LoginResponse> => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Check the password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Create a JWT
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: '1h',
    }
  );
  return {
    message: 'Logged in successfully',
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    token,
  };
};
