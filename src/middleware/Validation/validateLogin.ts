import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../../errors/AppError';
import { EMAIL_REGEX, PASSWORD_MIN_LENGTH } from '../../constants/validation';

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Email and password are required');
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
