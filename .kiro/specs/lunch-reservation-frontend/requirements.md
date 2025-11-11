# Requirements Document

## Introduction

Este documento define os requisitos para adaptar o projeto frontend atual (Next.js 15 + TypeScript) para consumir a API REST de gerenciamento de reservas de almoço corporativo. O sistema substituirá completamente o módulo anterior de gerenciamento de empresas (companies) por um sistema completo de reservas de almoço que inclui autenticação, gerenciamento de usuários, categorias, itens de menu, cardápios e reservas.

O sistema permitirá que usuários façam reservas de almoço, visualizem cardápios semanais, e administradores gerenciem todo o sistema (usuários, categorias, itens de menu, cardápios). O frontend seguirá os padrões já estabelecidos no projeto (shadcn/ui, React Hook Form, Zod, Tanstack Query) e consumirá a API REST documentada em README_API.MD.

## Glossary

- **Frontend Application**: Aplicação Next.js 15 com App Router que consome a API de reservas de almoço
- **API REST**: Backend Node.js + Express + PostgreSQL documentado em README_API.MD
- **User**: Usuário do sistema (pode ser ADMIN ou USER, FIXO ou NAO_FIXO, ATIVO ou INATIVO)
- **Authentication System**: Sistema de autenticação baseado em CPF e senha usando Better Auth
- **Category**: Categoria de alimentos (Proteína, Acompanhamento, Salada, Sobremesa)
- **MenuItem**: Item individual de alimento que compõe os cardápios
- **Menu**: Cardápio diário com data, dia da semana e composição de itens
- **MenuComposition**: Composição do cardápio (relacionamento entre Menu e MenuItem)
- **MenuVariation**: Variações do cardápio (padrão, substituição com ovo)
- **Reservation**: Reserva de almoço de um usuário para uma data específica
- **Cutoff Time**: Horário limite de 8:30 AM para criar, alterar ou cancelar reservas
- **Auto Reservation**: Reserva automática criada pelo sistema para usuários do tipo FIXO
- **shadcn/ui**: Biblioteca de componentes UI usada no projeto
- **Tanstack Query**: Biblioteca para gerenciamento de estado assíncrono e cache
- **React Hook Form**: Biblioteca para gerenciamento de formulários
- **Zod**: Biblioteca para validação de schemas e inferência de tipos

## Requirements

### Requirement 1: Autenticação de Usuários

**User Story:** Como um usuário do sistema, eu quero fazer login usando meu CPF e senha, para que eu possa acessar o sistema de reservas de almoço de forma segura.

#### Acceptance Criteria

1. WHEN o usuário acessa a página de login, THE Frontend Application SHALL exibir um formulário com campos para CPF (11 dígitos) e senha (mínimo 6 caracteres)
2. WHEN o usuário submete credenciais válidas, THE Frontend Application SHALL enviar requisição POST para /api/auth/login e armazenar o token JWT retornado
3. IF as credenciais são inválidas, THEN THE Frontend Application SHALL exibir mensagem de erro "CPF ou senha incorretos"
4. IF o usuário está com status INATIVO, THEN THE Frontend Application SHALL exibir mensagem "Este usuário está desativado. Entre em contato com o administrador"
5. WHEN o login é bem-sucedido, THE Frontend Application SHALL redirecionar o usuário para a página principal do sistema
6. THE Frontend Application SHALL incluir o token JWT em todas as requisições subsequentes através do header Authorization

### Requirement 2: Gerenciamento de Usuários (Admin)

**User Story:** Como um administrador, eu quero gerenciar usuários do sistema (criar, listar, visualizar, atualizar, ativar/desativar), para que eu possa controlar quem tem acesso ao sistema de reservas.

#### Acceptance Criteria

