# Design Document

## Overview

Este documento descreve o design técnico da adaptação do frontend Next.js 15 para consumir a API REST de reservas de almoço corporativo. O sistema substituirá completamente o módulo de companies por um sistema completo de gerenciamento de reservas que inclui autenticação, usuários, categorias, itens de menu, cardápios e reservas.

O design seguirá os padrões já estabelecidos no projeto:

- **UI**: shadcn/ui + Tailwind CSS
- **Formulários**: React Hook Form + Zod
- **Estado Assíncrono**: Tanstack Query
- **Autenticação**: JWT tokens (Better Auth para sessões)
- **Arquitetura**: Feature-based organization

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js 15 Frontend                      │
│                      (App Router)                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages/     │  │  Components  │  │    Hooks     │      │
│  │   Routes     │  │   (UI/UX)    │  │  (Queries/   │      │
│  │              │  │              │  │  Mutations)  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                 │               │
│         └─────────────────┴─────────────────┘               │
│                           │                                  │
│         ┌─────────────────┴─────────────────┐               │
│         │                                     │               │
│  ┌──────▼───────┐                   ┌────────▼────────┐     │
│  │   Services   │                   │   Schemas (Zod) │     │
│  │  (API calls) │                   │   Validations   │     │
│  └──────┬───────┘                   └─────────────────┘     │
│         │                                                     │
│  ┌──────▼───────┐                                           │
│  │  API Client  │                                           │
│  │  (fetch +    │                                           │
│  │   JWT auth)  │                                           │
│  └──────┬───────┘                                           │
│         │                                                     │
└─────────┼─────────────────────────────────────────────────┘
          │
          │ HTTP/REST + JWT
          │
┌─────────▼─────────────────────────────────────────────────┐
│              Backend API (Node.js + Express)               │
│                  http://localhost:8080/api                 │
│                                                             │
│  Endpoints: /auth, /users, /categories, /menu-items,      │
│             /menus, /reservations, /week-days              │
└─────────────────────────────────────────────────────────────┘
```

### Folder Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth layout group
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/              # Dashboard layout group (authenticated)
│   │   ├── layout.tsx            # Shared layout with sidebar
│   │   ├── page.tsx              # Dashboard home
│   │   ├── usuarios/             # User management (admin)
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   ├── categorias/           # Categories (admin)
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   ├── itens-menu/           # Menu items (admin)
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   ├── cardapios/            # Menus (admin + user)
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   ├── minhas-reservas/      # My reservations (user)
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   └── reservas/             # All reservations (admin)
│   │       ├── page.tsx
│   │       └── _components/
│   ├── api/                      # API routes (if needed)
│   ├── globals.css
│   └── layout.tsx
│
├── _components/                  # Shared components
│   ├── common/
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   ├── user-menu.tsx
│   │   └── protected-route.tsx
│   └── ui/                       # shadcn/ui components
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── form.tsx
│       ├── table.tsx
│       └── ...
│
├── _hooks/                       # Custom hooks
│   ├── queries/                  # Tanstack Query hooks
│   │   ├── use-get-users.ts
│   │   ├── use-get-categories.ts
│   │   ├── use-get-menu-items.ts
│   │   ├── use-get-menus.ts
│   │   ├── use-get-reservations.ts
│   │   └── use-get-week-days.ts
│   ├── mutations/                # Mutation hooks
│   │   ├── use-create-user.ts
│   │   ├── use-update-user.ts
│   │   ├── use-toggle-user-status.ts
│   │   ├── use-create-category.ts
│   │   ├── use-update-category.ts
│   │   ├── use-delete-category.ts
│   │   ├── use-create-menu-item.ts
│   │   ├── use-update-menu-item.ts
│   │   ├── use-delete-menu-item.ts
│   │   ├── use-create-menu.ts
│   │   ├── use-update-menu.ts
│   │   ├── use-delete-menu.ts
│   │   ├── use-create-reservation.ts
│   │   ├── use-update-reservation.ts
│   │   └── use-cancel-reservation.ts
│   └── use-auth.ts              # Auth hook
│
├── _lib/                         # Utilities
│   ├── api-client.ts             # HTTP client with JWT
│   ├── auth-client.ts            # Auth utilities
│   ├── utils.ts                  # General utilities
│   └── date-utils.ts             # Date formatting utilities
│
├── _schemas/                     # Zod schemas
│   ├── auth.schema.ts
│   ├── user.schema.ts
│   ├── category.schema.ts
│   ├── menu-item.schema.ts
│   ├── menu.schema.ts
│   └── reservation.schema.ts
│
├── _services/                    # API services
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── category.service.ts
│   ├── menu-item.service.ts
│   ├── menu.service.ts
│   ├── reservation.service.ts
│   └── week-day.service.ts
│
├── _types/                       # TypeScript types
│   ├── auth.ts
│   ├── user.ts
│   ├── category.ts
│   ├── menu-item.ts
│   ├── menu.ts
│   ├── reservation.ts
│   └── week-day.ts
│
└── _providers/                   # Context providers
    ├── react-query.tsx
    └── auth-provider.tsx
```

