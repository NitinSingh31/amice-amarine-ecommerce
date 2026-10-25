import { Request, Response, NextFunction } from 'express';
import { StoreSettings } from '../models/StoreSettings.js';
import { sendSuccess } from '../utils/responseHandler.js';

export async function getPublicSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = await StoreSettings.create({});
    }
    sendSuccess(res, { settings }, 'Public store settings retrieved');
  } catch (error) {
    next(error);
  }
}