1. WHEN um administrador acessa a página de usuários, THE Frontend Application SHALL exibir uma tabela com todos os usuários cadastrados incluindo CPF, nome, role, tipo e status
2. WHEN um administrador clica em "Novo Usuário", THE Frontend Application SHALL exibir um formulário modal com campos: CPF (11 dígitos), nome (3-255 caracteres), senha (mínimo 6 caracteres), role (ADMIN/USER), userType (FIXO/NAO_FIXO)
3. WHEN um administrador submete o formulário de criação, THE Frontend Application SHALL enviar requisição POST para /api/users com os dados validados
4. WHEN um administrador clica em "Editar" em um usuário, THE Frontend Application SHALL exibir formulário modal permitindo alterar nome, role, userType e senha
5. WHEN um administrador clica em "Ativar/Desativar", THE Frontend Application SHALL enviar requisição PATCH para /api/users/{id}/status e atualizar o status do usuário
6. THE Frontend Application SHALL exibir filtros para status (ATIVO/INATIVO), role (ADMIN/USER) e userType (FIXO/NAO_FIXO)
7. IF o CPF já está cadastrado, THEN THE Frontend Application SHALL exibir mensagem de erro "Já existe um usuário com este CPF no sistema"

### Requirement 3: Gerenciamento de Categorias (Admin)

**User Story:** Como um administrador, eu quero gerenciar categorias de alimentos (criar, listar, editar, excluir), para que eu possa organizar os itens de menu por tipo (Proteína, Acompanhamento, Salada, Sobremesa).

#### Acceptance Criteria

1. WHEN um administrador acessa a página de categorias, THE Frontend Application SHALL exibir uma tabela com todas as categorias incluindo nome, descrição, ordem de exibição e status
2. WHEN um administrador clica em "Nova Categoria", THE Frontend Application SHALL exibir formulário modal com campos: nome (2-100 caracteres), descrição (opcional, máximo 500 caracteres), displayOrder (número inteiro positivo)
3. WHEN um administrador submete o formulário de criação, THE Frontend Application SHALL enviar requisição POST para /api/categories
4. WHEN um administrador clica em "Editar", THE Frontend Application SHALL permitir alterar nome, descrição, displayOrder e status (isActive)
5. WHEN um administrador clica em "Excluir", THE Frontend Application SHALL exibir confirmação e enviar requisição DELETE para /api/categories/{id}
6. IF a categoria está sendo usada em itens de menu, THEN THE Frontend Application SHALL exibir mensagem "Não é possível remover esta categoria pois existem itens de menu associados a ela"

### Requirement 4: Gerenciamento de Itens de Menu (Admin)

**User Story:** Como um administrador, eu quero gerenciar itens de menu (criar, listar, editar, excluir), para que eu possa manter atualizado o catálogo de alimentos disponíveis para compor os cardápios.

#### Acceptance Criteria

1. WHEN um administrador acessa a página de itens de menu, THE Frontend Application SHALL exibir uma tabela com todos os itens incluindo nome, descrição, categoria e status
2. WHEN um administrador clica em "Novo Item", THE Frontend Application SHALL exibir formulário modal com campos: nome (2-200 caracteres), descrição (opcional, máximo 500 caracteres), categoria (select com categorias ativas)
3. WHEN um administrador submete o formulário de criação, THE Frontend Application SHALL enviar requisição POST para /api/menu-items
4. THE Frontend Application SHALL permitir filtrar itens por categoria e status (ativo/inativo)
5. WHEN um administrador clica em "Editar", THE Frontend Application SHALL permitir alterar nome, descrição, categoria e status
6. WHEN um administrador clica em "Excluir", THE Frontend Application SHALL exibir confirmação e enviar requisição DELETE para /api/menu-items/{id}
7. IF o item está sendo usado em cardápios ativos, THEN THE Frontend Application SHALL exibir mensagem "Não é possível remover este item pois ele está sendo usado em cardápios ativos"

### Requirement 5: Gerenciamento de Cardápios (Admin)

**User Story:** Como um administrador, eu quero gerenciar cardápios semanais (criar, listar, visualizar, editar, excluir), para que eu possa definir as opções de almoço disponíveis para cada dia.

#### Acceptance Criteria

