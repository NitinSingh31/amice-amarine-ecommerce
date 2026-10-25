import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { AppError } from './utils/AppError.js';

const app = express();

// Security and middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(
  cors({
    origin: [env.FRONTEND_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(env.COOKIE_SECRET));

// Static files for uploaded images
const uploadsPath = path.resolve(process.cwd(), env.UPLOAD_DIR);
app.use('/uploads', express.static(uploadsPath));

// Global Rate Limiting
app.use('/api', globalLimiter);

// API Routes
app.use('/api', routes);

// 404 Handler for undefined API routes
app.all('/api/*', (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found on this server`, 404, 'NOT_FOUND'));
});

// Centralized Error Handler
app.use(errorHandler);

// Start Server after connecting to MongoDB
async function startServer(): Promise<void> {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`==================================================`);
    console.log(`  🚀 AMICE AMARINE BACKEND RUNNING`);
    console.log(`  🔗 Port: ${env.PORT}`);
    console.log(`  🌐 Environment: ${env.NODE_ENV}`);
    console.log(`  📊 API Health: ${env.BACKEND_URL}/api/health`);
    console.log(`==================================================`);
  });

  const handleShutdown = (signal: string) => {
    console.log(`[Server] ${signal} received. Closing HTTP server gracefully...`);
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
}

startServer().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});

export default app;
