"use client";

import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { cn } from "@/_lib/utils";

interface StatCardProps {
  icon?: LucideIcon;
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  className?: string;
}

export function StatCard({
  icon: Icon,
  title,
  value,
  description,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            {title}
          </CardTitle>
          {Icon && (
            <Icon
              className="text-muted-foreground h-4 w-4"
              aria-hidden="true"
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <div className="flex items-center gap-2">
            {trend && (
              <div
                className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  trend.isPositive
                    ? "text-green-600 dark:text-green-500"
                    : "text-red-600 dark:text-red-500",
                )}
              >
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3" aria-hidden="true" />
                ) : (
                  <TrendingDown className="h-3 w-3" aria-hidden="true" />
                )}
                <span>
                  {trend.value > 0 ? "+" : ""}
                  {trend.value}%
                </span>
                {trend.label && (
                  <span className="text-muted-foreground">{trend.label}</span>
                )}
              </div>
            )}
            {description && !trend && (
              <CardDescription className="text-xs">
                {description}
              </CardDescription>
            )}
            {description && trend && (
              <span className="text-muted-foreground text-xs">
                {description}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
