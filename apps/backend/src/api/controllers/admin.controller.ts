import { Request, Response } from 'express';
import { z } from 'zod';
import * as authService from '../../services/auth.service';
import * as configService from '../../services/config.service';
import * as statsService from '../../services/stats.service';
import * as exportService from '../../services/export.service';
import { prisma } from '../../lib/prisma';

// ─── Staff Management ─────────────────────────────────────────────────────────
export async function getStaff(_req: Request, res: Response): Promise<void> {
  const staff = await prisma.staffUser.findMany({
    select: { id: true, email: true, name: true, role: true, department: true, isActive: true, createdAt: true, lastLoginAt: true },
    orderBy: { name: 'asc' },
  });
  res.json(staff);
}

export async function createStaff(req: Request, res: Response): Promise<void> {
  const { email, name, role, department } = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    role: z.enum(['STAFF', 'ADMIN']),
    department: z.string().optional(),
  }).parse(req.body);

  try {
    const { user, tempPassword } = await authService.createStaffUser(email, name, role, department);
    res.status(201).json({ user, tempPassword });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Email already registered') {
      res.status(409).json({ error: 'Conflict', message: 'Email already registered' });
    } else {
      throw err;
    }
  }
}

export async function updateStaff(req: Request, res: Response): Promise<void> {
  const data = z.object({
    name: z.string().optional(),
    role: z.enum(['STAFF', 'ADMIN']).optional(),
    department: z.string().optional(),
    isActive: z.boolean().optional(),
  }).parse(req.body);

  const updated = await prisma.staffUser.update({
    where: { id: (req.params['id'] as string) },
    data,
    select: { id: true, email: true, name: true, role: true, department: true, isActive: true },
  });
  res.json(updated);
}

// ─── Config ───────────────────────────────────────────────────────────────────
export async function getAppConfig(_req: Request, res: Response): Promise<void> {
  const config = await configService.getConfig();
  res.json(config);
}

export async function updateAppConfig(req: Request, res: Response): Promise<void> {
  const allowedKeys = ['city.name', 'city.primaryColor', 'city.defaultLat', 'city.defaultLng', 'city.defaultZoom'];
  const data: Record<string, string> = {};
  for (const key of allowedKeys) {
    if (req.body[key] !== undefined) {
      data[key] = String(req.body[key]);
    }
  }
  await configService.setConfigs(data);
  const config = await configService.getConfig();
  res.json(config);
}

// ─── Stats + Export ───────────────────────────────────────────────────────────
export async function getStats(req: Request, res: Response): Promise<void> {
  const { dateFrom, dateTo } = z.object({
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
  }).parse(req.query);

  const stats = await statsService.getStats(dateFrom, dateTo);
  res.json(stats);
}

export async function exportReports(req: Request, res: Response): Promise<void> {
  const { format } = z.object({ format: z.enum(['csv', 'xlsx']).default('csv') }).parse(req.query);

  if (format === 'csv') {
    const csv = await exportService.exportCsv();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="meldungen.csv"');
    res.send('\ufeff' + csv); // BOM for Excel
  } else {
    const buffer = await exportService.exportXlsx();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="meldungen.xlsx"');
    res.send(buffer);
  }
}
