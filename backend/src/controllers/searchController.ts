import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product.js';
import { sendSuccess } from '../utils/responseHandler.js';

export async function getSearchSuggestions(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const q = ((req.query.q as string) || '').trim();

    if (!q || q.length < 2) {
      sendSuccess(res, { suggestions: [] });
      return;
    }

    const regex = new RegExp(q, 'i');

    const suggestions = await Product.find({
      status: 'published',
      $or: [
        { name: regex },
        { subtitle: regex },
        { tags: regex },
      ],
    })
      .select('name slug subtitle basePrice compareAtPrice discountPercentage images tags category')
      .populate('category', 'name slug')
      .limit(6);

    sendSuccess(res, { suggestions });
  } catch (error) {
    next(error);
  }
}

export async function searchProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const q = ((req.query.q as string) || '').trim();
    const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
    const limit = Math.min(30, Math.max(1, parseInt((req.query.limit as string) || '12', 10)));
    const skip = (page - 1) * limit;

    const filter: any = { status: 'published' };

    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [
        { name: regex },
        { subtitle: regex },
        { description: regex },
        { tags: regex },
      ];
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort({ isBestseller: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    sendSuccess(res, { products }, 'Search results', 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      query: q,
    });
  } catch (error) {
    next(error);
  }
}
