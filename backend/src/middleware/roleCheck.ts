import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.js';
import { AppError } from '../utils/AppError.js';
import { UserRole, USER_ROLES } from '../config/constants.js';

export function authorizeRoles(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Unauthorized access. Log in first.', 401, 'UNAUTHORIZED'));
    }

    // Super admin has universal bypass
    if (req.user.role === USER_ROLES.SUPER_ADMIN) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      return next(
        new AppError(
          `Forbidden. Your role '${req.user.role}' lacks permission for this administrative resource.`,
          403,
          'FORBIDDEN'
        )
      );
    }

    next();
  };
}
