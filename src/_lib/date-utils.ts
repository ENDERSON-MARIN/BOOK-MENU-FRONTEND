import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

// Extend dayjs with necessary plugins
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Verifica se o horário atual é antes de 8:30 AM do dia da refeição
 * @param date - Data da refeição no formato YYYY-MM-DD
 * @returns true se ainda é possível fazer/alterar/cancelar reserva, false caso contrário
 */
export function isBeforeCutoffTime(date: string): boolean {
  // Parse da data da refeição (formato YYYY-MM-DD)
  const mealDate = dayjs(date, "YYYY-MM-DD");

  // Verifica se a data é válida
  if (!mealDate.isValid()) {
    return false;
  }

  // Cria o horário limite: 8:30 AM do dia da refeição
  const cutoffTime = mealDate.hour(8).minute(30).second(0).millisecond(0);

  // Obtém o horário atual
  const now = dayjs();

  // Retorna true se o horário atual é antes do limite
  return now.isBefore(cutoffTime);
}

/**
 * Formata uma data no formato brasileiro (DD/MM/YYYY)
 * @param date - Data no formato YYYY-MM-DD ou objeto Date
 * @returns Data formatada como DD/MM/YYYY
 */
export function formatDateBR(date: string | Date): string {
  return dayjs(date).format("DD/MM/YYYY");
}

/**
 * Formata uma data e hora no formato brasileiro (DD/MM/YYYY HH:mm)
 * @param date - Data/hora no formato ISO ou objeto Date
 * @returns Data e hora formatadas como DD/MM/YYYY HH:mm
 */
export function formatDateTimeBR(date: string | Date): string {
  return dayjs(date).format("DD/MM/YYYY HH:mm");
}

/**
 * Obtém o nome do dia da semana em português
 * @param date - Data no formato YYYY-MM-DD ou objeto Date
 * @returns Nome do dia da semana (ex: "Segunda-feira")
 */
export function getDayOfWeekName(date: string | Date): string {
  const dayNames = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];

  const dayIndex = dayjs(date).day();
  return dayNames[dayIndex];
}

/**
 * Verifica se uma data é futura (após hoje)
 * @param date - Data no formato YYYY-MM-DD
 * @returns true se a data é futura, false caso contrário
 */
export function isFutureDate(date: string): boolean {
  const targetDate = dayjs(date, "YYYY-MM-DD").startOf("day");
  const today = dayjs().startOf("day");

  return targetDate.isAfter(today);
}

/**
 * Obtém a data atual no formato YYYY-MM-DD
 * @returns Data atual formatada
 */
export function getTodayFormatted(): string {
  return dayjs().format("YYYY-MM-DD");
}
