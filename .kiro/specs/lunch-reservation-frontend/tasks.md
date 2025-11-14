# Implementation Plan

Este plano de implementação detalha as tarefas necessárias para migrar o frontend de gerenciamento de companies para o sistema de reservas de almoço corporativo. Cada tarefa é incremental e referencia os requisitos do documento de requirements.

---

## Phase 1: Limpeza e Preparação

- [x] 1. Remover módulo de companies e preparar ambiente
  - Remover pasta `src/app/companies/` e todos os seus arquivos
  - Remover `src/_services/company.service.ts`
  - Remover `src/_schemas/company.schema.ts`
  - Remover `src/_types/company.ts`
  - Remover `src/_hooks/queries/use-get-companies.ts`
  - Remover `src/_hooks/mutations/use-create-company.ts`
  - Atualizar `.env` com `NEXT_PUBLIC_API_URL=http://localhost:8080/api`
  - Remover dependências não utilizadas: `drizzle-orm`, `drizzle-kit`, `pg`, `@types/pg` do `package.json`
  - Remover pasta `src/_db/` (schema.ts e index.ts)
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

---

## Phase 2: Fundação - Types, Schemas e Services

- [x] 2. Criar types TypeScript para todas as entidades
  - Criar `src/_types/auth.ts` com interfaces `LoginRequest`, `LoginResponse`, `AuthUser`
  - Criar `src/_types/user.ts` com interface `User` e types `UserRole`, `UserType`, `UserStatus`
  - Criar `src/_types/category.ts` com interface `Category`
  - Criar `src/_types/menu-item.ts` com interface `MenuItem`
  - Criar `src/_types/menu.ts` com interfaces `Menu`, `MenuComposition`, `MenuVariation` e type `DayOfWeek`
  - Criar `src/_types/reservation.ts` com interface `Reservation` e type `ReservationStatus`
  - Criar `src/_types/week-day.ts` com interface `WeekDay`
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 8.1_

- [x] 3. Criar schemas Zod para validação de formulários
  - Criar `src/_schemas/auth.schema.ts` com `loginSchema` (CPF 11 dígitos, senha mínimo 6 caracteres)
  - Criar `src/_schemas/user.schema.ts` com `userFormSchema` e `updateUserFormSchema`
  - Criar `src/_schemas/category.schema.ts` com `categoryFormSchema`
  - Criar `src/_schemas/menu-item.schema.ts` com `menuItemFormSchema`
  - Criar `src/_schemas/menu.schema.ts` com `menuFormSchema`
  - Criar `src/_schemas/reservation.schema.ts` com `reservationFormSchema` e `updateReservationFormSchema`
  - _Requirements: 1.1, 2.2, 3.2, 4.2, 5.2, 7.2, 8.3_

- [x] 4. Atualizar API client para incluir JWT authentication
  - Modificar `src/_lib/api-client.ts` para incluir token JWT do localStorage no header Authorization
  - Adicionar tratamento de erro 401 (redirecionar para /login e limpar token)
  - Adicionar tratamento de erro 403 (exibir mensagem de acesso negado)
  - Manter tratamento de erro 204 (No Content)
  - _Requirements: 1.6, 10.6_

- [x] 5. Criar services para comunicação com a API
  - Criar `src/_services/auth.service.ts` com métodos `login()` e `logout()`
  - Criar `src/_services/user.service.ts` com métodos CRUD e `toggleStatus()`
  - Criar `src/_services/category.service.ts` com métodos CRUD
  - Criar `src/_services/menu-item.service.ts` com métodos CRUD
  - Criar `src/_services/menu.service.ts` com métodos CRUD e filtros
  - Criar `src/_services/reservation.service.ts` com métodos CRUD
  - Criar `src/_services/week-day.service.ts` com método `getAll()`
  - _Requirements: 1.2, 2.3, 3.3, 4.3, 5.4, 7.3, 8.4_

---

## Phase 3: Autenticação e Controle de Acesso

- [x] 6. Implementar sistema de autenticação
  - Criar `src/_hooks/use-auth.ts` com hook customizado para gerenciar estado de autenticação
  - Criar `src/_providers/auth-provider.tsx` com contexto de autenticação
  - Implementar funções `login()`, `logout()`, `getUser()`, `isAuthenticated()`, `hasRole()`
  - Armazenar token JWT no localStorage
  - Decodificar token JWT para extrair informações do usuário
  - _Requirements: 1.2, 1.5, 10.5_

