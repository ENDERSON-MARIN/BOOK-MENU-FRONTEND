import dayjs from "dayjs";
import { useMemo, useState } from "react";

import { ReportFilters, ReportPeriod } from "@/_types/report";

interface UseReportFiltersOptions {
  initialStartDate?: string;
  initialEndDate?: string;
  maxPeriodDays?: number;
}

interface UseReportFiltersReturn {
  filters: ReportFilters;
  startDate: string;
  endDate: string;
  errors: {
    startDate?: string;
    endDate?: string;
    period?: string;
  };
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setPresetPeriod: (period: ReportPeriod) => void;
  setStatus: (status: ReportFilters["status"]) => void;
  setUserType: (userType: ReportFilters["userType"]) => void;
  setReservationType: (
    reservationType: ReportFilters["reservationType"],
  ) => void;
  clearFilters: () => void;
  isValid: boolean;
}

/**
 * Hook customizado para gerenciar filtros de relatórios
 * Implementa validações de datas e períodos pré-definidos
 *
 * @param options - Opções de configuração
 * @param options.initialStartDate - Data inicial padrão (formato YYYY-MM-DD)
 * @param options.initialEndDate - Data final padrão (formato YYYY-MM-DD)
 * @param options.maxPeriodDays - Limite máximo de dias no período (padrão: 365)
 *
 * @returns Objeto com filtros, funções de atualização e validações
 *
 * @example
 * const {
 *   filters,
 *   startDate,
 *   endDate,
 *   errors,
 *   setStartDate,
 *   setEndDate,
 *   setPresetPeriod,
 *   isValid
 * } = useReportFilters({
 *   initialStartDate: dayjs().subtract(7, 'days').format('YYYY-MM-DD'),
 *   initialEndDate: dayjs().format('YYYY-MM-DD')
 * });
 */
export function useReportFilters(
  options: UseReportFiltersOptions = {},
): UseReportFiltersReturn {
  const {
    initialStartDate = dayjs().subtract(7, "days").format("YYYY-MM-DD"),
    initialEndDate = dayjs().format("YYYY-MM-DD"),
    maxPeriodDays = 365,
  } = options;

  const [startDate, setStartDateState] = useState<string>(initialStartDate);
  const [endDate, setEndDateState] = useState<string>(initialEndDate);
  const [status, setStatus] = useState<ReportFilters["status"]>();
  const [userType, setUserType] = useState<ReportFilters["userType"]>();
  const [reservationType, setReservationType] =
    useState<ReportFilters["reservationType"]>();

  // Validações de datas
  const errors = useMemo(() => {
    const validationErrors: {
      startDate?: string;
      endDate?: string;
      period?: string;
    } = {};

    if (!startDate) {
      validationErrors.startDate = "Data inicial é obrigatória";
      return validationErrors;
    }

    if (!endDate) {
      validationErrors.endDate = "Data final é obrigatória";
      return validationErrors;
    }

    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const today = dayjs();

    // Validar formato de data
    if (!start.isValid()) {
      validationErrors.startDate = "Data inicial inválida";
    }

    if (!end.isValid()) {
      validationErrors.endDate = "Data final inválida";
    }

    // Validar se data inicial não é posterior à data final
    if (start.isValid() && end.isValid() && start.isAfter(end)) {
      validationErrors.startDate =
        "Data inicial não pode ser posterior à data final";
    }

    // Validar limite máximo de período (1 ano)
    if (start.isValid() && end.isValid()) {
      const daysDiff = end.diff(start, "days");
      if (daysDiff > maxPeriodDays) {
        validationErrors.period = `O período não pode exceder ${maxPeriodDays} dias (aproximadamente 1 ano)`;
      }
    }

    return validationErrors;
  }, [startDate, endDate, maxPeriodDays]);

  // Verificar se os filtros são válidos
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  // Função para definir data inicial
  const setStartDate = (date: string) => {
    setStartDateState(date);
  };

  // Função para definir data final
  const setEndDate = (date: string) => {
    setEndDateState(date);
  };

  // Função para definir período pré-definido
  const setPresetPeriod = (period: ReportPeriod) => {
    const today = dayjs();
    let newStartDate: string;
    const newEndDate: string = today.format("YYYY-MM-DD");

    switch (period) {
      case "last-week":
        newStartDate = today.subtract(7, "days").format("YYYY-MM-DD");
        break;
      case "last-month":
        newStartDate = today.subtract(1, "month").format("YYYY-MM-DD");
        break;
      case "last-3-months":
        newStartDate = today.subtract(3, "months").format("YYYY-MM-DD");
        break;
      case "last-year":
        newStartDate = today.subtract(1, "year").format("YYYY-MM-DD");
        break;
      case "custom":
        // Não altera as datas para período customizado
        return;
      default:
        newStartDate = today.subtract(7, "days").format("YYYY-MM-DD");
    }

    setStartDateState(newStartDate);
    setEndDateState(newEndDate);
  };

  // Função para limpar todos os filtros
  const clearFilters = () => {
    setStartDateState(initialStartDate);
    setEndDateState(initialEndDate);
    setStatus(undefined);
    setUserType(undefined);
    setReservationType(undefined);
  };

  // Montar objeto de filtros
  const filters: ReportFilters = useMemo(() => {
    return {
      startDate,
      endDate,
      ...(status && { status }),
      ...(userType && { userType }),
      ...(reservationType && { reservationType }),
    };
  }, [startDate, endDate, status, userType, reservationType]);

  return {
    filters,
    startDate,
    endDate,
    errors,
    setStartDate,
    setEndDate,
    setPresetPeriod,
    setStatus,
    setUserType,
    setReservationType,
    clearFilters,
    isValid,
  };
}
