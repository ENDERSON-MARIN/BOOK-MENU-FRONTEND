# 🛠️ Guia de Desenvolvimento

Este documento fornece informações detalhadas para desenvolvedores que trabalham no Sistema de Reservas de Almoço Corporativo.

## 📋 Índice

- [Configuração do Ambiente](#configuração-do-ambiente)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Fluxo de Desenvolvimento](#fluxo-de-desenvolvimento)
- [Padrões e Convenções](#padrões-e-convenções)
- [Debugging](#debugging)
- [Troubleshooting](#troubleshooting)

## 🚀 Configuração do Ambiente

### Requisitos

- **Node.js:** 20.x ou superior
- **npm/yarn/pnpm:** Gerenciador de pacotes
- **Git:** Controle de versão
- **VS Code:** Editor recomendado (opcional)

### Extensões VS Code Recomendadas

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag",
    "dsznajder.es7-react-js-snippets",
    "christian-kohler.path-intellisense"
  ]
}
```

### Configuração Inicial

1. **Clone o repositório:**

```bash
git clone <repository-url>
cd booking-menu-front
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Configure as variáveis de ambiente:**

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

4. **Inicie o servidor de desenvolvimento:**

```bash
npm run dev
```

5. **Acesse a aplicação:**

```
http://localhost:3000
```

### Configuração do Backend

O frontend depende da API REST. Certifique-se de que o backend está rodando:

```bash
# Em outro terminal, no diretório do backend
cd ../booking-menu-api
npm run dev
```

A API deve estar disponível em `http://localhost:8080/api`.

## 🏗️ Arquitetura do Projeto

### Visão Geral

O projeto segue uma arquitetura modular baseada em features, utilizando o App Router do Next.js 15.

```
Frontend (Next.js)
    ↓
API Client (fetch + JWT)
    ↓
Backend API (Express)
    ↓
Database (PostgreSQL)
```

### Camadas da Aplicação

#### 1. Camada de Apresentação (UI)

- **Localização:** `src/app/`, `src/_components/`
- **Responsabilidade:** Renderizar UI, capturar eventos do usuário
- **Tecnologias:** React 19, Tailwind CSS, shadcn/ui

#### 2. Camada de Lógica de Negócio

- **Localização:** `src/_hooks/`, `src/_lib/`
- **Responsabilidade:** Gerenciar estado, validações, transformações
- **Tecnologias:** React Hooks, Tanstack Query, Zod

#### 3. Camada de Serviços

- **Localização:** `src/_services/`
- **Responsabilidade:** Comunicação com API, serialização de dados
- **Tecnologias:** Fetch API, TypeScript

#### 4. Camada de Tipos

- **Localização:** `src/_types/`, `src/_schemas/`
- **Responsabilidade:** Definições de tipos, validações
- **Tecnologias:** TypeScript, Zod

### Fluxo de Dados

```
User Action
    ↓
Component Event Handler
    ↓
Custom Hook (Tanstack Query)
    ↓
Service Function
    ↓
API Client (with JWT)
    ↓
Backend API
    ↓
Database
```

**Resposta:**

```
Database
    ↓
Backend API
    ↓
API Client
    ↓
Service Function
    ↓
Tanstack Query (cache)
    ↓
Component Re-render
    ↓
UI Update
```

## 🔄 Fluxo de Desenvolvimento

### 1. Criar Nova Feature

#### Exemplo: Adicionar Gerenciamento de Fornecedores

**Passo 1: Criar Types**

```typescript
// src/_types/supplier.ts
export interface Supplier {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierRequest {
  name: string;
  cnpj: string;
  email: string;
  phone: string;
}
```

**Passo 2: Criar Schema Zod**

```typescript
// src/_schemas/supplier.schema.ts
import { z } from "zod";

export const supplierFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  cnpj: z.string().length(14, "CNPJ deve ter 14 dígitos"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido"),
});

export type SupplierFormValues = z.infer<typeof supplierFormSchema>;
```

**Passo 3: Criar Service**

```typescript
// src/_services/supplier.service.ts
import { apiClient } from "@/_lib/api-client";
import { Supplier, CreateSupplierRequest } from "@/_types/supplier";

export const SupplierService = {
  getAll: async (): Promise<Supplier[]> => {
    return apiClient<Supplier[]>("/suppliers");
  },

  getById: async (id: string): Promise<Supplier> => {
    return apiClient<Supplier>(`/suppliers/${id}`);
  },

  create: async (data: CreateSupplierRequest): Promise<Supplier> => {
    return apiClient<Supplier>("/suppliers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: string,
    data: Partial<CreateSupplierRequest>,
  ): Promise<Supplier> => {
    return apiClient<Supplier>(`/suppliers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiClient<void>(`/suppliers/${id}`, {
      method: "DELETE",
    });
  },
};
```

**Passo 4: Criar Hooks Tanstack Query**

```typescript
// src/_hooks/queries/use-get-suppliers.ts
import { useQuery } from "@tanstack/react-query";
import { SupplierService } from "@/_services/supplier.service";

