"use client";

import { DataTable } from "@/_components/ui/data-table";
import { Skeleton } from "@/_components/ui/skeleton";
import { useGetAllReservations } from "@/_hooks/queries/use-get-all-reservations";
import { useGetMyReservations } from "@/_hooks/queries/use-get-my-reservations";
import { useAuth } from "@/_hooks/use-auth";
import { ReservationStatus } from "@/_types/reservation";

import {
  adminReservationsTableColumns,
  myReservationsTableColumns,
} from "./table-columns";

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
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  // Admin sees all reservations, users see only their own
  const { data: myReservations, isLoading: isLoadingMy } = useGetMyReservations(
    {
      status,
      startDate,
      endDate,
    },
    {
      enabled: !isAdmin,
    },
  );

  const { data: allReservations, isLoading: isLoadingAll } =
    useGetAllReservations(
      {
        status,
        startDate,
        endDate,
      },
      {
        enabled: isAdmin,
      },
    );

  const isLoading = isAdmin ? isLoadingAll : isLoadingMy;
  const reservations = isAdmin ? allReservations : myReservations;
  const columns = isAdmin
    ? adminReservationsTableColumns
    : myReservationsTableColumns;

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

  return <DataTable columns={columns} data={sortedReservations} />;
};

export default MyReservationsTableContent;
