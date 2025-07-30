import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../../errors/AppError';
import {
  EMAIL_REGEX,
  PASSWORD_MIN_LENGTH,
  USERNAME_MIN_LENGTH,
} from '../../constants/validation';

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new BadRequestError('Username, email and password are required');
  }

  if (username.length < USERNAME_MIN_LENGTH) {
    throw new BadRequestError(
      `Username must be at least ${USERNAME_MIN_LENGTH} characters`
    );
  }

  if (!EMAIL_REGEX.test(email)) {
    throw new BadRequestError('Invalid email format');
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    throw new BadRequestError(
      `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
    );
  }

  next();
};
