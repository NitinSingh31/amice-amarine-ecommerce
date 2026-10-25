import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { AppError } from '../utils/AppError.js';

export async function getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      page = '1',
      limit = '12',
      category,
      sort = 'newest',
      search,
      minPrice,
      maxPrice,
      size,
      color,
      inStock,
      discount,
      featured,
      bestseller,
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const filter: any = { status: 'published' };

    // Category filter
    if (category && category !== 'all-products' && category !== 'all') {
      const catDoc = await Category.findOne({ slug: category });
      if (catDoc) {
        filter.category = catDoc._id;
      }
    }

    // Search query
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: regex },
        { subtitle: regex },
        { tags: regex },
      ];
    }

    // Price range
    if (minPrice || maxPrice) {
      filter.basePrice = {};
      if (minPrice) filter.basePrice.$gte = parseFloat(minPrice);
      if (maxPrice) filter.basePrice.$lte = parseFloat(maxPrice);
    }

    // Size filter (can be comma-separated like "M,L")
    if (size) {
      const sizesArray = size.split(',').map((s) => s.trim().toUpperCase());
      filter['variants.size'] = { $in: sizesArray };
    }

    // Color filter
    if (color) {
      const colorsArray = color.split(',').map((c) => new RegExp(c.trim(), 'i'));
      filter['variants.color'] = { $in: colorsArray };
    }

    // In Stock filter
    if (inStock === 'true') {
      filter['variants.stock'] = { $gt: 0 };
    }

    // Discount filter (minimum discount percentage)
    if (discount) {
      filter.discountPercentage = { $gte: parseInt(discount, 10) };
    }

    // Featured / Bestseller flags
    if (featured === 'true') filter.isFeatured = true;
    if (bestseller === 'true') filter.isBestseller = true;

    // Sorting
    let sortOption: any = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { basePrice: 1 };
    else if (sort === 'price_desc') sortOption = { basePrice: -1 };
    else if (sort === 'discount') sortOption = { discountPercentage: -1 };
    else if (sort === 'popular') sortOption = { isBestseller: -1, totalStock: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    sendSuccess(
      res,
      { products },
      'Products fetched successfully',
      200,
      {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      }
    );
  } catch (error) {
    next(error);
  }
}

export async function getProductBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug, status: 'published' }).populate('category', 'name slug');
    if (!product) {
      throw new AppError(`Product '${slug}' not found`, 404, 'NOT_FOUND');
    }

    // Related products from same category or complementary
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      status: 'published',
    })
      .limit(4)
      .select('name slug subtitle basePrice compareAtPrice discountPercentage images tags variants')
      .populate('category', 'name slug');

    sendSuccess(res, { product, relatedProducts });
  } catch (error) {
    next(error);
  }
}

export async function getFeaturedProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const products = await Product.find({ isFeatured: true, status: 'published' })
      .populate('category', 'name slug')
      .limit(8)
      .sort({ createdAt: -1 });

    sendSuccess(res, { products }, 'Featured products retrieved');
  } catch (error) {
    next(error);
  }
}

export async function getNewArrivals(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const products = await Product.find({ isNewArrival: true, status: 'published' })
      .populate('category', 'name slug')
      .limit(8)
      .sort({ createdAt: -1 });

    sendSuccess(res, { products }, 'New arrivals retrieved');
  } catch (error) {
    next(error);
  }
}
