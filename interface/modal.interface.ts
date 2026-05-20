import type { Admin } from "./admin.interface";
import type { Client } from "./client.interface";
import type { Reservation } from "./reservation.interface";
import type { Room } from "./room.interface";

export type ModalMode = "create" | "edit" | "view" | "delete";
export type ModalEntity = "client" | "admin" | "room" | "reservation";

export type ModalRecord = Client | Admin | Room | Reservation;

export interface CrudModalState {
  mode: ModalMode;
  entity: ModalEntity;
  record?: ModalRecord;
}