1. WHEN um administrador acessa a página de cardápios, THE Frontend Application SHALL exibir uma visualização semanal com os cardápios cadastrados organizados por data
2. WHEN um administrador clica em "Novo Cardápio", THE Frontend Application SHALL exibir formulário com campos: data (date picker, apenas datas futuras), dia da semana (auto-preenchido), observações (opcional, máximo 500 caracteres)
3. WHEN um administrador está criando um cardápio, THE Frontend Application SHALL permitir selecionar múltiplos itens de menu organizados por categoria e marcar qual é a proteína principal
4. WHEN um administrador submete o formulário de criação, THE Frontend Application SHALL enviar requisição POST para /api/menus com a composição completa do cardápio
5. WHEN um administrador visualiza um cardápio, THE Frontend Application SHALL exibir todos os itens organizados por categoria (Proteína, Acompanhamento, Salada, Sobremesa) e as variações disponíveis (Padrão, Com Ovo)
6. WHEN um administrador clica em "Editar" em um cardápio futuro, THE Frontend Application SHALL permitir alterar data, observações e composição de itens
7. WHEN um administrador clica em "Excluir" em um cardápio futuro sem reservas, THE Frontend Application SHALL exibir confirmação e enviar requisição DELETE para /api/menus/{id}
8. IF o cardápio possui reservas ativas, THEN THE Frontend Application SHALL exibir mensagem "Não é possível excluir cardápio que possui reservas ativas"
9. THE Frontend Application SHALL permitir filtrar cardápios por período (data inicial e final) e dia da semana

### Requirement 6: Visualização de Cardápios (User)

**User Story:** Como um usuário, eu quero visualizar os cardápios da semana, para que eu possa ver as opções de almoço disponíveis e decidir se vou fazer uma reserva.

#### Acceptance Criteria

1. WHEN um usuário acessa a página de cardápios, THE Frontend Application SHALL exibir uma visualização semanal com os cardápios disponíveis para os próximos dias
2. WHEN um usuário visualiza um cardápio, THE Frontend Application SHALL exibir todos os itens organizados por categoria com nome e descrição
3. THE Frontend Application SHALL exibir as variações disponíveis (Padrão, Com Ovo) com suas descrições
4. WHEN um usuário clica em um cardápio, THE Frontend Application SHALL exibir detalhes completos incluindo data, dia da semana, observações e composição completa
5. THE Frontend Application SHALL indicar visualmente se o usuário já possui reserva para aquela data
6. THE Frontend Application SHALL permitir navegar entre semanas (anterior/próxima)

### Requirement 7: Criação de Reservas (User)

**User Story:** Como um usuário, eu quero criar uma reserva de almoço para uma data específica, para que eu possa garantir minha refeição no dia desejado.

#### Acceptance Criteria

1. WHEN um usuário visualiza um cardápio sem reserva, THE Frontend Application SHALL exibir botão "Fazer Reserva"
2. WHEN um usuário clica em "Fazer Reserva", THE Frontend Application SHALL exibir modal com as variações disponíveis (Padrão, Com Ovo) para seleção
3. WHEN um usuário seleciona uma variação e confirma, THE Frontend Application SHALL enviar requisição POST para /api/reservations com menuId, menuVariationId e reservationDate
4. IF o horário atual é após 8:30 AM do dia da refeição, THEN THE Frontend Application SHALL desabilitar o botão de reserva e exibir mensagem "Prazo para reservas encerrado (até 8:30 AM)"
5. IF o usuário já possui reserva para aquela data, THEN THE Frontend Application SHALL exibir "Reserva já realizada" ao invés do botão
6. WHEN a reserva é criada com sucesso, THE Frontend Application SHALL exibir mensagem de confirmação e atualizar a visualização do cardápio
7. IF ocorrer erro na criação, THEN THE Frontend Application SHALL exibir a mensagem de erro retornada pela API

### Requirement 8: Gerenciamento de Minhas Reservas (User)

**User Story:** Como um usuário, eu quero visualizar, alterar e cancelar minhas reservas, para que eu possa gerenciar minhas refeições agendadas.

#### Acceptance Criteria

