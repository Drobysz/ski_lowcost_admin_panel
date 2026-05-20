import type { Admin } from "@/interface/admin.interface";
import type { Client } from "@/interface/client.interface";
import type { Reservation } from "@/interface/reservation.interface";
import type { Room } from "@/interface/room.interface";

export const mockClients: Client[] = [
  {
    id: 1,
    first_name: "Elena",
    last_name: "Rossi",
    age: 34,
    address: "12 Rue Alpine, Chamonix",
    birth_date: "1992-02-14",
    tel: "+33000000001",
    skiing_level: "confirmed",
    height: "1.68",
    weight: 58,
    shoe_size: 38,
    role: "client",
  },
  {
    id: 2,
    first_name: "Marcus",
    last_name: "Thorne",
    age: 42,
    address: "Glacierstrasse 8, Zermatt",
    birth_date: "1984-09-03",
    tel: "+41000000002",
    skiing_level: "medium",
    height: "1.82",
    weight: 81,
    shoe_size: 43,
    role: "client",
  },
  {
    id: 3,
    first_name: "Sarah",
    last_name: "Chen",
    age: 29,
    address: "Via Neve 6, Courmayeur",
    birth_date: "1997-05-21",
    tel: "+39000000003",
    skiing_level: "beginner",
    height: "1.61",
    weight: 54,
    shoe_size: 37,
    role: "client",
  },
];

export const mockAdmins: Admin[] = [
  { id: 101, name: "Julian Bergmann", role: "admin" },
];

export const mockRooms: Room[] = [
  {
    id: 1,
    num: 101,
    nb_lits: 2,
    building_id: 1,
    floor: 1,
    surface: 42,
    view: "mountains",
    balcony: false,
    status: "available",
  },
  {
    id: 2,
    num: 204,
    nb_lits: 4,
    building_id: 1,
    floor: 2,
    surface: 68,
    view: "parking",
    balcony: true,
    status: "occupied",
  },
  {
    id: 3,
    num: 305,
    nb_lits: 6,
    building_id: 2,
    floor: 5,
    surface: 120,
    view: "mountains",
    balcony: true,
    status: "maintenance",
  },
];

export const mockReservations: Reservation[] = [
  {
    id: 4829,
    client_id: 1,
    check_in: "2026-12-12T15:00:00.000Z",
    check_out: "2026-12-18T10:00:00.000Z",
    status: "approaching",
    total_price: "3420.00",
    accommodations: [{ id: 1, reservation_id: 4829, room_id: 1, client_id: 1 }],
  },
  {
    id: 4830,
    client_id: 2,
    check_in: "2026-12-01T15:00:00.000Z",
    check_out: "2026-12-07T10:00:00.000Z",
    status: "in process",
    total_price: "8150.00",
    accommodations: [{ id: 2, reservation_id: 4830, room_id: 2, client_id: 2 }],
  },
  {
    id: 4792,
    client_id: 3,
    check_in: "2026-11-15T15:00:00.000Z",
    check_out: "2026-11-20T10:00:00.000Z",
    status: "finished",
    total_price: "2100.00",
    accommodations: [{ id: 3, reservation_id: 4792, room_id: 1, client_id: 3 }],
  },
  {
    id: 4831,
    client_id: 2,
    check_in: "2027-01-05T15:00:00.000Z",
    check_out: "2027-01-12T10:00:00.000Z",
    status: "approaching",
    total_price: "5240.00",
    accommodations: [{ id: 4, reservation_id: 4831, room_id: 3, client_id: 2 }],
  },
];
