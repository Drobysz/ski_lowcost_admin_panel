import type { Client } from "@/interface/client.interface";
import type { ReservationStatus } from "@/interface/reservation.interface";
import type { Room } from "@/interface/room.interface";
import type { BadgeTone } from "@/interface/ui.interface";

export function formatCurrency(value: string | number | null | undefined) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
  }).format(new Date(value));
}

export function formatClientName(client?: Client) {
  return client ? `${client.first_name} ${client.last_name}` : "Guest";
}

export function formatRoomName(room: Room) {
  if (room.nb_lits === 6) {
    return "Large Alpine Suite";
  }
  if (room.nb_lits === 4) {
    return "Family Lodge";
  }
  return "Standard Alpine Suite";
}

export function formatReservationStatus(status: ReservationStatus): {
  label: string;
  tone: BadgeTone;
} {
  if (status === "in process") {
    return { label: "Current", tone: "green" };
  }
  if (status === "finished") {
    return { label: "Past", tone: "gray" };
  }
  if (status === "not paid") {
    return { label: "Pending", tone: "orange" };
  }
  if (status === "cancelled") {
    return { label: "Cancelled", tone: "gray" };
  }
  return { label: "Upcoming", tone: "blue" };
}

export function nightsBetween(start: string, end: string) {
  const diff = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.round(diff / 86_400_000));
}

export function dateTimeLocal(value?: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 16);
}

export function toIsoDate(value: string) {
  return value ? new Date(value).toISOString() : "";
}

export function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, ".");
}

export function initials(value: string) {
  return value
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
