"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/_components/ui/button";
import { Dialog, DialogTrigger } from "@/_components/ui/dialog";
import { useAuth } from "@/_hooks/use-auth";

import MenuFormDialog from "./menu-form-dialog";

export const CreateMenuButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  if (user?.role !== "ADMIN") {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="text-white">
          <PlusIcon className="mr-2 h-4 w-4" />
          Novo Cardápio
        </Button>
      </DialogTrigger>
      <MenuFormDialog onSuccess={() => setIsOpen(false)} />
    </Dialog>
  );
};
