"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/_components/ui/button";
import { Dialog, DialogTrigger } from "@/_components/ui/dialog";

import CategoryFormDialog from "./category-form-dialog";

export const CreateCategoryButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full text-white sm:w-auto">
          <PlusIcon className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Nova Categoria</span>
          <span className="sm:hidden">Nova</span>
        </Button>
      </DialogTrigger>
      <CategoryFormDialog onSuccess={() => setIsOpen(false)} />
    </Dialog>
  );
};
