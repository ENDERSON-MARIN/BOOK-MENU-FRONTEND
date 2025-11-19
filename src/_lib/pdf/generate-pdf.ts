"use client";

import { DocumentProps, pdf } from "@react-pdf/renderer";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import { JSXElementConstructor, ReactElement } from "react";

/**
 * Gera e faz download de um PDF a partir de um componente React PDF
 * @param component - Componente React PDF a ser renderizado
 * @param filename - Nome do arquivo (sem extensão .pdf)
 * @param onProgress - Callback opcional para acompanhar o progresso
 * @returns Promise que resolve quando o download é iniciado
 */
export async function generateAndDownloadPDF(
  component: ReactElement<
    DocumentProps,
    string | JSXElementConstructor<DocumentProps>
  >,
  filename: string,
  onProgress?: (progress: number) => void,
): Promise<void> {
  try {
    // Notificar início da geração (0%)
    onProgress?.(0);

    // Gerar o blob do PDF
    const blob = await pdf(component).toBlob();

    // Notificar progresso intermediário (70%)
    onProgress?.(70);

    // Garantir que o filename tenha a extensão .pdf
    const pdfFilename = filename.endsWith(".pdf")
      ? filename
      : `${filename}.pdf`;

    // Iniciar o download
    saveAs(blob, pdfFilename);

    // Notificar conclusão (100%)
    onProgress?.(100);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw new Error(
      "Falha ao gerar o PDF. Por favor, tente novamente ou entre em contato com o suporte.",
    );
  }
}

/**
 * Gera o nome padrão do arquivo PDF seguindo o padrão:
 * relatorio-[tipo]-[data-inicio]-[data-fim].pdf
 * @param reportType - Tipo do relatório (ex: "reservas", "cardapios-populares")
 * @param startDate - Data inicial no formato ISO (YYYY-MM-DD)
 * @param endDate - Data final no formato ISO (YYYY-MM-DD)
 * @returns Nome do arquivo formatado
 */
export function generateReportFilename(
  reportType: string,
  startDate: string,
  endDate: string,
): string {
  const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD");
  const formattedEndDate = dayjs(endDate).format("YYYY-MM-DD");

  return `relatorio-${reportType}-${formattedStartDate}-${formattedEndDate}.pdf`;
}

/**
 * Tipos de relatórios disponíveis
 */
export const REPORT_TYPES = {
  RESERVATIONS: "reservas-periodo",
  POPULAR_MENUS: "cardapios-populares",
  ACTIVE_USERS: "usuarios-ativos",
  OPERATIONAL_STATS: "estatisticas-operacionais",
  WASTE: "desperdicio-cancelamentos",
} as const;

export type ReportType = (typeof REPORT_TYPES)[keyof typeof REPORT_TYPES];
