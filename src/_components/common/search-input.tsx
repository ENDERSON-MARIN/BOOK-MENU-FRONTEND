"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { useDebounce } from "@/_hooks/use-debounce";

import { Input } from "../ui/input";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  debounceDelay?: number;
  className?: string;
}

/**
 * Componente de input de busca com debouncing
 * Otimizado para evitar chamadas excessivas durante a digitação
 *
 * @example
 * <SearchInput
 *   placeholder="Buscar usuários..."
 *   onSearch={(value) => fetchUsers(value)}
 *   debounceDelay={500}
 * />
 */
export function SearchInput({
  placeholder = "Buscar...",
  onSearch,
  debounceDelay = 500,
  className,
}: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);

  useEffect(() => {
    // Só executa a busca após o usuário parar de digitar
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  return (
    <div className="relative">
      <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={className}
        style={{ paddingLeft: "2.5rem" }}
      />
    </div>
  );
}
