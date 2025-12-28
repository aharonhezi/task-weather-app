import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';

type AsyncFunction = (
  req: Request | AuthRequest,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as Request | AuthRequest, res, next)).catch(next);
  };
};
