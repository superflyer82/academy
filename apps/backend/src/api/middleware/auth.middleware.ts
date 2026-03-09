import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '../../lib/jwt';
import { StaffRole } from '@maengelmelder/shared-types';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized', message: 'Missing or invalid token' });
    return;
  }
  const token = authHeader.slice(7);
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token' });
  }
}

export function requireStaff(req: Request, res: Response, next: NextFunction): void {
  requireAuth(req, res, () => {
    if (req.user?.type !== 'staff') {
      res.status(403).json({ error: 'Forbidden', message: 'Staff access required' });
      return;
    }
    next();
  });
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  requireAuth(req, res, () => {
    if (req.user?.type !== 'staff' || req.user?.role !== StaffRole.ADMIN) {
      res.status(403).json({ error: 'Forbidden', message: 'Admin access required' });
      return;
    }
    next();
  });
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    try {
      req.user = verifyAccessToken(authHeader.slice(7));
    } catch {
      // ignore invalid token for optional auth
    }
  }
  next();
}
