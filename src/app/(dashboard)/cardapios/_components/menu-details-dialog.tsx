"use client";

import { CalendarIcon, ClockIcon, InfoIcon, Loader2Icon } from "lucide-react";
import { useMemo } from "react";

import { Badge } from "@/_components/ui/badge";
import { Button } from "@/_components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/_components/ui/dialog";
import { Separator } from "@/_components/ui/separator";
import { useGetMenuItems } from "@/_hooks/queries/use-get-menu-items";
import { useAuth } from "@/_hooks/use-auth";
import { formatDateBR, isBeforeCutoffTime } from "@/_lib/date-utils";
import type { Menu } from "@/_types/menu";

interface MenuDetailsDialogProps {
  menu: Menu;
  onReserve?: () => void;
  hasReservation?: boolean;
}

const DAY_OF_WEEK_LABELS: Record<string, string> = {
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

const MenuDetailsDialog = ({
  menu,
  onReserve,
  hasReservation = false,
}: MenuDetailsDialogProps) => {
  const { user } = useAuth();
  const isUser = user?.role === "USER";

  // Fetch all menu items to populate the compositions (only works for admins)
  const { data: allMenuItems } = useGetMenuItems();

  // Use menu prop directly since API doesn't return relations
  const menuData = menu;

  // Don't show loading since users might not have permission to fetch menu items
  const isLoading = false;

  // Enrich menu compositions with menu item data
  const enrichedCompositions = useMemo(() => {
    if (!menuData.menuCompositions) {
      return [];
    }

    // If allMenuItems is not loaded yet, still show compositions
    // They will show "Carregando..." until items are loaded
    if (!allMenuItems) {
      return menuData.menuCompositions;
    }

    return menuData.menuCompositions.map((composition) => {
      // If menuItem is already populated, use it
      if (composition.menuItem && composition.menuItem.name) {
        return composition;
      }

      // Otherwise, find the menuItem from allMenuItems
      const menuItem = allMenuItems.find(
        (item) => item.id === composition.menuItemId,
      );

      return {
        ...composition,
        menuItem: menuItem || composition.menuItem,
      };
    });
  }, [menuData.menuCompositions, allMenuItems]);

  // Group menu items by category
  const itemsByCategory = useMemo(() => {
    const grouped: Record<string, typeof enrichedCompositions> = {};

    if (!enrichedCompositions || enrichedCompositions.length === 0) {
      return grouped;
    }

    enrichedCompositions.forEach((composition) => {
      const categoryName = composition.menuItem?.category?.name || "Outros";
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(composition);
    });

    return grouped;
  }, [enrichedCompositions]);

  // Sort categories by display order
  const sortedCategories = useMemo(() => {
    if (!enrichedCompositions || enrichedCompositions.length === 0) {
      return [];
    }

    const categories = Object.keys(itemsByCategory);

    return categories.sort((a, b) => {
      const categoryA = enrichedCompositions.find(
        (c) => c.menuItem?.category?.name === a,
      )?.menuItem?.category;
      const categoryB = enrichedCompositions.find(
        (c) => c.menuItem?.category?.name === b,
      )?.menuItem?.category;

      return (
        (categoryA?.displayOrder || 999) - (categoryB?.displayOrder || 999)
      );
    });
  }, [itemsByCategory, enrichedCompositions]);

  // Format date
  const formattedDate = formatDateBR(menuData.date);
  const dayOfWeek =
    DAY_OF_WEEK_LABELS[menuData.dayOfWeek] || menuData.dayOfWeek;

  // Check if reservation deadline has passed (8:30 AM)
  const isBeforeCutoff = useMemo(() => {
    return isBeforeCutoffTime(menuData.date);
  }, [menuData.date]);

  return (
    <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Detalhes do Cardápio</DialogTitle>
        <DialogDescription>
          Visualize a composição completa do cardápio e as variações
          disponíveis.
        </DialogDescription>
      </DialogHeader>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2Icon className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Date and Day of Week */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="text-muted-foreground h-4 w-4" />
              <span className="text-sm font-medium">{formattedDate}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <ClockIcon className="text-muted-foreground h-4 w-4" />
              <span className="text-muted-foreground text-sm">{dayOfWeek}</span>
            </div>
          </div>

          {/* Observations */}
          {menuData.observations && (
            <div className="bg-muted/50 rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2">
                <InfoIcon className="text-muted-foreground h-4 w-4" />
                <h3 className="text-sm font-medium">Observações</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                {menuData.observations}
              </p>
            </div>
          )}

          {/* Menu Composition by Category */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Composição do Cardápio</h3>
            {!menuData.menuCompositions ||
            menuData.menuCompositions.length === 0 ? (
              <div className="bg-muted/50 rounded-lg border p-4">
                <p className="text-muted-foreground text-sm">
                  Nenhum item cadastrado neste cardápio.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedCategories.map((categoryName) => {
                  const items = itemsByCategory[categoryName];
                  return (
                    <div key={categoryName} className="space-y-2">
                      <h4 className="text-muted-foreground text-xs font-medium uppercase">
                        {categoryName}
                      </h4>
                      <div className="space-y-2">
                        {items.map(
                          (composition: Menu["menuCompositions"][0]) => (
                            <div
                              key={composition.id}
                              className="flex items-start gap-3 rounded-lg border p-3"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium">
                                    {composition.menuItem?.name ||
                                      "Item do cardápio"}
                                  </p>
                                  {composition.isMainProtein && (
                                    <Badge
                                      variant="default"
                                      className="text-xs text-white"
                                    >
                                      Proteína Principal
                                    </Badge>
                                  )}
                                  {composition.isAlternativeProtein && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs text-white"
                                    >
                                      Proteína Alternativa
                                    </Badge>
                                  )}
                                </div>
                                {composition.menuItem?.description && (
                                  <p className="text-muted-foreground mt-1 text-xs">
                                    {composition.menuItem.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Menu Variations */}
          {menuData.variations && menuData.variations.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Variações Disponíveis</h3>
              <div className="space-y-2">
                {menuData.variations.map((variation) => {
                  const variationTypeLabels = {
                    STANDARD: "Padrão",
                    EGG_SUBSTITUTE: "Substituto de Ovo",
                    VEGETARIAN: "Vegetariano",
                  };

                  const proteinItem = allMenuItems?.find(
                    (item) => item.id === variation.proteinItemId,
                  );

                  return (
                    <div key={variation.id} className="rounded-lg border p-3">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">
                          {variationTypeLabels[variation.variationType] ||
                            variation.variationType}
                        </p>
                        {variation.isDefault && (
                          <Badge
                            variant="default"
                            className="text-xs text-white"
                          >
                            Padrão
                          </Badge>
                        )}
                      </div>
                      {proteinItem && (
                        <p className="text-muted-foreground mt-1 text-xs">
                          Proteína: {proteinItem.name}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reservation Status for Users */}
          {isUser && hasReservation && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/20">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                ✓ Você já possui uma reserva para este cardápio
              </p>
            </div>
          )}

          {/* Cutoff Time Warning */}
          {isUser && !hasReservation && !isBeforeCutoff && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950/20">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                ⚠ Prazo para reservas encerrado (até 8:30 AM)
              </p>
            </div>
          )}
        </div>
      )}

      <DialogFooter>
        {!isLoading &&
          isUser &&
          !hasReservation &&
          isBeforeCutoff &&
          onReserve && (
            <Button onClick={onReserve} className="w-full text-white sm:w-auto">
              Fazer Reserva
            </Button>
          )}
      </DialogFooter>
    </DialogContent>
  );
};

export default MenuDetailsDialog;
