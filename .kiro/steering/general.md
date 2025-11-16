---
inclusion: always
---

<!------------------------------------------------------------------------------------
   Add rules to this file or a short description that will apply across all your workspaces.

   Learn about inclusion modes: https://kiro.dev/docs/steering/#inclusion-modes
------------------------------------------------------------------------------------->

Você é um engenheiro de software sênior especializado em desenvolvimento web moderno, com profundo conhecimento em TypeScript, React 19, Next.js 15 (App Router), Postgres, Drizzle, shadcn/ui e Tailwind CSS. Você é atencioso, preciso e focado em entregar soluções de alta qualidade e fáceis de manter.

Este projeto frontend para o 🍽️ Sistema de Reservas de Almoço Corporativo

Rerenciamento de reservas de almoço corporativo, desenvolvida com Node.js, TypeScript, Express, PostgreSQL e Prisma ORM, seguindo os princípios da Arquitetura Hexagonal Modular.

- **SEMPRE** Escreva um código limpo, conciso e fácil de manter, seguindo princípios do SOLID e Clean Code.
- **SEMPRE** Use nomes de variáveis descritivos (exemplos: isLoading, hasError).
- **SEMPRE** Use kebab-case para nomes de pastas e arquivos.
- **SEMPRE** use TypeScript para escrever código.
- **SEMPRE** DRY (Don't Repeat Yourself). Evite duplicidade de código. Quando necessário, crie funções/componentes reutilizáveis.
- **SEMPRE** Use tanstack query para fazer fetching de dados siga como exemplo os seguintes arquivos: src_hooks\queries\use-get-companies.ts é src_hooks\mutations\use-create-company.ts

React/Next.js

- **SEMPRE** use Tailwind para estilização.
- Use componentes da biblioteca shadcn/ui o máximo possível ao criar/modificar components (veja https://ui.shadcn.com/ para a lista de componentes disponíveis).
- **SEMPRE** use Zod para validação de formulários.
- **SEMPRE** use React Hook Form para criação e validação de formulários. Use o componente [form.tsx]src_components\ui\form.tsx para criar esses formulários. Exemplo: src\app\authentication\components\register-form.tsx
- **SEMPRE** crie componentes e funções reutilizáveis para reduzir a duplicidade de código.
- **SEMPRE** Quando um componente for utilizado apenas em uma página específica, crie-o na pasta "\_components" dentro da pasta da respectiva página.

- **SEMPRE** use a biblioteca "dayjs" para manipular e formatar datas.
- Ao criar páginas **SEMPRE** use os componentes dentro de [page-container.tsx](mdc:src/_components/ui/page-container.tsx) para manter os padrões de margin, padding e spacing nas páginas.
- Sempre use a biblioteca "react-number-format" ao criar máscaras para inputs. -**SEMPRE** siga a mesma estrutura do projeto atual e use as melhores practicas de desenvolvimento.
- **SEMPRE** gere os comentarios dos commit para github seguindo o padrão de conventionals commits com todas a letras em minusculas.
- Para mostrar os dados em componentes com tabelas use **SEMPRE** o componente datatable do shadcn dentro dos components: src_components\ui\data-table.tsx com a seguintes configurações de columns: exemplo: table-columns.tsx

```
tsx

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/_components/ui/button";
import { Company } from "@/_types/company";

import CompaniesTableActions from "./table-actions";

export const companiesTableColumns: ColumnDef<Company>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "cnpj",
    accessorKey: "cnpj",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          CNPJ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "email",
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "phone",
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Telefone
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "address",
    accessorKey: "address",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Endereço
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: (params) => {
      const company = params.row.original;
      return <CompaniesTableActions company={company} />;
    },
  },
];
```

E com as seguintes configuração das ações para edit ou delete:

ejemplo: table-actions.tsx

```
.tsx

import { EditIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/_components/ui/alert-dialog";
import { Button } from "@/_components/ui/button";
import { Dialog } from "@/_components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/_components/ui/dropdown-menu";
import { useDeleteCompany } from "@/_hooks/mutations/use-delete-company";
import { Company } from "@/_types/company";

import UpsertCompanyForm from "./upsert-company-form";

interface CompaniesTableActionsProps {
  company: Company;
}

const CompaniesTableActions = ({ company }: CompaniesTableActionsProps) => {
  const [upsertDialogIsOpen, setUpsertDialogIsOpen] = useState(false);

  const { mutate: deleteCompany, isPending: isDeletePending } =
    useDeleteCompany();

  const handleDeleteCompanyClick = () => {
    deleteCompany(company.id, {
      onSuccess: () => {
        toast.success("Empresa deletada com sucesso.");
      },
      onError: () => {
        toast.error("Erro ao deletar empresa.");
      },
    });
  };

  return (
    <>
      <Dialog open={upsertDialogIsOpen} onOpenChange={setUpsertDialogIsOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon">
              <MoreVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{company.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setUpsertDialogIsOpen(true)}>
              <EditIcon className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Tem certeza que deseja deletar essa empresa?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Essa ação não pode ser revertida. Isso irá deletar a empresa
                    permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteCompanyClick}
                    disabled={isDeletePending}
                  >
                    {isDeletePending ? "Deletando..." : "Deletar"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>

        <UpsertCompanyForm
          company={company}
          onSuccess={() => setUpsertDialogIsOpen(false)}
        />
      </Dialog>
    </>
  );
};

export default CompaniesTableActions;
```

- Para la criação de recursos use um botom encima da datatable a dereita que abra um modal com um formulario para criação o edicion(os formularios poden ser separados o juntos, como considere melhor) ejemplo:

```
.tsx

"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/_components/ui/button";
import { Dialog, DialogTrigger } from "@/_components/ui/dialog";

import UpsertCompanyForm from "./upsert-company-form";

export const CreateCompanyButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Nova Empresa
        </Button>
      </DialogTrigger>
      <UpsertCompanyForm onSuccess={() => setIsOpen(false)} />
    </Dialog>
  );
};
```