export const useGetSuppliers = () => {
  return useQuery({
    queryKey: ["suppliers"],
    queryFn: () => SupplierService.getAll(),
  });
};

// src/_hooks/mutations/use-create-supplier.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SupplierService } from "@/_services/supplier.service";
import { CreateSupplierRequest } from "@/_types/supplier";

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSupplierRequest) => SupplierService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });
};
```

**Passo 5: Criar Página**

```typescript
// src/app/(dashboard)/fornecedores/page.tsx
"use client";

import { PageContainer } from "@/_components/ui/page-container";
import { useGetSuppliers } from "@/_hooks/queries/use-get-suppliers";
import { CreateSupplierButton } from "./_components/create-supplier-button";
import { SuppliersTable } from "./_components/suppliers-table";

export default function SuppliersPage() {
  const { data: suppliers, isLoading } = useGetSuppliers();

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Fornecedores</h1>
        <CreateSupplierButton />
      </div>

      {isLoading ? (
        <div>Carregando...</div>
      ) : (
        <SuppliersTable suppliers={suppliers || []} />
      )}
    </PageContainer>
  );
}
```

**Passo 6: Criar Componentes**

```typescript
// src/app/(dashboard)/fornecedores/_components/supplier-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useCreateSupplier } from "@/_hooks/mutations/use-create-supplier";
import { supplierFormSchema, SupplierFormValues } from "@/_schemas/supplier.schema";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/_components/ui/form";
import { Input } from "@/_components/ui/input";
import { Button } from "@/_components/ui/button";

interface SupplierFormProps {
  onSuccess: () => void;
}

export const SupplierForm = ({ onSuccess }: SupplierFormProps) => {
  const { mutate: createSupplier, isPending } = useCreateSupplier();

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: "",
      cnpj: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = (data: SupplierFormValues) => {
    createSupplier(data, {
      onSuccess: () => {
        toast.success("Fornecedor criado com sucesso");
        onSuccess();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Outros campos... */}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </Form>
  );
};
```

### 2. Adicionar Rota ao Sidebar

```typescript
// src/_components/common/sidebar.tsx
const adminRoutes = [
  // ... rotas existentes
  {
    label: "Fornecedores",
    href: "/fornecedores",
    icon: TruckIcon,
  },
];
```

## 📐 Padrões e Convenções

### Estrutura de Arquivos

#### Componentes de Página

```
src/app/(dashboard)/usuarios/
├── page.tsx                    # Página principal
└── _components/                # Componentes específicos
    ├── user-form.tsx
    ├── user-table.tsx
    ├── table-columns.tsx
    └── table-actions.tsx
```

#### Hooks

```
src/_hooks/
├── queries/                    # Hooks de leitura (GET)
│   ├── use-get-users.ts
│   └── use-get-user.ts
├── mutations/                  # Hooks de escrita (POST/PUT/DELETE)
│   ├── use-create-user.ts
│   ├── use-update-user.ts
│   └── use-delete-user.ts
└── use-auth.ts                # Hooks customizados
```

### Nomenclatura de Arquivos

| Tipo       | Padrão                | Exemplo            |
| ---------- | --------------------- | ------------------ |
| Componente | kebab-case.tsx        | `user-form.tsx`    |
| Hook       | use-kebab-case.ts     | `use-get-users.ts` |
| Service    | kebab-case.service.ts | `user.service.ts`  |
| Type       | kebab-case.ts         | `user.ts`          |
| Schema     | kebab-case.schema.ts  | `user.schema.ts`   |
| Util       | kebab-case.ts         | `date-utils.ts`    |

### Imports

Organize imports na seguinte ordem:

```typescript
// 1. Imports externos
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// 2. Imports de componentes UI
import { Button } from "@/_components/ui/button";
import { Form } from "@/_components/ui/form";

// 3. Imports de hooks
import { useGetUsers } from "@/_hooks/queries/use-get-users";
import { useCreateUser } from "@/_hooks/mutations/use-create-user";

// 4. Imports de types/schemas
import { User } from "@/_types/user";
import { userFormSchema } from "@/_schemas/user.schema";

// 5. Imports de componentes locais
import { UserTable } from "./_components/user-table";
```

### Comentários

Use comentários para explicar "por quê", não "o quê":

```typescript
// ✅ Bom
// Validamos antes de 8:30 AM porque é o horário limite da cozinha
if (isBefore830AM(date)) {
  // ...
}

// ❌ Evite
// Verifica se é antes de 8:30
if (isBefore830AM(date)) {
  // ...
}
```

### Tratamento de Erros

```typescript
// Em componentes
const handleSubmit = (data: FormValues) => {
  createUser(data, {
    onSuccess: () => {
      toast.success("Usuário criado com sucesso");
      onSuccess();
    },
    onError: (error) => {
      if (error instanceof AppError) {
        toast.error(error.message);
      } else {
        toast.error("Erro inesperado ao criar usuário");
      }
    },
  });
};

// Em services
export const UserService = {
  create: async (data: CreateUserRequest): Promise<User> => {
    try {
      return await apiClient<User>("/users", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (error) {
      // Deixe o apiClient lidar com erros HTTP
      throw error;
    }
  },
};
```

## 🐛 Debugging

### React DevTools

Instale a extensão React DevTools para Chrome/Firefox:

- Inspecione componentes
- Visualize props e state
- Trace re-renders

### Tanstack Query DevTools

Já incluído no projeto em desenvolvimento:

```typescript
// src/_providers/react-query.tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

<QueryClientProvider client={queryClient}>
  {children}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

Acesse via botão flutuante no canto inferior direito.

### Console Logging

Use console.log estrategicamente:

```typescript
// Debug de props
console.log("UserForm props:", { user, onSuccess });

// Debug de estado
console.log("Form values:", form.getValues());

// Debug de API
console.log("API response:", data);
```

### Breakpoints

Use `debugger` para pausar execução:

```typescript
const handleSubmit = (data: FormValues) => {
  debugger; // Pausa aqui
  createUser(data);
};
```

### Network Tab

Use o Network tab do DevTools para:

- Verificar requisições à API
- Inspecionar headers (Authorization)
- Ver payloads de request/response
- Identificar erros HTTP

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Erro de CORS

**Sintoma:** `Access to fetch at 'http://localhost:8080/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solução:** Configure CORS no backend:

```typescript
// backend/src/index.ts
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
```

#### 2. Token JWT Expirado

**Sintoma:** Requisições retornam 401 Unauthorized

**Solução:** O apiClient já redireciona para login automaticamente. Verifique se o token está sendo enviado:

```typescript
// src/_lib/api-client.ts
const token = localStorage.getItem("auth_token");
```

#### 3. Formulário Não Valida

**Sintoma:** Formulário submete sem validar campos

**Solução:** Verifique se o resolver está configurado:

```typescript
const form = useForm({
  resolver: zodResolver(userFormSchema), // ← Importante!
});
```

#### 4. Tanstack Query Não Atualiza

**Sintoma:** Dados não atualizam após mutation

**Solução:** Invalide queries após mutation:

```typescript
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => UserService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] }); // ← Importante!
    },
  });
};
```

#### 5. Componente Não Re-renderiza

**Sintoma:** UI não atualiza quando estado muda

**Solução:** Verifique se está usando estado corretamente:

```typescript
// ✅ Bom
const [count, setCount] = useState(0);
setCount(count + 1);