## Components and Interfaces

### Core Components

#### 1. Authentication Components

**LoginForm** (`app/(auth)/login/_components/login-form.tsx`)

- Form com campos CPF (máscara 000.000.000-00) e senha
- Validação com Zod
- Submit chama AuthService.login()
- Armazena token JWT no localStorage
- Redireciona para dashboard após sucesso

**ProtectedRoute** (`_components/common/protected-route.tsx`)

- HOC que verifica autenticação
- Redireciona para /login se não autenticado
- Verifica role do usuário (admin/user)
- Redireciona se não tem permissão

#### 2. Layout Components

**DashboardLayout** (`app/(dashboard)/layout.tsx`)

- Layout principal com sidebar e header
- Sidebar com navegação baseada em role
- Header com informações do usuário e botão logout

**Sidebar** (`_components/common/sidebar.tsx`)

- Navegação condicional baseada em role:
  - **USER**: Cardápios, Minhas Reservas, Perfil
  - **ADMIN**: Dashboard, Usuários, Categorias, Itens de Menu, Cardápios, Reservas, Perfil
- Indicador visual da rota ativa

**Header** (`_components/common/header.tsx`)

- Logo do sistema
- Informações do usuário (nome, role, avatar)
- Menu dropdown com opções de perfil e logout
- Toggle dark mode

#### 3. User Management Components (Admin)

**UsersTable** (`app/(dashboard)/usuarios/_components/users-table.tsx`)

- Tabela com colunas: CPF, Nome, Role, Tipo, Status, Ações
- Filtros: Status, Role, UserType
- Ações: Editar, Ativar/Desativar
- Paginação
- Loading states com skeleton

**UserFormDialog** (`app/(dashboard)/usuarios/_components/user-form-dialog.tsx`)

- Modal para criar/editar usuário
- Campos: CPF (máscara), Nome, Senha, Role (select), UserType (select)
- Validação em tempo real
- Submit chama UserService.create() ou UserService.update()

**UserStatusToggle** (`app/(dashboard)/usuarios/_components/user-status-toggle.tsx`)

- Botão toggle para ativar/desativar usuário
- Confirmação antes de alterar
- Atualiza status via UserService.toggleStatus()

#### 4. Category Management Components (Admin)

**CategoriesTable** (`app/(dashboard)/categorias/_components/categories-table.tsx`)

- Tabela com colunas: Nome, Descrição, Ordem, Status, Ações
- Filtro por status
- Ações: Editar, Excluir
- Ordenação por displayOrder

**CategoryFormDialog** (`app/(dashboard)/categorias/_components/category-form-dialog.tsx`)

- Modal para criar/editar categoria
- Campos: Nome, Descrição (textarea), DisplayOrder (number)
- Validação Zod
- Submit chama CategoryService.create() ou CategoryService.update()

#### 5. Menu Item Management Components (Admin)

**MenuItemsTable** (`app/(dashboard)/itens-menu/_components/menu-items-table.tsx`)

- Tabela com colunas: Nome, Descrição, Categoria, Status, Ações
- Filtros: Categoria, Status
- Ações: Editar, Excluir
- Agrupamento visual por categoria

**MenuItemFormDialog** (`app/(dashboard)/itens-menu/_components/menu-item-form-dialog.tsx`)

- Modal para criar/editar item
- Campos: Nome, Descrição, Categoria (select com categorias ativas)
- Validação Zod
- Submit chama MenuItemService.create() ou MenuItemService.update()

#### 6. Menu Management Components (Admin)

**MenusCalendar** (`app/(dashboard)/cardapios/_components/menus-calendar.tsx`)

- Visualização semanal de cardápios
- Navegação entre semanas (anterior/próxima)
- Cards com resumo do cardápio de cada dia
- Indicador de quantidade de reservas
- Botões: Ver Detalhes, Editar, Excluir

**MenuFormDialog** (`app/(dashboard)/cardapios/_components/menu-form-dialog.tsx`)

- Modal para criar/editar cardápio
- Campos: Data (date picker, apenas futuras), Observações
- Seleção de itens de menu organizados por categoria
- Checkbox para marcar proteína principal
- Preview da composição do cardápio
- Submit chama MenuService.create() ou MenuService.update()

