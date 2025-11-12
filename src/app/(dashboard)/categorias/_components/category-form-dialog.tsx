"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/_components/ui/dialog";
import { Category } from "@/_types/category";

interface CategoryFormDialogProps {
  category?: Category;
  onSuccess: () => void;
}

const CategoryFormDialog = ({ category }: CategoryFormDialogProps) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {category ? "Editar Categoria" : "Nova Categoria"}
        </DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <p className="text-muted-foreground text-sm">
          Formulário será implementado na tarefa 19
        </p>
      </div>
    </DialogContent>
  );
};

export default CategoryFormDialog;
