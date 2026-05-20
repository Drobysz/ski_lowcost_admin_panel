"use client";

import { useState } from "react";
import { Badge } from "@/components/Badge";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { IconButton } from "@/components/IconButton";
import { LoadingState } from "@/components/LoadingState";
import { Pagination } from "@/components/Pagination";
import { Table } from "@/components/Table";
import {
  formatClientName,
  formatCurrency,
  formatDate,
  formatReservationStatus,
  nightsBetween,
} from "@/helper/format";
import type { Reservation } from "@/interface/reservation.interface";
import { useReservations } from "../ReservationsProvider";
import styles from "./style.module.scss";

export function ReservationsTableSection() {
  const {
    reservations,
    clients,
    rooms,
    isLoading,
    notice,
    openView,
    openEdit,
    openDelete,
  } = useReservations();
  const pageSize = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(reservations.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const visibleReservations = reservations.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  return (
    <>
      {notice ? <ErrorState message={notice.text} /> : null}
      <Table
        className={styles.table}
        columns={[
          { label: "ID" },
          { label: "Group / Guest" },
          { label: "Dates" },
          { label: "Status" },
          { label: "Total Price" },
          { label: "Actions", className: styles.actionsHead },
        ]}
        footer={
          <Pagination
            label={`Showing ${visibleReservations.length} of ${reservations.length} reservations`}
            currentPage={safePage}
            pageSize={pageSize}
            totalItems={reservations.length}
            onPageChange={setCurrentPage}
          />
        }
      >
        {isLoading ? <LoadingState rows={4} /> : null}
        {!isLoading && !visibleReservations.length ? (
          <EmptyState
            title="No reservations found"
            message="Adjust filters or create the first stay."
          />
        ) : null}
        {!isLoading
          ? visibleReservations.map((reservation) => {
              const client = clients.find(
                (item) => item.id === reservation.client_id,
              );
              const badge = formatReservationStatus(reservation.status);

              return (
                <div key={reservation.id} className={styles.row}>
                  <strong className={styles.id}>
                    #ZS-
                    <br />
                    {reservation.id}
                  </strong>
                  <div>
                    <strong>{formatClientName(client)}</strong>
                    <small>
                      {reservation.accommodations?.length ?? 1} Guests -{" "}
                      {roomsForReservation(reservation, rooms)}
                    </small>
                  </div>
                  <div>
                    <strong>
                      {formatDate(reservation.check_in)} -{" "}
                      {formatDate(reservation.check_out)}
                    </strong>
                    <small>
                      {nightsBetween(
                        reservation.check_in,
                        reservation.check_out,
                      )}{" "}
                      nights
                    </small>
                  </div>
                  <Badge tone={badge.tone}>{badge.label}</Badge>
                  <strong>{formatCurrency(reservation.total_price)}</strong>
                  <div className={styles.actions}>
                    <IconButton icon="eye" label="View reservation" onClick={() => openView(reservation)} />
                    <IconButton icon="edit" label="Edit reservation" onClick={() => openEdit(reservation)} />
                    <IconButton icon="x-circle" label="Delete reservation" onClick={() => openDelete(reservation)} />
                  </div>
                </div>
              );
            })
          : null}
      </Table>
    </>
  );
}

function roomsForReservation(
  reservation: Reservation,
  rooms: ReturnType<typeof useReservations>["rooms"],
) {
  return (
    reservation.accommodations
      ?.map((item) => rooms.find((room) => room.id === item.room_id)?.num)
      .filter(Boolean)
      .map((num) => `Room ${num}`)
      .join(", ") || "Premium Suite"
  );
}
