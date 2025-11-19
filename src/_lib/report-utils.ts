import "dayjs/locale/pt-br";

import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.locale("pt-br");

/**
 * Calcula a taxa de cancelamento em percentual
 * @param totalReservations - Total de reservas
 * @param cancelledReservations - Total de reservas canceladas
 * @returns Taxa de cancelamento em percentual (0-100)
 */
export function calculateCancellationRate(
  totalReservations: number,
  cancelledReservations: number,
): number {
  if (totalReservations === 0) return 0;
  return Number(((cancelledReservations / totalReservations) * 100).toFixed(2));
}

/**
 * Calcula a taxa de adesão em percentual
 * @param activeUsers - Número de usuários ativos (que fizeram pelo menos uma reserva)
 * @param totalUsers - Total de usuários cadastrados
 * @returns Taxa de adesão em percentual (0-100)
 */
export function calculateAdherenceRate(
  activeUsers: number,
  totalUsers: number,
): number {
  if (totalUsers === 0) return 0;
  return Number(((activeUsers / totalUsers) * 100).toFixed(2));
}

/**
 * Agrupa dados por dia
 * @param data - Array de objetos com campo de data
 * @param dateField - Nome do campo que contém a data
 * @returns Objeto com datas como chaves e arrays de itens como valores
 */
export function groupByDay<T extends Record<string, unknown>>(
  data: T[],
  dateField: keyof T,
): Record<string, T[]> {
  return data.reduce(
    (acc, item) => {
      const date = dayjs(item[dateField] as string).format("YYYY-MM-DD");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}

/**
 * Agrupa dados por semana
 * @param data - Array de objetos com campo de data
 * @param dateField - Nome do campo que contém a data
 * @returns Array de objetos com informações da semana e itens agrupados
 */
export function groupByWeek<T extends Record<string, unknown>>(
  data: T[],
  dateField: keyof T,
): Array<{
  weekStart: string;
  weekEnd: string;
  weekNumber: number;
  year: number;
  items: T[];
}> {
  const weekMap = new Map<
    string,
    {
      weekStart: string;
      weekEnd: string;
      weekNumber: number;
      year: number;
      items: T[];
    }
  >();

  data.forEach((item) => {
    const date = dayjs(item[dateField] as string);
    const weekNumber = date.isoWeek();
    const year = date.year();
    const weekKey = `${year}-W${weekNumber}`;

    if (!weekMap.has(weekKey)) {
      const weekStart = date.startOf("isoWeek").format("YYYY-MM-DD");
      const weekEnd = date.endOf("isoWeek").format("YYYY-MM-DD");

      weekMap.set(weekKey, {
        weekStart,
        weekEnd,
        weekNumber,
        year,
        items: [],
      });
    }

    weekMap.get(weekKey)!.items.push(item);
  });

  return Array.from(weekMap.values()).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.weekNumber - b.weekNumber;
  });
}

/**
 * Mascara um CPF para proteção de dados
 * Formato: XXX.XXX.XXX-XX -> XXX.XXX.XXX-**
 * @param cpf - CPF a ser mascarado
 * @returns CPF mascarado
 */
export function maskCPF(cpf: string): string {
  if (!cpf) return "";

  // Remove caracteres não numéricos
  const cleanCpf = cpf.replace(/\D/g, "");

  if (cleanCpf.length !== 11) return cpf;

  // Mascara os últimos 2 dígitos
  const masked = cleanCpf.slice(0, 9) + "**";

  // Formata com pontos e traço
  return masked.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

/**
 * Formata uma data para exibição em relatórios
 * @param date - Data a ser formatada (string ISO ou Date)
 * @param format - Formato desejado (padrão: "DD/MM/YYYY")
 * @returns Data formatada
 */
export function formatReportDate(
  date: string | Date,
  format: string = "DD/MM/YYYY",
): string {
  return dayjs(date).format(format);
}

/**
 * Formata uma data com dia da semana para relatórios
 * @param date - Data a ser formatada
 * @returns Data formatada com dia da semana (ex: "Segunda, 18/11/2025")
 */
export function formatReportDateWithWeekday(date: string | Date): string {
  const dayOfWeek = dayjs(date).format("dddd");
  const formattedDate = dayjs(date).format("DD/MM/YYYY");
  return `${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}, ${formattedDate}`;
}

/**
 * Calcula a diferença em dias entre duas datas
 * @param startDate - Data inicial
 * @param endDate - Data final
 * @returns Número de dias entre as datas
 */
export function getDaysDifference(
  startDate: string | Date,
  endDate: string | Date,
): number {
  return dayjs(endDate).diff(dayjs(startDate), "day");
}

/**
 * Verifica se uma data está dentro de um período
 * @param date - Data a ser verificada
 * @param startDate - Data inicial do período
 * @param endDate - Data final do período
 * @returns true se a data está dentro do período
 */
export function isDateInPeriod(
  date: string | Date,
  startDate: string | Date,
  endDate: string | Date,
): boolean {
  const checkDate = dayjs(date);
  return (
    checkDate.isSameOrAfter(dayjs(startDate), "day") &&
    checkDate.isSameOrBefore(dayjs(endDate), "day")
  );
}

/**
 * Gera um array de datas entre duas datas
 * @param startDate - Data inicial
 * @param endDate - Data final
 * @returns Array de datas no formato YYYY-MM-DD
 */
export function generateDateRange(
  startDate: string | Date,
  endDate: string | Date,
): string[] {
  const dates: string[] = [];
  let currentDate = dayjs(startDate);
  const end = dayjs(endDate);

  while (currentDate.isSameOrBefore(end, "day")) {
    dates.push(currentDate.format("YYYY-MM-DD"));
    currentDate = currentDate.add(1, "day");
  }

  return dates;
}

/**
 * Formata um número como moeda brasileira
 * @param value - Valor a ser formatado
 * @returns Valor formatado como moeda (ex: "R$ 1.234,56")
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/**
 * Formata um número com separadores de milhar
 * @param value - Valor a ser formatado
 * @returns Valor formatado (ex: "1.234")
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value);
}

/**
 * Calcula a média de um array de números
 * @param values - Array de números
 * @returns Média dos valores
 */
export function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return Number((sum / values.length).toFixed(2));
}

/**
 * Encontra o valor máximo em um array de objetos
 * @param data - Array de objetos
 * @param field - Campo a ser comparado
 * @returns Objeto com o valor máximo
 */
export function findMax<T extends Record<string, unknown>>(
  data: T[],
  field: keyof T,
): T | null {
  if (data.length === 0) return null;
  return data.reduce((max, item) =>
    (item[field] as number) > (max[field] as number) ? item : max,
  );
}

/**
 * Encontra o valor mínimo em um array de objetos
 * @param data - Array de objetos
 * @param field - Campo a ser comparado
 * @returns Objeto com o valor mínimo
 */
export function findMin<T extends Record<string, unknown>>(
  data: T[],
  field: keyof T,
): T | null {
  if (data.length === 0) return null;
  return data.reduce((min, item) =>
    (item[field] as number) < (min[field] as number) ? item : min,
  );
}

/**
 * Calcula a porcentagem de crescimento entre dois valores
 * @param currentValue - Valor atual
 * @param previousValue - Valor anterior
 * @returns Porcentagem de crescimento (positivo ou negativo)
 */
export function calculateGrowthPercentage(
  currentValue: number,
  previousValue: number,
): number {
  if (previousValue === 0) return currentValue > 0 ? 100 : 0;
  return Number(
    (((currentValue - previousValue) / previousValue) * 100).toFixed(2),
  );
}
