import type { ReservationStatus } from "@/interface/reservation.interface";

export const ROOM_BED_OPTIONS = [2, 4, 6] as const;

export const RESERVATION_STATUS_OPTIONS: ReservationStatus[] = [
  "not paid",
  "paid",
  "approaching",
  "in process",
  "finished",
  "cancelled",
];

export const API_FALLBACK_NOTICE =
  "Using local sample data until the Laravel API responds.";
