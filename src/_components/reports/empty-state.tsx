import { FileSearchIcon, LucideIcon } from "lucide-react";

import { Button } from "@/_components/ui/button";
import { Card, CardContent } from "@/_components/ui/card";

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = FileSearchIcon,
  title = "Nenhum dado encontrado",
  description = "Não há dados disponíveis para o período selecionado. Tente ajustar os filtros.",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center px-4 py-16">
        <div className="bg-muted mb-4 rounded-full p-6">
          <Icon className="text-muted-foreground h-12 w-12" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-md text-center text-sm">
          {description}
        </p>
        {actionLabel && onAction && (
          <Button onClick={onAction} variant="outline">
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
