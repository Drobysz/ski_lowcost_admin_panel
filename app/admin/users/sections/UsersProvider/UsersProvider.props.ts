import type { ReactNode } from "react";
import type { Admin } from "@/interface/admin.interface";
import type { Client } from "@/interface/client.interface";
import type { CrudModalState } from "@/interface/modal.interface";
import type { Notice } from "@/interface/ui.interface";

export interface UserTableItem {
  id: number;
  kind: "admin" | "client";
  name: string;
  email: string;
  role: string;
  tariff: string;
  age?: number;
  raw: Admin | Client;
}

export interface UsersProviderProps {
  children: ReactNode;
}

export interface UsersContextValue {
  users: UserTableItem[];
  isLoading: boolean;
  notice: Notice | null;
  modal: CrudModalState | null;
  query: string;
  roleFilter: string;
  ageFilter: string;
  setQuery: (value: string) => void;
  setRoleFilter: (value: string) => void;
  setAgeFilter: (value: string) => void;
  openCreate: () => void;
  openView: (record: UserTableItem) => void;
  openEdit: (record: UserTableItem) => void;
  openDelete: (record: UserTableItem) => void;
  closeModal: () => void;
  switchEntity: (entity: "admin" | "client") => void;
  saveModal: (form: HTMLFormElement) => Promise<void>;
  deleteModalRecord: () => Promise<void>;
}