// ❌ Evite
let count = 0;
count = count + 1; // Não causa re-render
```

#### 6. Erro de Hidratação

**Sintoma:** `Warning: Text content did not match. Server: "..." Client: "..."`

**Solução:** Evite renderização condicional baseada em localStorage no primeiro render:

```typescript
// ❌ Evite
const user = localStorage.getItem("user"); // undefined no servidor

// ✅ Bom
const [user, setUser] = useState(null);

useEffect(() => {
  setUser(localStorage.getItem("user"));
}, []);
```

### Comandos Úteis

```bash
# Limpar cache do Next.js
rm -rf .next

# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar erros de TypeScript
npx tsc --noEmit

# Verificar erros de ESLint
npm run lint

# Executar build para verificar erros de produção
npm run build
```

### Logs do Servidor

Para ver logs detalhados do servidor de desenvolvimento:

```bash
# Com logs detalhados
npm run dev -- --debug

# Com logs de build
npm run dev -- --show-all
```

## 📚 Recursos Adicionais

### Documentação Oficial

- [Next.js 15 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Tanstack Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [React Hook Form Docs](https://react-hook-form.com/get-started)
- [Zod Docs](https://zod.dev)

### Tutoriais e Guias

- [Next.js App Router Tutorial](https://nextjs.org/learn)
- [TypeScript for React Developers](https://react-typescript-cheatsheet.netlify.app/)
- [Tailwind CSS Best Practices](https://tailwindcss.com/docs/reusing-styles)

### Ferramentas

- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Tailwind Play](https://play.tailwindcss.com/)
- [Regex101](https://regex101.com/) - Para testar regex
- [JSON Formatter](https://jsonformatter.org/) - Para formatar JSON

## 🤝 Suporte

Se encontrar problemas:

1. Verifique a documentação
2. Procure em issues existentes no GitHub
3. Pergunte no canal de desenvolvimento da equipe
4. Abra uma nova issue com detalhes do problema

---

**Última atualização:** 2025-01-17
