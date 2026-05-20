"use client";

import { useState } from "react";
import { Badge } from "@/components/Badge";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { IconButton } from "@/components/IconButton";
import { LoadingState } from "@/components/LoadingState";
import { Pagination } from "@/components/Pagination";
import { Table } from "@/components/Table";
import { initials } from "@/helper/format";
import { useUsers } from "../UsersProvider";
import styles from "./style.module.scss";

export function UsersTableSection() {
  const { users, isLoading, notice, openView, openEdit, openDelete } =
    useUsers();
  const pageSize = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const visibleUsers = users.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  return (
    <>
      {notice ? <ErrorState message={notice.text} /> : null}
      <Table
        className={styles.table}
        columns={[
          { label: "User Profile" },
          { label: "Role" },
          { label: "Tariff Type" },
          { label: "Actions", className: styles.actionsHead },
        ]}
        footer={
          <Pagination
            label={`Showing ${visibleUsers.length} of ${users.length} users`}
            currentPage={safePage}
            pageSize={pageSize}
            totalItems={users.length}
            onPageChange={setCurrentPage}
          />
        }
      >
        {isLoading ? <LoadingState /> : null}
        {!isLoading && !visibleUsers.length ? (
          <EmptyState
            title="No users found"
            message="Adjust filters or create the first client."
          />
        ) : null}
        {!isLoading
          ? visibleUsers.map((user) => (
              <div key={`${user.kind}-${user.id}`} className={styles.row}>
                <div className={styles.userCell}>
                  <span className={styles.avatar}>{initials(user.name)}</span>
                  <div>
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </div>
                </div>
                <Badge tone={user.kind === "admin" ? "blue" : "orange"}>
                  {user.role}
                </Badge>
                <span>{user.tariff}</span>
                <div className={styles.actions}>
                  <IconButton
                    icon="eye"
                    label={`View ${user.name}`}
                    onClick={() => openView(user)}
                  />
                  <IconButton
                    icon="edit"
                    label={`Edit ${user.name}`}
                    onClick={() => openEdit(user)}
                  />
                  <IconButton
                    icon="x-circle"
                    label={`Delete ${user.name}`}
                    onClick={() => openDelete(user)}
                  />
                </div>
              </div>
            ))
          : null}
      </Table>
    </>
  );
}
