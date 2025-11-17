# Guia de Contribuição

Obrigado por considerar contribuir para o Sistema de Reservas de Almoço Corporativo! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Padrões de Desenvolvimento](#padrões-de-desenvolvimento)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Commits](#commits)
- [Pull Requests](#pull-requests)
- [Testes](#testes)

## 🤝 Código de Conduta

- Seja respeitoso e profissional
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Mostre empatia com outros membros

## 🚀 Como Contribuir

### 1. Fork e Clone

```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone <seu-fork-url>
cd booking-menu-front

# Adicione o repositório original como upstream
git remote add upstream <repositorio-original-url>
```

### 2. Crie uma Branch

```bash
# Atualize sua main
git checkout main
git pull upstream main

# Crie uma branch para sua feature/fix
git checkout -b feat/nome-da-feature
# ou
git checkout -b fix/nome-do-bug
```

### 3. Desenvolva

- Siga os [Padrões de Desenvolvimento](#padrões-de-desenvolvimento)
- Escreva código limpo e bem documentado
- Adicione testes quando apropriado
- Teste suas mudanças localmente

### 4. Commit

```bash
# Adicione suas mudanças
git add .

# Commit seguindo Conventional Commits
git commit -m "feat: adiciona nova funcionalidade"
```

### 5. Push e Pull Request

```bash
# Push para seu fork
git push origin feat/nome-da-feature

# Abra um Pull Request no GitHub
```

## 💻 Padrões de Desenvolvimento

### Convenções de Nomenclatura

#### Arquivos e Pastas

- Use **kebab-case** para nomes de arquivos e pastas
- Exemplos: `user-form.tsx`, `use-get-users.ts`, `menu-item.service.ts`

#### Componentes React

- Use **PascalCase** para componentes
- Exemplos: `UserForm`, `MenuCard`, `ReservationDialog`

#### Funções e Variáveis

- Use **camelCase** para funções e variáveis
- Use nomes descritivos
- Exemplos: `getUserById`, `isLoading`, `hasError`, `handleSubmit`

#### Constantes

- Use **UPPER_SNAKE_CASE** para constantes
- Exemplos: `API_BASE_URL`, `MAX_RETRIES`, `DEFAULT_PAGE_SIZE`

### Estrutura de Componentes

#### Componentes de Página

Componentes usados apenas em uma página específica devem ficar em `_components`:

```
src/app/(dashboard)/usuarios/
├── page.tsx
└── _components/
    ├── user-form.tsx
    ├── user-table.tsx
    └── user-status-toggle.tsx
```

#### Componentes Reutilizáveis

Componentes usados em múltiplas páginas devem ficar em `_components/common`:

```
src/_components/common/
├── header.tsx
├── sidebar.tsx
├── protected-route.tsx
└── page-container.tsx
```

#### Componentes UI

Componentes da biblioteca shadcn/ui ficam em `_components/ui`:

```
src/_components/ui/
├── button.tsx
├── dialog.tsx
├── form.tsx
└── table.tsx
```

### TypeScript

#### Types vs Interfaces

- Use `interface` para objetos que podem ser estendidos
- Use `type` para unions, intersections e tipos primitivos

```typescript
// ✅ Bom
interface User {
  id: string;
  name: string;
}

type UserRole = "ADMIN" | "USER";
type UserStatus = "ATIVO" | "INATIVO";

// ❌ Evite
type User = {
  id: string;
  name: string;
};

interface UserRole extends String {}
```

#### Tipagem Explícita

- Sempre defina tipos para props de componentes
- Use tipos inferidos para variáveis quando óbvio
- Evite `any` - use `unknown` se necessário

```typescript
// ✅ Bom
interface UserFormProps {
  user?: User;
  onSuccess: () => void;
}

const UserForm = ({ user, onSuccess }: UserFormProps) => {
  const [isLoading, setIsLoading] = useState(false); // tipo inferido
  // ...
};

// ❌ Evite
const UserForm = ({ user, onSuccess }: any) => {
  // ...
};
```

### React e Next.js

#### Componentes Funcionais

- Sempre use componentes funcionais com hooks
- Evite componentes de classe

```typescript
// ✅ Bom
const UserCard = ({ user }: UserCardProps) => {
  return <div>{user.name}</div>;
};

// ❌ Evite
class UserCard extends React.Component {
  render() {
    return <div>{this.props.user.name}</div>;
  }
}
```

#### Hooks

- Use hooks customizados para lógica reutilizável
- Prefixe hooks customizados com `use`
- Siga as regras dos hooks (não chame em loops/condições)

```typescript
// ✅ Bom
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  // ...
  return { user, login, logout };
};

// ❌ Evite
const getAuth = () => {
  const [user, setUser] = useState<User | null>(null); // hooks em função não-hook
  // ...
};
```

#### Server vs Client Components

- Use Server Components por padrão (Next.js 15)
- Use `"use client"` apenas quando necessário (hooks, eventos, etc)

```typescript
// Server Component (padrão)
const UsersPage = async () => {
  return <div>...</div>;
};

// Client Component (quando necessário)
"use client";

const UserForm = () => {
  const [name, setName] = useState("");
  return <form>...</form>;
};
```

### Formulários

#### React Hook Form + Zod

Sempre use React Hook Form com Zod para validação:

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
});

type UserFormValues = z.infer<typeof userSchema>;

const UserForm = () => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = (data: UserFormValues) => {
    // ...
  };

  return <Form {...form}>...</Form>;
};
```

### Requisições à API

#### Tanstack Query

Use Tanstack Query para todas as requisições:

```typescript
// Query (GET)
// src/_hooks/queries/use-get-users.ts
export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => UserService.getAll(),
  });
};

