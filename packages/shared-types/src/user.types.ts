export const StaffRole = {
  STAFF: 'STAFF',
  ADMIN: 'ADMIN',
} as const;
export type StaffRole = (typeof StaffRole)[keyof typeof StaffRole];

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
