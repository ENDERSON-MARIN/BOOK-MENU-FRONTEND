# Sistema de Tratamento de Erros

Este documento descreve o sistema de tratamento de erros implementado no frontend do Sistema de Reservas de Almoço.

## Componentes do Sistema

### 1. Error Boundary

**Localização:** `src/_components/common/error-boundary.tsx`

Error Boundary é um componente React que captura erros JavaScript em qualquer lugar da árvore de componentes filhos, registra esses erros e exibe uma UI de fallback.

**Características:**

- Captura erros não tratados em componentes React
- Exibe mensagem amigável ao usuário
- Mostra detalhes do erro em modo de desenvolvimento
- Oferece opções para tentar novamente ou voltar ao início
- Implementado no layout principal (`src/app/layout.tsx`)

**Uso:**

```tsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### 2. Páginas de Erro Customizadas

#### Página 404 (Not Found)

**Localização:** `src/app/not-found.tsx`

Exibida quando o usuário tenta acessar uma rota que não existe.

**Características:**

- Design consistente com o tema do aplicativo
- Ícone visual (FileQuestion)
- Botões para voltar ao início ou ver cardápios
- Mensagem clara e amigável

#### Página 500 (Error)

**Localização:** `src/app/error.tsx`

Exibida quando ocorre um erro no servidor ou erro não tratado na aplicação.

**Características:**

- Captura erros em tempo de execução
- Exibe detalhes do erro em desenvolvimento
- Botão para tentar novamente (reset)
- Botão para voltar ao início
- Registra erro no console para debugging

#### Página de Erro do Dashboard

**Localização:** `src/app/(dashboard)/error.tsx`

Versão específica para erros dentro do dashboard, mantendo o contexto do usuário logado.

**Características:**

- Layout adaptado para área autenticada
- Mesmas funcionalidades da página 500 global
- Mantém navegação do dashboard

### 3. Retry Logic no Tanstack Query

**Localização:** `src/_providers/react-query.tsx`

Configuração global de retry para queries e mutations.

**Configuração Padrão:**

- **Queries:**
  - Retry até 2 vezes para erros 5xx (server errors)
  - Não faz retry para erros 4xx (client errors)
  - Não faz retry para erros 401 (não autenticado) e 403 (não autorizado)
  - Exponential backoff: 1s, 2s, 4s
  - Stale time: 5 minutos
  - GC time: 10 minutos

- **Mutations:**
  - Não faz retry automático (deve ser tratado manualmente)

### 4. Utilitários de Retry

**Localização:** `src/_lib/query-utils.ts`

Fornece configurações de retry pré-definidas para diferentes cenários.

#### `criticalQueryRetry`

Para queries críticas que precisam de retry mais agressivo:

- Retry até 3 vezes
- Exponential backoff: 1s, 2s, 4s, 8s
- Não faz retry para erros 4xx, 401, 403

**Uso:**

```typescript
import { criticalQueryRetry } from "@/_lib/query-utils";

export function useGetMenus() {
  return useQuery({
    queryKey: ["menus"],
    queryFn: () => MenuService.getAll(),
    ...criticalQueryRetry,
  });
}
```

#### `noRetryQuery`

Para queries que não devem ser retentadas:

```typescript
import { noRetryQuery } from "@/_lib/query-utils";

export function useGetUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => UserService.getMe(),
    ...noRetryQuery,
  });
}
```

#### `defaultQueryRetry`

Configuração padrão (já aplicada globalmente, mas pode ser usada explicitamente).

### 5. API Client Error Handling

**Localização:** `src/_lib/api-client.ts`

Trata erros HTTP e fornece mensagens apropriadas.

**Tratamento de Erros:**

- **401 Unauthorized:** Remove token, exibe toast e redireciona para login
- **403 Forbidden:** Exibe mensagem de acesso negado
- **404 Not Found:** Lança erro com mensagem apropriada
- **204 No Content:** Retorna null
- **Outros erros:** Lança AppError com mensagem da API

### 6. Classe AppError

**Localização:** `src/_errors/AppError.ts`

Classe customizada para erros da aplicação.

**Propriedades:**

- `message`: Mensagem de erro
- `statusCode`: Código HTTP do erro
- `name`: Nome do erro ("AppError")

## Queries com Retry Crítico Implementadas

As seguintes queries foram configuradas com retry crítico:

1. **useGetMenus** - Busca de cardápios (crítico para visualização)
2. **useGetMyReservations** - Busca de reservas do usuário (crítico para gerenciamento)

## Boas Práticas

### Quando usar retry crítico:

- Queries essenciais para a funcionalidade principal
- Dados que o usuário precisa ver imediatamente
- Operações que podem falhar temporariamente por problemas de rede

### Quando NÃO usar retry:

- Mutations (criar, atualizar, deletar)
- Queries de autenticação/autorização
- Operações que devem falhar imediatamente

### Tratamento de Erros em Componentes:

```typescript
const { data, error, isError, isLoading } = useGetMenus();

if (isError) {
  // O erro já foi logado e o retry foi tentado
  return <ErrorMessage error={error} />;
}

if (isLoading) {
  return <LoadingSkeleton />;
}

return <MenuList menus={data} />;
```

### Tratamento de Erros em Mutations:

```typescript
const { mutate, isPending } = useCreateReservation();

const handleSubmit = (data) => {
  mutate(data, {
    onSuccess: () => {
      toast.success("Reserva criada com sucesso!");
    },
    onError: (error) => {
      if (error instanceof AppError) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao criar reserva");
      }
    },
  });
};
```

## Debugging

### Modo de Desenvolvimento

Em desenvolvimento, as páginas de erro exibem:

- Mensagem de erro completa
- Stack trace (quando disponível)
- Digest do erro (quando disponível)

### Console Logs

Todos os erros são registrados no console:

- Error Boundary: `console.error("Error Boundary capturou um erro:", error)`
- Páginas de erro: `console.error("Erro capturado pela página de erro:", error)`

### React Query Devtools

Para debugging de queries e mutations, instale o React Query Devtools:

```bash
npm install @tanstack/react-query-devtools
```

E adicione ao provider:

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

<QueryClientProvider client={queryClient}>
  {children}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>;
```

## Melhorias Futuras

1. **Logging Service:** Integrar com serviço de logging (Sentry, LogRocket)
2. **Error Tracking:** Rastrear erros em produção
3. **User Feedback:** Permitir usuário reportar erros
4. **Offline Support:** Melhor tratamento de erros de rede
5. **Error Analytics:** Análise de padrões de erro
