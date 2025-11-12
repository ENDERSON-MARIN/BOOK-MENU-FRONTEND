import { Category } from "./category";

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  category?: Category;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuItemRequest {
  name: string;
  description?: string;
  categoryId: string;
}

export interface UpdateMenuItemRequest {
  name?: string;
  description?: string;
  categoryId?: string;
  isActive?: boolean;
}
