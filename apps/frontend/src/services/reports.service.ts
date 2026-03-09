import { apiClient } from './api.client';
import {
  ReportPublic, ReportCreated, ReportTrack, ReportFull,
  CreateReportDto, ReportFilters, PaginatedResponse,
} from '@maengelmelder/shared-types';

export async function submitReport(data: CreateReportDto, photos: File[]): Promise<ReportCreated> {
  const formData = new FormData();
  formData.append('categoryId', data.categoryId);
  formData.append('lat', String(data.lat));
  formData.append('lng', String(data.lng));
  if (data.description) formData.append('description', data.description);
  if (data.address) formData.append('address', data.address);
  if (data.reporterName) formData.append('reporterName', data.reporterName);
  if (data.reporterEmail) formData.append('reporterEmail', data.reporterEmail);
  if (data.notifyOnUpdate !== undefined) formData.append('notifyOnUpdate', String(data.notifyOnUpdate));
  photos.forEach((p) => formData.append('photos', p));

  const res = await apiClient.post<ReportCreated>('/reports', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function fetchPublicReports(filters: ReportFilters): Promise<PaginatedResponse<ReportPublic>> {
  const res = await apiClient.get<PaginatedResponse<ReportPublic>>('/reports', { params: filters });
  return res.data;
}

export async function fetchReportById(id: string): Promise<ReportPublic> {
  const res = await apiClient.get<ReportPublic>(`/reports/${id}`);
  return res.data;
}

export async function trackReport(publicToken: string): Promise<ReportTrack> {
  const res = await apiClient.get<ReportTrack>(`/reports/track/${publicToken}`);
  return res.data;
}

export async function fetchNearby(lat: number, lng: number, categoryId: string): Promise<ReportPublic[]> {
  const res = await apiClient.get<ReportPublic[]>('/reports/nearby', { params: { lat, lng, categoryId } });
  return res.data;
}

export async function fetchDashboardReports(filters: ReportFilters): Promise<PaginatedResponse<ReportFull>> {
  const res = await apiClient.get<PaginatedResponse<ReportFull>>('/reports/dashboard/list', { params: filters });
  return res.data;
}

export async function updateReportStatus(id: string, status: string, note?: string, sendEmail = true) {
  const res = await apiClient.patch(`/reports/dashboard/${id}/status`, { status, note, sendEmail });
  return res.data;
}

export async function assignReport(id: string, assignedToId: string | null) {
  const res = await apiClient.patch(`/reports/dashboard/${id}/assign`, { assignedToId });
  return res.data;
}

export async function addComment(id: string, text: string) {
  const res = await apiClient.post(`/reports/dashboard/${id}/comments`, { text });
  return res.data;
}

export async function bulkUpdate(ids: string[], action: string, value: string) {
  const res = await apiClient.patch('/reports/dashboard/bulk', { ids, action, value });
  return res.data;
}

export async function fetchCitizenReports() {
  const res = await apiClient.get('/reports/citizen/my');
  return res.data;
}
