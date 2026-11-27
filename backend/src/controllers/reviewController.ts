import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Review } from '../models/Review.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { AppError } from '../utils/AppError.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function getProductReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const prodId = String(req.params.productId);

    if (!mongoose.Types.ObjectId.isValid(prodId)) {
      throw new AppError('Invalid product ID format.', 400, 'INVALID_PRODUCT_ID');
    }

    const reviews = await Review.find({ product: prodId })
      .sort({ createdAt: -1 })
      .limit(50);

    const stats = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(prodId) } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          star5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
          star4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
          star3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
          star2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
          star1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
        },
      },
    ]);

    const ratingSummary = stats[0]
      ? {
          average: Math.round(stats[0].avgRating * 10) / 10,
          total: stats[0].totalReviews,
          distribution: {
            5: stats[0].star5,
            4: stats[0].star4,
            3: stats[0].star3,
            2: stats[0].star2,
            1: stats[0].star1,
          },
        }
      : {
          average: 5.0,
          total: 0,
          distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        };

    sendSuccess(res, { reviews, ratingSummary });
  } catch (error) {
    next(error);
  }
}

export async function createReview(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { productId, rating, title, comment } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('Authentication required to submit review.', 401, 'UNAUTHORIZED');
    }

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      throw new AppError('Valid product ID is required.', 400, 'INVALID_PRODUCT_ID');
    }

    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      throw new AppError('Rating must be an integer between 1 and 5.', 400, 'INVALID_RATING');
    }

    if (!title || !comment) {
      throw new AppError('Title and review commentary are required.', 400, 'MISSING_REVIEW_FIELDS');
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new AppError('Product not found.', 404, 'PRODUCT_NOT_FOUND');
    }

    // Check if user already reviewed this product
    const existing = await Review.findOne({ product: productId, user: userId });
    if (existing) {
      throw new AppError('You have already submitted a review for this piece.', 409, 'DUPLICATE_REVIEW');
    }

    // Verify if buyer purchased this product
    const hasPurchased = await Order.exists({
      user: userId,
      'items.productId': productId,
      paymentStatus: 'paid',
    });

    const userDoc = await User.findById(userId);
    const userName = userDoc?.name || (req.user?.email ? req.user.email.split('@')[0] : 'Streetwear Operative');

    const review = await Review.create({
      product: productId,
      user: userId,
      userName,
      rating: Math.round(numRating),
      title: title.trim(),
      comment: comment.trim(),
      isVerifiedBuyer: Boolean(hasPurchased),
    });

    // Update Product averageRating & reviewCount
    const allReviews = await Review.find({ product: productId });
    const total = allReviews.length;
    const avg = total > 0 ? allReviews.reduce((sum, r) => sum + r.rating, 0) / total : 5.0;

    product.averageRating = Math.round(avg * 10) / 10;
    product.reviewCount = total;
    await product.save();

    sendSuccess(res, { review }, 'Review submitted successfully. Thank you for your feedback.', 201);
  } catch (error) {
    next(error);
  }
}
