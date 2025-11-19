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
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDownIcon className="text-primary h-5 w-5" />
            Gerando PDF
          </DialogTitle>
          <DialogDescription>
            Por favor, aguarde enquanto o relatório está sendo gerado...
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center space-y-4 py-6">
          <Loader2Icon className="text-primary h-12 w-12 animate-spin" />

          {/* Progress bar */}
          <div className="w-full space-y-2">
            <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
              <div
                className="bg-primary h-full transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-muted-foreground text-center text-sm">
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
