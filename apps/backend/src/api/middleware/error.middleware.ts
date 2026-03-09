import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../../lib/logger';

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid request data',
      details: err.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
    });
    return;
  }

  logger.error({ err, url: req.url, method: req.method }, 'Unhandled error');
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
  });
}

export function notFoundMiddleware(req: Request, res: Response): void {
  res.status(404).json({ error: 'Not Found', message: `Route ${req.method} ${req.url} not found` });
}
