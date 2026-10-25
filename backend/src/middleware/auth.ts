import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt.js';
import { AppError } from '../utils/AppError.js';
import { User } from '../models/User.js';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { id: string };
}

export async function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Authentication required. Please log in to proceed.', 401, 'UNAUTHORIZED');
    }

    const decoded = verifyToken(token);
    
    // Check if user still exists and is active
    const user = await User.findById(decoded.userId).select('isActive role email');
    if (!user || !user.isActive) {
      throw new AppError('User account not found or has been deactivated.', 401, 'ACCOUNT_DEACTIVATED');
    }

    req.user = {
      ...decoded,
      id: decoded.userId,
    };

    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      next(new AppError('Invalid or expired authentication token. Please log in again.', 401, 'INVALID_TOKEN'));
    } else {
      next(error);
    }
  }
}

export function optionalAuthenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  try {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const decoded = verifyToken(token);
      req.user = {
        ...decoded,
        id: decoded.userId,
      };
    }
  } catch {
    // Ignore invalid token for optional auth
  }
  next();
}