- [x] 7. Criar página de login
  - Criar `src/app/(auth)/login/page.tsx` com layout de autenticação
  - Criar `src/app/(auth)/login/_components/login-form.tsx` com formulário de login
  - Implementar máscara de CPF usando react-number-format
  - Validar formulário com React Hook Form + Zod
  - Exibir mensagens de erro da API (credenciais inválidas, usuário inativo)
  - Redirecionar para dashboard após login bem-sucedido
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 8. Criar componente ProtectedRoute
  - Criar `src/_components/common/protected-route.tsx` como HOC
  - Verificar se usuário está autenticado (redirecionar para /login se não)
  - Verificar role do usuário (redirecionar se não tem permissão)
  - Aceitar prop `allowedRoles` para controle de acesso
  - _Requirements: 10.3, 10.6_

---

## Phase 4: Layout e Navegação

- [x] 9. Criar layout principal do dashboard
  - Criar `src/app/(dashboard)/layout.tsx` com estrutura de sidebar + header + content
  - Envolver com ProtectedRoute
  - Implementar responsividade (mobile, tablet, desktop)
  - _Requirements: 9.1, 10.1, 10.2_

- [x] 10. Criar componente Sidebar
  - Criar `src/_components/common/sidebar.tsx` com navegação
  - Implementar navegação condicional baseada em role:
    - USER: Cardápios, Minhas Reservas, Perfil
    - ADMIN: Dashboard, Usuários, Categorias, Itens de Menu, Cardápios, Reservas, Perfil
  - Adicionar indicador visual da rota ativa
  - Implementar collapse/expand para mobile
  - Usar ícones do lucide-react
  - _Requirements: 10.1, 10.2_

- [x] 11. Criar componente Header
  - Criar `src/_components/common/header.tsx` com logo e user menu
  - Exibir informações do usuário logado (nome, role, avatar)
  - Criar dropdown menu com opções: Perfil, Sair
  - Adicionar toggle de dark mode (next-themes)
  - Implementar botão de logout que limpa token e redireciona
  - _Requirements: 10.4, 10.5_

- [x] 12. Criar página inicial do dashboard
  - Criar `src/app/(dashboard)/page.tsx` com dashboard home
  - Exibir cards com estatísticas (total de reservas, cardápios da semana, etc.)
  - Exibir próximos cardápios (para USER)
  - Exibir resumo de reservas recentes (para ADMIN)
  - _Requirements: 10.1, 10.2_

---

## Phase 5: Gerenciamento de Usuários (Admin)

- [x] 13. Criar hooks Tanstack Query para usuários
  - Criar `src/_hooks/queries/use-get-users.ts` com filtros (status, role, userType)
  - Criar `src/_hooks/queries/use-get-user.ts` para buscar usuário por ID
  - Criar `src/_hooks/mutations/use-create-user.ts` com invalidação de cache
  - Criar `src/_hooks/mutations/use-update-user.ts` com invalidação de cache
  - Criar `src/_hooks/mutations/use-toggle-user-status.ts` com invalidação de cache
  - _Requirements: 2.1, 2.3, 2.4, 2.5_

- [x] 14. Criar página de listagem de usuários
  - Criar `src/app/(dashboard)/usuarios/page.tsx` protegida com role ADMIN
  - Criar `src/app/(dashboard)/usuarios/_components/users-table.tsx` com tabela
  - Implementar colunas: CPF (com máscara), Nome, Role, Tipo, Status, Ações
  - Adicionar filtros: Status, Role, UserType
  - Implementar paginação
  - Adicionar loading states com skeleton
  - Adicionar botão "Novo Usuário"
  - _Requirements: 2.1, 2.6_

- [x] 15. Criar formulário de criação/edição de usuário
  - Criar `src/app/(dashboard)/usuarios/_components/user-form-dialog.tsx` como modal
  - Implementar campos: CPF (máscara), Nome, Senha, Role (select), UserType (select)
  - Validar formulário com React Hook Form + Zod
  - Exibir erros de validação inline
  - Exibir erro de CPF duplicado da API
  - Limpar formulário após sucesso
  - Exibir toast de sucesso/erro
  - _Requirements: 2.2, 2.3, 2.4, 2.7_

