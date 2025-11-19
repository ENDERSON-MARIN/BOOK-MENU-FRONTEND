"use client";

import { FileDownIcon, Loader2Icon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/_components/ui/dialog";

interface PDFLoadingModalProps {
  isOpen: boolean;
  progress?: number;
}

export function PDFLoadingModal({
  isOpen,
  progress = 0,
}: PDFLoadingModalProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100vw-2rem)] max-w-md sm:w-full"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-base sm:justify-start sm:text-lg">
            <FileDownIcon className="text-primary h-5 w-5 shrink-0" />
            Gerando PDF
          </DialogTitle>
          <DialogDescription className="text-center text-xs sm:text-left sm:text-sm">
            Por favor, aguarde enquanto o relatório está sendo gerado...
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center space-y-4 py-4 sm:py-6">
          <Loader2Icon className="text-primary h-10 w-10 animate-spin sm:h-12 sm:w-12" />

          {/* Progress bar */}
          <div className="w-full space-y-2">
            <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
              <div
                className="bg-primary h-full transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-muted-foreground text-center text-xs sm:text-sm">
              {progress < 30 && "Preparando dados..."}
              {progress >= 30 && progress < 70 && "Gerando documento..."}
              {progress >= 70 && progress < 100 && "Finalizando..."}
              {progress === 100 && "Concluído!"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
