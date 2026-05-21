"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import { ErrorState } from "@/components/ErrorState";
import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { Select } from "@/components/Select";
import type { Admin } from "@/interface/admin.interface";
import type { Client } from "@/interface/client.interface";
import { useUsers } from "../UsersProvider";
import styles from "./style.module.scss";
import type {
  AdminFormProps,
  ClientFormProps,
  SwitchPromptProps,
} from "./UsersModals.props";

export function UsersModals() {
  const {
    modal,
    closeModal,
    saveModal,
    deleteModalRecord,
    switchEntity,
  } = useUsers();
  const [error, setError] = useState("");

  if (!modal) {
    return null;
  }

  const isReadOnly = modal.mode === "view";
  const isDelete = modal.mode === "delete";
  const title = `${modal.mode} ${modal.entity}`;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      await saveModal(event.currentTarget);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save this record.",
      );
    }
  }

  return (
    <Modal
      isOpen
      eyebrow={modal.entity}
      title={title}
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
          Confirm deletion for this record. This action cannot be undone.
        </p>
      ) : null}
      {!isDelete && modal.entity === "client" ? (
        <ClientForm record={modal.record as Client | undefined} readOnly={isReadOnly} />
      ) : null}
      {!isDelete && modal.entity === "admin" ? (
        <AdminForm record={modal.record as Admin | undefined} readOnly={isReadOnly} />
      ) : null}
      {modal.mode === "create" && modal.entity === "client" ? (
        <SwitchPrompt label="Creating a staff admin instead?" onClick={() => switchEntity("admin")} />
      ) : null}
      {modal.mode === "create" && modal.entity === "admin" ? (
        <SwitchPrompt label="Creating a client instead?" onClick={() => switchEntity("client")} />
      ) : null}
    </Modal>
  );
}

function ClientForm({ record, readOnly }: ClientFormProps) {
  return (
    <div className={styles.grid}>
      <Input name="first_name" label="First name" defaultValue={record?.first_name} readOnly={readOnly} required />
      <Input name="last_name" label="Last name" defaultValue={record?.last_name} readOnly={readOnly} required />
      <Input name="age" label="Age" type="number" defaultValue={record?.age} readOnly={readOnly} required />
      <Input name="birth_date" label="Birth date" type="date" defaultValue={record?.birth_date} readOnly={readOnly} required />
      <Input name="tel" label="Telephone" defaultValue={record?.tel} readOnly={readOnly} required />
      <Select
        name="skiing_level"
        label="Skiing level"
        defaultValue={record?.skiing_level ?? "beginner"}
        disabled={readOnly}
        options={[
          { value: "beginner", label: "Beginner" },
          { value: "medium", label: "Medium" },
          { value: "confirmed", label: "Confirmed" },
        ]}
      />
      <Input name="height" label="Height" type="number" step="0.01" defaultValue={record?.height} readOnly={readOnly} required />
      <Input name="weight" label="Weight" type="number" defaultValue={record?.weight} readOnly={readOnly} required />
      <Input name="shoe_size" label="Shoe size" type="number" defaultValue={record?.shoe_size} readOnly={readOnly} required />
      <Input name="address" label="Address" defaultValue={record?.address} readOnly={readOnly} required />
      {!readOnly ? (
        <>
          <Input name="password" label="Password" type="password" required={!record} />
        </>
      ) : null}
    </div>
  );
}

function AdminForm({ record, readOnly }: AdminFormProps) {
  return (
    <div className={styles.grid}>
      <Input name="name" label="Admin name" defaultValue={record?.name} readOnly={readOnly} required />
      {!readOnly ? <Input name="password" label="Password" type="password" required={!record} /> : null}
    </div>
  );
}

function SwitchPrompt({ label, onClick }: SwitchPromptProps) {
  return (
    <div className={styles.switchPrompt}>
      <p>{label}</p>
      <button type="button" onClick={onClick}>
        Switch form
      </button>
    </div>
  );
}
