"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import { ErrorState } from "@/components/ErrorState";
import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { Select } from "@/components/Select";
import type { Room } from "@/interface/room.interface";
import { useRooms } from "../../context";
import styles from "./style.module.scss";
import type { RoomFormProps } from "./RoomsModals.props";

export function RoomsModals() {
  const { modal, closeModal, saveModal, deleteModalRecord } = useRooms();
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
          : "Unable to save this room.",
      );
    }
  }

  return (
    <Modal
      isOpen
      eyebrow="room"
      title={`${modal.mode} room`}
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
          Confirm deletion for this room. This action cannot be undone.
        </p>
      ) : (
        <RoomForm record={modal.record as Room | undefined} readOnly={isReadOnly} />
      )}
    </Modal>
  );
}

function RoomForm({ record, readOnly }: RoomFormProps) {
  return (
    <div className={styles.grid}>
      <Input name="num" label="Room number" type="number" defaultValue={record?.num} readOnly={readOnly} required />
      <Select
        name="nb_lits"
        label="Beds"
        defaultValue={String(record?.nb_lits ?? 2)}
        disabled={readOnly}
        options={[
          { value: "2", label: "2 Beds" },
          { value: "4", label: "4 Beds" },
          { value: "6", label: "6 Beds" },
        ]}
      />
      <Input name="building_id" label="Building ID" type="number" defaultValue={record?.building_id ?? 1} readOnly={readOnly} required />
      <Input name="floor" label="Floor" type="number" defaultValue={record?.floor} readOnly={readOnly} required />
      <Input name="surface" label="Surface" type="number" defaultValue={record?.surface} readOnly={readOnly} required />
      <Select
        name="view"
        label="View"
        defaultValue={record?.view ?? "mountains"}
        disabled={readOnly}
        options={[
          { value: "mountains", label: "Mountains" },
          { value: "parking", label: "Parking" },
        ]}
      />
      <Select
        name="balcony"
        label="Balcony"
        defaultValue={record?.balcony ? "1" : "0"}
        disabled={readOnly}
        options={[
          { value: "0", label: "No" },
          { value: "1", label: "Yes" },
        ]}
      />
      {!readOnly ? (
        <label className={styles.fileField}>
          Images
          <input
            name="images[]"
            type="file"
            multiple
            accept="image/*"
          />
        </label>
      ) : null}
    </div>
  );
}
