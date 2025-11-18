"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { AppError } from "@/_errors/AppError";

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutos
            gcTime: 1000 * 60 * 10, // 10 minutos (anteriormente cacheTime)
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
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
              // Fazer retry até 2 vezes para erros 5xx (server errors)
              return failureCount < 2;
            },
            retryDelay: (attemptIndex) => {
              // Exponential backoff: 1s, 2s, 4s
              return Math.min(1000 * 2 ** attemptIndex, 4000);
            },
          },
          mutations: {
            retry: false, // Não fazer retry automático em mutations
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQueryProvider;
