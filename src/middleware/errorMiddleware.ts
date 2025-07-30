import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

function errorMiddleware(
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.stack);

  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
  });
}

export default errorMiddleware;
