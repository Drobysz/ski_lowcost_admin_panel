"use client";

import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { useReservations } from "../ReservationsProvider";
import styles from "./style.module.scss";

export function ReservationsFilters() {
  const {
    query,
    statusFilter,
    dateFrom,
    dateTo,
    setQuery,
    setStatusFilter,
    setDateFrom,
    setDateTo,
    clearDateRange,
  } = useReservations();

  return (
    <section className={styles.filters}>
      <Input
        icon="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by group or user name..."
      />
      <Select
        value={statusFilter}
        onValueChange={setStatusFilter}
        options={[
          { value: "all", label: "All Statuses" },
          { value: "upcoming", label: "Upcoming" },
          { value: "current", label: "Current" },
          { value: "past", label: "Past" },
          { value: "pending", label: "Pending" },
          { value: "cancelled", label: "Cancelled" },
        ]}
      />
      <Input
        type="date"
        value={dateFrom}
        onChange={(event) => setDateFrom(event.target.value)}
        aria-label="Date range start"
      />
      <Input
        type="date"
        value={dateTo}
        min={dateFrom || undefined}
        onChange={(event) => setDateTo(event.target.value)}
        aria-label="Date range end"
      />
      <Button
        type="button"
        variant="secondary"
        onClick={clearDateRange}
        disabled={!dateFrom && !dateTo}
      >
        Clear
        <Icon name="calendar" />
      </Button>
    </section>
  );
}
