import type { ReactNode } from "react";
import type { CrudModalState } from "@/interface/modal.interface";
import type { Room } from "@/interface/room.interface";
import type { Notice } from "@/interface/ui.interface";

export interface RoomsProviderProps {
  children: ReactNode;
}

export interface RoomsContextValue {
  rooms: Room[];
  isLoading: boolean;
  notice: Notice | null;
  modal: CrudModalState | null;
  query: string;
  bedsFilter: string;
  floorFilter: string;
  balconyOnly: boolean;
  mountainOnly: boolean;
  setQuery: (value: string) => void;
  setBedsFilter: (value: string) => void;
  setFloorFilter: (value: string) => void;
  setBalconyOnly: (value: boolean) => void;
  setMountainOnly: (value: boolean) => void;
  openCreate: () => void;
  openView: (room: Room) => void;
  openEdit: (room: Room) => void;
  openDelete: (room: Room) => void;
  closeModal: () => void;
  saveModal: (form: HTMLFormElement) => Promise<void>;
  deleteModalRecord: () => Promise<void>;
}
