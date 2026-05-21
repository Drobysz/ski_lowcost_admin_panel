import type { Admin } from "@/interface/admin.interface";
import type { TokenPair } from "@/interface/api.interface";
import type { Client } from "@/interface/client.interface";
import type { Reservation } from "@/interface/reservation.interface";
import type { Room } from "@/interface/room.interface";
import { getAdminSession, setAdminSession } from "./auth";

const NORMALIZED_API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api"
).replace(/\/+$/, "");
const API_BASE_URL = NORMALIZED_API_BASE_URL.endsWith("/api")
  ? NORMALIZED_API_BASE_URL
  : `${NORMALIZED_API_BASE_URL}/api`;

type RequestOptions = RequestInit & {
  skipAuth?: boolean;
};

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(normalizeApiError(payload, response.status));
  }

  return payload?.data ?? payload;
}

function normalizeApiError(payload: unknown, status: number) {
  const validationErrors = extractValidationErrors(payload);

  if (validationErrors.length) {
    return validationErrors.join(" ");
  }

  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message;
  }

  return `Request failed with status ${status}.`;
}

function extractValidationErrors(payload: unknown) {
  if (!payload || typeof payload !== "object" || !("errors" in payload)) {
    return [];
  }

  const errors = payload.errors;

  if (!errors || typeof errors !== "object") {
    return [];
  }

  return Object.values(errors)
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .filter((value): value is string => typeof value === "string");
}

async function refreshAdminToken() {
  const session = getAdminSession();

  if (!session?.refreshToken) {
    throw new Error("Your session expired. Please sign in again.");
  }

  const tokens = await apiRequest<TokenPair>(
    "/admin/refresh",
    {
      method: "POST",
      skipAuth: true,
      body: JSON.stringify({ refresh_token: session.refreshToken }),
    },
    false,
  );

  setAdminSession(tokens, session.adminName);
  return tokens;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
  retryOnUnauthorized = true,
): Promise<T> {
  const headers = new Headers(options.headers);
  const session = getAdminSession();
  const isFormData = options.body instanceof FormData;

  headers.set("Accept", headers.get("Accept") ?? "application/json");

  if (!headers.has("Content-Type") && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  if (!options.skipAuth && session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && retryOnUnauthorized) {
    await refreshAdminToken();
    return apiRequest<T>(path, options, false);
  }

  return parseResponse<T>(response);
}

export function adminLogin(payload: { name: string; password: string }) {
  return apiRequest<TokenPair>("/admin/login", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify(payload),
  });
}

export function adminLogout() {
  return apiRequest<{ ok: boolean }>("/admin/logout", { method: "POST" });
}

export function getClients() {
  return apiRequest<Client[]>("/admin/clients");
}

export function createClient(payload: Record<string, unknown>) {
  return apiRequest<Client>("/admin/clients", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateClient(id: number, payload: Record<string, unknown>) {
  return apiRequest<Client>(`/admin/clients/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteClient(id: number) {
  return apiRequest<void>(`/admin/clients/${id}`, { method: "DELETE" });
}

export function getAdmins() {
  return apiRequest<Admin[]>("/admin/admins");
}

export function createAdmin(payload: Record<string, unknown>) {
  return apiRequest<Admin>("/admin/admins", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAdmin(id: number, payload: Record<string, unknown>) {
  return apiRequest<Admin>(`/admin/admins/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteAdmin(id: number) {
  return apiRequest<void>(`/admin/admins/${id}`, { method: "DELETE" });
}

export function getRooms() {
  return apiRequest<Room[]>("/admin/rooms");
}

export function createRoom(payload: FormData) {
  return apiRequest<Room>("/admin/rooms", { method: "POST", body: payload });
}

export function updateRoom(id: number, payload: FormData) {
  payload.append("_method", "PATCH");
  return apiRequest<Room>(`/admin/rooms/${id}`, {
    method: "POST",
    body: payload,
  });
}

export function deleteRoom(id: number) {
  return apiRequest<void>(`/admin/rooms/${id}`, { method: "DELETE" });
}

export function getReservations() {
  return apiRequest<Reservation[]>("/admin/reservations");
}

export function createReservation(payload: Record<string, unknown>) {
  return apiRequest<Reservation>("/admin/reservations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateReservation(
  id: number,
  payload: Record<string, unknown>,
) {
  return apiRequest<Reservation>(`/admin/reservations/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteReservation(id: number) {
  return apiRequest<{ ok: boolean }>(`/admin/reservations/${id}`, {
    method: "DELETE",
  });
}
