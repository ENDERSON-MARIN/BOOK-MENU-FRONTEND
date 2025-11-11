import { MenuItem } from "./menu-item";

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface MenuComposition {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  isMainProtein: boolean;
}

export interface MenuVariation {
  id: string;
  menuId: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface Menu {
  id: string;
  date: string;
  dayOfWeek: DayOfWeek;
  weekNumber: number;
  observations?: string;
  isActive: boolean;
  menuCompositions: MenuComposition[];
  variations: MenuVariation[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuRequest {
  date: string;
  dayOfWeek: DayOfWeek;
  observations?: string;
  menuCompositions: {
    menuItemId: string;
    isMainProtein: boolean;
  }[];
}

export interface UpdateMenuRequest {
  date?: string;
  dayOfWeek?: DayOfWeek;
  observations?: string;
  isActive?: boolean;
  menuCompositions?: {
    menuItemId: string;
    isMainProtein: boolean;
  }[];
}
