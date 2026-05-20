import type { ReactNode } from "react";
import type { Client } from "@/interface/client.interface";
import type { CrudModalState } from "@/interface/modal.interface";
import type { Reservation } from "@/interface/reservation.interface";
import type { Room } from "@/interface/room.interface";
import type { Notice } from "@/interface/ui.interface";

export interface ReservationsProviderProps {
  children: ReactNode;
}

export interface ReservationsContextValue {
  reservations: Reservation[];
  clients: Client[];
  rooms: Room[];
  isLoading: boolean;
  notice: Notice | null;
  modal: CrudModalState | null;
  query: string;
  statusFilter: string;
  dateFrom: string;
  dateTo: string;
  setQuery: (value: string) => void;
  setStatusFilter: (value: string) => void;
  setDateFrom: (value: string) => void;
  setDateTo: (value: string) => void;
  clearDateRange: () => void;
  openCreate: () => void;
  openView: (reservation: Reservation) => void;
  openEdit: (reservation: Reservation) => void;
  openDelete: (reservation: Reservation) => void;
  closeModal: () => void;
  saveModal: (form: HTMLFormElement) => Promise<void>;
  deleteModalRecord: () => Promise<void>;
}
