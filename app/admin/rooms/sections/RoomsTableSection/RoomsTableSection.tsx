"use client";

import { useState } from "react";
import { Badge } from "@/components/Badge";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { Icon } from "@/components/Icon";
import { IconButton } from "@/components/IconButton";
import { LoadingState } from "@/components/LoadingState";
import { Pagination } from "@/components/Pagination";
import { Table } from "@/components/Table";
import { formatRoomName } from "@/helper/format";
import type { Room } from "@/interface/room.interface";
import { useRooms } from "../../context";
import styles from "./style.module.scss";
import type { RoomThumbProps } from "./RoomsTableSection.props";

export function RoomsTableSection() {
  const { rooms, isLoading, notice, openView, openEdit, openDelete } =
    useRooms();
  const pageSize = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(rooms.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const visibleRooms = rooms.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  return (
    <>
      {notice ? <ErrorState message={notice.text} /> : null}
      <Table
        className={styles.table}
        columns={[
          { label: "Room Details" },
          { label: "Configuration" },
          { label: "Floor & Area" },
          { label: "Status" },
          { label: "Actions", className: styles.actionsHead },
        ]}
        footer={
          <Pagination
            label={`Showing ${visibleRooms.length} of ${rooms.length} rooms`}
            currentPage={safePage}
            pageSize={pageSize}
            totalItems={rooms.length}
            onPageChange={setCurrentPage}
          />
        }
      >
        {isLoading ? <LoadingState /> : null}
        {!isLoading && !visibleRooms.length ? (
          <EmptyState
            title="No rooms found"
            message="Adjust filters or create a room."
          />
        ) : null}
        {!isLoading
          ? visibleRooms.map((room, index) => (
              <div key={room.id} className={styles.row}>
                <div className={styles.roomCell}>
                  <RoomThumb room={room} index={index} />
                  <div>
                    <strong>Room {room.num}</strong>
                    <small>{formatRoomName(room)}</small>
                  </div>
                </div>
                <div className={styles.configCell}>
                  <span>
                    <Icon name="bed" /> {room.nb_lits} Beds
                  </span>
                  <span>
                    <Icon name={room.view === "mountains" ? "mountain" : "square"} />
                    {room.balcony ? "Balcony included" : "Mountain View"}
                  </span>
                </div>
                <div>
                  <strong>Floor {room.floor}</strong>
                  <small>{room.surface} m2</small>
                </div>
                <Badge tone={roomBadge(room).tone}>{roomBadge(room).label}</Badge>
                <div className={styles.actions}>
                  <IconButton icon="eye" label="View room" onClick={() => openView(room)} />
                  <IconButton icon="edit" label="Edit room" onClick={() => openEdit(room)} />
                  <IconButton icon="x-circle" label="Delete room" onClick={() => openDelete(room)} />
                </div>
              </div>
            ))
          : null}
      </Table>
    </>
  );
}

function RoomThumb({ room, index }: RoomThumbProps) {
  const image = room.images?.find((item) => {
    if (!item.url || item.name === "placeholder.jpg") {
      return false;
    }

    return !item.url.includes("example.com") && !item.path?.endsWith("/placeholder.jpg");
  })?.url;

  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={image} alt={`Room ${room.num}`} className={styles.thumb} />
    );
  }

  return (
    <span className={`${styles.thumb} ${styles[`thumb${index % 3}`]}`}>
      {room.num}
    </span>
  );
}

function roomBadge(room: Room) {
  if (room.status === "occupied") {
    return { label: "Occupied", tone: "orange" as const };
  }

  if (room.status === "maintenance") {
    return { label: "Maintenance", tone: "gray" as const };
  }

  return { label: "Available", tone: "green" as const };
}
