"use client";

import { ChevronDown, ChevronUp, TrendingUp, Utensils } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/_components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/_components/ui/collapsible";
import { Separator } from "@/_components/ui/separator";
import { formatReportDateWithWeekday } from "@/_lib/report-utils";
import { cn } from "@/_lib/utils";
import { PopularMenusReportData } from "@/_types/report";

interface PopularMenusRankingProps {
  data: PopularMenusReportData;
  className?: string;
}

/**
 * Retorna a variante do badge baseada na taxa de adesão
 * - Alta: >70% (verde)
 * - Média: 40-70% (amarelo)
 * - Baixa: <40% (vermelho)
 */
function getAdherenceBadgeVariant(
  rate: number,
): "default" | "secondary" | "destructive" {
  if (rate > 70) return "default";
  if (rate >= 40) return "secondary";
  return "destructive";
}

/**
 * Retorna o label do badge baseado na taxa de adesão
 */
function getAdherenceLabel(rate: number): string {
  if (rate > 70) return "Alta Adesão";
  if (rate >= 40) return "Média Adesão";
  return "Baixa Adesão";
}

/**
 * Componente de ranking de cardápios populares
 * Exibe os top 10 cardápios mais reservados em cards expansíveis
 *
 * @param data - Dados do relatório de cardápios populares
 * @param className - Classes CSS adicionais
 *
 * @example
 * <PopularMenusRanking data={reportData} />
 */
export function PopularMenusRanking({
  data,
  className,
}: PopularMenusRankingProps) {
  // Estado para controlar quais cards estão expandidos
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCard = (menuId: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  };

  // Pegar apenas os top 10
  const topMenus = data?.topMenus?.slice(0, 10) || [];

  if (!data || topMenus.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Ranking de Cardápios</CardTitle>
          <CardDescription>
            Nenhum cardápio encontrado no período selecionado
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <h3 className="text-lg font-semibold">
          Top 10 Cardápios Mais Reservados
        </h3>
        <p className="text-muted-foreground text-sm">
          Ranking dos cardápios com maior número de reservas no período
        </p>
      </div>

      <div className="space-y-3">
        {topMenus.map((menu, index) => {
          const isExpanded = expandedCards.has(menu.menuId);
          const adherenceBadgeVariant = getAdherenceBadgeVariant(
            menu.adherenceRate,
          );
          const adherenceLabel = getAdherenceLabel(menu.adherenceRate);

          return (
            <Collapsible
              key={menu.menuId}
              open={isExpanded}
              onOpenChange={() => toggleCard(menu.menuId)}
            >
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <div className="flex flex-1 items-start gap-3">
                      {/* Ranking Number */}
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-white",
                          index === 0 && "bg-yellow-500",
                          index === 1 && "bg-gray-400",
                          index === 2 && "bg-orange-600",
                          index > 2 && "bg-primary",
                        )}
                      >
                        {index + 1}º
                      </div>

                      {/* Menu Info */}
                      <div className="flex-1 space-y-2">
                        <div>
                          <CardTitle className="text-sm sm:text-base">
                            {formatReportDateWithWeekday(menu.date)}
                          </CardTitle>
                          <CardDescription className="mt-1 text-xs sm:text-sm">
                            {menu.summary}
                          </CardDescription>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <div className="flex items-center gap-1.5">
                            <Utensils className="text-muted-foreground h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span className="text-xs font-semibold sm:text-sm">
                              {menu.totalReservations}
                            </span>
                            <span className="text-muted-foreground text-[10px] sm:text-xs">
                              reservas
                            </span>
                          </div>

                          <Separator orientation="vertical" className="h-4" />

                          <div className="flex items-center gap-1.5">
                            <TrendingUp className="text-muted-foreground h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span className="text-xs font-semibold sm:text-sm">
                              {menu.adherenceRate.toFixed(1)}%
                            </span>
                            <span className="text-muted-foreground text-[10px] sm:text-xs">
                              adesão
                            </span>
                          </div>

                          <Badge
                            variant={adherenceBadgeVariant}
                            className="text-[10px] sm:text-xs"
                          >
                            {adherenceLabel}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Expand Button */}
                    <CollapsibleTrigger asChild>
                      <button
                        className="text-muted-foreground hover:text-foreground hover:bg-accent shrink-0 self-end rounded-md p-2 transition-colors sm:self-auto"
                        aria-label={
                          isExpanded
                            ? "Recolher composição"
                            : "Ver composição completa"
                        }
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                    </CollapsibleTrigger>
                  </div>
                </CardHeader>

                {/* Collapsible Content - Menu Composition */}
                <CollapsibleContent>
                  <CardContent className="space-y-4 pt-0">
                    <Separator />

                    {/* Variation Distribution */}
                    <div>
                      <h4 className="mb-2 text-xs font-semibold sm:text-sm">
                        Distribuição de Variações
                      </h4>
                      <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary h-3 w-3 shrink-0 rounded-full" />
                          <span className="text-xs sm:text-sm">
                            Padrão:{" "}
                            <span className="font-medium">
                              {menu.variationDistribution.standard}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 shrink-0 rounded-full bg-yellow-500" />
                          <span className="text-xs sm:text-sm">
                            Com Ovo:{" "}
                            <span className="font-medium">
                              {menu.variationDistribution.withEgg}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Menu Composition by Category */}
                    <div>
                      <h4 className="mb-3 text-xs font-semibold sm:text-sm">
                        Composição Completa
                      </h4>
                      <div className="space-y-3">
                        {menu.composition.map((category, idx) => (
                          <div
                            key={idx}
                            className="bg-muted/30 rounded-lg border p-2.5 sm:p-3"
                          >
                            <h5 className="mb-2 text-xs font-medium sm:text-sm">
                              {category.categoryName}
                            </h5>
                            <ul className="text-muted-foreground space-y-1 text-xs sm:text-sm">
                              {category.items.map((item, itemIdx) => (
                                <li key={itemIdx} className="flex items-start">
                                  <span className="mr-2">•</span>
                                  <span className="break-words">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}