- [x] 16. Criar componente de toggle de status
  - Criar `src/app/(dashboard)/usuarios/_components/user-status-toggle.tsx`
  - Implementar botão toggle com confirmação
  - Exibir estado atual (Ativo/Inativo) com cores diferentes
  - Atualizar status via mutation
  - Exibir toast de sucesso/erro
  - _Requirements: 2.5_

---

## Phase 6: Gerenciamento de Categorias (Admin)

- [x] 17. Criar hooks Tanstack Query para categorias
  - Criar `src/_hooks/queries/use-get-categories.ts` com filtro de status
  - Criar `src/_hooks/queries/use-get-category.ts` para buscar por ID
  - Criar `src/_hooks/mutations/use-create-category.ts`
  - Criar `src/_hooks/mutations/use-update-category.ts`
  - Criar `src/_hooks/mutations/use-delete-category.ts`
  - _Requirements: 3.1, 3.3, 3.4, 3.5_

- [x] 18. Criar página de listagem de categorias
  - Criar `src/app/(dashboard)/categorias/page.tsx` protegida com role ADMIN
  - Criar `src/app/(dashboard)/categorias/_components/categories-table.tsx`
  - Implementar colunas: Nome, Descrição, Ordem, Status, Ações
  - Adicionar filtro por status
  - Implementar ordenação por displayOrder
  - Adicionar botão "Nova Categoria"
  - _Requirements: 3.1, 3.6_

- [x] 19. Criar formulário de criação/edição de categoria
  - Criar `src/app/(dashboard)/categorias/_components/category-form-dialog.tsx`
  - Implementar campos: Nome, Descrição (textarea), DisplayOrder (number input)
  - Validar formulário com Zod
  - Exibir erro de nome duplicado da API
  - Exibir toast de sucesso/erro
  - _Requirements: 3.2, 3.3, 3.4_

- [x] 20. Implementar exclusão de categoria
  - Adicionar botão de exclusão na tabela
  - Exibir dialog de confirmação
  - Tratar erro de categoria em uso (exibir mensagem da API)
  - Exibir toast de sucesso/erro
  - _Requirements: 3.5, 3.6_

---

## Phase 7: Gerenciamento de Itens de Menu (Admin)

- [x] 21. Criar hooks Tanstack Query para itens de menu
  - Criar `src/_hooks/queries/use-get-menu-items.ts` com filtros (categoryId, isActive)
  - Criar `src/_hooks/queries/use-get-menu-item.ts`
  - Criar `src/_hooks/mutations/use-create-menu-item.ts`
  - Criar `src/_hooks/mutations/use-update-menu-item.ts`
  - Criar `src/_hooks/mutations/use-delete-menu-item.ts`
  - _Requirements: 4.1, 4.3, 4.5, 4.6_

- [x] 22. Criar página de listagem de itens de menu
  - Criar `src/app/(dashboard)/itens-menu/page.tsx` protegida com role ADMIN
  - Criar `src/app/(dashboard)/itens-menu/_components/menu-items-table.tsx`
  - Implementar colunas: Nome, Descrição, Categoria, Status, Ações
  - Adicionar filtros: Categoria (select), Status
  - Implementar agrupamento visual por categoria
  - Adicionar botão "Novo Item"
  - _Requirements: 4.1, 4.4_

- [x] 23. Criar formulário de criação/edição de item de menu
  - Criar `src/app/(dashboard)/itens-menu/_components/menu-item-form-dialog.tsx`
  - Implementar campos: Nome, Descrição (textarea), Categoria (select com categorias ativas)
  - Validar formulário com Zod
  - Exibir toast de sucesso/erro
  - _Requirements: 4.2, 4.3, 4.5_

- [x] 24. Implementar exclusão de item de menu
  - Adicionar botão de exclusão na tabela
  - Exibir dialog de confirmação
  - Tratar erro de item em uso em cardápios (exibir mensagem da API)
  - Exibir toast de sucesso/erro
  - _Requirements: 4.6, 4.7_

---

## Phase 8: Gerenciamento de Cardápios (Admin)

