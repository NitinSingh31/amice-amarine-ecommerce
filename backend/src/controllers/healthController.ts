import { Request, Response } from 'express';
import { isDbConnected } from '../config/db.js';
import { sendSuccess } from '../utils/responseHandler.js';

export function getHealth(req: Request, res: Response): Response {
  return sendSuccess(res, {
    status: 'online',
    appName: 'Amice Amarine API',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      connected: isDbConnected(),
      state: isDbConnected() ? 'healthy' : 'disconnected',
    },
    memoryUsage: process.memoryUsage(),
  }, 'Amice Amarine service is healthy and operational');
}
