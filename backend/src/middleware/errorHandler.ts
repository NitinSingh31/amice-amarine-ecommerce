import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import { sendError } from '../utils/responseHandler.js';
import { ZodError } from 'zod';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): Response {
  // 1. Zod Validation Error
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    return sendError(res, 'Validation failed for request payload', 400, 'VALIDATION_ERROR', formattedErrors);
  }

  // 2. Custom AppError
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.errorCode, err.details);
  }

  // 3. Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue ? err.keyValue[field] : '';
    return sendError(res, `A record with ${field} '${value}' already exists.`, 409, 'DUPLICATE_RESOURCE');
  }

  // 4. Mongoose Cast Error (invalid ObjectId)
  if (err.name === 'CastError') {
    return sendError(res, `Invalid identifier format for parameter ${err.path}`, 400, 'INVALID_ID');
  }

  // 5. Default Unhandled Server Error
  console.error('[Unhandled Error]', err);
  const message = process.env.NODE_ENV === 'production' ? 'An unexpected internal error occurred' : err.message;
  return sendError(res, message, 500, 'INTERNAL_SERVER_ERROR');
}
