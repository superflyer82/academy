export const ReportStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED',
  PENDING_RESPONSE: 'PENDING_RESPONSE',
} as const;
export type ReportStatus = (typeof ReportStatus)[keyof typeof ReportStatus];

export const ReportPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;
export type ReportPriority = (typeof ReportPriority)[keyof typeof ReportPriority];

export interface ReportPublic {
  id: string;
  categoryId: string;
  category?: CategoryBasic;
  description?: string | null;
  status: ReportStatus;
  lat: number;
  lng: number;
  address?: string | null;
  photos: PhotoPublic[];
  createdAt: string;
}

export interface ReportCreated {
  id: string;
  publicToken: string;
  status: ReportStatus;
  createdAt: string;
}

export interface ReportTrack {
  id: string;
  status: ReportStatus;
  category?: CategoryBasic;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusEntry[];
}

export interface ReportFull extends ReportPublic {
  reporterName?: string | null;
  reporterEmail?: string | null;
  priority: ReportPriority;
  assignedTo?: StaffProfileBasic | null;
  comments: InternalComment[];
  statusHistory: StatusEntry[];
}

export interface StatusEntry {
  id: string;
  fromStatus?: ReportStatus | null;
  toStatus: ReportStatus;
  note?: string | null;
  createdAt: string;
}

export interface InternalComment {
  id: string;
  text: string;
  author: StaffProfileBasic;
  createdAt: string;
}

export interface PhotoPublic {
  id: string;
  url: string;
}

export interface CategoryBasic {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface StaffProfileBasic {
  id: string;
  name: string;
  department?: string | null;
}
