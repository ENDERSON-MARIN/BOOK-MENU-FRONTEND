# Implementation Plan

- [x] 1. Atualizar serviço de reservas com método toggleStatus
  - Adicionar método `toggleStatus(id: string, status: ReservationStatus)` ao ReservationService
  - Implementar chamada PUT para `/api/lunch-reservation/admin/reservations/{id}/status`
  - Adicionar tratamento de erros específicos (404, 403, 400, 500)
  - _Requirements: 4.3, 4.4_

- [x] 2. Criar hook de mutação useToggleReservationStatus
  - Criar arquivo `src/_hooks/mutations/use-toggle-reservation-status.ts`
  - Implementar hook usando useMutation do React Query
  - Configurar invalidação de queries após sucesso (all-reservations, reservations, menus)
  - Implementar exibição de toasts de sucesso e erro
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ]\* 2.1 Escrever teste de propriedade para hook de mutação
  - **Property 1: Opções contextuais baseadas em status**
  - **Validates: Requirements 1.2, 1.3**

- [x] 3. Atualizar mensagens de toast
  - Adicionar mensagens de sucesso para cancelamento e reativação em `src/_lib/toast-messages.ts`
  - Adicionar mensagens de erro específicas
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 4. Criar componente AdminTableActions
  - Criar arquivo `src/app/(dashboard)/reservas/_components/admin-table-actions.tsx`
  - Implementar menu dropdown com DropdownMenu do shadcn/ui
  - Adicionar opção "Ver Detalhes" reutilizando ReservationDetailsDialog
  - Implementar lógica condicional para exibir "Cancelar Reserva" ou "Reativar Reserva"
  - Usar isBeforeCutoffTime para validar prazo e desabilitar opções quando necessário
  - Adicionar ícones apropriados (XIcon para cancelar, CheckCircleIcon para reativar)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 5.1, 5.2_

- [ ]\* 4.1 Escrever teste de propriedade para opções contextuais
  - **Property 1: Opções contextuais baseadas em status**
  - **Validates: Requirements 1.2, 1.3**

- [ ]\* 4.2 Escrever teste de propriedade para desabilitação por prazo
  - **Property 2: Desabilitação por prazo limite**
  - **Validates: Requirements 1.4, 1.5**

- [ ] 5. Implementar alert dialog de confirmação
  - Adicionar AlertDialog do shadcn/ui ao componente AdminTableActions
  - Implementar títulos dinâmicos baseados na ação (cancelar/reativar)
  - Adicionar botões "Cancelar" e "Confirmar"
  - Conectar botão "Confirmar" ao hook useToggleReservationStatus
  - Exibir estado de loading no botão durante mutação
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 5.5_

- [ ]\* 5.1 Escrever teste de propriedade para títulos do dialog
  - **Property 4: Títulos corretos no dialog de confirmação**
  - **Validates: Requirements 2.3, 2.4**

- [ ] 6. Integrar AdminTableActions na tabela de reservas admin
  - Atualizar `src/app/(dashboard)/reservas/_components/all-reservations-table-columns.tsx`
  - Adicionar coluna de ações usando AdminTableActions
  - Garantir que apenas administradores vejam as novas opções
  - _Requirements: 1.1_

- [ ]\* 6.1 Escrever testes unitários para componente AdminTableActions
  - Testar renderização do menu dropdown
  - Testar exibição de opções baseadas no status
  - Testar desabilitação quando prazo expirado
  - Testar abertura do alert dialog
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 7. Adicionar validação de prazo para datas futuras
  - Verificar que função isBeforeCutoffTime em `src/_lib/date-utils.ts` já trata datas futuras corretamente
  - Se necessário, adicionar testes para garantir comportamento correto
  - _Requirements: 3.5_

- [ ]\* 7.1 Escrever teste de propriedade para validação de datas futuras
  - **Property 3: Validação de prazo para datas futuras**
  - **Validates: Requirements 3.1, 3.2, 3.5**

- [ ] 8. Implementar tratamento de erros específicos
  - Adicionar mensagem para prazo expirado (400)
  - Adicionar mensagem para reserva não encontrada (404)
  - Adicionar mensagem para sem permissão (403)
  - Adicionar mensagem para erro de servidor (500)
  - Adicionar mensagem para erro de rede
  - _Requirements: 4.3, 4.4_

- [ ] 9. Checkpoint - Garantir que todos os testes passam
  - Ensure all tests pass, ask the user if questions arise.

- [ ]\* 10. Escrever testes de integração
  - Testar fluxo completo de cancelamento de reserva
  - Testar fluxo completo de reativação de reserva
  - Testar tentativa de alteração após prazo limite
  - Testar tratamento de erro de API
  - Testar atualização automática da tabela
  - _Requirements: 4.5_

- [ ] 11. Validar acessibilidade
  - Verificar navegação por teclado no menu dropdown
  - Adicionar aria-labels apropriados
  - Testar com leitor de tela
  - Verificar gerenciamento de foco no dialog
  - _Requirements: 5.1_

- [ ] 12. Checkpoint final - Garantir que todos os testes passam
  - Ensure all tests pass, ask the user if questions arise.
