import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { generateToken, setAuthCookie, clearAuthCookie } from '../utils/jwt.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { z } from 'zod';
import mongoose from 'mongoose';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new AppError('An account with this email address already exists.', 409, 'EMAIL_EXISTS');
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      role: 'customer',
    });

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    setAuthCookie(res, token);

    sendSuccess(
      res,
      {
        user,
        token,
      },
      'Account created successfully. Welcome to Amice Amarine.',
      201
    );
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password credentials.', 401, 'INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
      throw new AppError('This account has been deactivated. Please contact support.', 403, 'ACCOUNT_DEACTIVATED');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password credentials.', 401, 'INVALID_CREDENTIALS');
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    setAuthCookie(res, token);

    sendSuccess(
      res,
      {
        user,
        token,
      },
      'Login successful. Welcome back.'
    );
  } catch (error) {
    next(error);
  }
}

export function logout(req: Request, res: Response): void {
  clearAuthCookie(res);
  sendSuccess(res, null, 'Logged out successfully');
}

export async function getMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const user = await User.findById(req.user.id).populate('wishlist');
    if (!user) {
      throw new AppError('User profile not found', 404, 'NOT_FOUND');
    }

    sendSuccess(res, { user });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');

    const { name, phone } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');

    if (name) user.name = name.trim();
    if (phone) user.phone = phone.trim();

    await user.save();
    sendSuccess(res, { user }, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
}

export async function getAddresses(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');

    const user = await User.findById(req.user.id).select('addresses');
    sendSuccess(res, { addresses: user?.addresses || [] });
  } catch (error) {
    next(error);
  }
}

export async function addAddress(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');

    const { fullName, phone, addressLine1, addressLine2, city, state, postalCode, country = 'India', isDefault } = req.body;

    if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
      throw new AppError('Please fill in all required address fields.', 400, 'VALIDATION_ERROR');
    }

    const user = await User.findById(req.user.id);
    if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');

    // If marked as default, unmark any existing defaults
    if (isDefault || user.addresses.length === 0) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    const newAddress = {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault: isDefault || user.addresses.length === 0,
    };

    user.addresses.push(newAddress as any);
    await user.save();

    sendSuccess(res, { addresses: user.addresses }, 'Address added successfully', 201);
  } catch (error) {
    next(error);
  }
}

export async function updateAddress(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    const { addressId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');

    const address = (user.addresses as any).id(addressId);
    if (!address) throw new AppError('Address not found', 404, 'NOT_FOUND');

    const { fullName, phone, addressLine1, addressLine2, city, state, postalCode, country, isDefault } = req.body;

    if (isDefault) {
      user.addresses.forEach((addr: any) => {
        if (addr._id.toString() !== addressId) addr.isDefault = false;
      });
      address.isDefault = true;
    }

    if (fullName) address.fullName = fullName;
    if (phone) address.phone = phone;
    if (addressLine1) address.addressLine1 = addressLine1;
    if (addressLine2 !== undefined) address.addressLine2 = addressLine2;
    if (city) address.city = city;
    if (state) address.state = state;
    if (postalCode) address.postalCode = postalCode;
    if (country) address.country = country;

    await user.save();
    sendSuccess(res, { addresses: user.addresses }, 'Address updated successfully');
  } catch (error) {
    next(error);
  }
}

export async function deleteAddress(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    const { addressId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');

    user.addresses = user.addresses.filter((a: any) => a._id.toString() !== addressId);
    if (user.addresses.length > 0 && !user.addresses.some((a) => a.isDefault)) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    sendSuccess(res, { addresses: user.addresses }, 'Address removed successfully');
  } catch (error) {
    next(error);
  }
}

export async function toggleWishlist(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    const { productId } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      throw new AppError('Valid product ID required', 400, 'INVALID_ID');
    }

    const user = await User.findById(req.user.id);
    if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');

    const index = user.wishlist.findIndex((id) => id.toString() === productId);
    let isAdded = false;

    if (index > -1) {
      user.wishlist.splice(index, 1);
      isAdded = false;
    } else {
      user.wishlist.push(new mongoose.Types.ObjectId(productId) as any);
      isAdded = true;
    }

    await user.save();
    sendSuccess(res, { wishlist: user.wishlist, isAdded }, isAdded ? 'Added to wishlist' : 'Removed from wishlist');
  } catch (error) {
    next(error);
  }
}

export async function getWishlist(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');

    const user = await User.findById(req.user.id).populate({
      path: 'wishlist',
      select: 'name slug basePrice compareAtPrice discountPercentage images variants status category',
      populate: { path: 'category', select: 'name slug' },
    });

    sendSuccess(res, { wishlist: user?.wishlist || [] });
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || newPassword.length < 8) {
      throw new AppError('New password must be at least 8 characters', 400, 'VALIDATION_ERROR');
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new AppError('Current password is incorrect', 400, 'INVALID_CREDENTIALS');
    }

    user.password = newPassword;
    await user.save();

    sendSuccess(res, null, 'Password updated successfully');
  } catch (error) {
    next(error);
  }
}
