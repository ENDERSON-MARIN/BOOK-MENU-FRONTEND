# Requirements Document

## Introduction

Este documento especifica os requisitos para a funcionalidade de ativação e desativação de reservas por administradores na página de reservas do sistema de almoço corporativo. A funcionalidade permitirá que administradores gerenciem o status das reservas (ACTIVE/CANCELLED) respeitando o prazo limite de 8:30 AM do dia da reserva.

## Glossary

- **Sistema**: O sistema de reservas de almoço corporativo BookMenu
- **Administrador**: Usuário com role ADMIN que possui privilégios administrativos
- **Reserva**: Uma reserva de almoço criada por um usuário para uma data específica
- **Status da Reserva**: Estado atual da reserva, podendo ser ACTIVE (ativa) ou CANCELLED (cancelada)
- **Prazo Limite**: Horário de 8:30 AM do dia da reserva, após o qual modificações não são permitidas
- **Tabela de Reservas Admin**: Interface de listagem de todas as reservas do sistema acessível apenas por administradores
- **Menu Dropdown**: Menu de ações disponível em cada linha da tabela através do ícone de três pontos verticais
- **Alert Dialog**: Diálogo de confirmação que solicita confirmação do usuário antes de executar uma ação

## Requirements

### Requirement 1

**User Story:** Como administrador, eu quero visualizar uma opção para ativar ou desativar reservas na tabela de reservas, para que eu possa gerenciar o status das reservas dos usuários.

#### Acceptance Criteria

1. WHEN um administrador visualiza a tabela de reservas THEN o sistema SHALL exibir um menu dropdown de ações para cada reserva
2. WHEN o menu dropdown é aberto para uma reserva ativa THEN o sistema SHALL exibir a opção "Cancelar Reserva"
3. WHEN o menu dropdown é aberto para uma reserva cancelada THEN o sistema SHALL exibir a opção "Reativar Reserva"
4. WHEN o prazo limite (8:30 AM do dia da reserva) foi ultrapassado THEN o sistema SHALL desabilitar as opções de alteração de status
5. WHEN as opções estão desabilitadas THEN o sistema SHALL exibir feedback visual indicando que a ação não está disponível

### Requirement 2

**User Story:** Como administrador, eu quero confirmar a ação de alteração de status de uma reserva antes de executá-la, para que eu possa evitar alterações acidentais.

#### Acceptance Criteria

1. WHEN um administrador clica em "Cancelar Reserva" THEN o sistema SHALL exibir um alert dialog de confirmação
2. WHEN um administrador clica em "Reativar Reserva" THEN o sistema SHALL exibir um alert dialog de confirmação
3. WHEN o alert dialog é exibido para cancelamento THEN o sistema SHALL mostrar o título "Tem certeza que deseja cancelar esta reserva?"
4. WHEN o alert dialog é exibido para reativação THEN o sistema SHALL mostrar o título "Tem certeza que deseja reativar esta reserva?"
5. WHEN o alert dialog é exibido THEN o sistema SHALL incluir botões "Cancelar" e "Confirmar"

### Requirement 3

**User Story:** Como administrador, eu quero que o sistema valide o prazo limite antes de permitir alterações de status, para que as regras de negócio sejam respeitadas.

#### Acceptance Criteria

1. WHEN o horário atual é anterior a 8:30 AM do dia da reserva THEN o sistema SHALL permitir alterações de status
2. WHEN o horário atual é 8:30 AM ou posterior do dia da reserva THEN o sistema SHALL bloquear alterações de status
3. WHEN uma alteração é bloqueada por prazo THEN o sistema SHALL exibir mensagem "Prazo para alterações encerrado (até 8:30 AM do dia da refeição)"
4. WHEN a validação de prazo é executada THEN o sistema SHALL considerar o fuso horário local do servidor
5. WHEN a data da reserva é futura THEN o sistema SHALL sempre permitir alterações de status

### Requirement 4

**User Story:** Como administrador, eu quero receber feedback imediato após alterar o status de uma reserva, para que eu saiba se a operação foi bem-sucedida.

#### Acceptance Criteria

1. WHEN uma reserva é cancelada com sucesso THEN o sistema SHALL exibir toast de sucesso com mensagem "Reserva cancelada com sucesso"
2. WHEN uma reserva é reativada com sucesso THEN o sistema SHALL exibir toast de sucesso com mensagem "Reserva reativada com sucesso"
3. WHEN ocorre erro ao cancelar reserva THEN o sistema SHALL exibir toast de erro com mensagem descritiva
4. WHEN ocorre erro ao reativar reserva THEN o sistema SHALL exibir toast de erro com mensagem descritiva
5. WHEN a alteração é bem-sucedida THEN o sistema SHALL atualizar a tabela automaticamente refletindo o novo status

### Requirement 5

**User Story:** Como administrador, eu quero que a interface siga os padrões visuais existentes do sistema, para que a experiência seja consistente.

#### Acceptance Criteria

1. WHEN o menu dropdown é renderizado THEN o sistema SHALL utilizar os componentes shadcn/ui existentes (DropdownMenu, AlertDialog)
2. WHEN os ícones são exibidos THEN o sistema SHALL utilizar ícones da biblioteca lucide-react
3. WHEN o toast é exibido THEN o sistema SHALL utilizar a biblioteca sonner configurada no projeto
4. WHEN o layout é renderizado THEN o sistema SHALL seguir os padrões de espaçamento e cores do Tailwind CSS configurado
5. WHEN estados de loading são necessários THEN o sistema SHALL exibir indicadores visuais apropriados nos botões
