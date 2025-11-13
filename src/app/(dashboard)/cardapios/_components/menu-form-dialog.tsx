"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/_components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/_components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/_components/ui/form";
import { Input } from "@/_components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/_components/ui/select";
import { Textarea } from "@/_components/ui/textarea";
import { useCreateMenu } from "@/_hooks/mutations/use-create-menu";
import { useUpdateMenu } from "@/_hooks/mutations/use-update-menu";
import { useGetCategories } from "@/_hooks/queries/use-get-categories";
import { useGetMenuItems } from "@/_hooks/queries/use-get-menu-items";
import { menuFormSchema, type MenuFormValues } from "@/_schemas/menu.schema";
import type { DayOfWeek, Menu } from "@/_types/menu";

interface MenuFormDialogProps {
  menu?: Menu;
  onSuccess: () => void;
}

const DAY_OF_WEEK_MAP: Record<number, DayOfWeek> = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
};

const DAY_OF_WEEK_LABELS: Record<DayOfWeek, string> = {
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

const MenuFormDialog = ({ menu, onSuccess }: MenuFormDialogProps) => {
  const isEditing = !!menu;
  const [selectedItems, setSelectedItems] = useState<
    Map<string, { isMainProtein: boolean; isAlternativeProtein: boolean }>
  >(new Map());

  const form = useForm<MenuFormValues>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: {
      date: menu?.date || "",
      dayOfWeek: menu?.dayOfWeek || "MONDAY",
      observations: menu?.observations || "",
      menuCompositions:
        menu?.menuCompositions?.map((comp) => ({
          menuItemId: comp.menuItemId,
          isMainProtein: comp.isMainProtein,
        })) || [],
    },
  });

  // Reset form when menu changes
  useEffect(() => {
    if (menu) {
      form.reset({
        date: menu.date,
        dayOfWeek: menu.dayOfWeek,
        observations: menu.observations || "",
        menuCompositions: menu.menuCompositions.map((comp) => ({
          menuItemId: comp.menuItemId,
          isMainProtein: comp.isMainProtein,
        })),
      });

      // Initialize selected items
      const itemsMap = new Map<
        string,
        { isMainProtein: boolean; isAlternativeProtein: boolean }
      >();
      menu.menuCompositions.forEach((comp) => {
        itemsMap.set(comp.menuItemId, {
          isMainProtein: comp.isMainProtein,
          isAlternativeProtein: false,
        });
      });
      setSelectedItems(itemsMap);
    } else {
      form.reset({
        date: "",
        dayOfWeek: "MONDAY",
        observations: "",
        menuCompositions: [],
      });
      setSelectedItems(new Map());
    }
  }, [menu, form]);

  const { data: categories } = useGetCategories({ isActive: true });
  const { data: menuItems } = useGetMenuItems({ isActive: true });

  const { mutate: createMenu, isPending: isCreating } = useCreateMenu();
  const { mutate: updateMenu, isPending: isUpdating } = useUpdateMenu();

  const isPending = isCreating || isUpdating;

  // Auto-fill day of week when date changes
  const handleDateChange = (date: string) => {
    if (date) {
      const dayIndex = dayjs(date).day();
      const dayOfWeek = DAY_OF_WEEK_MAP[dayIndex];
      form.setValue("dayOfWeek", dayOfWeek);
    }
  };

  // Group menu items by category
  const itemsByCategory = useMemo(() => {
    if (!menuItems || !categories) return {};

    const grouped: Record<string, typeof menuItems> = {};
    categories.forEach((category) => {
      grouped[category.id] = menuItems.filter(
        (item) => item.categoryId === category.id,
      );
    });
    return grouped;
  }, [menuItems, categories]);

  // Toggle item selection
  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) => {
      const newMap = new Map(prev);
      if (newMap.has(itemId)) {
        newMap.delete(itemId);
      } else {
        newMap.set(itemId, {
          isMainProtein: false,
          isAlternativeProtein: false,
        });
      }

      // Update form field
      const compositions = Array.from(newMap.entries()).map(
        ([menuItemId, { isMainProtein }]) => ({
          menuItemId,
          isMainProtein,
        }),
      );
      form.setValue("menuCompositions", compositions);

      return newMap;
    });
  };

  // Toggle main protein
  const toggleMainProtein = (itemId: string) => {
    setSelectedItems((prev) => {
      const newMap = new Map(prev);
      const item = newMap.get(itemId);
      if (item) {
        // If setting as main protein, unset alternative protein
        newMap.set(itemId, {
          isMainProtein: !item.isMainProtein,
          isAlternativeProtein: item.isMainProtein
            ? item.isAlternativeProtein
            : false,
        });
      }

      // Update form field
      const compositions = Array.from(newMap.entries()).map(
        ([menuItemId, { isMainProtein }]) => ({
          menuItemId,
          isMainProtein,
        }),
      );
      form.setValue("menuCompositions", compositions);

      return newMap;
    });
  };

  // Toggle alternative protein
  const toggleAlternativeProtein = (itemId: string) => {
    setSelectedItems((prev) => {
      const newMap = new Map(prev);
      const item = newMap.get(itemId);
      if (item) {
        // If setting as alternative protein, unset main protein
        newMap.set(itemId, {
          isMainProtein: item.isAlternativeProtein ? item.isMainProtein : false,
          isAlternativeProtein: !item.isAlternativeProtein,
        });
      }

      // Update form field
      const compositions = Array.from(newMap.entries()).map(
        ([menuItemId, { isMainProtein }]) => ({
          menuItemId,
          isMainProtein,
        }),
      );
      form.setValue("menuCompositions", compositions);

      return newMap;
    });
  };

  const onSubmit = async (data: MenuFormValues) => {
    try {
      console.log("Form submitted with data:", data);
      console.log("Form errors:", form.formState.errors);

      // Convert date to ISO format with timezone
      const dateISO = dayjs(data.date).toISOString();

      // Build menuItems array in the format expected by the API
      const menuItemsPayload = Array.from(selectedItems.entries()).map(
        ([menuItemId, { isMainProtein, isAlternativeProtein }]) => ({
          menuItemId,
          isMainProtein,
          isAlternativeProtein,
        }),
      );

      const payload = {
        date: dateISO,
        observations: data.observations || undefined,
        menuItems: menuItemsPayload,
      };

      console.log("Payload to send:", payload);

      if (isEditing) {
        updateMenu(
          {
            id: menu.id,
            data: payload,
          },
          {
            onSuccess: () => {
              toast.success("Cardápio atualizado com sucesso.");
              onSuccess();
            },
            onError: (error: Error) => {
              console.error("Error updating menu:", error);
              const errorMessage =
                error?.message || "Erro ao atualizar cardápio.";
              toast.error(errorMessage);
            },
          },
        );
      } else {
        createMenu(payload, {
          onSuccess: () => {
            toast.success("Cardápio criado com sucesso.");
            form.reset();
            setSelectedItems(new Map());
            onSuccess();
          },
          onError: (error: Error) => {
            console.error("Error creating menu:", error);
            const errorMessage = error?.message || "Erro ao criar cardápio.";
            toast.error(errorMessage);
          },
        });
      }
    } catch (error) {
      console.error("Unexpected error in onSubmit:", error);
      toast.error("Erro inesperado ao processar o formulário.");
    }
  };

  // Get minimum date (tomorrow)
  const minDate = dayjs().add(1, "day").format("YYYY-MM-DD");

  return (
    <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Editar Cardápio" : "Novo Cardápio"}
        </DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Atualize as informações do cardápio abaixo."
            : "Preencha os campos abaixo para criar um novo cardápio."}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="date"
                        min={minDate}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleDateChange(e.target.value);
                        }}
                        disabled={isPending}
                        className="w-full"
                      />
                      <CalendarIcon className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dayOfWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dia da Semana</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o dia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(DAY_OF_WEEK_LABELS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="observations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações (opcional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Adicione observações sobre o cardápio..."
                    rows={3}
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Menu Items Selection */}
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-medium">
                Itens do Cardápio
                <span className="text-muted-foreground ml-2 text-xs">
                  ({selectedItems.size} selecionado
                  {selectedItems.size !== 1 ? "s" : ""})
                </span>
              </h3>
              <p className="text-muted-foreground text-xs">
                Selecione os itens que farão parte do cardápio e marque a
                proteína principal e/ou alternativa.
              </p>
            </div>

            <div className="space-y-4">
              {categories?.map((category) => {
                const items = itemsByCategory[category.id] || [];
                if (items.length === 0) return null;

                return (
                  <div
                    key={category.id}
                    className="space-y-2 rounded-lg border p-4"
                  >
                    <h4 className="text-sm font-medium">{category.name}</h4>
                    <div className="space-y-2">
                      {items.map((item) => {
                        const isSelected = selectedItems.has(item.id);
                        const itemData = selectedItems.get(item.id);
                        const isMainProtein = itemData?.isMainProtein || false;
                        const isAlternativeProtein =
                          itemData?.isAlternativeProtein || false;

                        return (
                          <div
                            key={item.id}
                            className="hover:bg-muted/50 flex items-center gap-3 rounded-md border p-3 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleItemSelection(item.id)}
                              disabled={isPending}
                              className="size-4 cursor-pointer"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{item.name}</p>
                              {item.description && (
                                <p className="text-muted-foreground text-xs">
                                  {item.description}
                                </p>
                              )}
                            </div>
                            {isSelected && (
                              <div className="flex gap-3">
                                <label className="flex items-center gap-2 text-xs">
                                  <input
                                    type="checkbox"
                                    checked={isMainProtein}
                                    onChange={() => toggleMainProtein(item.id)}
                                    disabled={isPending}
                                    className="size-3 cursor-pointer"
                                  />
                                  <span className="text-muted-foreground">
                                    Proteína principal
                                  </span>
                                </label>
                                <label className="flex items-center gap-2 text-xs">
                                  <input
                                    type="checkbox"
                                    checked={isAlternativeProtein}
                                    onChange={() =>
                                      toggleAlternativeProtein(item.id)
                                    }
                                    disabled={isPending}
                                    className="size-3 cursor-pointer"
                                  />
                                  <span className="text-muted-foreground">
                                    Proteína alternativa
                                  </span>
                                </label>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          {selectedItems.size > 0 && (
            <div className="bg-muted/50 rounded-lg border p-4">
              <h4 className="mb-2 text-sm font-medium">
                Preview da Composição
              </h4>
              <div className="space-y-2">
                {Array.from(selectedItems.entries()).map(
                  ([itemId, { isMainProtein, isAlternativeProtein }]) => {
                    const item = menuItems?.find((i) => i.id === itemId);
                    const category = categories?.find(
                      (c) => c.id === item?.categoryId,
                    );
                    if (!item) return null;

                    return (
                      <div
                        key={itemId}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="text-muted-foreground">
                          {category?.name}:
                        </span>
                        <span className="font-medium">{item.name}</span>
                        {isMainProtein && (
                          <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                            Proteína Principal
                          </span>
                        )}
                        {isAlternativeProtein && (
                          <span className="bg-secondary/10 text-secondary-foreground rounded-full px-2 py-0.5 text-xs">
                            Proteína Alternativa
                          </span>
                        )}
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              className="w-full text-white sm:w-auto"
              type="submit"
              disabled={isPending || selectedItems.size === 0}
            >
              {isPending
                ? isEditing
                  ? "Atualizando..."
                  : "Criando..."
                : isEditing
                  ? "Atualizar"
                  : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default MenuFormDialog;
