# Date Utils - Exemplos de Uso

## isBeforeCutoffTime

Valida se o horário atual é antes de 8:30 AM do dia da refeição. Usado para controlar quando usuários podem criar, alterar ou cancelar reservas.

### Exemplo de uso em componentes:

```typescript
import { isBeforeCutoffTime } from "@/_lib/date-utils";

// Em um botão de criar reserva
const canMakeReservation = isBeforeCutoffTime(menu.date);

<Button disabled={!canMakeReservation}>
  {canMakeReservation ? "Fazer Reserva" : "Prazo Encerrado"}
</Button>

// Em um botão de alterar variação
const canChangeVariation = isBeforeCutoffTime(reservation.reservationDate);

<Button disabled={!canChangeVariation}>
  {canChangeVariation ? "Alterar Variação" : "Prazo Encerrado (até 8:30 AM)"}
</Button>

// Em um botão de cancelar reserva
const canCancelReservation = isBeforeCutoffTime(reservation.reservationDate);

<Button disabled={!canCancelReservation}>
  Cancelar Reserva
</Button>
```

### Lógica de validação:

- **Data futura**: Sempre retorna `true` (pode fazer/alterar/cancelar)
- **Data de hoje antes das 8:30 AM**: Retorna `true` (ainda pode fazer/alterar/cancelar)
- **Data de hoje após 8:30 AM**: Retorna `false` (prazo encerrado)
- **Data passada**: Retorna `false` (prazo encerrado)
- **Data inválida**: Retorna `false` (segurança)

### Exemplos práticos:

```typescript
// Cenário 1: Amanhã (sempre pode)
isBeforeCutoffTime("2024-11-15"); // true (se hoje é 14/11)

// Cenário 2: Hoje às 7:00 AM (pode)
isBeforeCutoffTime("2024-11-14"); // true (se agora é 14/11 07:00)

// Cenário 3: Hoje às 8:30 AM (não pode mais)
isBeforeCutoffTime("2024-11-14"); // false (se agora é 14/11 08:30)

// Cenário 4: Hoje às 9:00 AM (não pode mais)
isBeforeCutoffTime("2024-11-14"); // false (se agora é 14/11 09:00)

// Cenário 5: Ontem (não pode)
isBeforeCutoffTime("2024-11-13"); // false (se hoje é 14/11)
```

## Outras funções úteis

### formatDateBR

Formata data no padrão brasileiro (DD/MM/YYYY):

```typescript
formatDateBR("2024-11-14"); // "14/11/2024"
```

### formatDateTimeBR

Formata data e hora no padrão brasileiro (DD/MM/YYYY HH:mm):

```typescript
formatDateTimeBR("2024-11-14T14:30:00"); // "14/11/2024 14:30"
```

### getDayOfWeekName

Retorna o nome do dia da semana em português:

```typescript
getDayOfWeekName("2024-11-14"); // "Quinta-feira"
```

### isFutureDate

Verifica se uma data é futura (após hoje):

```typescript
isFutureDate("2024-11-15"); // true (se hoje é 14/11)
isFutureDate("2024-11-14"); // false (se hoje é 14/11)
```

### getTodayFormatted

Retorna a data de hoje no formato YYYY-MM-DD:

```typescript
getTodayFormatted(); // "2024-11-14" (se hoje é 14/11)
```
