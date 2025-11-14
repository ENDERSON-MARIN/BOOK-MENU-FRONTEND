"use client";

import { DataTable } from "@/_components/ui/data-table";
import { Skeleton } from "@/_components/ui/skeleton";
import { useGetAllReservations } from "@/_hooks/queries/use-get-all-reservations";
import { ReservationStatus } from "@/_types/reservation";

import { allReservationsTableColumns } from "./all-reservations-table-columns";

interface AllReservationsTableContentProps {
  status?: ReservationStatus;
  startDate?: string;
  endDate?: string;
  userId?: string;
}

const AllReservationsTableContent = ({
  status,
  startDate,
  endDate,
  userId,
}: AllReservationsTableContentProps) => {
  const { data: reservations, isLoading } = useGetAllReservations({
    status,
    startDate,
    endDate,
    userId,
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
    <DataTable
      columns={allReservationsTableColumns}
      data={sortedReservations}
    />
  );
};

export default AllReservationsTableContent;
