import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/JwtPayload';
import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors/AppError';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('No token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    console.log(req.user);
    console.log('Decoded token payload:', decoded);

    next();
  } catch (error) {
    throw new UnauthorizedError('Invalid token');
  }
};
