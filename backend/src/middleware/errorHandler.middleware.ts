import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors';

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  stack?: string;
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  if (err instanceof AppError && err.isOperational) {
    const response: ErrorResponse = {
      success: false,
      message: err.message,
    };

    if (err instanceof ValidationError && err.errors) {
      response.errors = err.errors as Record<string, string[]>;
    }

    if (process.env.NODE_ENV === 'development') {
      response.stack = err.stack;
    }

    return res.status(err.statusCode).json(response);
  }

  const response: ErrorResponse = {
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  return res.status(500).json(response);
};
