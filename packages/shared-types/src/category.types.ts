export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  responsibleDepartment: string;
  targetResolutionDays: number;
  isActive: boolean;
  sortOrder: number;
}

export interface CategoryInput {
  name: string;
  icon: string;
  color: string;
  responsibleDepartment: string;
  targetResolutionDays: number;
  isActive?: boolean;
  sortOrder?: number;
}
