import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';

import reportsRouter from './api/routes/reports.routes';
import authRouter from './api/routes/auth.routes';
import categoriesRouter from './api/routes/categories.routes';
import adminRouter from './api/routes/admin.routes';
import { errorMiddleware, notFoundMiddleware } from './api/middleware/error.middleware';
import { logger } from './lib/logger';

const app = express();

// ─── Security middleware ──────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow serving uploaded images
}));

app.use(cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  credentials: true,
}));

// ─── Rate limiting ────────────────────────────────────────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
}));

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Static files (uploads) ──────────────────────────────────────────────────
const uploadDir = path.resolve(process.env.UPLOAD_DIR ?? './uploads');
app.use('/uploads', express.static(uploadDir));

// ─── Request logging ─────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  logger.debug({ method: req.method, url: req.url }, 'Incoming request');
  next();
});

// ─── API Routes ───────────────────────────────────────────────────────────────
const prefix = process.env.API_PREFIX ?? '/api/v1';
app.use(`${prefix}/auth`, authRouter);
app.use(`${prefix}/reports`, reportsRouter);
app.use(`${prefix}/categories`, categoriesRouter);
app.use(`${prefix}/admin`, adminRouter);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ─── Error handling ───────────────────────────────────────────────────────────
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
