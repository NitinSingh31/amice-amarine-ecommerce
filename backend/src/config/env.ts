import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform((v) => parseInt(v, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  BACKEND_URL: z.string().default('http://localhost:5000'),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/amice_amarine'),
  JWT_SECRET: z.string().default('super_secret_amice_amarine_jwt_key_change_in_production_2026'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  COOKIE_SECRET: z.string().default('super_secret_cookie_secret_change_in_production_2026'),
  ADMIN_SECRET_KEY: z.string().default('admin_access_token_secure_setup_2026'),
  UPLOAD_DIR: z.string().default('uploads'),
  MAX_FILE_SIZE_MB: z.string().default('5').transform((v) => parseInt(v, 10)),
  STORE_NAME: z.string().default('Amice Amarine'),
  STORE_CURRENCY: z.string().default('INR'),
  STORE_FREE_SHIPPING_THRESHOLD: z.string().default('999').transform((v) => parseInt(v, 10)),
  STORE_STANDARD_SHIPPING_FEE: z.string().default('99').transform((v) => parseInt(v, 10)),
  STORE_COD_ENABLED: z.string().default('true').transform((v) => v === 'true'),
  STORE_COD_FEE: z.string().default('50').transform((v) => parseInt(v, 10)),
  CLOUDINARY_CLOUD_NAME: z.string().default('dobqwvddb'),
  CLOUDINARY_API_KEY: z.string().default('537941754467769'),
  CLOUDINARY_API_SECRET: z.string().default('-VQS9Y5-iimjvAVzxHM5F12PRE0'),
  CLOUDINARY_URL: z.string().optional(),
});

// Support both MONGO_URI and MONGODB_URI, and CLIENT_URL and FRONTEND_URL
const normalizedEnv = {
  ...process.env,
  MONGODB_URI: process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/amice_amarine',
  FRONTEND_URL: process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000',
};

const parsed = envSchema.safeParse(normalizedEnv);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