1. WHEN um usuário acessa a página "Minhas Reservas", THE Frontend Application SHALL exibir uma lista com todas as suas reservas ordenadas por data
2. WHEN um usuário visualiza uma reserva, THE Frontend Application SHALL exibir data, cardápio completo, variação selecionada, status e se foi gerada automaticamente
3. WHEN um usuário clica em "Alterar Variação" em uma reserva ativa, THE Frontend Application SHALL exibir modal permitindo trocar entre as variações disponíveis
4. WHEN um usuário confirma a alteração, THE Frontend Application SHALL enviar requisição PATCH para /api/reservations/{id}
5. WHEN um usuário clica em "Cancelar Reserva", THE Frontend Application SHALL exibir confirmação e enviar requisição DELETE para /api/reservations/{id}
6. IF o horário atual é após 8:30 AM do dia da refeição, THEN THE Frontend Application SHALL desabilitar botões de alterar e cancelar e exibir mensagem "Prazo para alterações encerrado"
7. THE Frontend Application SHALL permitir filtrar reservas por status (ACTIVE, CANCELLED) e período
8. THE Frontend Application SHALL indicar visualmente reservas geradas automaticamente (usuários FIXO) com um badge "Auto"

### Requirement 9: Responsividade e UX

**User Story:** Como um usuário, eu quero que o sistema seja responsivo e tenha boa experiência de uso em diferentes dispositivos, para que eu possa acessá-lo de qualquer lugar.

#### Acceptance Criteria

1. THE Frontend Application SHALL ser totalmente responsivo e funcional em dispositivos mobile (320px+), tablet (768px+) e desktop (1024px+)
2. THE Frontend Application SHALL usar componentes shadcn/ui para manter consistência visual
3. THE Frontend Application SHALL exibir loading states durante requisições à API usando skeletons ou spinners
4. THE Frontend Application SHALL exibir mensagens de erro de forma clara usando toast notifications (sonner)
5. THE Frontend Application SHALL validar formulários em tempo real usando React Hook Form + Zod
6. THE Frontend Application SHALL usar Tanstack Query para cache e sincronização automática de dados
7. THE Frontend Application SHALL implementar dark mode usando next-themes

### Requirement 10: Controle de Acesso e Navegação

**User Story:** Como um usuário do sistema, eu quero que o acesso às funcionalidades seja controlado de acordo com meu perfil (ADMIN/USER), para que eu veja apenas as opções relevantes para meu papel.

#### Acceptance Criteria

1. WHEN um usuário com role USER está autenticado, THE Frontend Application SHALL exibir no menu apenas: Cardápios, Minhas Reservas, Perfil
2. WHEN um usuário com role ADMIN está autenticado, THE Frontend Application SHALL exibir no menu: Dashboard, Usuários, Categorias, Itens de Menu, Cardápios, Reservas (todas), Perfil
3. THE Frontend Application SHALL proteger rotas administrativas redirecionando usuários não-admin para a página inicial
4. THE Frontend Application SHALL exibir informações do usuário logado no header (nome, role, avatar)
5. WHEN um usuário clica em "Sair", THE Frontend Application SHALL limpar o token de autenticação e redirecionar para a página de login
6. IF o token JWT expirar, THEN THE Frontend Application SHALL redirecionar automaticamente para a página de login

### Requirement 11: Migração e Limpeza do Código Anterior

**User Story:** Como desenvolvedor, eu quero remover completamente o módulo de companies e adaptar a estrutura do projeto para o novo domínio de reservas de almoço, para que o código fique limpo e organizado.

#### Acceptance Criteria

1. THE Frontend Application SHALL remover todos os arquivos relacionados ao módulo companies: src/app/companies/, src/\_services/company.service.ts, src/\_schemas/company.schema.ts, src/\_types/company.ts
2. THE Frontend Application SHALL remover hooks relacionados a companies: src/\_hooks/queries/use-get-companies.ts, src/\_hooks/mutations/use-create-company.ts
3. THE Frontend Application SHALL atualizar a variável de ambiente NEXT_PUBLIC_API_URL para apontar para a API de reservas (http://localhost:8080/api)
4. THE Frontend Application SHALL manter a estrutura de pastas existente (\_components, \_hooks, \_lib, \_schemas, \_services, \_types) adaptando para o novo domínio
5. THE Frontend Application SHALL remover dependências do Drizzle ORM e PostgreSQL do frontend (pg, drizzle-orm, drizzle-kit) pois o backend já gerencia o banco
6. THE Frontend Application SHALL manter Better Auth apenas se for usado para gerenciar sessões no frontend, caso contrário usar apenas JWT tokens
7. THE Frontend Application SHALL atualizar o README.md do projeto com documentação do novo sistema de reservas de almoço
