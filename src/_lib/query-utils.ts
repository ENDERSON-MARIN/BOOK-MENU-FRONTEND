import { UseQueryOptions } from "@tanstack/react-query";

import { AppError } from "@/_errors/AppError";

/**
 * Configuração de retry para queries críticas
 * Usa retry mais agressivo para operações importantes
 */
export const criticalQueryRetry = {
  retry: (failureCount: number, error: unknown) => {
    // Não fazer retry em erros de autenticação ou autorização
    if (error instanceof AppError) {
      if (error.statusCode === 401 || error.statusCode === 403) {
        return false;
      }
      // Não fazer retry em erros 4xx (client errors)
      if (error.statusCode >= 400 && error.statusCode < 500) {
        return false;
      }
    }
    // Fazer retry até 3 vezes para queries críticas
    return failureCount < 3;
  },
  retryDelay: (attemptIndex: number) => {
    // Exponential backoff: 1s, 2s, 4s, 8s
    return Math.min(1000 * 2 ** attemptIndex, 8000);
  },
} satisfies Pick<UseQueryOptions, "retry" | "retryDelay">;

/**
 * Configuração sem retry para queries que não devem ser retentadas
 */
export const noRetryQuery = {
  retry: false,
} satisfies Pick<UseQueryOptions, "retry">;

/**
 * Configuração de retry padrão (já está no QueryClient, mas pode ser usado explicitamente)
 */
export const defaultQueryRetry = {
  retry: (failureCount: number, error: unknown) => {
    if (error instanceof AppError) {
      if (error.statusCode === 401 || error.statusCode === 403) {
        return false;
      }
      if (error.statusCode >= 400 && error.statusCode < 500) {
        return false;
      }
    }
    return failureCount < 2;
  },
  retryDelay: (attemptIndex: number) => {
    return Math.min(1000 * 2 ** attemptIndex, 4000);
  },
} satisfies Pick<UseQueryOptions, "retry" | "retryDelay">;
