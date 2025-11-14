"use client";

import { DataTable } from "@/_components/ui/data-table";
import { Skeleton } from "@/_components/ui/skeleton";
import { useGetMyReservations } from "@/_hooks/queries/use-get-my-reservations";
import { ReservationStatus } from "@/_types/reservation";

import { myReservationsTableColumns } from "./table-columns";

interface MyReservationsTableContentProps {
  status?: ReservationStatus;
  startDate?: string;
  endDate?: string;
}

const MyReservationsTableContent = ({
  status,
  startDate,
  endDate,
}: MyReservationsTableContentProps) => {
  const { data: reservations, isLoading } = useGetMyReservations({
    status,
    startDate,
    endDate,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Sort reservations by date (most recent first)
  const sortedReservations = [...(reservations || [])].sort((a, b) => {
    return (
      new Date(b.reservationDate).getTime() -
      new Date(a.reservationDate).getTime()
    );
  });

  return (
    <DataTable columns={myReservationsTableColumns} data={sortedReservations} />
  );
};

export default MyReservationsTableContent;
