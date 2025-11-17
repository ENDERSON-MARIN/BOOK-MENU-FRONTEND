# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Em Desenvolvimento

- Melhorias de performance
- Otimizações de acessibilidade
- Testes adicionais

## [1.0.0] - 2025-01-17

### Adicionado

#### Autenticação

- Sistema de login com CPF e senha
- Autenticação JWT com tokens
- Controle de acesso baseado em roles (ADMIN/USER)
- Proteção de rotas com ProtectedRoute
- Logout com limpeza de sessão

#### Gerenciamento de Usuários (Admin)

- Listagem de usuários com filtros (status, role, tipo)
- Criação de novos usuários
- Edição de usuários existentes
- Ativação/desativação de usuários
- Validação de CPF único
- Máscaras para CPF

#### Gerenciamento de Categorias (Admin)

- Listagem de categorias com filtros
- Criação de categorias (Proteína, Acompanhamento, Salada, Sobremesa)
- Edição de categorias
- Exclusão de categorias (com validação de uso)
- Ordenação por displayOrder

#### Gerenciamento de Itens de Menu (Admin)

- Listagem de itens com filtros por categoria e status
- Criação de itens de menu
- Edição de itens
- Exclusão de itens (com validação de uso em cardápios)
- Agrupamento visual por categoria

#### Gerenciamento de Cardápios (Admin)

- Visualização semanal de cardápios
- Criação de cardápios com data e composição
- Seleção de itens organizados por categoria
- Marcação de proteína principal
- Edição de cardápios futuros
- Exclusão de cardápios (com validação de reservas)
- Navegação entre semanas
- Variações automáticas (Padrão, Com Ovo)

#### Visualização de Cardápios (User)

- Visualização semanal de cardápios disponíveis
- Detalhes completos do cardápio
- Indicador de reserva existente
- Navegação entre semanas
- Visualização de variações disponíveis

#### Reservas (User)

- Criação de reservas com seleção de variação
- Validação de horário limite (8:30 AM)
- Listagem de minhas reservas
- Filtros por status e período
- Alteração de variação (antes de 8:30 AM)
- Cancelamento de reservas (antes de 8:30 AM)
- Indicador de reservas automáticas
- Detalhes completos da reserva

#### Gerenciamento de Reservas (Admin)

- Visualização de todas as reservas do sistema
- Filtros por status, período e usuário
- Estatísticas de reservas
- Exportação de dados

#### Layout e Navegação

- Layout responsivo com sidebar e header
- Navegação condicional baseada em role
- Indicador de rota ativa
- Menu de usuário com informações e logout
- Dark mode com toggle
- Collapse/expand da sidebar em mobile

#### UX e Responsividade

- Design responsivo (mobile, tablet, desktop)
- Loading states com skeletons
- Toast notifications para feedback
- Validação de formulários em tempo real
- Mensagens de erro claras
- Confirmações para ações destrutivas

#### Infraestrutura

- Configuração do Next.js 15 com App Router
- Integração com Tanstack Query para cache
- Configuração de React Hook Form + Zod
- Integração com shadcn/ui
- Configuração de Tailwind CSS
- Configuração de ESLint e Prettier
- Configuração de Husky para git hooks
- Configuração de Commitlint
- Configuração de testes com Vitest

### Alterado

- Migração completa do módulo de companies para reservas de almoço
- Atualização da estrutura de pastas para novo domínio
- Atualização de variáveis de ambiente

### Removido

- Módulo de gerenciamento de companies
- Dependências do Drizzle ORM (movido para backend)
- Arquivos e componentes relacionados a companies

### Corrigido

- Validação de horário limite para reservas
- Tratamento de erros 401 (redirecionamento para login)
- Invalidação de cache após mutations
- Máscaras de CPF em formulários
- Responsividade em dispositivos móveis

### Segurança

- Implementação de autenticação JWT
- Proteção de rotas administrativas
- Validação de tokens expirados
- Sanitização de inputs de usuário

## [0.1.0] - 2024-12-XX

### Adicionado

- Configuração inicial do projeto Next.js
- Estrutura básica de pastas
- Configuração de Tailwind CSS
- Integração com shadcn/ui
- Módulo de gerenciamento de companies (removido posteriormente)

---

## Tipos de Mudanças

- `Adicionado` para novas funcionalidades
- `Alterado` para mudanças em funcionalidades existentes
- `Descontinuado` para funcionalidades que serão removidas
- `Removido` para funcionalidades removidas
- `Corrigido` para correções de bugs
- `Segurança` para vulnerabilidades corrigidas

## Links

- [Unreleased]: Mudanças não lançadas ainda
- [1.0.0]: Primeira versão estável do sistema de reservas
- [0.1.0]: Versão inicial do projeto
