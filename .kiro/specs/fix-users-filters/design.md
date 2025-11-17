# Design Document

## Overview

A correção dos filtros no dashboard de usuários envolve garantir que o React Query gerencie corretamente o cache e as requisições quando os filtros são alterados. Atualmente, a implementação já possui a estrutura básica de filtros (status, role, userType), mas há problemas na sincronização entre os estados dos filtros e as query keys do React Query, resultando em dados desatualizados ou requisições não sendo disparadas corretamente.

O design proposto mantém a arquitetura existente baseada em React Query e componentes shadcn/ui, mas corrige a gestão de cache e garante que cada combinação de filtros resulte em uma requisição única e corretamente cacheada.

## Architecture

### Componentes Principais

1. **UsersTable Component** (`src/app/(dashboard)/usuarios/_components/users-table.tsx`)
   - Componente principal que gerencia os estados dos filtros
   - Renderiza os selects de filtro e a tabela de dados
   - Coordena a comunicação entre filtros e o hook de dados

2. **useGetUsers Hook** (`src/_hooks/queries/use-get-users.ts`)
   - Hook customizado do React Query para buscar usuários
   - Gerencia a query key baseada nos parâmetros de filtro
   - Implementa cache automático e invalidação

3. **UserService** (`src/_services/user.service.ts`)
   - Camada de serviço que abstrai as chamadas à API
   - Constrói query strings com base nos parâmetros de filtro
   - Utiliza o apiClient para comunicação HTTP

### Fluxo de Dados

```
[Usuário altera filtro]
    ↓
[Estado local atualizado (useState)]
    ↓
[useGetUsers recebe novos parâmetros]
    ↓
[React Query detecta mudança na query key]
    ↓
[Nova requisição é disparada]
    ↓
[UserService constrói URL com query params]
    ↓
[API retorna dados filtrados]
    ↓
[React Query cacheia resultado]
    ↓
[Componente re-renderiza com novos dados]
```

## Components and Interfaces

### UsersTable Component

**Responsabilidades:**

- Gerenciar estados locais dos três filtros (status, role, userType)
- Renderizar componentes Select do shadcn/ui para cada filtro com layout responsivo
- Passar parâmetros corretos para o hook useGetUsers
- Exibir estados de loading com skeleton loaders detalhados
- Exibir mensagens de erro claras (Requirement 5.3)
- Renderizar a tabela com os dados filtrados usando UsersTableContent
- Garantir resposta imediata às mudanças de filtro (Requirement 5.1, 5.2)

**Estados:**

```typescript
const [statusFilter, setStatusFilter] = useState<UserStatus | "ALL">("ALL");
const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");
const [userTypeFilter, setUserTypeFilter] = useState<UserType | "ALL">("ALL");
```

**Integração com React Query:**

```typescript
const {
  data: users,
  isLoading,
  isError,
} = useGetUsers({
  status: statusFilter !== "ALL" ? statusFilter : undefined,
  role: roleFilter !== "ALL" ? roleFilter : undefined,
  userType: userTypeFilter !== "ALL" ? userTypeFilter : undefined,
});
```

**Layout Responsivo:**

- Filtros em coluna em mobile (`flex-col`)
- Filtros em linha em desktop (`md:flex-row`)
- Cada select ocupa largura total em mobile (`w-full`)
- Largura fixa de 200px em desktop (`md:w-[200px]`)
- Gap de 4 unidades entre filtros para espaçamento adequado

### useGetUsers Hook

**Interface:**

```typescript
interface UseGetUsersParams {
  status?: UserStatus;
  role?: UserRole;
  userType?: UserType;
}

function useGetUsers(params?: UseGetUsersParams): UseQueryResult<User[]>;
```

**Query Key Strategy:**
A query key deve incluir todos os parâmetros de filtro para garantir cache correto:

```typescript
queryKey: ["users", params];
```

Isso garante que:

- `["users", {}]` é diferente de `["users", { status: "ATIVO" }]`
- Cada combinação de filtros tem seu próprio cache
- Mudanças nos filtros disparam novas requisições automaticamente

### UserService

**Método getAll:**

```typescript
async getAll(params?: GetUsersParams): Promise<User[]>
```

**Construção de Query String:**

- Utiliza URLSearchParams para construir query string de forma segura
- Apenas adiciona parâmetros que não são undefined (evita `?status=undefined`)
- Garante formato correto: `/api/lunch-reservation/users?status=ATIVO&role=ADMIN`
- Endpoint base: `/lunch-reservation/users` (conforme steering rules)
- Usa apiClient para comunicação HTTP com tratamento de erros centralizado

**Implementação Atual:**

```typescript
const queryParams = new URLSearchParams();
if (params?.status) queryParams.append("status", params.status);
if (params?.role) queryParams.append("role", params.role);
if (params?.userType) queryParams.append("userType", params.userType);

const query = queryParams.toString();
const endpoint = query
  ? `/lunch-reservation/users?${query}`
  : "/lunch-reservation/users";

return apiClient<User[]>(endpoint);
```

Esta implementação garante que:

- Parâmetros undefined não aparecem na URL
- Query string é construída corretamente
- Endpoint sem parâmetros não tem `?` desnecessário