// Mutation (POST/PUT/DELETE)
// src/_hooks/mutations/use-create-user.ts
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => UserService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// Uso no componente
const UserForm = () => {
  const { data: users, isLoading } = useGetUsers();
  const { mutate: createUser } = useCreateUser();

  const handleSubmit = (data: UserFormValues) => {
    createUser(data, {
      onSuccess: () => {
        toast.success("Usuário criado com sucesso");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };
};
```

### Estilização

#### Tailwind CSS

- Use classes do Tailwind para estilização
- Use componentes shadcn/ui quando disponível
- Evite CSS customizado quando possível

```typescript
// ✅ Bom
<div className="flex items-center gap-4 rounded-lg border p-4">
  <Button variant="outline" size="sm">
    Cancelar
  </Button>
</div>

// ❌ Evite
<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
  <button className="custom-button">Cancelar</button>
</div>
```

#### Responsividade

Use breakpoints do Tailwind:

```typescript
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {/* Mobile: 1 coluna, Tablet: 2 colunas, Desktop: 3 colunas */}
</div>
```

### Tratamento de Erros

#### Try-Catch

Use try-catch para operações que podem falhar:

```typescript
const handleSubmit = async (data: FormValues) => {
  try {
    await createUser(data);
    toast.success("Usuário criado com sucesso");
  } catch (error) {
    if (error instanceof AppError) {
      toast.error(error.message);
    } else {
      toast.error("Erro inesperado");
    }
  }
};
```

#### Error Boundaries

Use Error Boundaries para erros não tratados:

```typescript
// app/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Algo deu errado!</h2>
      <button onClick={reset}>Tentar novamente</button>
    </div>
  );
}
```

### Performance

#### Memoização

Use React.memo, useMemo e useCallback quando apropriado:

```typescript
// Componente pesado que não precisa re-renderizar
const UserCard = React.memo(({ user }: UserCardProps) => {
  return <div>{user.name}</div>;
});

// Cálculo pesado
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data);
}, [data]);

// Callback que não precisa ser recriado
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

#### Code Splitting

Use dynamic imports para code splitting:

