"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createRoom,
  deleteRoom,
  getRooms,
  updateRoom,
} from "@/helper/api";
import { API_FALLBACK_NOTICE } from "@/helper/constants";
import { prepareRoomImages } from "@/helper/images";
import { mockRooms } from "@/helper/mock-data";
import { roomSchema } from "@/helper/validation";
import type { CrudModalState } from "@/interface/modal.interface";
import type { Room } from "@/interface/room.interface";
import type {
  RoomsContextValue,
  RoomsProviderProps,
} from "./context.interface";

const RoomsContext = createContext<RoomsContextValue | null>(null);

export function RoomsProvider({ children }: RoomsProviderProps) {
  const [allRooms, setAllRooms] = useState<Room[]>(mockRooms);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState<RoomsContextValue["notice"]>(null);
  const [modal, setModal] = useState<CrudModalState | null>(null);
  const [query, setQuery] = useState("");
  const [bedsFilter, setBedsFilter] = useState("all");
  const [floorFilter, setFloorFilter] = useState("all");
  const [balconyOnly, setBalconyOnly] = useState(false);
  const [mountainOnly, setMountainOnly] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadRooms() {
      setIsLoading(true);
      try {
        const roomData = await getRooms();

        if (!active) {
          return;
        }

        setAllRooms(roomData.length ? roomData : mockRooms);
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

    loadRooms();

    return () => {
      active = false;
    };
  }, []);

  const rooms = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return allRooms.filter((room) => {
      const matchesQuery =
        !normalized || String(room.num).toLowerCase().includes(normalized);
      const matchesBeds =
        bedsFilter === "all" || String(room.nb_lits) === bedsFilter;
      const matchesFloor =
        floorFilter === "all" || String(room.floor) === floorFilter;
      const matchesBalcony = !balconyOnly || room.balcony;
      const matchesMountain = !mountainOnly || room.view === "mountains";

      return (
        matchesQuery &&
        matchesBeds &&
        matchesFloor &&
        matchesBalcony &&
        matchesMountain
      );
    });
  }, [allRooms, balconyOnly, bedsFilter, floorFilter, mountainOnly, query]);

  async function saveModal(form: HTMLFormElement) {
    if (!modal) {
      return;
    }

    const rawFormData = new FormData(form);
    const parsed = roomSchema.parse(Object.fromEntries(rawFormData.entries()));
    const formData = roomFormData(rawFormData, parsed.balcony);

    if (modal.mode === "create") {
      const created = await withFallback(
        () => createRoom(formData),
        () =>
          ({
            ...parsed,
            id: nextId(allRooms),
            balcony: isTruthyBalcony(parsed.balcony),
            view: parsed.view,
            status: "available",
          }) as Room,
      );
      setAllRooms((items) => [created, ...items]);
      setModal(null);
      return;
    }

    const record = modal.record as Room;
    const updated = await withFallback(
      () => updateRoom(record.id, formData),
      () =>
        ({
          ...record,
          ...parsed,
          balcony: isTruthyBalcony(parsed.balcony),
        }) as Room,
    );
    setAllRooms((items) =>
      items.map((item) => (item.id === record.id ? updated : item)),
    );
    setModal(null);
  }

  async function deleteModalRecord() {
    if (!modal?.record) {
      return;
    }

    const record = modal.record as Room;
    await withFallback(() => deleteRoom(record.id), () => undefined);
    setAllRooms((items) => items.filter((item) => item.id !== record.id));
    setModal(null);
  }

  const value = {
    rooms,
    isLoading,
    notice,
    modal,
    query,
    bedsFilter,
    floorFilter,
    balconyOnly,
    mountainOnly,
    setQuery,
    setBedsFilter,
    setFloorFilter,
    setBalconyOnly,
    setMountainOnly,
    openCreate: () => setModal({ mode: "create", entity: "room" }),
    openView: (room: Room) =>
      setModal({ mode: "view", entity: "room", record: room }),
    openEdit: (room: Room) =>
      setModal({ mode: "edit", entity: "room", record: room }),
    openDelete: (room: Room) =>
      setModal({ mode: "delete", entity: "room", record: room }),
    closeModal: () => setModal(null),
    saveModal,
    deleteModalRecord,
  };

  return <RoomsContext.Provider value={value}>{children}</RoomsContext.Provider>;
}

export function useRooms() {
  const context = useContext(RoomsContext);

  if (!context) {
    throw new Error("useRooms must be used inside RoomsProvider.");
  }

  return context;
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

function roomFormData(source: FormData, balcony: string) {
  const formData = prepareRoomImages(source);

  formData.set("balcony", isTruthyBalcony(balcony) ? "1" : "0");
  return formData;
}

function isTruthyBalcony(value: string) {
  return value === "1" || value === "true";
}
