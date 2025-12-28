import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth.service';
import { UnauthorizedError } from '../utils/errors';
import { AuthRequest } from '../types';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    (req as AuthRequest).user = {
      id: decoded.userId,
      email: decoded.email,
      username: decoded.username,
    };

    next();
  } catch (error) {
    next(error);
  }
};