- [x] 25. Criar hooks Tanstack Query para cardápios
  - Criar `src/_hooks/queries/use-get-menus.ts` com filtros (date, startDate, endDate, dayOfWeek, isActive)
  - Criar `src/_hooks/queries/use-get-menu.ts`
  - Criar `src/_hooks/queries/use-get-week-days.ts`
  - Criar `src/_hooks/mutations/use-create-menu.ts`
  - Criar `src/_hooks/mutations/use-update-menu.ts`
  - Criar `src/_hooks/mutations/use-delete-menu.ts`
  - _Requirements: 5.1, 5.4, 5.6, 5.7, 5.9_

- [x] 26. Criar visualização semanal de cardápios
  - Criar `src/app/(dashboard)/cardapios/page.tsx` (acessível para ADMIN e USER)
  - Criar `src/app/(dashboard)/cardapios/_components/menus-calendar.tsx`
  - Implementar visualização semanal com cards para cada dia
  - Adicionar navegação entre semanas (anterior/próxima)
  - Exibir resumo do cardápio em cada card (proteína principal + quantidade de itens)
  - Adicionar indicador de quantidade de reservas (se ADMIN)
  - Adicionar botões: Ver Detalhes, Editar (ADMIN), Excluir (ADMIN)
  - _Requirements: 5.1, 5.9, 6.1, 6.6_

- [x] 27. Criar formulário de criação/edição de cardápio
  - Criar `src/app/(dashboard)/cardapios/_components/menu-form-dialog.tsx`
  - Implementar date picker (apenas datas futuras)
  - Auto-preencher dia da semana baseado na data selecionada
  - Adicionar campo de observações (textarea)
  - Implementar seleção de itens de menu organizados por categoria
  - Adicionar checkbox para marcar proteína principal
  - Exibir preview da composição do cardápio
  - Validar que pelo menos um item foi selecionado
  - Exibir toast de sucesso/erro
  - _Requirements: 5.2, 5.3, 5.4, 5.6_

- [x] 28. Criar modal de detalhes do cardápio
  - Criar `src/app/(dashboard)/cardapios/_components/menu-details-dialog.tsx`
  - Exibir data, dia da semana e observações
  - Exibir itens organizados por categoria (Proteína, Acompanhamento, Salada, Sobremesa)
  - Exibir variações disponíveis (Padrão, Com Ovo) com descrições
  - Exibir lista de reservas (se ADMIN)
  - Adicionar botão "Fazer Reserva" (se USER e sem reserva para aquela data)
  - _Requirements: 5.5, 6.2, 6.3, 6.4, 6.5_

- [x] 29. Implementar exclusão de cardápio
  - Adicionar botão de exclusão na visualização semanal
  - Exibir dialog de confirmação
  - Validar que cardápio é de data futura
  - Tratar erro de cardápio com reservas (exibir mensagem da API)
  - Exibir toast de sucesso/erro
  - _Requirements: 5.7, 5.8_

---

## Phase 9: Reservas do Usuário

- [x] 30. Criar hooks Tanstack Query para reservas
  - Criar `src/_hooks/queries/use-get-my-reservations.ts` com filtros (status, startDate, endDate)
  - Criar `src/_hooks/queries/use-get-reservation.ts`
  - Criar `src/_hooks/mutations/use-create-reservation.ts`
  - Criar `src/_hooks/mutations/use-update-reservation.ts`
  - Criar `src/_hooks/mutations/use-cancel-reservation.ts`
  - _Requirements: 7.3, 8.1, 8.4, 8.5_

- [x] 31. Criar utilitário para validação de horário limite (8:30 AM)
  - Criar `src/_lib/date-utils.ts` com função `isBeforeCutoffTime(date: string): boolean`
  - Implementar lógica que verifica se horário atual é antes de 8:30 AM do dia da refeição
  - Usar dayjs para manipulação de datas
  - _Requirements: 7.4, 8.6_

- [x] 32. Criar modal de criação de reserva
  - Criar `src/app/(dashboard)/cardapios/_components/reservation-form-dialog.tsx`
  - Exibir composição completa do cardápio
  - Implementar seleção de variação com radio buttons (Padrão, Com Ovo)
  - Validar horário limite (desabilitar se após 8:30 AM)
  - Exibir mensagem de prazo expirado se necessário
  - Validar formulário com Zod
  - Exibir toast de sucesso/erro
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.6, 7.7_

