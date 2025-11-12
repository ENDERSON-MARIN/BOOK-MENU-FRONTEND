"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/_components/ui/button";
import { Dialog, DialogTrigger } from "@/_components/ui/dialog";

import MenuItemFormDialog from "./menu-item-form-dialog";

export const CreateMenuItemButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="text-white">
          <PlusIcon className="mr-2 h-4 w-4" />
          Novo Item
        </Button>
      </DialogTrigger>
      <MenuItemFormDialog onSuccess={() => setIsOpen(false)} />
    </Dialog>
  );
};
