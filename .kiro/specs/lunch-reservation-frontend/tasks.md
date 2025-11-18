# Tasks - Sistema de Reservas de Almoço (Frontend)

Este documento contém todas as tasks necessárias para implementar o frontend do sistema de reservas de almoço corporativo.

## Status Legend

- ✅ **done**: Task completada
- 🚧 **in_progress**: Task em andamento
- ⏳ **not started**: Task não iniciada
- ⏸️ **blocked**: Task bloqueada aguardando dependência

---

## Phase 1: Setup Inicial do Projeto

### 1. Configurar projeto Next.js 15

Status: done

Task details:

- Criar projeto com `create-next-app@latest`
- Configurar TypeScript
- Configurar ESLint e Prettier
- Configurar Tailwind CSS 4
- Configurar estrutura de pastas
- _Requirements: 1.1, 1.2_

### 2. Instalar e configurar dependências principais

Status: done

Task details:

- shadcn/ui (componentes)
- React Hook Form + Zod (formulários)
- Tanstack Query (estado assíncrono)
- next-themes (dark mode)
- dayjs (datas)
- lucide-react (ícones)
- sonner (toast notifications)
- _Requirements: 1.2_

### 3. Configurar variáveis de ambiente

Status: done

Task details:

- Criar arquivo `.env.example`
- Configurar `NEXT_PUBLIC_API_URL`
- Documentar variáveis no README
- _Requirements: 1.3_

---

## Phase 2: Autenticação e Autorização

### 4. Implementar serviço de autenticação

Status: done

Task details:

- Criar `auth.service.ts` com métodos de login/logout
- Implementar gerenciamento de token JWT
- Criar tipos TypeScript para auth
- _Requirements: 2.1, 2.2_

### 5. Criar hook de autenticação

Status: done

Task details:

- Implementar `useAuth` hook
- Gerenciar estado de autenticação
- Implementar auto-refresh de token
- _Requirements: 2.1, 2.2_

### 6. Criar página de login

Status: done

Task details:

- Criar formulário de login com validação
- Implementar feedback de erros
- Adicionar loading states
- Redirecionar após login bem-sucedido
- _Requirements: 2.1, 2.3_

### 7. Implementar proteção de rotas

Status: done

Task details:

- Criar componente `ProtectedRoute`
- Verificar autenticação antes de renderizar
- Redirecionar para login se não autenticado
- _Requirements: 2.2_

### 8. Implementar controle de acesso por role

Status: done

Task details:

- Verificar role do usuário (ADMIN/USER)
- Mostrar/ocultar funcionalidades baseado em role
- Implementar redirecionamento baseado em permissões
- _Requirements: 2.2_

---

## Phase 3: Layout e Navegação

### 9. Criar componente Header

Status: done

Task details:

- Logo e título
- Toggle de tema (dark/light)
- Menu do usuário (perfil, logout)
- Botão de menu mobile
- _Requirements: 3.1_

### 10. Criar componente Sidebar

Status: done

Task details:

- Navegação principal
- Filtrar itens por role
- Indicador de página ativa
- Responsivo (drawer em mobile)
- _Requirements: 3.1_

### 11. Criar layout do dashboard

Status: done

Task details:

- Integrar Header e Sidebar
- Área de conteúdo principal
- Footer
- Responsividade
- _Requirements: 3.1_

### 12. Implementar navegação responsiva

Status: done

Task details:

- Menu hamburguer em mobile
- Drawer/Sheet para sidebar mobile
- Touch-friendly navigation
- _Requirements: 3.1_

---

## Phase 4: Componentes Base e UI

### 13. Configurar shadcn/ui

Status: done

Task details:

- Instalar componentes necessários
- Customizar tema (cores da empresa)
- Configurar variantes
- _Requirements: 1.2_

### 14. Criar componente DataTable reutilizável

Status: done

Task details:

