export enum StaffRole {
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
}

export interface StaffProfile {
  id: string;
  email: string;
  name: string;
  role: StaffRole;
  department?: string | null;
}

export interface CitizenProfile {
  id: string;
  email: string;
  name: string;
}
