import type { Room } from "@/interface/room.interface";

export type RoomsModalsProps = Record<string, never>;

export interface RoomFormProps {
  record?: Room;
  readOnly: boolean;
}
