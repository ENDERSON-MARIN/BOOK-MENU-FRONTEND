"use client";

import { DocumentProps } from "@react-pdf/renderer";
import { JSXElementConstructor, ReactElement, useState } from "react";
import { toast } from "sonner";

import { generateAndDownloadPDF } from "@/_lib/pdf/generate-pdf";

interface UsePDFExportOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function usePDFExport(options?: UsePDFExportOptions) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const exportPDF = async (
    component: ReactElement<
      DocumentProps,
      string | JSXElementConstructor<DocumentProps>
    >,
    filename: string,
  ) => {
    try {
      setIsGenerating(true);
      setProgress(0);

      await generateAndDownloadPDF(component, filename, (newProgress) => {
        setProgress(newProgress);
      });

      // Pequeno delay para mostrar o progresso completo
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.success("PDF gerado com sucesso!");
      options?.onSuccess?.();
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao gerar PDF. Tente novamente.";
      toast.error(errorMessage);
      options?.onError?.(
        error instanceof Error ? error : new Error(errorMessage),
      );
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return {
    exportPDF,
    isGenerating,
    progress,
  };
}