## Data Models

### User Type

```typescript
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
```

### Filter State Types

```typescript
type StatusFilterValue = UserStatus | "ALL";
type RoleFilterValue = UserRole | "ALL";
type UserTypeFilterValue = UserType | "ALL";
```

O valor "ALL" representa "sem filtro" e é convertido para `undefined` antes de ser passado ao hook.

## Error Handling

### Estratégia de Tratamento de Erros

1. **Erros de Rede/API (Requirement 5.3):**
   - React Query automaticamente gerencia estados de erro via `isError` e `error`
   - Componente DEVE exibir mensagem clara e amigável quando `isError === true`
   - Implementar retry automático (configuração padrão do React Query: 3 tentativas)
   - Mensagem de erro deve ser específica e orientar o usuário sobre próximos passos

2. **Estados de Loading (Requirement 5.1):**
   - Exibir skeleton loaders durante `isLoading === true`
   - Skeleton deve replicar a estrutura visual da tabela (cabeçalhos + 5 linhas)
   - Skeleton também deve ser exibido para os 3 selects de filtro
   - Manter filtros habilitados durante loading para permitir mudanças rápidas
   - React Query cancela requisições pendentes automaticamente quando filtros mudam (Requirement 5.4)

3. **Dados Vazios:**
   - Diferenciar entre "sem dados" e "erro"
   - Exibir mensagem apropriada quando `data.length === 0`
   - Sugerir ajustar filtros se nenhum resultado for encontrado
   - Manter filtros visíveis e funcionais mesmo sem resultados

4. **Validação de Filtros:**
   - TypeScript garante type-safety dos valores de filtro
   - Select components do shadcn/ui previnem valores inválidos
   - Conversão "ALL" → `undefined` acontece antes da requisição
   - Não há necessidade de validação adicional no runtime

5. **Performance e Cancelamento (Requirement 5.4):**
   - React Query automaticamente cancela requisições pendentes quando nova requisição é iniciada
   - Isso previne race conditions quando usuário altera filtros rapidamente
   - Garante que apenas a requisição mais recente será processada

### Mensagens de Erro

```typescript
if (isError) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row">
        {/* Filtros permanecem visíveis */}
      </div>
      <div className="text-center py-8">
        <p className="text-destructive font-medium">
          Erro ao carregar usuários. Por favor, tente novamente.
        </p>
        <p className="text-muted-foreground text-sm mt-2">
          Se o problema persistir, entre em contato com o suporte.
        </p>
      </div>
    </div>
  );
}
```

### Mensagem de Dados Vazios

```typescript
if (!isLoading && users?.length === 0) {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">
        Nenhum usuário encontrado com os filtros selecionados.
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        Tente ajustar os critérios de busca.
      </p>
    </div>
  );
}
```

## Testing Strategy

### Testes Unitários

1. **useGetUsers Hook:**
   - Verificar que query key muda quando parâmetros mudam (Requirements 1.4, 2.4, 3.4)
   - Testar que `undefined` é passado corretamente quando filtro é "ALL"
   - Validar que o hook retorna dados corretos da API
   - Confirmar que query key é `["users", params]` com estrutura correta

2. **UserService.getAll:**
   - Testar construção correta de query strings para cada filtro individual
   - Verificar que parâmetros undefined não aparecem na URL
   - Validar múltiplas combinações de filtros (Requirement 4.1)
   - Testar endpoint sem parâmetros (todos filtros em "ALL")
   - Verificar formato correto: `/lunch-reservation/users?param=value`

3. **UsersTable Component:**
   - Testar que mudanças nos selects atualizam os estados locais
   - Verificar que estados corretos são passados para useGetUsers
   - Validar renderização de skeleton loaders durante loading (Requirement 5.1)
   - Testar renderização de mensagens de erro claras (Requirement 5.3)
   - Validar renderização de mensagem quando não há dados
   - Testar conversão "ALL" → `undefined` antes de passar ao hook

### Testes de Integração

1. **Fluxo Completo de Filtros Individuais (Requirements 1, 2, 3):**
   - Simular seleção de filtro de status (ATIVO/INATIVO)
   - Simular seleção de filtro de role (ADMIN/USER)
   - Simular seleção de filtro de userType (FIXO/NAO_FIXO)
   - Verificar que requisição é disparada com parâmetros corretos
   - Validar que dados filtrados são exibidos corretamente
   - Testar retorno para "Todos" em cada filtro

2. **Múltiplos Filtros Simultâneos (Requirement 4):**
   - Selecionar status + role + userType simultaneamente
   - Verificar que todos os parâmetros são enviados na requisição
   - Validar que resultado combina todos os critérios selecionados
   - Testar diferentes combinações de 2 filtros
   - Validar que remover um filtro mantém os outros ativos

3. **Cache do React Query (Requirements 1.4, 2.4, 3.4, 4.3):**
   - Aplicar filtros, depois voltar aos mesmos filtros
   - Verificar que dados vêm do cache (sem nova requisição)
   - Validar que mudança em qualquer filtro dispara nova requisição
   - Testar que cada combinação de filtros tem cache independente

