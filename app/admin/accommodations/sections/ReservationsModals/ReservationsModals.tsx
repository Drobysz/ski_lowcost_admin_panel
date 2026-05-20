"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import { ErrorState } from "@/components/ErrorState";
import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { Select } from "@/components/Select";
import { dateTimeLocal } from "@/helper/format";
import type { Reservation } from "@/interface/reservation.interface";
import { useReservations } from "../ReservationsProvider";
import styles from "./style.module.scss";
import type { ReservationFormProps } from "./ReservationsModals.props";

export function ReservationsModals() {
  const {
    modal,
    closeModal,
    saveModal,
    deleteModalRecord,
    clients,
    rooms,
  } = useReservations();
  const [error, setError] = useState("");

  if (!modal) {
    return null;
  }

  const isReadOnly = modal.mode === "view";
  const isDelete = modal.mode === "delete";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      await saveModal(event.currentTarget);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save this reservation.",
      );
    }
  }

  return (
    <Modal
      isOpen
      eyebrow="reservation"
      title={`${modal.mode} reservation`}
      isDismissible={!isDelete}
      onClose={closeModal}
      onSubmit={isDelete ? undefined : onSubmit}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={closeModal}>
            Close
          </Button>
          {isDelete ? (
            <Button type="button" variant="danger" onClick={deleteModalRecord}>
              Delete
            </Button>
          ) : null}
          {!isReadOnly && !isDelete ? <Button type="submit">Save changes</Button> : null}
        </>
      }
    >
      {error ? <ErrorState message={error} /> : null}
      {isDelete ? (
        <p className={styles.confirm}>
          Confirm deletion for this reservation. This action cannot be undone.
        </p>
      ) : (
        <ReservationForm
          record={modal.record as Reservation | undefined}
          readOnly={isReadOnly}
          clients={clients}
          rooms={rooms}
        />
      )}
    </Modal>
  );
}

function ReservationForm({
  record,
  readOnly,
  clients,
  rooms,
}: ReservationFormProps) {
  const initialAccommodations = record?.accommodations?.length
    ? record.accommodations
    : [{ room_id: rooms[0]?.id ?? null, client_id: record?.client_id ?? clients[0]?.id ?? 1 }];
  const [accommodationCount, setAccommodationCount] = useState(
    initialAccommodations.length,
  );
  const accommodations = Array.from({ length: accommodationCount }).map(
    (_, index) =>
      initialAccommodations[index] ?? {
        room_id: initialAccommodations[0]?.room_id ?? rooms[0]?.id ?? null,
        client_id: clients[index]?.id ?? clients[0]?.id ?? 1,
      },
  );

  return (
    <div className={styles.grid}>
      <Select
        name="client_id"
        label="Primary client"
        defaultValue={String(record?.client_id ?? clients[0]?.id ?? "")}
        disabled={readOnly}
        options={clients.map((client) => ({
          value: String(client.id),
          label: `${client.first_name} ${client.last_name}`,
        }))}
      />
      <Select
        name="status"
        label="Status"
        defaultValue={record?.status ?? "not paid"}
        disabled={readOnly}
        options={[
          { value: "not paid", label: "Not paid" },
          { value: "paid", label: "Paid" },
          { value: "approaching", label: "Approaching" },
          { value: "in process", label: "In process" },
          { value: "finished", label: "Finished" },
          { value: "cancelled", label: "Cancelled" },
        ]}
      />
      <Input name="check_in" label="Check in" type="datetime-local" defaultValue={dateTimeLocal(record?.check_in)} readOnly={readOnly} required />
      <Input name="check_out" label="Check out" type="datetime-local" defaultValue={dateTimeLocal(record?.check_out)} readOnly={readOnly} required />
      <Input name="total_price" label="Total price" type="number" step="0.01" defaultValue={record?.total_price ?? ""} readOnly={readOnly} />
      <div className={styles.accommodations}>
        <div className={styles.accommodationsHead}>
          <p>Accommodations</p>
          {!readOnly ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                setAccommodationCount((current) => Math.min(current + 1, 20))
              }
            >
              Add guest
            </Button>
          ) : null}
        </div>
        {accommodations.map((item, index) => (
          <div key={index} className={styles.accommodationRow}>
            <Select
              name={`accommodation_room_id_${index}`}
              label="Room"
              defaultValue={String(item.room_id ?? rooms[0]?.id ?? "")}
              disabled={readOnly}
              options={rooms.map((room) => ({
                value: String(room.id),
                label: `Room ${room.num}`,
              }))}
            />
            <Select
              name={`accommodation_client_id_${index}`}
              label="Guest"
              defaultValue={String(item.client_id ?? clients[0]?.id ?? "")}
              disabled={readOnly}
              options={clients.map((client) => ({
                value: String(client.id),
                label: `${client.first_name} ${client.last_name}`,
              }))}
            />
            {!readOnly && accommodationCount > 1 ? (
              <Button
                type="button"
                variant="secondary"
                className={styles.removeGuest}
                onClick={() =>
                  setAccommodationCount((current) => Math.max(1, current - 1))
                }
              >
                Remove guest
              </Button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
