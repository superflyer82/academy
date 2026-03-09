import { prisma } from '../lib/prisma';
import { getPhotoUrl } from './upload.service';
import { ReportStatus, ReportPriority, CreateReportDto, ReportFilters } from '@maengelmelder/shared-types';

// Haversine distance in meters
function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function createReport(
  data: CreateReportDto,
  photoFiles: Express.Multer.File[],
  citizenId?: string
) {
  const isAnonymous = !data.reporterEmail && !data.reporterName && !citizenId;

  const report = await prisma.report.create({
    data: {
      categoryId: data.categoryId,
      description: data.description,
      lat: data.lat,
      lng: data.lng,
      address: data.address,
      reporterName: isAnonymous ? null : data.reporterName,
      reporterEmail: isAnonymous ? null : data.reporterEmail,
      isAnonymous,
      notifyOnUpdate: data.notifyOnUpdate ?? false,
      citizenId: citizenId ?? null,
      photos: {
        create: photoFiles.map((f) => ({
          url: getPhotoUrl(f.filename),
          filename: f.filename,
          mimeType: f.mimetype,
          sizeBytes: f.size,
        })),
      },
      statusHistory: {
        create: {
          fromStatus: null,
          toStatus: ReportStatus.OPEN,
          note: 'Meldung eingereicht',
        },
      },
    },
    include: { photos: true },
  });

  return report;
}

export async function findNearbyDuplicates(lat: number, lng: number, categoryId: string) {
  const radius = 100; // meters
  const reports = await prisma.report.findMany({
    where: {
      categoryId,
      status: { notIn: [ReportStatus.RESOLVED, ReportStatus.REJECTED] },
    },
    include: { category: true, photos: { take: 1 } },
  });

  return reports.filter((r) => haversineMeters(lat, lng, r.lat, r.lng) <= radius);
}

export async function getPublicReports(filters: ReportFilters) {
  const { status, categoryId, page = 1, limit = 50 } = filters;

  const where: Record<string, unknown> = {
    status: status
      ? status
      : { notIn: [ReportStatus.REJECTED] },
  };
  if (categoryId) where.categoryId = categoryId;

  const [data, total] = await Promise.all([
    prisma.report.findMany({
      where,
      include: { category: true, photos: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.report.count({ where }),
  ]);

  return { data, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getReportById(id: string) {
  return prisma.report.findUnique({
    where: { id },
    include: { category: true, photos: true, statusHistory: { orderBy: { createdAt: 'asc' } } },
  });
}

export async function getReportByToken(publicToken: string) {
  return prisma.report.findUnique({
    where: { publicToken },
    include: { category: true, statusHistory: { orderBy: { createdAt: 'asc' } } },
  });
}

export async function getDashboardReports(filters: ReportFilters) {
  const {
    status, categoryId, priority, assignedToId,
    dateFrom, dateTo, search, page = 1, limit = 50,
    sortBy = 'createdAt', sortDir = 'desc',
  } = filters;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (categoryId) where.categoryId = categoryId;
  if (priority) where.priority = priority;
  if (assignedToId) where.assignedToId = assignedToId;
  if (dateFrom || dateTo) {
    where.createdAt = {
      ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
      ...(dateTo ? { lte: new Date(dateTo) } : {}),
    };
  }
  if (search) {
    where.OR = [
      { description: { contains: search, mode: 'insensitive' } },
      { address: { contains: search, mode: 'insensitive' } },
      { reporterName: { contains: search, mode: 'insensitive' } },
    ];
  }

  const validSortFields = ['createdAt', 'updatedAt', 'status', 'priority'];
  const orderBy = validSortFields.includes(sortBy)
    ? { [sortBy]: sortDir }
    : { createdAt: 'desc' as const };

  const [data, total] = await Promise.all([
    prisma.report.findMany({
      where,
      include: {
        category: true,
        photos: true,
        assignedTo: true,
        comments: { include: { author: true }, orderBy: { createdAt: 'desc' } },
        statusHistory: { orderBy: { createdAt: 'asc' } },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.report.count({ where }),
  ]);

  return { data, total, page, totalPages: Math.ceil(total / limit) };
}

export async function updateReportStatus(
  reportId: string,
  newStatus: ReportStatus,
  authorId: string,
  note?: string
) {
  const report = await prisma.report.findUniqueOrThrow({ where: { id: reportId } });

  const validTransitions: Record<ReportStatus, ReportStatus[]> = {
    [ReportStatus.OPEN]: [ReportStatus.IN_PROGRESS, ReportStatus.REJECTED],
    [ReportStatus.IN_PROGRESS]: [ReportStatus.RESOLVED, ReportStatus.REJECTED, ReportStatus.PENDING_RESPONSE],
    [ReportStatus.PENDING_RESPONSE]: [ReportStatus.IN_PROGRESS, ReportStatus.RESOLVED],
    [ReportStatus.RESOLVED]: [],
    [ReportStatus.REJECTED]: [],
  };

  if (!validTransitions[report.status].includes(newStatus)) {
    throw new Error(`Invalid status transition: ${report.status} → ${newStatus}`);
  }

  return prisma.report.update({
    where: { id: reportId },
    data: {
      status: newStatus,
      statusHistory: {
        create: { fromStatus: report.status, toStatus: newStatus, note, authorId },
      },
    },
    include: { photos: true, category: true, statusHistory: { orderBy: { createdAt: 'asc' } } },
  });
}

export async function assignReport(reportId: string, assignedToId: string | null) {
  return prisma.report.update({
    where: { id: reportId },
    data: { assignedToId },
  });
}

export async function addInternalComment(reportId: string, authorId: string, text: string) {
  return prisma.internalComment.create({
    data: { reportId, authorId, text },
    include: { author: true },
  });
}

export async function bulkUpdateReports(
  ids: string[],
  action: 'setStatus' | 'setPriority' | 'assign',
  value: string,
  staffId: string
) {
  if (action === 'setStatus') {
    for (const id of ids) {
      await updateReportStatus(id, value as ReportStatus, staffId);
    }
  } else if (action === 'setPriority') {
    await prisma.report.updateMany({
      where: { id: { in: ids } },
      data: { priority: value as ReportPriority },
    });
  } else if (action === 'assign') {
    await prisma.report.updateMany({
      where: { id: { in: ids } },
      data: { assignedToId: value || null },
    });
  }
}

export async function getDashboardReportById(id: string) {
  return prisma.report.findUnique({
    where: { id },
    include: {
      category: true,
      photos: true,
      statusHistory: { orderBy: { createdAt: 'asc' } },
      comments: { include: { author: true }, orderBy: { createdAt: 'asc' } },
      assignedTo: { select: { id: true, name: true } },
    },
  });
}

export async function getCitizenReports(citizenId: string) {
  return prisma.report.findMany({
    where: { citizenId },
    include: {
      category: true,
      photos: true,
      statusHistory: { orderBy: { createdAt: 'asc' } },
    },
    orderBy: { createdAt: 'desc' },
  });
}