```typescript
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./heavy-component"), {
  loading: () => <Skeleton />,
});
```

### Acessibilidade

#### ARIA Labels

Adicione labels apropriados:

```typescript
<button aria-label="Fechar modal" onClick={onClose}>
  <X className="h-4 w-4" />
</button>
```

#### Navegação por Teclado

Garanta que todos os elementos interativos sejam acessíveis por teclado.

#### Contraste de Cores

Use cores com contraste adequado (WCAG AA).

## 📝 Commits

### Conventional Commits

Siga o padrão Conventional Commits:

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

#### Tipos

- `feat`: nova funcionalidade
- `fix`: correção de bug
- `refactor`: refatoração de código
- `style`: mudanças de estilo/formatação
- `docs`: documentação
- `test`: testes
- `chore`: tarefas de manutenção
- `perf`: melhorias de performance
- `ci`: mudanças em CI/CD

#### Exemplos

```bash
# Feature
git commit -m "feat(users): adiciona filtro por status"

# Bug fix
git commit -m "fix(reservations): corrige validação de horário"

# Refactor
git commit -m "refactor(api): extrai lógica de autenticação"

# Documentation
git commit -m "docs: atualiza guia de contribuição"

# Breaking change
git commit -m "feat(auth)!: altera estrutura de token JWT

BREAKING CHANGE: token agora inclui campo 'exp'"
```

### Mensagens de Commit

- Use letras minúsculas
- Use verbos no imperativo ("adiciona" não "adicionado")
- Seja conciso mas descritivo
- Limite a primeira linha a 72 caracteres
- Use o corpo para explicações detalhadas

## 🔄 Pull Requests

### Checklist

Antes de abrir um PR, verifique:

- [ ] Código segue os padrões do projeto
- [ ] Testes passam (`npm run test`)
- [ ] Lint passa (`npm run lint`)
- [ ] Build funciona (`npm run build`)
- [ ] Commits seguem Conventional Commits
- [ ] Documentação atualizada (se necessário)
- [ ] Screenshots adicionados (para mudanças visuais)

### Descrição do PR

Use o template:

```markdown
## Descrição

Breve descrição das mudanças

## Tipo de Mudança

- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Como Testar

1. Passo 1
2. Passo 2
3. Passo 3

## Screenshots (se aplicável)

[Adicione screenshots aqui]

## Checklist

- [ ] Código segue os padrões
- [ ] Testes adicionados/atualizados
- [ ] Documentação atualizada
```

### Review

- Responda aos comentários de forma construtiva
- Faça as mudanças solicitadas
- Marque conversas como resolvidas quando apropriado

## 🧪 Testes

### Escrevendo Testes

```typescript
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import UserCard from "./user-card";

describe("UserCard", () => {
  it("deve renderizar o nome do usuário", () => {
    const user = { id: "1", name: "João Silva" };
    render(<UserCard user={user} />);
    expect(screen.getByText("João Silva")).toBeInTheDocument();
  });

  it("deve chamar onEdit quando botão é clicado", async () => {
    const onEdit = vi.fn();
    const user = { id: "1", name: "João Silva" };
    render(<UserCard user={user} onEdit={onEdit} />);

    await userEvent.click(screen.getByRole("button", { name: /editar/i }));
    expect(onEdit).toHaveBeenCalledWith(user);
  });
});
```

### Executando Testes

```bash
# Todos os testes
npm run test

# Modo watch
npm run test -- --watch

# Com coverage
npm run test -- --coverage

# Teste específico
npm run test -- user-card.test.tsx
```

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tanstack Query Documentation](https://tanstack.com/query/latest)
- [React Hook Form Documentation](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)

## ❓ Dúvidas

Se tiver dúvidas:

1. Verifique a documentação
2. Procure em issues existentes
3. Abra uma nova issue com a tag `question`
4. Entre em contato com a equipe

## 🙏 Agradecimentos

Obrigado por contribuir para o projeto!
