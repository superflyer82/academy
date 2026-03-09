import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? 'fallback-access-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'fallback-refresh-secret';
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES_IN ?? '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  type: 'staff' | 'citizen';
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES } as jwt.SignOptions);
}

export function signRefreshToken(payload: Pick<JwtPayload, 'sub' | 'type'>): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): Pick<JwtPayload, 'sub' | 'type'> {
  return jwt.verify(token, REFRESH_SECRET) as Pick<JwtPayload, 'sub' | 'type'>;
}
