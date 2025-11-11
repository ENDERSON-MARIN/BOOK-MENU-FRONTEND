"use client";

import { LogOut, Menu, User } from "lucide-react";
import { useRouter } from "next/navigation";

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
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="bg-card flex h-16 items-center justify-between border-b px-4 lg:px-6">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Abrir menu"
      >
        <Menu className="size-6" />
      </Button>

      {/* Spacer for desktop */}
      <div className="hidden lg:block" />

      {/* User Menu */}
      <div className="ml-auto flex items-center gap-4">
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2"
                aria-label="Menu do usuário"
              >
                <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full">
                  <User className="size-4" />
                </div>
                <div className="hidden text-left md:block">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {user.role === "ADMIN" ? "Administrador" : "Usuário"}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-muted-foreground text-xs">
                    CPF:{" "}
                    {user.cpf.replace(
                      /(\d{3})(\d{3})(\d{3})(\d{2})/,
                      "$1.$2.$3-$4",
                    )}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/perfil")}>
                <User className="mr-2 size-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} variant="destructive">
                <LogOut className="mr-2 size-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
