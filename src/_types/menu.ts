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
  isAlternativeProtein: boolean;
}

export interface MenuVariation {
  id: string;
  menuId: string;
  variationType: "STANDARD" | "EGG_SUBSTITUTE" | "VEGETARIAN";
  proteinItemId: string;
  isDefault: boolean;
  proteinItem?: MenuItem;
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
  observations?: string;
  menuItems: {
    menuItemId: string;
    observations?: string;
    isMainProtein: boolean;
    isAlternativeProtein: boolean;
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
