# Requirements Document

## Introduction

Esta funcionalidade adiciona uma coluna visual na tabela de cardápios do dashboard do usuário que indica quando o usuário possui uma reserva ativa para um cardápio específico. O objetivo é melhorar a experiência do usuário, permitindo que ele identifique rapidamente quais cardápios já foram reservados sem precisar abrir os detalhes de cada um.

## Glossary

- **Sistema de Cardápios**: O módulo da aplicação que exibe a lista de cardápios disponíveis para reserva
- **Coluna de Status de Reserva**: Nova coluna na tabela que mostra se o usuário tem uma reserva ativa para o cardápio
- **Reserva Ativa**: Uma reserva com status "ACTIVE" associada ao usuário autenticado
- **Tabela de Cardápios**: Componente DataTable que lista os cardápios disponíveis no dashboard do usuário
- **Badge de Reserva**: Componente visual que indica o status da reserva do usuário

## Requirements

### Requirement 1

**User Story:** Como usuário do sistema, eu quero ver visualmente na tabela de cardápios quais cardápios eu já reservei, para que eu possa identificar rapidamente meu status de reserva sem precisar abrir cada cardápio individualmente.

#### Acceptance Criteria

1. WHEN o Sistema de Cardápios renderiza a Tabela de Cardápios, THE Sistema de Cardápios SHALL exibir uma Coluna de Status de Reserva para cada linha da tabela
2. WHEN o usuário possui uma Reserva Ativa para um cardápio específico, THE Sistema de Cardápios SHALL exibir um Badge de Reserva com o texto "Reservado" na Coluna de Status de Reserva
3. WHEN o usuário não possui uma Reserva Ativa para um cardápio específico, THE Sistema de Cardápios SHALL exibir um hífen ("-") na Coluna de Status de Reserva
4. WHEN o Sistema de Cardápios busca as reservas do usuário, THE Sistema de Cardápios SHALL filtrar apenas as reservas com status "ACTIVE"
5. WHEN o Sistema de Cardápios exibe o Badge de Reserva, THE Sistema de Cardápios SHALL utilizar a variante visual "default" com cor verde para indicar reserva confirmada

### Requirement 2

**User Story:** Como usuário do sistema, eu quero que a coluna de status de reserva seja atualizada automaticamente quando eu criar ou cancelar uma reserva, para que eu sempre veja informações atualizadas sem precisar recarregar a página.

#### Acceptance Criteria

1. WHEN o usuário cria uma nova reserva através do Sistema de Cardápios, THE Sistema de Cardápios SHALL atualizar automaticamente a Coluna de Status de Reserva para exibir o Badge de Reserva
2. WHEN o usuário cancela uma reserva existente através do Sistema de Cardápios, THE Sistema de Cardápios SHALL atualizar automaticamente a Coluna de Status de Reserva para exibir um hífen ("-")
3. WHEN o Sistema de Cardápios invalida o cache de reservas, THE Sistema de Cardápios SHALL refazer a busca das reservas do usuário para garantir dados atualizados

### Requirement 3

**User Story:** Como desenvolvedor do sistema, eu quero que a coluna de status de reserva seja implementada de forma eficiente, para que não haja impacto negativo na performance da aplicação.

#### Acceptance Criteria

1. WHEN o Sistema de Cardápios busca as reservas do usuário, THE Sistema de Cardápios SHALL utilizar o hook useGetAllReservations existente com filtro de userId
2. WHEN o Sistema de Cardápios verifica se um cardápio está reservado, THE Sistema de Cardápios SHALL realizar a verificação através de uma função auxiliar que compara o menuId da reserva com o menuId do cardápio
3. WHEN o Sistema de Cardápios renderiza a Tabela de Cardápios, THE Sistema de Cardápios SHALL utilizar memoização para evitar recálculos desnecessários do status de reserva
