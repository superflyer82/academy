import { apiClient } from './api.client';
import { StatsResponse } from '@maengelmelder/shared-types';

export async function getStats(dateFrom?: string, dateTo?: string): Promise<StatsResponse> {
  const res = await apiClient.get<StatsResponse>('/admin/stats', { params: { dateFrom, dateTo } });
  return res.data;
}

export async function getConfig(): Promise<Record<string, string>> {
  const res = await apiClient.get<Record<string, string>>('/admin/config');
  return res.data;
}

export async function updateConfig(data: Record<string, string>) {
  const res = await apiClient.put('/admin/config', data);
  return res.data;
}

export async function getStaff() {
  const res = await apiClient.get('/admin/staff');
  return res.data;
}

export async function createStaff(data: { email: string; name: string; role: string; department?: string }) {
  const res = await apiClient.post('/admin/staff', data);
  return res.data;
}

export function exportUrl(format: 'csv' | 'xlsx' = 'csv'): string {
  const base = import.meta.env.VITE_API_URL ?? '/api/v1';
  return `${base}/admin/export?format=${format}`;
}
