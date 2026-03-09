import { apiClient } from './api.client';
import { StaffProfile, CitizenProfile } from '@maengelmelder/shared-types';

export async function staffLogin(email: string, password: string): Promise<{ accessToken: string; user: StaffProfile }> {
  const res = await apiClient.post('/auth/staff/login', { email, password });
  return res.data;
}

export async function citizenLogin(email: string, password: string): Promise<{ accessToken: string; user: CitizenProfile }> {
  const res = await apiClient.post('/auth/login', { email, password });
  return res.data;
}

export async function citizenRegister(email: string, password: string, name: string) {
  const res = await apiClient.post('/auth/register', { email, password, name });
  return res.data;
}

export async function logout() {
  await apiClient.post('/auth/logout');
}