- [x] 33. Integrar botão de reserva na visualização de cardápios
  - Adicionar botão "Fazer Reserva" nos cards de cardápio (se USER)
  - Verificar se usuário já tem reserva para aquela data
  - Exibir "Reserva já realizada" se já existe reserva
  - Desabilitar botão se prazo expirado (após 8:30 AM)
  - Abrir modal de criação de reserva ao clicar
  - _Requirements: 7.1, 7.4, 7.5_

- [x] 34. Criar página de minhas reservas
  - Criar `src/app/(dashboard)/minhas-reservas/page.tsx` (acessível para USER e ADMIN)
  - Criar `src/app/(dashboard)/minhas-reservas/_components/my-reservations-table.tsx`
  - Implementar colunas: Data, Cardápio (resumo), Variação, Status, Auto, Ações
  - Adicionar badge "Auto" para reservas geradas automaticamente
  - Adicionar filtros: Status, Período (date range)
  - Ordenar por data (mais recentes primeiro)
  - Adicionar ações: Ver Detalhes, Alterar Variação, Cancelar
  - Desabilitar ações se prazo expirado
  - _Requirements: 8.1, 8.2, 8.7, 8.8_

- [x] 35. Criar modal de alteração de variação
  - Criar `src/app/(dashboard)/minhas-reservas/_components/change-variation-dialog.tsx`
  - Exibir variações disponíveis com radio buttons
  - Marcar variação atual como selecionada
  - Validar horário limite
  - Exibir mensagem de prazo expirado se necessário
  - Exibir toast de sucesso/erro
  - _Requirements: 8.3, 8.4, 8.6_

- [x] 36. Criar modal de detalhes da reserva
  - Criar `src/app/(dashboard)/minhas-reservas/_components/reservation-details-dialog.tsx`
  - Exibir data, status e se foi gerada automaticamente
  - Exibir cardápio completo organizado por categoria
  - Exibir variação selecionada com descrição
  - Exibir data de criação e última atualização
  - _Requirements: 8.2_

- [x] 37. Implementar cancelamento de reserva
  - Adicionar botão "Cancelar Reserva" na tabela e no modal de detalhes
  - Exibir dialog de confirmação
  - Validar horário limite (desabilitar se após 8:30 AM)
  - Exibir mensagem de prazo expirado se necessário
  - Atualizar status para CANCELLED via mutation
  - Exibir toast de sucesso/erro
  - _Requirements: 8.5, 8.6_

---

## Phase 10: Gerenciamento de Todas as Reservas (Admin)

- [x] 38. Criar hooks Tanstack Query para todas as reservas
  - Criar `src/_hooks/queries/use-get-all-reservations.ts` com filtros (status, startDate, endDate, userId)
  - Implementar paginação
  - _Requirements: 10.2_

- [x] 39. Criar página de todas as reservas
  - Criar `src/app/(dashboard)/reservas/page.tsx` protegida com role ADMIN
  - Criar `src/app/(dashboard)/reservas/_components/all-reservations-table.tsx`
  - Implementar colunas: Usuário (nome + CPF), Data, Cardápio (resumo), Variação, Status, Auto
  - Adicionar filtros: Status, Período, Usuário (autocomplete)
  - Implementar paginação
  - Adicionar estatísticas: Total de reservas, Por status, Por dia
  - Adicionar botão de exportação (CSV/Excel) - opcional
  - _Requirements: 10.2_

---

## Phase 11: Melhorias de UX e Responsividade

- [x] 40. Implementar loading states e skeletons
  - Criar componentes skeleton para tabelas
  - Criar componentes skeleton para cards de cardápio
  - Adicionar spinners em botões durante submissão
  - Usar Suspense boundaries onde apropriado
  - _Requirements: 9.3_

- [x] 41. Implementar toast notifications
  - Configurar sonner para exibir toasts

  - Padronizar mensagens de sucesso/erro
  - Adicionar toasts em todas as operações CRUD
  - Adicionar toasts para erros de validação da API
  - _Requirements: 9.4_

- [x] 42. Implementar validação de formulários em tempo real
  - Configurar React Hook Form para validação onChange
  - Exibir erros inline abaixo dos campos
  - Desabilitar botão de submit enquanto há erros
  - Adicionar feedback visual (bordas vermelhas/verdes)
  - _Requirements: 9.5_

