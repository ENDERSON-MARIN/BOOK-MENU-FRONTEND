"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

import { Button } from "@/_components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/_components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/_components/ui/popover";
import { useGetUsers } from "@/_hooks/queries/use-get-users";
import { cn } from "@/_lib/utils";

interface UserAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
}

const UserAutocomplete = ({ value, onChange }: UserAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const { data: users, isLoading } = useGetUsers();

  const selectedUser = users?.find((user) => user.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedUser ? (
            <span className="truncate">
              {selectedUser.name} - {selectedUser.cpf}
            </span>
          ) : (
            "Selecione um usuário..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Buscar usuário..." />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Carregando..." : "Nenhum usuário encontrado."}
            </CommandEmpty>
            <CommandGroup>
              <CommandItem
                value=""
                onSelect={() => {
                  onChange("");
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === "" ? "opacity-100" : "opacity-0",
                  )}
                />
                Todos os usuários
              </CommandItem>
              {users?.map((user) => (
                <CommandItem
                  key={user.id}
                  value={`${user.name} ${user.cpf}`}
                  onSelect={() => {
                    onChange(user.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === user.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{user.name}</span>
                    <span className="text-muted-foreground text-xs">
                      CPF: {user.cpf}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default UserAutocomplete;
