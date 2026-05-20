import type { Client } from "@/interface/client.interface";
import type { Reservation } from "@/interface/reservation.interface";
import type { Room } from "@/interface/room.interface";

export type ReservationsModalsProps = Record<string, never>;

export interface ReservationFormProps {
  record?: Reservation;
  readOnly: boolean;
  clients: Client[];
  rooms: Room[];
}
