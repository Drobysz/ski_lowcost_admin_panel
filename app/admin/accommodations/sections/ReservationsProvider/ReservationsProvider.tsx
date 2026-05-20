"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createReservation,
  deleteReservation,
  getClients,
  getReservations,
  getRooms,
  updateReservation,
} from "@/helper/api";
import { API_FALLBACK_NOTICE } from "@/helper/constants";
import { formatClientName, formatReservationStatus, toIsoDate } from "@/helper/format";
import { mockClients, mockReservations, mockRooms } from "@/helper/mock-data";
import { reservationSchema } from "@/helper/validation";
import type { Accommodation } from "@/interface/accommodation.interface";
import type { CrudModalState } from "@/interface/modal.interface";
import type { Reservation } from "@/interface/reservation.interface";
import type {
  ReservationsContextValue,
  ReservationsProviderProps,
} from "./ReservationsProvider.props";

const ReservationsContext = createContext<ReservationsContextValue | null>(null);

export function ReservationsProvider({ children }: ReservationsProviderProps) {
  const [allReservations, setAllReservations] =
    useState<Reservation[]>(mockReservations);
  const [clients, setClients] = useState(mockClients);
  const [rooms, setRooms] = useState(mockRooms);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] =
    useState<ReservationsContextValue["notice"]>(null);
  const [modal, setModal] = useState<CrudModalState | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    let active = true;

    async function loadReservations() {
      setIsLoading(true);
      try {
        const [reservationData, clientData, roomData] = await Promise.all([
          getReservations(),
          getClients(),
          getRooms(),
        ]);

        if (!active) {
          return;
        }

        setAllReservations(
          reservationData.length ? reservationData : mockReservations,
        );
        setClients(clientData.length ? clientData : mockClients);
        setRooms(roomData.length ? roomData : mockRooms);
        setNotice(null);
      } catch {
        if (active) {
          setNotice({ tone: "info", text: API_FALLBACK_NOTICE });
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadReservations();

    return () => {
      active = false;
    };
  }, []);

  const reservations = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return allReservations.filter((reservation) => {
      const client = clients.find((item) => item.id === reservation.client_id);
      const clientName = formatClientName(client).toLowerCase();
      const statusKind = formatReservationStatus(
        reservation.status,
      ).label.toLowerCase();
      const startsAfterFrom =
        !dateFrom || new Date(reservation.check_out) >= startOfDay(dateFrom);
      const endsBeforeTo =
        !dateTo || new Date(reservation.check_in) <= endOfDay(dateTo);

      return (
        (!normalized ||
          clientName.includes(normalized) ||
          String(reservation.id).includes(normalized)) &&
        (statusFilter === "all" || statusKind === statusFilter) &&
        startsAfterFrom &&
        endsBeforeTo
      );
    });
  }, [allReservations, clients, dateFrom, dateTo, query, statusFilter]);

  async function saveModal(form: HTMLFormElement) {
    if (!modal) {
      return;
    }

    const formData = new FormData(form);
    const parsed = reservationSchema.parse(Object.fromEntries(formData.entries()));
    const accommodations = accommodationRows(formData);
    const payload = {
      ...parsed,
      check_in: toIsoDate(parsed.check_in),
      check_out: toIsoDate(parsed.check_out),
      accommodations,
    };

    if (!accommodations.length) {
      throw new Error("At least one accommodation row is required.");
    }

    if (modal.mode === "create") {
      const created = await withFallback(
        () => createReservation(payload),
        () => ({ ...payload, id: nextId(allReservations) }) as Reservation,
      );
      setAllReservations((items) => [created, ...items]);
      setModal(null);
      return;
    }

    const record = modal.record as Reservation;
    const updated = await withFallback(
      () => updateReservation(record.id, payload),
      () => ({ ...record, ...payload }) as Reservation,
    );
    setAllReservations((items) =>
      items.map((item) => (item.id === record.id ? updated : item)),
    );
    setModal(null);
  }

  async function deleteModalRecord() {
    if (!modal?.record) {
      return;
    }

    const record = modal.record as Reservation;
    await withFallback(() => deleteReservation(record.id), () => ({ ok: true }));
    setAllReservations((items) => items.filter((item) => item.id !== record.id));
    setModal(null);
  }

  const value = {
    reservations,
    clients,
    rooms,
    isLoading,
    notice,
    modal,
    query,
    statusFilter,
    dateFrom,
    dateTo,
    setQuery,
    setStatusFilter,
    setDateFrom,
    setDateTo,
    clearDateRange: () => {
      setDateFrom("");
      setDateTo("");
    },
    openCreate: () => setModal({ mode: "create", entity: "reservation" }),
    openView: (reservation: Reservation) =>
      setModal({ mode: "view", entity: "reservation", record: reservation }),
    openEdit: (reservation: Reservation) =>
      setModal({ mode: "edit", entity: "reservation", record: reservation }),
    openDelete: (reservation: Reservation) =>
      setModal({ mode: "delete", entity: "reservation", record: reservation }),
    closeModal: () => setModal(null),
    saveModal,
    deleteModalRecord,
  };

  return (
    <ReservationsContext.Provider value={value}>
      {children}
    </ReservationsContext.Provider>
  );
}

export function useReservations() {
  const context = useContext(ReservationsContext);

  if (!context) {
    throw new Error("useReservations must be used inside ReservationsProvider.");
  }

  return context;
}

function accommodationRows(formData: FormData): Accommodation[] {
  const rows: Accommodation[] = [];

  for (let index = 0; index < 20; index += 1) {
    const roomId = formData.get(`accommodation_room_id_${index}`);
    const clientId = formData.get(`accommodation_client_id_${index}`);

    if (roomId && clientId) {
      rows.push({
        room_id: Number(roomId),
        client_id: Number(clientId),
      });
    }
  }

  return rows;
}

async function withFallback<T>(apiCall: () => Promise<T>, fallback: () => T) {
  try {
    return await apiCall();
  } catch {
    return fallback();
  }
}

function nextId(items: Array<{ id: number }>) {
  return Math.max(0, ...items.map((item) => item.id)) + 1;
}

function startOfDay(value: string) {
  return new Date(`${value}T00:00:00`);
}

function endOfDay(value: string) {
  return new Date(`${value}T23:59:59`);
}
