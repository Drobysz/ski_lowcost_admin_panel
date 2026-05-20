"use client";

import { AdminPageHeader } from "@/components/AdminPageHeader";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { useUsers } from "../UsersProvider";

export function UsersHeader() {
  const { openCreate } = useUsers();

  return (
    <AdminPageHeader
      title="User Management"
      subtitle="Oversee and manage alpine hospitality staff and clients."
      action={
        <Button onClick={openCreate}>
          <Icon name="plus" />
          Create New User
        </Button>
      }
    />
  );
}
