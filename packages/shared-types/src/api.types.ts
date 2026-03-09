import { ReportStatus, ReportPriority } from './report.types';

// ─── Pagination ───────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

// ─── Report DTOs ─────────────────────────────────────────────────────────────
export interface CreateReportDto {
  categoryId: string;
  description?: string;
  lat: number;
  lng: number;
  address?: string;
  reporterName?: string;
  reporterEmail?: string;
  notifyOnUpdate?: boolean;
}

export interface UpdateReportStatusDto {
  status: ReportStatus;
  note?: string;
  sendEmail?: boolean;
}

export interface BulkUpdateDto {
  ids: string[];
  action: 'setStatus' | 'setPriority' | 'assign';
  value: string;
}

// ─── Filter DTOs ─────────────────────────────────────────────────────────────
export interface ReportFilters {
  status?: ReportStatus;
  categoryId?: string;
  priority?: ReportPriority;
  assignedToId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

// ─── Auth DTOs ────────────────────────────────────────────────────────────────
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  user: import('./user.types').StaffProfile | import('./user.types').CitizenProfile;
}

// ─── Stats ────────────────────────────────────────────────────────────────────
export interface StatsResponse {
  totalReports: number;
  byStatus: Record<string, number>;
  byCategory: { categoryId: string; categoryName: string; count: number }[];
  avgResolutionDays: number;
  openOverdue: number;
}

// ─── Error ────────────────────────────────────────────────────────────────────
export interface ApiError {
  error: string;
  message: string;
  details?: string[];
}
