import { Request, Response } from 'express';
import { z } from 'zod';
import * as reportService from '../../services/report.service';
import * as notificationService from '../../services/notification.service';
import { ReportStatus } from '@maengelmelder/shared-types';

const createReportSchema = z.object({
  categoryId: z.string().uuid(),
  description: z.string().max(2000).optional(),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  address: z.string().max(500).optional(),
  reporterName: z.string().max(100).optional(),
  reporterEmail: z.string().email().optional(),
  notifyOnUpdate: z.coerce.boolean().optional(),
});

const reportFiltersSchema = z.object({
  status: z.nativeEnum(ReportStatus).optional(),
  categoryId: z.string().uuid().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(200).default(50),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  radius: z.coerce.number().int().optional(),
});

export async function createReport(req: Request, res: Response): Promise<void> {
  const data = createReportSchema.parse(req.body);
  const photos = (req.files as Express.Multer.File[]) ?? [];
  const citizenId = req.user?.type === 'citizen' ? req.user.sub : undefined;

  const report = await reportService.createReport(data, photos, citizenId);
  res.status(201).json({ id: report.id, publicToken: report.publicToken, status: report.status, createdAt: report.createdAt });
}

export async function getPublicReports(req: Request, res: Response): Promise<void> {
  const filters = reportFiltersSchema.parse(req.query);
  const result = await reportService.getPublicReports(filters);
  res.json(result);
}

export async function getReportById(req: Request, res: Response): Promise<void> {
  const report = await reportService.getReportById(req.params.id);
  if (!report) { res.status(404).json({ error: 'Not Found' }); return; }
  res.json(report);
}

export async function trackReport(req: Request, res: Response): Promise<void> {
  const report = await reportService.getReportByToken(req.params.publicToken);
  if (!report) { res.status(404).json({ error: 'Not Found' }); return; }
  res.json({ id: report.id, status: report.status, category: report.category, createdAt: report.createdAt, statusHistory: report.statusHistory });
}

export async function getNearbyReports(req: Request, res: Response): Promise<void> {
  const { lat, lng, categoryId } = z.object({
    lat: z.coerce.number(),
    lng: z.coerce.number(),
    categoryId: z.string().uuid(),
  }).parse(req.query);

  const reports = await reportService.findNearbyDuplicates(lat, lng, categoryId);
  res.json(reports);
}

export async function getDashboardReportById(req: Request, res: Response): Promise<void> {
  const report = await reportService.getDashboardReportById(req.params.id);
  if (!report) { res.status(404).json({ error: 'Not Found' }); return; }
  res.json(report);
}

export async function getDashboardReports(req: Request, res: Response): Promise<void> {
  const filters = z.object({
    status: z.nativeEnum(ReportStatus).optional(),
    categoryId: z.string().uuid().optional(),
    priority: z.string().optional(),
    assignedToId: z.string().uuid().optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(200).default(50),
    sortBy: z.string().optional(),
    sortDir: z.enum(['asc', 'desc']).optional(),
  }).parse(req.query);

  const result = await reportService.getDashboardReports(filters);
  res.json(result);
}

export async function updateStatus(req: Request, res: Response): Promise<void> {
  const { status, note, sendEmail } = z.object({
    status: z.nativeEnum(ReportStatus),
    note: z.string().max(1000).optional(),
    sendEmail: z.boolean().default(true),
  }).parse(req.body);

  const updated = await reportService.updateReportStatus(req.params.id, status, req.user!.sub, note);

  if (sendEmail && updated.reporterEmail && updated.notifyOnUpdate) {
    await notificationService.notifyStatusChange({
      to: updated.reporterEmail,
      reportId: updated.id,
      publicToken: updated.publicToken,
      newStatus: status,
      note,
    });
  }
  res.json(updated);
}

export async function assignReport(req: Request, res: Response): Promise<void> {
  const { assignedToId } = z.object({ assignedToId: z.string().uuid().nullable() }).parse(req.body);
  const updated = await reportService.assignReport(req.params.id, assignedToId);
  res.json(updated);
}

export async function addComment(req: Request, res: Response): Promise<void> {
  const { text } = z.object({ text: z.string().min(1).max(5000) }).parse(req.body);
  const comment = await reportService.addInternalComment(req.params.id, req.user!.sub, text);
  res.status(201).json(comment);
}

export async function bulkUpdate(req: Request, res: Response): Promise<void> {
  const { ids, action, value } = z.object({
    ids: z.array(z.string().uuid()).min(1),
    action: z.enum(['setStatus', 'setPriority', 'assign']),
    value: z.string(),
  }).parse(req.body);

  await reportService.bulkUpdateReports(ids, action, value, req.user!.sub);
  res.json({ updated: ids.length });
}

export async function getCitizenReports(req: Request, res: Response): Promise<void> {
  const reports = await reportService.getCitizenReports(req.user!.sub);
  res.json(reports);
}
