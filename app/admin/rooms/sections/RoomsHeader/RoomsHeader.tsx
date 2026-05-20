"use client";

import { AdminPageHeader } from "@/components/AdminPageHeader";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { useRooms } from "../../context";

export function RoomsHeader() {
  const { openCreate } = useRooms();

  return (
    <AdminPageHeader
      title="Room Inventory"
      subtitle="Manage room capacity, views, amenities, and availability."
      action={
        <Button onClick={openCreate}>
          <Icon name="plus" />
          Create Room
        </Button>
      }
    />
  );
}
