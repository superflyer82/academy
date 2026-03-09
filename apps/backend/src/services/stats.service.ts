import { prisma } from '../lib/prisma';
import { ReportStatus } from '@maengelmelder/shared-types';

export async function getStats(dateFrom?: string, dateTo?: string) {
  const where: Record<string, unknown> = {};
  if (dateFrom || dateTo) {
    where.createdAt = {
      ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
      ...(dateTo ? { lte: new Date(dateTo) } : {}),
    };
  }

  const [reports, byCategory] = await Promise.all([
    prisma.report.findMany({
      where,
      select: { status: true, priority: true, createdAt: true, updatedAt: true, categoryId: true },
    }),
    prisma.report.groupBy({
      by: ['categoryId'],
      where,
      _count: { id: true },
    }),
  ]);

  const byStatus: Record<string, number> = {};
  for (const s of Object.values(ReportStatus)) byStatus[s] = 0;
  for (const r of reports) byStatus[r.status]++;

  const categories = await prisma.category.findMany({ where: { id: { in: byCategory.map((c) => c.categoryId) } } });
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  const resolved = reports.filter((r) => r.status === ReportStatus.RESOLVED);
  const avgResolutionDays =
    resolved.length > 0
      ? resolved.reduce((sum, r) => {
          const ms = r.updatedAt.getTime() - r.createdAt.getTime();
          return sum + ms / (1000 * 60 * 60 * 24);
        }, 0) / resolved.length
      : 0;

  const now = new Date();
  const openOverdue = await prisma.report.count({
    where: {
      ...where,
      status: { in: [ReportStatus.OPEN, ReportStatus.IN_PROGRESS] },
    },
  });

  return {
    totalReports: reports.length,
    byStatus,
    byCategory: byCategory.map((c) => ({
      categoryId: c.categoryId,
      categoryName: categoryMap[c.categoryId] ?? 'Unbekannt',
      count: c._count.id,
    })),
    avgResolutionDays: Math.round(avgResolutionDays * 10) / 10,
    openOverdue,
    _now: now,
  };
}
