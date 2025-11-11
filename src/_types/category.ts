export interface Category {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  displayOrder: number;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
}