4. **Performance e Cancelamento (Requirements 5.2, 5.4):**
   - Alternar rapidamente entre múltiplos filtros
   - Verificar que requisições pendentes são canceladas automaticamente
   - Validar que apenas a última requisição é processada
   - Confirmar que resposta ocorre em menos de 2 segundos

### Testes Manuais

1. **Performance (Requirement 5.2):**
   - Alternar rapidamente entre filtros
   - Verificar que requisições antigas são canceladas
   - Validar que UI permanece responsiva
   - Confirmar tempo de resposta menor que 2 segundos

2. **UX (Requirements 5.1, 5.3):**
   - Verificar que skeleton loaders são exibidos durante carregamento
   - Validar que mensagens de erro são claras e orientam o usuário
   - Testar mensagem de "nenhum resultado encontrado"
   - Verificar que filtros permanecem acessíveis durante loading

3. **Responsividade:**
   - Testar layout de filtros em mobile (coluna)
   - Testar layout de filtros em desktop (linha)
   - Validar que selects são usáveis em diferentes tamanhos de tela
   - Verificar espaçamento adequado entre elementos

## Design Decisions and Rationales

### 1. Manter Estrutura Existente

**Decisão:** Não refatorar completamente, apenas corrigir problemas específicos.
**Rationale:** A arquitetura atual (React Query + shadcn/ui + service layer) é sólida e segue as melhores práticas do projeto. Mudanças mínimas reduzem risco de regressões.

### 2. Query Key com Objeto de Parâmetros

**Decisão:** Usar `["users", params]` em vez de `["users", status, role, userType]`.
**Rationale:**

- Mais limpo e escalável
- React Query compara objetos por valor (deep equality)
- Facilita adicionar novos filtros no futuro

### 3. Conversão "ALL" → undefined

**Decisão:** Converter valor "ALL" para `undefined` antes de passar ao hook.
**Rationale:**

- API não espera parâmetro "ALL"
- `undefined` é semanticamente correto para "sem filtro"
- Simplifica lógica no serviço (não precisa tratar "ALL")

### 4. Estados Locais no Componente

**Decisão:** Manter filtros como estados locais (useState) em vez de URL params ou context.
**Rationale:**

- Filtros são específicos desta página
- Não há necessidade de compartilhar estado entre componentes
- Não há requisito de manter filtros ao navegar para outras páginas
- Simplicidade de implementação

### 5. Loading States com Skeleton

**Decisão:** Usar skeleton loaders em vez de spinners genéricos.
**Rationale:**

- Melhor UX - usuário vê estrutura da tabela
- Consistente com padrões do shadcn/ui
- Reduz percepção de tempo de carregamento

### 6. Sem Debounce nos Filtros

**Decisão:** Disparar requisição imediatamente ao mudar filtro.
**Rationale:**

- Filtros são selects (não text inputs)
- Usuário faz seleção deliberada, não digitação contínua
- React Query já cancela requisições pendentes automaticamente
- Resposta imediata melhora percepção de performance

### 7. Retry Automático

**Decisão:** Manter configuração padrão do React Query (3 retries).
**Rationale:**

- Protege contra falhas temporárias de rede
- Não impacta negativamente UX (retries são rápidos)
- Padrão do React Query é bem testado

## Implementation Notes

### Análise da Implementação Atual

**Pontos Positivos:**

1. ✅ Query key está correta: `["users", params]` inclui todos os parâmetros
2. ✅ Conversão "ALL" → `undefined` está implementada corretamente
3. ✅ UserService constrói query strings de forma segura com URLSearchParams
4. ✅ Skeleton loaders detalhados estão implementados (filtros + tabela)
5. ✅ Layout responsivo está implementado (flex-col em mobile, flex-row em desktop)
6. ✅ React Query cancela requisições pendentes automaticamente

**Possíveis Problemas a Verificar:**

1. **Tratamento de Erro Ausente (Requirement 5.3):**
   - Implementação atual não verifica `isError`
   - Necessário adicionar bloco de tratamento de erro antes do loading
   - Mensagem deve ser clara e orientar o usuário

2. **Mensagem de Dados Vazios:**
   - Não há tratamento específico para `users?.length === 0`
   - Usuário pode não entender se não há dados ou se filtros não retornaram resultados
   - Recomendado adicionar mensagem específica

3. **Validação de Performance (Requirement 5.2):**
   - Necessário validar que requisições completam em menos de 2 segundos
   - Pode depender de otimizações no backend
   - Frontend já está otimizado com React Query

### Melhorias Recomendadas

1. **Adicionar indicador visual durante loading:**
   - Desabilitar ou mostrar overlay nos selects durante loading
   - Previne confusão se usuário tenta mudar filtro durante requisição

2. **Feedback para "sem resultados":**
   - Mensagem específica quando filtros não retornam dados
   - Sugestão de ajustar critérios

3. **Persistência opcional:**
   - Considerar salvar filtros em localStorage para sessões futuras
   - Implementar apenas se houver demanda dos usuários

4. **Métricas:**
   - Adicionar logging de erros de API
   - Monitorar tempo de resposta das requisições filtradas
