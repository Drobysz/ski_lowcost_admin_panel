import type { Room } from "@/interface/room.interface";

export type RoomsTableSectionProps = Record<string, never>;

export interface RoomThumbProps {
  room: Room;
  index: number;
}
