"use client";

import { Component, ReactNode } from "react";

import { Button } from "@/_components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error Boundary capturou um erro:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="w-full max-w-md space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-destructive text-4xl font-bold">Ops!</h1>
              <h2 className="text-2xl font-semibold">Algo deu errado</h2>
              <p className="text-muted-foreground">
                Ocorreu um erro inesperado. Por favor, tente novamente.
              </p>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-4 text-left">
                <p className="text-destructive font-mono text-sm">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button onClick={this.handleReset} variant="default">
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

    return this.props.children;
  }
}

export default ErrorBoundary;