**MenuDetailsDialog** (`app/(dashboard)/cardapios/_components/menu-details-dialog.tsx`)

- Modal com detalhes completos do cardápio
- Itens organizados por categoria
- Variações disponíveis (Padrão, Com Ovo)
- Lista de reservas (se admin)
- Botão "Fazer Reserva" (se user e sem reserva)

#### 7. Reservation Components (User)

**MyReservationsTable** (`app/(dashboard)/minhas-reservas/_components/my-reservations-table.tsx`)

- Tabela com reservas do usuário
- Colunas: Data, Cardápio, Variação, Status, Auto, Ações
- Filtros: Status, Período
- Ações: Ver Detalhes, Alterar Variação, Cancelar
- Indicador visual de reservas automáticas (badge "Auto")
- Desabilita ações após 8:30 AM

**ReservationFormDialog** (`app/(dashboard)/cardapios/_components/reservation-form-dialog.tsx`)

- Modal para criar reserva
- Seleção de variação (radio buttons)
- Exibe composição do cardápio
- Validação de horário (antes de 8:30 AM)
- Submit chama ReservationService.create()

**ChangeVariationDialog** (`app/(dashboard)/minhas-reservas/_components/change-variation-dialog.tsx`)

- Modal para alterar variação da reserva
- Radio buttons com variações disponíveis
- Validação de horário
- Submit chama ReservationService.update()

**ReservationDetailsDialog** (`app/(dashboard)/minhas-reservas/_components/reservation-details-dialog.tsx`)

- Modal com detalhes completos da reserva
- Cardápio completo organizado por categoria
- Variação selecionada
- Status e data de criação
- Indicador se foi gerada automaticamente

#### 8. All Reservations Components (Admin)

**AllReservationsTable** (`app/(dashboard)/reservas/_components/all-reservations-table.tsx`)

- Tabela com todas as reservas do sistema
- Colunas: Usuário, Data, Cardápio, Variação, Status, Auto
- Filtros: Status, Período, Usuário
- Exportação para Excel/CSV
- Estatísticas (total de reservas, por status, etc.)

## Data Models

### TypeScript Interfaces

```typescript
// _types/auth.ts
export interface LoginRequest {
  cpf: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthUser {
  id: string;
  cpf: string;
  name: string;
  role: UserRole;
  userType: UserType;
  status: UserStatus;
}

// _types/user.ts
export type UserRole = "ADMIN" | "USER";
export type UserType = "FIXO" | "NAO_FIXO";
export type UserStatus = "ATIVO" | "INATIVO";

export interface User {
  id: string;
  cpf: string;
  name: string;
  role: UserRole;
  userType: UserType;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  cpf: string;
  name: string;
  password: string;
  role: UserRole;
  userType: UserType;
}

export interface UpdateUserRequest {
  name?: string;
  password?: string;
  role?: UserRole;
  userType?: UserType;
}

// _types/category.ts
export interface Category {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  displayOrder: number;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
}

// _types/menu-item.ts
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

// _types/menu.ts
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

// _types/reservation.ts
export type ReservationStatus = "ACTIVE" | "CANCELLED";

export interface Reservation {
  id: string;
  userId: string;
  user?: User;
  menuId: string;
  menu: Menu;
  menuVariationId: string;
  menuVariation: MenuVariation;
  reservationDate: string;
  status: ReservationStatus;
  isAutoGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationRequest {
  menuId: string;
  menuVariationId: string;
  reservationDate: string;
}

export interface UpdateReservationRequest {
  menuVariationId: string;
}

// _types/week-day.ts
export interface WeekDay {
  id: string;
  name: string;
  dayOfWeek: DayOfWeek;
}
```

### Zod Schemas

