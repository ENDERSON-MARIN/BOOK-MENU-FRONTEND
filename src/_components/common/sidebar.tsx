"use client";

import {
  BarChart3,
  BookOpen,
  CalendarDays,
  FolderTree,
  LayoutDashboard,
  User,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";

import { ScrollArea } from "@/_components/ui/scroll-area";
import { Separator } from "@/_components/ui/separator";
import { useAuth } from "@/_hooks/use-auth";
import { cn } from "@/_lib/utils";

interface SidebarProps {
  onClose?: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: ("ADMIN" | "USER")[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    roles: ["ADMIN", "USER"],
  },
  {
    title: "Usuários",
    href: "/usuarios",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    title: "Categorias",
    href: "/categorias",
    icon: FolderTree,
    roles: ["ADMIN"],
  },
  {
    title: "Itens de Menu",
    href: "/itens-menu",
    icon: UtensilsCrossed,
    roles: ["ADMIN"],
  },
  {
    title: "Cardápios",
    href: "/cardapios",
    icon: CalendarDays,
    roles: ["ADMIN", "USER"],
  },
  {
    title: "Reservas",
    href: "/reservas",
    icon: BookOpen,
    roles: ["ADMIN"],
  },
  {
    title: "Relatórios",
    href: "/relatorios",
    icon: BarChart3,
    roles: ["ADMIN"],
  },
  {
    title: "Minhas Reservas",
    href: "/minhas-reservas",
    icon: BookOpen,
    roles: ["USER"],
  },
  // {
  //   title: "Perfil",
  //   href: "/perfil",
  //   icon: User,
  //   roles: ["ADMIN", "USER"],
  // },
];

export const Sidebar = memo(function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false,
  );

  return (
    <div className="bg-card flex h-full flex-col border-r">
      {/* Logo and Close Button (Mobile) */}
      <div className="flex h-16 items-center justify-between border-b px-6">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo BookingMenu - Sistema de Reservas de Almoço"
            width={80}
            height={40}
            priority
          />
          <span className="text-md font-bold" aria-label="BookingMenu">
            BookingMenu
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ring-offset-background focus:ring-ring rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden lg:hidden"
            aria-label="Fechar menu de navegação"
            type="button"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1" aria-label="Menu de navegação">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                aria-current={isActive ? "page" : undefined}
                aria-label={`${item.title}${isActive ? " (página atual)" : ""}`}
              >
                <Icon className="size-5" aria-hidden="true" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User Info */}
      {user && (
        <>
          <Separator role="separator" aria-label="Separador" />
          <div
            className="p-4"
            role="region"
            aria-label="Informações do usuário"
          >
            <div className="flex items-center gap-3">
              <div
                className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-full"
                aria-hidden="true"
              >
                <User className="size-5" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p
                  className="truncate text-sm font-medium"
                  aria-label={`Usuário: ${user.name}`}
                >
                  {user.name}
                </p>
                <p
                  className="text-muted-foreground truncate text-xs"
                  aria-label={`Perfil: ${user.role === "ADMIN" ? "Administrador" : "Usuário"}`}
                >
                  {user.role === "ADMIN" ? "Administrador" : "Usuário"}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
});
