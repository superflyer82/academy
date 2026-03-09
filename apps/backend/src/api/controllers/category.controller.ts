import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';

const categorySchema = z.object({
  name: z.string().min(1).max(100),
  icon: z.string().min(1),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  responsibleDepartment: z.string().min(1),
  targetResolutionDays: z.number().int().min(1),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export async function getActiveCategories(_req: Request, res: Response): Promise<void> {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });
  res.json(categories);
}

export async function getAllCategories(_req: Request, res: Response): Promise<void> {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
  res.json(categories);
}

export async function createCategory(req: Request, res: Response): Promise<void> {
  const data = categorySchema.parse(req.body);
  const category = await prisma.category.create({ data });
  res.status(201).json(category);
}

export async function updateCategory(req: Request, res: Response): Promise<void> {
  const data = categorySchema.partial().parse(req.body);
  const category = await prisma.category.update({
    where: { id: Array.isArray(req.params['id']) ? req.params['id'][0] : req.params['id'] },
    data,
  });
  res.json(category);
}

export async function deleteCategory(req: Request, res: Response): Promise<void> {
  await prisma.category.update({
    where: { id: Array.isArray(req.params['id']) ? req.params['id'][0] : req.params['id'] },
    data: { isActive: false },
  });
  res.status(204).send();
}
