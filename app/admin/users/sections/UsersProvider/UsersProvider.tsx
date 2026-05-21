"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createAdmin,
  createClient,
  deleteAdmin,
  deleteClient,
  getAdmins,
  getClients,
  updateAdmin,
  updateClient,
} from "@/helper/api";
import { API_FALLBACK_NOTICE } from "@/helper/constants";
import { mockAdmins, mockClients } from "@/helper/mock-data";
import { slugify } from "@/helper/format";
import { adminSchema, clientSchema } from "@/helper/validation";
import type { Admin } from "@/interface/admin.interface";
import type { Client } from "@/interface/client.interface";
import type { CrudModalState } from "@/interface/modal.interface";
import type {
  UserTableItem,
  UsersContextValue,
  UsersProviderProps,
} from "./UsersProvider.props";

const UsersContext = createContext<UsersContextValue | null>(null);

export function UsersProvider({ children }: UsersProviderProps) {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [admins, setAdmins] = useState<Admin[]>(mockAdmins);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState<UsersContextValue["notice"]>(null);
  const [modal, setModal] = useState<CrudModalState | null>(null);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      setIsLoading(true);
      try {
        const [clientData, adminData] = await Promise.all([
          getClients(),
          getAdmins(),
        ]);

        if (!active) {
          return;
        }

        setClients(clientData.length ? clientData : mockClients);
        setAdmins(adminData.length ? adminData : mockAdmins);
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

    loadUsers();

    return () => {
      active = false;
    };
  }, []);

  const users = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const combined: UserTableItem[] = [
      ...admins.map((admin) => ({
        id: admin.id,
        kind: "admin" as const,
        name: admin.name,
        email: `${slugify(admin.name)}@zarza-ski.com`,
        role: "Admin",
        tariff: "Full Access",
        raw: admin,
      })),
      ...clients.map((client) => ({
        id: client.id,
        kind: "client" as const,
        name: `${client.first_name} ${client.last_name}`,
        email: `${client.first_name}.${client.last_name}@alpine.net`.toLowerCase(),
        role: "Client",
        tariff: client.skiing_level === "confirmed" ? "Winter Premium" : "Family Bundle",
        age: client.age,
        raw: client,
      })),
    ];

    return combined.filter((user) => {
      const matchesQuery =
        !normalized ||
        user.name.toLowerCase().includes(normalized) ||
        user.email.toLowerCase().includes(normalized);
      const matchesRole =
        roleFilter === "all" || user.role.toLowerCase() === roleFilter;
      const matchesAge =
        ageFilter === "all" ||
        (ageFilter === "junior" && user.kind === "client" && user.age! < 18) ||
        (ageFilter === "adult" &&
          user.kind === "client" &&
          user.age! >= 18 &&
          user.age! < 55) ||
        (ageFilter === "senior" && user.kind === "client" && user.age! >= 55);

      return matchesQuery && matchesRole && matchesAge;
    });
  }, [admins, ageFilter, clients, query, roleFilter]);

  function openCreate() {
    setModal({ mode: "create", entity: "client" });
  }

  function openView(record: UserTableItem) {
    setModal({ mode: "view", entity: record.kind, record: record.raw });
  }

  function openEdit(record: UserTableItem) {
    setModal({ mode: "edit", entity: record.kind, record: record.raw });
  }

  function openDelete(record: UserTableItem) {
    setModal({ mode: "delete", entity: record.kind, record: record.raw });
  }

  async function saveModal(form: HTMLFormElement) {
    if (!modal) {
      return;
    }

    if (modal.entity === "client") {
      await saveClient(form);
    }

    if (modal.entity === "admin") {
      await saveAdmin(form);
    }

    setModal(null);
  }

  async function saveClient(form: HTMLFormElement) {
    const formData = new FormData(form);
    const parsed = clientSchema.parse(Object.fromEntries(formData.entries()));
    const payload = { ...parsed };

    if (modal?.mode === "create") {
      const password = String(formData.get("password") ?? "");

      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters.");
      }

      const created = await withFallback(
        () => createClient({ ...payload, password }),
        () => ({ ...payload, id: nextId(clients), role: "client" }) as Client,
      );
      setClients((items) => [created, ...items]);
      return;
    }

    const record = modal?.record as Client;
    const updated = await withFallback(
      () => updateClient(record.id, payload),
      () => ({ ...record, ...payload }) as Client,
    );
    setClients((items) =>
      items.map((item) => (item.id === record.id ? updated : item)),
    );
  }

  async function saveAdmin(form: HTMLFormElement) {
    const formData = new FormData(form);
    const parsed = adminSchema.parse(Object.fromEntries(formData.entries()));
    const password = String(formData.get("password") ?? "");

    if (modal?.mode === "create" && password.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }

    if (modal?.mode === "create") {
      const created = await withFallback(
        () => createAdmin({ ...parsed, password }),
        () => ({ id: nextId(admins), name: parsed.name, role: "admin" }) as Admin,
      );
      setAdmins((items) => [created, ...items]);
      return;
    }

    const record = modal?.record as Admin;
    const updated = await withFallback(
      () => updateAdmin(record.id, password ? { ...parsed, password } : parsed),
      () => ({ ...record, name: parsed.name }) as Admin,
    );
    setAdmins((items) =>
      items.map((item) => (item.id === record.id ? updated : item)),
    );
  }

  async function deleteModalRecord() {
    if (!modal?.record) {
      return;
    }

    if (modal.entity === "client") {
      const record = modal.record as Client;
      await withFallback(() => deleteClient(record.id), () => undefined);
      setClients((items) => items.filter((item) => item.id !== record.id));
    }

    if (modal.entity === "admin") {
      const record = modal.record as Admin;
      await withFallback(() => deleteAdmin(record.id), () => undefined);
      setAdmins((items) => items.filter((item) => item.id !== record.id));
    }

    setModal(null);
  }

  const value = {
    users,
    isLoading,
    notice,
    modal,
    query,
    roleFilter,
    ageFilter,
    setQuery,
    setRoleFilter,
    setAgeFilter,
    openCreate,
    openView,
    openEdit,
    openDelete,
    closeModal: () => setModal(null),
    switchEntity: (entity: "admin" | "client") =>
      setModal((current) => (current ? { ...current, entity } : current)),
    saveModal,
    deleteModalRecord,
  };

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
}

export function useUsers() {
  const context = useContext(UsersContext);

  if (!context) {
    throw new Error("useUsers must be used inside UsersProvider.");
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
