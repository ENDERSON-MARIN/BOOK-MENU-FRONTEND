"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { CalendarIcon, CheckIcon, PlusIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

dayjs.extend(utc);

import { Button } from "@/_components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/_components/ui/command";
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
import { LoadingButton } from "@/_components/ui/loading-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/_components/ui/popover";
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
import { logger } from "@/_lib/logger";
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
  const [openPopover, setOpenPopover] = useState(false);

  const form = useForm<MenuFormValues>({
    resolver: zodResolver(menuFormSchema),
    mode: "onChange",
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

  const { data: categories } = useGetCategories({ isActive: true });
  const { data: menuItems } = useGetMenuItems({ isActive: true });

  // Reset form when menu changes
  useEffect(() => {
    if (menu && menuItems) {
      // Filter out inactive items when editing
      const activeCompositions = menu.menuCompositions.filter((comp) => {
        const item = menuItems.find((i) => i.id === comp.menuItemId);
        return item && item.isActive;
      });

      // Convert ISO date to YYYY-MM-DD format for input type="date"
      const formattedDate = menu.date
        ? dayjs.utc(menu.date).format("YYYY-MM-DD")
        : "";

      form.reset({
        date: formattedDate,
        dayOfWeek: menu.dayOfWeek,
        observations: menu.observations || "",
        menuCompositions: activeCompositions.map((comp) => ({
          menuItemId: comp.menuItemId,
          isMainProtein: comp.isMainProtein,
        })),
      });

      // Initialize selected items (only active ones)
      const itemsMap = new Map<
        string,
        { isMainProtein: boolean; isAlternativeProtein: boolean }
      >();
      activeCompositions.forEach((comp) => {
        itemsMap.set(comp.menuItemId, {
          isMainProtein: comp.isMainProtein,
          isAlternativeProtein: comp.isAlternativeProtein || false,
        });
      });

      setSelectedItems(itemsMap);

      // Show warning if some items were filtered out
      const inactiveCount =
        menu.menuCompositions.length - activeCompositions.length;
      if (inactiveCount > 0) {
        toast.warning(
          `${inactiveCount} ${inactiveCount === 1 ? "item inativo foi removido" : "itens inativos foram removidos"} do cardápio.`,
        );
      }
    } else if (!menu) {
      form.reset({
        date: "",
        dayOfWeek: "MONDAY",
        observations: "",
        menuCompositions: [],
      });
      setSelectedItems(new Map());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu, menuItems]);

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

  // Group menu items by category (only active items)
  const itemsByCategory = useMemo(() => {
    if (!menuItems || !categories) return {};

    const grouped: Record<string, typeof menuItems> = {};
    categories.forEach((category) => {
      grouped[category.id] = menuItems.filter(
        (item) => item.categoryId === category.id && item.isActive,
      );
    });
    return grouped;
  }, [menuItems, categories]);

  // Add item to selection
  const addItem = useCallback(
    (itemId: string) => {
      setSelectedItems((prev) => {
        const newMap = new Map(prev);
        if (!newMap.has(itemId)) {
          newMap.set(itemId, {
            isMainProtein: false,
            isAlternativeProtein: false,
          });

          // Update form field
          const compositions = Array.from(newMap.entries()).map(
            ([menuItemId, { isMainProtein }]) => ({
              menuItemId,
              isMainProtein,
            }),
          );
          form.setValue("menuCompositions", compositions, {
            shouldValidate: true,
          });
        }
        return newMap;
      });
      setOpenPopover(false);
    },
    [form],
  );

  // Remove item from selection
  const removeItem = useCallback(
    (itemId: string) => {
      setSelectedItems((prev) => {
        const newMap = new Map(prev);
        newMap.delete(itemId);

        // Update form field
        const compositions = Array.from(newMap.entries()).map(
          ([menuItemId, { isMainProtein }]) => ({
            menuItemId,
            isMainProtein,
          }),
        );
        form.setValue("menuCompositions", compositions, {
          shouldValidate: true,
        });

        return newMap;
      });
    },
    [form],
  );

  // Toggle main protein
  const toggleMainProtein = useCallback(
    (itemId: string) => {
      setSelectedItems((prev) => {
        const newMap = new Map(prev);
        const item = newMap.get(itemId);
        if (item) {
          const newValue = !item.isMainProtein;

          // If setting as main protein, unset alternative protein
          newMap.set(itemId, {
            isMainProtein: newValue,
            isAlternativeProtein: newValue ? false : item.isAlternativeProtein,
          });
        }

        // Update form field
        const compositions = Array.from(newMap.entries()).map(
          ([menuItemId, { isMainProtein }]) => ({
            menuItemId,
            isMainProtein,
          }),
        );
        form.setValue("menuCompositions", compositions, {
          shouldValidate: true,
        });

        return newMap;
      });
    },
    [form],
  );

  // Toggle alternative protein
  const toggleAlternativeProtein = useCallback(
    (itemId: string) => {
      setSelectedItems((prev) => {
        const newMap = new Map(prev);
        const item = newMap.get(itemId);
        if (item) {
          const newValue = !item.isAlternativeProtein;

          // If setting as alternative protein, unset main protein
          newMap.set(itemId, {
            isMainProtein: newValue ? false : item.isMainProtein,
            isAlternativeProtein: newValue,
          });
        }

        // Update form field
        const compositions = Array.from(newMap.entries()).map(
          ([menuItemId, { isMainProtein }]) => ({
            menuItemId,
            isMainProtein,
          }),
        );
        form.setValue("menuCompositions", compositions, {
          shouldValidate: true,
        });

        return newMap;
      });
    },
    [form],
  );

  const onSubmit = async (data: MenuFormValues) => {
    try {
      // Validate that all selected items are active
      const inactiveItems: string[] = [];
      selectedItems.forEach((_, itemId) => {
        const item = menuItems?.find((i) => i.id === itemId);
        if (!item || !item.isActive) {
          inactiveItems.push(item?.name || itemId);
        }
      });

      if (inactiveItems.length > 0) {
        toast.error(
          `Os seguintes itens estão inativos e não podem ser adicionados: ${inactiveItems.join(", ")}`,
        );
        return;
      }

      // Build menuItems array in the format expected by the API
      const menuItemsPayload = Array.from(selectedItems.entries()).map(
        ([menuItemId, { isMainProtein, isAlternativeProtein }]) => {
          const payload: {
            menuItemId: string;
            isMainProtein: boolean;
            isAlternativeProtein: boolean;
            observations?: string;
          } = {
            menuItemId,
            isMainProtein: isMainProtein ?? false,
            isAlternativeProtein: isAlternativeProtein ?? false,
          };

          // Only include observations if it exists (for future use)
          // Currently we don't have per-item observations in the UI

          return payload;
        },
      );

      if (isEditing) {
        // For PUT (edit), API expects observations and menuItems
        const updatePayload = {
          observations: data.observations || undefined,
          menuItems: Array.from(selectedItems.entries()).map(
            ([menuItemId, { isMainProtein, isAlternativeProtein }]) => ({
              menuItemId,
              isMainProtein: isMainProtein ?? false,
              isAlternativeProtein: isAlternativeProtein ?? false,
            }),
          ),
        };

        updateMenu(
          {
            id: menu.id,
            data: updatePayload,
          },
          {
            onSuccess: () => {
              toast.success("Cardápio atualizado com sucesso.");
              // The queries will be refetched automatically by the mutation hook
              onSuccess();
            },
            onError: (error: Error) => {
              logger.error("Error updating menu:", error);
              let errorMessage =
                error?.message || "Erro ao atualizar cardápio.";

              // Check if it's a 404 error
              if (
                errorMessage.includes("404") ||
                errorMessage.includes("Not Found")
              ) {
                errorMessage =
                  "Cardápio não encontrado. Ele pode ter sido deletado.";
              }

              toast.error(errorMessage);
            },
          },
        );
      } else {
        // For POST (create), API expects date, observations and menuItems
        const dateISO = dayjs.utc(data.date).startOf("day").toISOString();

        const createPayload = {
          date: dateISO,
          observations: data.observations || undefined,
          menuItems: menuItemsPayload,
        };

        createMenu(createPayload, {
          onSuccess: () => {
            toast.success("Cardápio criado com sucesso.");
            form.reset();
            setSelectedItems(new Map());
            onSuccess();
          },
          onError: (error: Error) => {
            logger.error("Error creating menu:", error);
            const errorMessage = error?.message || "Erro ao criar cardápio.";
            toast.error(errorMessage);
          },
        });
      }
    } catch (error) {
      logger.error("Unexpected error in onSubmit:", error);
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
                        disabled={isPending || isEditing}
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
                Adicione itens ao cardápio e configure as proteínas.
              </p>
            </div>

            {/* Selected Items Display */}
            {selectedItems.size > 0 && (
              <div className="space-y-3 rounded-lg border p-4">
                {categories?.map((category) => {
                  const categoryItems = Array.from(selectedItems.keys())
                    .map((id) => menuItems?.find((item) => item.id === id))
                    .filter((item) => item && item.categoryId === category.id);

                  if (categoryItems.length === 0) return null;

                  return (
                    <div key={category.id} className="space-y-2">
                      <h4 className="text-muted-foreground text-xs font-medium">
                        {category.name}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {categoryItems.map((item) => {
                          if (!item) return null;
                          const itemData = selectedItems.get(item.id);
                          const isMainProtein =
                            itemData?.isMainProtein || false;
                          const isAlternativeProtein =
                            itemData?.isAlternativeProtein || false;

                          return (
                            <div
                              key={item.id}
                              className="bg-background flex items-center gap-2 rounded-md border p-2"
                            >
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">
                                    {item.name}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5"
                                    onClick={() => removeItem(item.id)}
                                    disabled={isPending}
                                  >
                                    <XIcon className="h-3 w-3" />
                                  </Button>
                                </div>
                                {category.name.toLowerCase() === "proteína" && (
                                  <div className="flex gap-2">
                                    <Button
                                      type="button"
                                      variant={
                                        isMainProtein ? "default" : "outline"
                                      }
                                      size="sm"
                                      className="h-6 text-xs"
                                      onClick={() => toggleMainProtein(item.id)}
                                      disabled={isPending}
                                    >
                                      {isMainProtein && (
                                        <CheckIcon className="mr-1 h-3 w-3" />
                                      )}
                                      Principal
                                    </Button>
                                    <Button
                                      type="button"
                                      variant={
                                        isAlternativeProtein
                                          ? "default"
                                          : "outline"
                                      }
                                      size="sm"
                                      className="h-6 text-xs"
                                      onClick={() =>
                                        toggleAlternativeProtein(item.id)
                                      }
                                      disabled={isPending}
                                    >
                                      {isAlternativeProtein && (
                                        <CheckIcon className="mr-1 h-3 w-3" />
                                      )}
                                      Alternativa
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add Items Popover */}
            <Popover open={openPopover} onOpenChange={setOpenPopover}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={isPending}
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Adicionar Itens
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Buscar item..." />
                  <CommandList>
                    <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                    {categories?.map((category) => {
                      const items = itemsByCategory[category.id] || [];
                      const availableItems = items.filter(
                        (item) => !selectedItems.has(item.id),
                      );

                      if (availableItems.length === 0) return null;

                      return (
                        <CommandGroup key={category.id} heading={category.name}>
                          {availableItems.map((item) => (
                            <CommandItem
                              key={item.id}
                              value={`${item.name} ${item.description || ""}`}
                              onSelect={() => addItem(item.id)}
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">{item.name}</span>
                                {item.description && (
                                  <span className="text-muted-foreground text-xs">
                                    {item.description}
                                  </span>
                                )}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      );
                    })}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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
            <LoadingButton
              className="w-full text-white"
              type="submit"
              disabled={
                selectedItems.size === 0 || isPending || !form.formState.isValid
              }
              isLoading={isPending}
              loadingText={isEditing ? "Atualizando..." : "Criando..."}
            >
              {isEditing ? "Atualizar" : "Criar"}
            </LoadingButton>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default MenuFormDialog;
