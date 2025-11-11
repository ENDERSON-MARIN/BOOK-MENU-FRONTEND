"use client";

import { LogOut, Menu, Moon, Sun, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import { Avatar, AvatarFallback } from "@/_components/ui/avatar";
import { Button } from "@/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/_components/ui/dropdown-menu";
import { useAuth } from "@/_hooks/use-auth";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleProfileClick = () => {
    router.push("/perfil");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getRoleLabel = (role: string) => {
    return role === "ADMIN" ? "Administrador" : "Usuário";
  };

  return (
    <header className="bg-card flex h-16 items-center justify-between border-b px-4 lg:px-6">
      {/* Left Section - Menu Button (Mobile) + Logo */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="size-5" />
          </Button>
        )}

        {/* Logo - Hidden on mobile, visible on desktop */}
        <div className="hidden items-center gap-2 lg:flex">
          <Image
            src="/logo.png"
            alt="Logo"
            width={32}
            height={32}
            className="size-8"
          />
          <span className="text-lg font-semibold">Reservas de Almoço</span>
        </div>
      </div>

      {/* Right Section - Theme Toggle + User Menu */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Alternar tema"
        >
          <Sun className="size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute size-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </Button>

        {/* User Menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2"
                aria-label="Menu do usuário"
              >
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                    {getUserInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden flex-col items-start text-left lg:flex">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {getRoleLabel(user.role)}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {getRoleLabel(user.role)}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 size-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} variant="destructive">
                <LogOut className="mr-2 size-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
