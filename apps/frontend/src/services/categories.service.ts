import { apiClient } from './api.client';
import { Category, CategoryInput } from '@maengelmelder/shared-types';

export async function fetchCategories(): Promise<Category[]> {
  const res = await apiClient.get<Category[]>('/categories');
  return res.data;
}

export async function fetchAllCategories(): Promise<Category[]> {
  const res = await apiClient.get<Category[]>('/categories/all');
  return res.data;
}

export async function createCategory(data: CategoryInput): Promise<Category> {
  const res = await apiClient.post<Category>('/categories', data);
  return res.data;
}

export async function updateCategory(id: string, data: Partial<CategoryInput>): Promise<Category> {
  const res = await apiClient.put<Category>(`/categories/${id}`, data);
  return res.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(`/categories/${id}`);
}
