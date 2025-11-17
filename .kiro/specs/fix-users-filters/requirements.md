# Requirements Document

## Introduction

Este documento descreve os requisitos para corrigir a funcionalidade de filtros no dashboard de usuários. Atualmente, os filtros por status (ATIVO/INATIVO), perfil (ADMIN/USER) e tipo (FIXO/NAO_FIXO) não estão funcionando corretamente, impedindo que os usuários filtrem a lista de usuários conforme necessário.

## Glossary

- **Sistema de Filtros**: Componente de interface que permite aos usuários filtrar a lista de usuários por diferentes critérios
- **Dashboard de Usuários**: Página principal de gerenciamento de usuários localizada em `/usuarios`
- **React Query**: Biblioteca de gerenciamento de estado assíncrono utilizada para cache e fetching de dados
- **Query Key**: Identificador único usado pelo React Query para gerenciar cache de requisições
- **API de Usuários**: Endpoint `/api/lunch-reservation/users` que retorna a lista de usuários

## Requirements

### Requirement 1

**User Story:** Como administrador do sistema, eu quero filtrar usuários por status, para que eu possa visualizar apenas usuários ativos ou inativos

#### Acceptance Criteria

1. WHEN o administrador seleciona um status no filtro de status, THE Sistema de Filtros SHALL enviar uma requisição à API de Usuários com o parâmetro de status correspondente
2. WHEN a API de Usuários retorna os dados filtrados, THE Dashboard de Usuários SHALL exibir apenas os usuários que correspondem ao status selecionado
3. WHEN o administrador seleciona "Todos os status", THE Dashboard de Usuários SHALL exibir todos os usuários sem filtro de status
4. WHEN o filtro de status é alterado, THE React Query SHALL invalidar o cache anterior e buscar novos dados

### Requirement 2

**User Story:** Como administrador do sistema, eu quero filtrar usuários por perfil, para que eu possa visualizar apenas administradores ou usuários comuns

#### Acceptance Criteria

1. WHEN o administrador seleciona um perfil no filtro de perfil, THE Sistema de Filtros SHALL enviar uma requisição à API de Usuários com o parâmetro de role correspondente
2. WHEN a API de Usuários retorna os dados filtrados, THE Dashboard de Usuários SHALL exibir apenas os usuários que correspondem ao perfil selecionado
3. WHEN o administrador seleciona "Todos os perfis", THE Dashboard de Usuários SHALL exibir todos os usuários sem filtro de perfil
4. WHEN o filtro de perfil é alterado, THE React Query SHALL invalidar o cache anterior e buscar novos dados

### Requirement 3

**User Story:** Como administrador do sistema, eu quero filtrar usuários por tipo, para que eu possa visualizar apenas usuários fixos ou não fixos

#### Acceptance Criteria

1. WHEN o administrador seleciona um tipo no filtro de tipo, THE Sistema de Filtros SHALL enviar uma requisição à API de Usuários com o parâmetro de userType correspondente
2. WHEN a API de Usuários retorna os dados filtrados, THE Dashboard de Usuários SHALL exibir apenas os usuários que correspondem ao tipo selecionado
3. WHEN o administrador seleciona "Todos os tipos", THE Dashboard de Usuários SHALL exibir todos os usuários sem filtro de tipo
4. WHEN o filtro de tipo é alterado, THE React Query SHALL invalidar o cache anterior e buscar novos dados

### Requirement 4

**User Story:** Como administrador do sistema, eu quero combinar múltiplos filtros simultaneamente, para que eu possa refinar minha busca com precisão

#### Acceptance Criteria

1. WHEN o administrador seleciona múltiplos filtros simultaneamente, THE Sistema de Filtros SHALL enviar uma requisição à API de Usuários com todos os parâmetros de filtro selecionados
2. WHEN a API de Usuários retorna os dados filtrados, THE Dashboard de Usuários SHALL exibir apenas os usuários que correspondem a todos os critérios selecionados
3. WHEN qualquer filtro é alterado, THE React Query SHALL atualizar a query key e buscar novos dados
4. WHEN todos os filtros são definidos como "Todos", THE Dashboard de Usuários SHALL exibir a lista completa de usuários

### Requirement 5

**User Story:** Como administrador do sistema, eu quero que os filtros respondam imediatamente, para que eu tenha uma experiência fluida ao navegar pelos dados

#### Acceptance Criteria

1. WHEN um filtro é alterado, THE Sistema de Filtros SHALL exibir um indicador de carregamento enquanto busca os novos dados
2. WHEN os novos dados são recebidos, THE Dashboard de Usuários SHALL atualizar a tabela em menos de 2 segundos
3. IF a requisição falhar, THEN THE Sistema de Filtros SHALL exibir uma mensagem de erro clara ao usuário
4. WHEN múltiplos filtros são alterados rapidamente, THE Sistema de Filtros SHALL cancelar requisições pendentes e executar apenas a mais recente