```typescript
// _schemas/auth.schema.ts
import { z } from "zod";

export const loginSchema = z.object({
  cpf: z
    .string()
    .length(11, "CPF deve conter exatamente 11 dígitos")
    .regex(/^\d{11}$/, "CPF deve conter apenas números"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// _schemas/user.schema.ts
import { z } from "zod";

export const userFormSchema = z.object({
  cpf: z
    .string()
    .length(11, "CPF deve conter exatamente 11 dígitos")
    .regex(/^\d{11}$/, "CPF deve conter apenas números"),
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(255, "Nome deve ter no máximo 255 caracteres"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  role: z.enum(["ADMIN", "USER"], {
    required_error: "Selecione um perfil",
  }),
  userType: z.enum(["FIXO", "NAO_FIXO"], {
    required_error: "Selecione um tipo",
  }),
});

export const updateUserFormSchema = userFormSchema
  .omit({ cpf: true, password: true })
  .extend({
    password: z.string().min(6).optional().or(z.literal("")),
  });

export type UserFormValues = z.infer<typeof userFormSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserFormSchema>;

// _schemas/category.schema.ts
import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional()
    .or(z.literal("")),
  displayOrder: z
    .number()
    .int("Ordem deve ser um número inteiro")
    .positive("Ordem deve ser um número positivo"),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

// _schemas/menu-item.schema.ts
import { z } from "zod";

export const menuItemFormSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(200, "Nome deve ter no máximo 200 caracteres"),
  description: z
    .string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional()
    .or(z.literal("")),
  categoryId: z.string().uuid("Selecione uma categoria válida"),
});

export type MenuItemFormValues = z.infer<typeof menuItemFormSchema>;

// _schemas/menu.schema.ts
import { z } from "zod";

export const menuFormSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  dayOfWeek: z.enum([
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ]),
  observations: z
    .string()
    .max(500, "Observações devem ter no máximo 500 caracteres")
    .optional()
    .or(z.literal("")),
  menuCompositions: z
    .array(
      z.object({
        menuItemId: z.string().uuid(),
        isMainProtein: z.boolean(),
      }),
    )
    .min(1, "Selecione pelo menos um item"),
});

export type MenuFormValues = z.infer<typeof menuFormSchema>;

// _schemas/reservation.schema.ts
import { z } from "zod";

export const reservationFormSchema = z.object({
  menuId: z.string().uuid("Menu inválido"),
  menuVariationId: z.string().uuid("Selecione uma variação"),
  reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
});

export const updateReservationFormSchema = z.object({
  menuVariationId: z.string().uuid("Selecione uma variação"),
});

export type ReservationFormValues = z.infer<typeof reservationFormSchema>;
export type UpdateReservationFormValues = z.infer<
  typeof updateReservationFormSchema
>;
```

## Error Handling

### API Error Handling

```typescript
// _lib/api-client.ts
import { AppError } from "@/_errors/AppError";

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = `${apiBaseUrl}${endpoint}`;

  // Get JWT token from localStorage
  const token = localStorage.getItem("auth_token");

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    // Handle 401 Unauthorized - redirect to login
    if (response.status === 401) {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
      throw new AppError("Sessão expirada. Faça login novamente.", 401);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AppError(
        errorData?.message || errorData?.error || "Erro na requisição",
        response.status,
      );
    }

    if (response.status === 204) {
      return null as T;
    }

    return response.json() as T;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Erro de conexão com o servidor", 500);
  }
}
```

### Error Display

- **Toast notifications** (sonner) para erros de API
- **Inline errors** em formulários (React Hook Form)
- **Error boundaries** para erros não tratados
- **Retry logic** em Tanstack Query para falhas temporárias

## Testing Strategy

### Unit Tests

**Componentes a testar:**

- Form validations (Zod schemas)
- Utility functions (date formatting, CPF mask)
- Custom hooks logic

**Ferramentas:**

- Vitest
- React Testing Library

### Integration Tests

**Fluxos a testar:**

- Login flow
- Create/Edit/Delete operations
- Reservation flow with time restrictions
- Role-based access control

### E2E Tests (opcional)

**Cenários críticos:**

- Complete reservation flow (user)
- Menu management flow (admin)
- User management flow (admin)

**Ferramenta:** Playwright

## Performance Considerations

### Tanstack Query Configuration

```typescript
// _providers/react-query.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

### Optimizations

1. **Code Splitting**: Lazy load admin routes
2. **Image Optimization**: Next.js Image component
3. **Memoization**: React.memo for expensive components
4. **Virtual Scrolling**: For large tables (react-virtual)
5. **Debouncing**: Search inputs and filters

## Security Considerations

1. **JWT Storage**: localStorage (considerar httpOnly cookies para produção)
2. **XSS Protection**: Sanitize user inputs
3. **CSRF Protection**: Tokens em formulários críticos
4. **Role Validation**: Client-side + server-side
5. **Sensitive Data**: Não expor senhas ou tokens em logs
6. **HTTPS**: Obrigatório em produção

## Accessibility

1. **Semantic HTML**: Uso correto de tags
2. **ARIA labels**: Para componentes interativos
3. **Keyboard navigation**: Tab order lógico
4. **Screen reader support**: Textos alternativos
5. **Color contrast**: WCAG AA compliance
6. **Focus indicators**: Visíveis e claros

## Internationalization (Future)

Preparar estrutura para i18n:

- next-intl ou react-i18next
- Arquivos de tradução por módulo
- Formatação de datas/números por locale
- Suporte a pt-BR (inicial) e en-US (futuro)
