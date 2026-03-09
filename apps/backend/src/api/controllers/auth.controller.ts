import { Request, Response } from 'express';
import { z } from 'zod';
import * as authService from '../../services/auth.service';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

export async function staffLogin(req: Request, res: Response): Promise<void> {
  const { email, password } = loginSchema.parse(req.body);
  try {
    const result = await authService.loginStaff(email, password);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken: result.accessToken, user: result.user });
  } catch {
    res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials' });
  }
}

export async function citizenLogin(req: Request, res: Response): Promise<void> {
  const { email, password } = loginSchema.parse(req.body);
  try {
    const result = await authService.loginCitizen(email, password);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken: result.accessToken, user: result.user });
  } catch {
    res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials' });
  }
}

export async function citizenRegister(req: Request, res: Response): Promise<void> {
  const { email, password, name } = registerSchema.parse(req.body);
  try {
    const user = await authService.registerCitizen(email, password, name);
    res.status(201).json({ message: 'Registration successful', user });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Email already registered') {
      res.status(409).json({ error: 'Conflict', message: 'Email already registered' });
    } else {
      throw err;
    }
  }
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
}
