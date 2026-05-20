"use client";

import { AdminPageHeader } from "@/components/AdminPageHeader";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { useReservations } from "../ReservationsProvider";

export function ReservationsHeader() {
  const { openCreate } = useReservations();

  return (
    <AdminPageHeader
      title="Reservations"
      subtitle="Manage guest stays, group bookings, and alpine schedules."
      action={
        <Button onClick={openCreate}>
          <Icon name="plus" />
          Create Reservation
        </Button>
      }
    />
  );
}
