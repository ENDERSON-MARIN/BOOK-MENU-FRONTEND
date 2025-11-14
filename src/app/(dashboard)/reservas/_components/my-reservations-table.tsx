"use client";

import { useState } from "react";

import { Button } from "@/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { Label } from "@/_components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/_components/ui/select";
import { ReservationStatus } from "@/_types/reservation";

import MyReservationsTableContent from "./my-reservations-table-content";

const MyReservationsTable = () => {
  const [status, setStatus] = useState<ReservationStatus | undefined>(
    undefined,
  );
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleClearFilters = () => {
    setStatus(undefined);
    setStartDate("");
    setEndDate("");
  };

  const hasActiveFilters = status !== undefined || startDate || endDate;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select
                value={status || "all"}
                onValueChange={(value) =>
                  setStatus(
                    value === "all" ? undefined : (value as ReservationStatus),
                  )
                }
              >
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="ACTIVE">Ativa</SelectItem>
                  <SelectItem value="CANCELLED">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-date-filter">Data Inicial</Label>
              <input
                id="start-date-filter"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date-filter">Data Final</Label>
              <input
                id="end-date-filter"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex justify-end">
              <Button variant="outline" onClick={handleClearFilters}>
                Limpar Filtros
              </Button>
            </div>
          )}
        </div>
      </CardContent>

      <CardContent>
        <MyReservationsTableContent
          status={status}
          startDate={startDate}
          endDate={endDate}
        />
      </CardContent>
    </Card>
  );
};

export default MyReservationsTable;
