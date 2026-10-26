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
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowed = [env.FRONTEND_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'];
      if (allowed.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
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

// Root Status Landing Page
app.get('/', (req, res) => {
  res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Amice Amarine API // System Operational</title>
  <style>
    body {
      background: #09090b;
      color: #fafafa;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }
    .card {
      background: #18181b;
      border: 1px solid #27272a;
      padding: 36px;
      max-width: 520px;
      width: 100%;
      box-shadow: 0 0 50px rgba(255, 0, 85, 0.15);
    }
    .badge {
      display: inline-block;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #10b981;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    h1 {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    p {
      color: #a1a1aa;
      font-size: 14px;
      line-height: 1.6;
      margin: 0 0 24px 0;
    }
    .links {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    a.btn {
      display: block;
      text-align: center;
      padding: 12px 18px;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      text-decoration: none;
      transition: all 0.2s;
    }
    a.primary {
      background: #ff0055;
      color: #fff;
    }
    a.primary:hover {
      background: #e6004c;
    }
    a.secondary {
      background: #27272a;
      color: #fafafa;
    }
    a.secondary:hover {
      background: #3f3f46;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">● Core API Online</div>
    <h1>Amice Amarine Engine</h1>
    <p>This is the production backend REST API connected to MongoDB Atlas & Cloudinary CDN. The visual customer storefront is hosted live on Vercel.</p>
    <div class="links">
      <a href="https://frontend-ten-zeta-4fq178colr.vercel.app" class="btn primary" target="_blank">Open Live Storefront →</a>
      <a href="/api/health" class="btn secondary">View System Health Status</a>
      <a href="/api/products" class="btn secondary">View Product Catalog JSON</a>
    </div>
  </div>
</body>
</html>`);
});

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
