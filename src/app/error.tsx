"use client";

import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/_components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erro capturado pela página de erro:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <AlertCircle className="text-destructive h-24 w-24" />
        </div>

        <div className="space-y-2">
          <h1 className="text-destructive text-6xl font-bold">500</h1>
          <h2 className="text-2xl font-semibold">Erro no servidor</h2>
          <p className="text-muted-foreground">
            Ocorreu um erro inesperado. Por favor, tente novamente.
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
            Voltar para o início
          </Button>
        </div>
      </div>
    </div>
  );
}
