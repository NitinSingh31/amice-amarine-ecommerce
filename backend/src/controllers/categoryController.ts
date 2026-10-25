import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/Category.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { AppError } from '../utils/AppError.js';

export async function getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
    sendSuccess(res, { categories }, 'Categories retrieved successfully');
  } catch (error) {
    next(error);
  }
}

export async function getCategoryBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug, isActive: true });
    if (!category) {
      throw new AppError(`Category '${slug}' not found`, 404, 'NOT_FOUND');
    }
    sendSuccess(res, { category });
  } catch (error) {
    next(error);
  }
}
