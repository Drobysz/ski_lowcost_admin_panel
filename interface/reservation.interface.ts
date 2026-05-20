import type { Accommodation } from "./accommodation.interface";

export type ReservationStatus =
  | "not paid"
  | "paid"
  | "approaching"
  | "in process"
  | "finished"
  | "cancelled";

export interface Reservation {
  id: number;
  client_id: number;
  check_in: string;
  check_out: string;
  purchase_date?: string | null;
  status: ReservationStatus;
  total_price?: string | number | null;
  stripe_session_id?: string | null;
  paid_at?: string | null;
  accommodations?: Accommodation[];
}
