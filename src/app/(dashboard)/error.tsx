"use client";

import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/_components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erro no dashboard:", error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <AlertCircle className="text-destructive h-20 w-20" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Erro ao carregar página</h2>
          <p className="text-muted-foreground">
            Ocorreu um erro ao carregar esta página. Por favor, tente novamente.
          </p>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-4 text-left">
            <p className="text-destructive font-mono text-sm break-words">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-muted-foreground mt-2 text-xs">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={reset} variant="default">
            Tentar novamente
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
          >
            Voltar para o dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
