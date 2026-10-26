import { Router } from 'express';
import multer from 'multer';
import { uploadToCloudinary } from '../services/cloudinaryService.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { AppError } from '../utils/AppError.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new AppError('Only image files are allowed', 400));
    }
  },
});

router.post('/image', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('No image file provided', 400);
    }
    const folder = (req.body.folder as string) || 'amice-amarine/products';
    const result = await uploadToCloudinary(req.file.buffer, folder);
    return sendSuccess(res, result, 'Image uploaded to Cloudinary successfully', 201);
  } catch (error) {
    next(error);
  }
});

export default router;