- [ ] 43. Otimizar responsividade mobile
  - Testar todas as páginas em viewport 320px+
  - Ajustar tabelas para scroll horizontal em mobile
  - Implementar menu hamburguer para sidebar em mobile
  - Ajustar modais para fullscreen em mobile
  - Testar formulários em mobile (teclado virtual)
  - _Requirements: 9.1_

- [ ] 44. Implementar dark mode
  - Configurar next-themes provider
  - Adicionar toggle no header
  - Testar todos os componentes em dark mode
  - Ajustar cores para contraste adequado
  - Cores da empresa: #1b994b #e4e30d
  - _Requirements: 9.7_

---

## Phase 12: Testes e Documentação

- [ ] 45. Escrever testes unitários
  - Testar schemas Zod (validações)
  - Testar utilitários (date-utils, formatters)
  - Testar custom hooks (use-auth)
  - _Requirements: 9.5_

- [ ] 46. Escrever testes de integração
  - Testar fluxo de login
  - Testar criação de reserva
  - Testar alteração de variação
  - Testar cancelamento de reserva
  - _Requirements: 1.1-1.5, 7.1-7.7, 8.3-8.6_

- [ ] 47. Atualizar documentação do projeto
  - Atualizar README.md com informações do sistema de reservas
  - Documentar variáveis de ambiente necessárias
  - Documentar estrutura de pastas
  - Adicionar guia de desenvolvimento
  - Adicionar screenshots do sistema
  - _Requirements: 11.7_

---

## Phase 13: Refinamentos Finais

- [ ] 48. Implementar tratamento de erros global
  - Criar Error Boundary para erros não tratados
  - Adicionar página 404 customizada
  - Adicionar página 500 customizada
  - Implementar retry logic em queries críticas
  - _Requirements: 9.4_

- [ ] 49. Otimizar performance
  - Implementar code splitting para rotas admin
  - Adicionar React.memo em componentes pesados
  - Implementar debouncing em filtros de busca
  - Otimizar re-renders desnecessários
  - Configurar cache do Tanstack Query adequadamente
  - _Requirements: 9.6_

- [ ] 50. Implementar acessibilidade
  - Adicionar ARIA labels em componentes interativos
  - Testar navegação por teclado (tab order)
  - Testar com screen reader
  - Verificar contraste de cores (WCAG AA)
  - Adicionar focus indicators visíveis
  - _Requirements: 9.1, 9.2_

---

## Notas de Implementação

### Ordem de Execução

As tasks devem ser executadas na ordem apresentada, pois há dependências entre elas:

- Phase 1-2: Fundação necessária para todas as outras fases
- Phase 3-4: Autenticação e layout são pré-requisitos para funcionalidades
- Phase 5-10: Podem ser executadas em paralelo após Phase 4
- Phase 11-13: Refinamentos finais após funcionalidades principais

### Tecnologias Utilizadas

- **Next.js 15.4.1** (App Router)
- **TypeScript 5.8.3**
- **React 19.1.0**
- **Tailwind CSS 4**
- **shadcn/ui** (componentes)
- **React Hook Form 7.62.0** (formulários)
- **Zod 4.0.15** (validação)
- **Tanstack Query 5.83.0** (estado assíncrono)
- **react-number-format 5.4.4** (máscaras)
- **dayjs** (manipulação de datas)
- **sonner 2.0.7** (toast notifications)
- **lucide-react 0.536.0** (ícones)
- **next-themes 0.4.6** (dark mode)

### Padrões de Código

- Usar kebab-case para nomes de arquivos e pastas
- Usar PascalCase para componentes React
- Usar camelCase para funções e variáveis
- Seguir princípios SOLID e Clean Code
- Evitar duplicação de código (DRY)
- Criar componentes reutilizáveis
- Usar Tanstack Query para todas as chamadas à API
- Validar todos os formulários com Zod
- Exibir feedback visual para todas as ações do usuário

### API Base URL

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Estrutura de Commits

Seguir Conventional Commits:

- `feat:` para novas funcionalidades
- `fix:` para correções de bugs
- `refactor:` para refatorações
- `style:` para mudanças de estilo
- `docs:` para documentação
- `test:` para testes
