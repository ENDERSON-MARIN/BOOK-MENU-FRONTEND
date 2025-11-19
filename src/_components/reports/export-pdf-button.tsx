"use client";

import { DocumentProps } from "@react-pdf/renderer";
import { DownloadIcon } from "lucide-react";
import { JSXElementConstructor, ReactElement } from "react";

import { Button } from "@/_components/ui/button";
import { usePDFExport } from "@/_hooks/use-pdf-export";

import { PDFLoadingModal } from "./pdf-loading-modal";

interface ExportPDFButtonProps {
  /**
   * Componente React PDF a ser exportado
   */
  pdfComponent: ReactElement<
    DocumentProps,
    string | JSXElementConstructor<DocumentProps>
  >;
  /**
   * Nome do arquivo (sem extensão .pdf)
   */
  filename: string;
  /**
   * Se o botão deve estar desabilitado
   */
  disabled?: boolean;
  /**
   * Texto do botão (padrão: "Exportar PDF")
   */
  label?: string;
  /**
   * Variante do botão
   */
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  /**
   * Tamanho do botão
   */
  size?: "default" | "sm" | "lg" | "icon";
  /**
   * Callback executado após sucesso
   */
  onSuccess?: () => void;
  /**
   * Callback executado em caso de erro
   */
  onError?: (error: Error) => void;
}

/**
 * Botão reutilizável para exportar relatórios em PDF
 * Inclui modal de loading e tratamento de erros automático
 */
export function ExportPDFButton({
  pdfComponent,
  filename,
  disabled = false,
  label = "Exportar PDF",
  variant = "default",
  size = "default",
  onSuccess,
  onError,
}: ExportPDFButtonProps) {
  const { exportPDF, isGenerating, progress } = usePDFExport({
    onSuccess,
    onError,
  });

  const handleExport = async () => {
    await exportPDF(pdfComponent, filename);
  };

  return (
    <>
      <Button
        onClick={handleExport}
        disabled={disabled || isGenerating}
        variant={variant}
        size={size}
      >
        <DownloadIcon className="mr-2 h-4 w-4" />
        {isGenerating ? "Gerando..." : label}
      </Button>

      <PDFLoadingModal isOpen={isGenerating} progress={progress} />
    </>
  );
}
