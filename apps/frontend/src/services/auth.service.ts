import { apiClient } from './api.client';
import { StaffProfile, CitizenProfile } from '@maengelmelder/shared-types';

export async function staffLogin(credentials: { email: string; password: string }): Promise<{ accessToken: string; user: StaffProfile }> {
  const res = await apiClient.post('/auth/staff/login', credentials);
  return res.data;
}

export async function citizenLogin(credentials: { email: string; password: string }): Promise<{ accessToken: string; user: CitizenProfile }> {
  const res = await apiClient.post('/auth/login', credentials);
  return res.data;
}

export async function citizenRegister(data: { email: string; password: string; name: string }): Promise<{ accessToken: string; user: CitizenProfile }> {
  const res = await apiClient.post('/auth/register', data);
  return res.data;
}

export async function logout() {
  await apiClient.post('/auth/logout').catch(() => {});
}