- Integrar Tanstack Table
- Paginação
- Ordenação
- Filtros
- Responsivo
- _Requirements: 3.2_

### 15. Criar componentes de formulário

Status: done

Task details:

- Input com validação
- Select
- DatePicker
- Textarea
- Checkbox/Radio
- _Requirements: 3.2_

### 16. Criar componentes de feedback

Status: done

Task details:

- Toast notifications (sonner)
- Loading states
- Empty states
- Error states
- _Requirements: 3.2_

---

## Phase 5: Gerenciamento de Usuários (Admin)

### 17. Criar serviço de usuários

Status: done

Task details:

- CRUD de usuários
- Tipos TypeScript
- Schemas Zod
- _Requirements: 4.1_

### 18. Criar hooks Tanstack Query para usuários

Status: done

Task details:

- `useGetUsers` (lista)
- `useGetUser` (detalhes)
- `useCreateUser`
- `useUpdateUser`
- `useDeleteUser`
- _Requirements: 4.1_

### 19. Criar página de listagem de usuários

Status: done

Task details:

- DataTable com usuários
- Filtros e busca
- Ações (editar, excluir)
- Paginação
- _Requirements: 4.1_

### 20. Criar formulário de usuário (criar/editar)

Status: done

Task details:

- Validação com Zod
- Máscaras (CPF, telefone)
- Feedback de erros
- Modal ou página separada
- _Requirements: 4.1_

---

## Phase 6: Gerenciamento de Categorias (Admin)

### 21. Criar serviço de categorias

Status: done

Task details:

- CRUD de categorias
- Tipos TypeScript
- Schemas Zod
- _Requirements: 4.2_

### 22. Criar hooks Tanstack Query para categorias

Status: done

Task details:

- `useGetCategories`
- `useCreateCategory`
- `useUpdateCategory`
- `useDeleteCategory`
- _Requirements: 4.2_

### 23. Criar página de gerenciamento de categorias

Status: done

Task details:

- Lista de categorias
- Formulário inline ou modal
- Ações CRUD
- _Requirements: 4.2_

---

## Phase 7: Gerenciamento de Itens de Menu (Admin)

### 24. Criar serviço de itens de menu

Status: done

Task details:

- CRUD de itens
- Tipos TypeScript
- Schemas Zod
- _Requirements: 4.3_

### 25. Criar hooks Tanstack Query para itens

Status: done

Task details:

- `useGetMenuItems`
- `useCreateMenuItem`
- `useUpdateMenuItem`
- `useDeleteMenuItem`
- _Requirements: 4.3_

### 26. Criar página de gerenciamento de itens

Status: done

Task details:

- DataTable com itens
- Filtro por categoria
- Formulário de item
- Upload de imagem (opcional)
- _Requirements: 4.3_

---

## Phase 8: Gerenciamento de Cardápios (Admin)

### 27. Criar serviço de cardápios

Status: done

Task details:

- CRUD de cardápios
- Tipos TypeScript
- Schemas Zod
- _Requirements: 5.1_

### 28. Criar hooks Tanstack Query para cardápios

Status: done

Task details:

- `useGetMenus`
- `useGetMenu`
- `useCreateMenu`
- `useUpdateMenu`
- `useDeleteMenu`
- _Requirements: 5.1_

### 29. Criar página de listagem de cardápios

Status: done

Task details:

- Visualização semanal
- Filtro por data
- Ações (criar, editar, excluir)
- _Requirements: 5.1_

### 30. Criar formulário de cardápio

Status: done

Task details:

- Seleção de data
- Seleção de dia da semana
- Seleção de itens de menu
- Validação de regras de negócio
- _Requirements: 5.1_

---

## Phase 9: Visualização de Cardápios (User)

### 31. Criar página de cardápios para usuários

Status: done

Task details:

- Visualização semanal
- Filtro por data
- Exibição de itens do cardápio
- Botão de fazer reserva
- _Requirements: 5.2_

