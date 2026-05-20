"use client";

import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { useUsers } from "../UsersProvider";
import styles from "./style.module.scss";

export function UsersFilters() {
  const {
    query,
    roleFilter,
    ageFilter,
    setQuery,
    setRoleFilter,
    setAgeFilter,
  } = useUsers();

  return (
    <section className={styles.filters}>
      <Input
        icon="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by name or email address..."
      />
      <Select
        icon="badge"
        value={roleFilter}
        onValueChange={setRoleFilter}
        options={[
          { value: "all", label: "All Roles" },
          { value: "admin", label: "Admin" },
          { value: "client", label: "Client" },
        ]}
      />
      <Select
        icon="calendar"
        value={ageFilter}
        onValueChange={setAgeFilter}
        options={[
          { value: "all", label: "Age Category" },
          { value: "junior", label: "Junior" },
          { value: "adult", label: "Adult" },
          { value: "senior", label: "Senior" },
        ]}
      />
    </section>
  );
}
