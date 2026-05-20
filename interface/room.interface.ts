export interface RoomImage {
  id?: number;
  room_id?: number;
  name?: string;
  path?: string;
  url?: string | null;
}

export type RoomStatus = "available" | "occupied" | "maintenance";

export interface Room {
  id: number;
  num: number;
  nb_lits: 2 | 4 | 6;
  building_id: number;
  floor: number;
  surface: number;
  view: "parking" | "mountains";
  balcony: boolean;
  images?: RoomImage[];
  status?: RoomStatus;
}