### 32. Criar componente de card de cardápio

Status: done

Task details:

- Exibir data e dia da semana
- Listar itens do menu
- Indicar se já tem reserva
- Ação de reservar
- _Requirements: 5.2_

---

## Phase 10: Gerenciamento de Reservas

### 33. Criar serviço de reservas

Status: done

Task details:

- CRUD de reservas
- Tipos TypeScript
- Schemas Zod
- _Requirements: 6.1, 6.2_

### 34. Criar hooks Tanstack Query para reservas

Status: done

Task details:

- `useGetReservations` (admin)
- `useGetMyReservations` (user)
- `useCreateReservation`
- `useUpdateReservation`
- `useCancelReservation`
- _Requirements: 6.1, 6.2_

### 35. Criar página "Minhas Reservas" (User)

Status: done

Task details:

- Lista de reservas do usuário
- Filtros (data, status)
- Ações (alterar variação, cancelar)
- Validação de horário para cancelamento
- _Requirements: 6.2_

### 36. Criar página "Todas as Reservas" (Admin)

Status: done

Task details:

- DataTable com todas as reservas
- Filtros avançados
- Exportação de dados
- Estatísticas
- _Requirements: 6.1_

### 37. Implementar modal de criar/editar reserva

Status: done

Task details:

- Seleção de cardápio
- Seleção de variação
- Validação de regras
- Feedback de sucesso/erro
- _Requirements: 6.2_

### 38. Implementar cancelamento de reserva

Status: done

Task details:

- Validar horário limite (8:30 AM)
- Confirmação de cancelamento
- Feedback visual
- Atualização da lista
- _Requirements: 6.2_

---

## Phase 11: Dashboard e Estatísticas

### 39. Criar dashboard para Admin

Status: done

Task details:

- Cards com estatísticas principais
- Gráficos de reservas
- Últimas atividades
- Ações rápidas
- _Requirements: 7.1_

### 40. Criar dashboard para User

Status: done

Task details:

- Próximas reservas
- Cardápios da semana
- Ações rápidas
- _Requirements: 7.1_

### 41. Implementar gráficos e visualizações

Status: done

Task details:

- Gráfico de reservas por dia
- Gráfico de itens mais pedidos
- Estatísticas de cancelamentos
- _Requirements: 7.1_

---

## Phase 12: Funcionalidades Adicionais

### 42. Implementar busca global

Status: done

Task details:

- Componente de busca
- Buscar em múltiplas entidades
- Atalho de teclado (Cmd/Ctrl + K)
- _Requirements: 8.1_

### 43. Implementar filtros avançados

Status: done

Task details:

- Filtros por data
- Filtros por status
- Filtros por categoria
- Persistir filtros no localStorage
- _Requirements: 8.1_

### 44. Implementar exportação de dados

Status: done

Task details:

- Exportar reservas para CSV/Excel
- Exportar relatórios
- _Requirements: 8.2_

### 45. Implementar notificações

Status: done

Task details:

- Toast para ações bem-sucedidas
- Toast para erros
- Notificações de validação
- _Requirements: 8.3_

---

## Phase 13: Otimização e Qualidade

### 46. Implementar loading states

Status: done

Task details:

- Skeletons para carregamento
- Loading spinners
- Suspense boundaries
- _Requirements: 8.4_

### 47. Implementar error boundaries

Status: done

Task details:

- Capturar erros de renderização
- Páginas de erro customizadas
- Logging de erros
- _Requirements: 8.4_

### 48. Otimizar performance

Status: done

Task details:

- Code splitting
- Lazy loading de componentes
- Otimização de imagens
- Memoização de componentes
- _Requirements: 8.5_

### 49. Implementar testes

Status: done

Task details:

- Testes unitários (componentes)
- Testes de integração (hooks)
- Testes E2E (fluxos principais)
- _Requirements: 8.6_

### 50. Implementar acessibilidade

Status: done

Task details:

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
