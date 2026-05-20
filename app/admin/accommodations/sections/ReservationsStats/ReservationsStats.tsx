"use client";

import { Icon } from "@/components/Icon";
import { useReservations } from "../ReservationsProvider";
import styles from "./style.module.scss";
import type { MetricProps } from "./ReservationsStats.props";

export function ReservationsStats() {
  const { reservations, rooms } = useReservations();
  const active = reservations.filter((item) =>
    ["paid", "approaching", "in process"].includes(item.status),
  ).length;
  const occupancy = rooms.length
    ? Math.round((active / rooms.length) * 1000) / 10
    : 0;
  const revenue = reservations.reduce(
    (total, item) => total + Number(item.total_price ?? 0),
    0,
  );

  return (
    <section className={styles.stats}>
      <Metric icon="trend" label="Occupancy Rate" value={`${occupancy}%`} />
      <Metric icon="tasks" label="Pending Tasks" value="14" tone="orange" />
      <Metric
        icon="money"
        label="Revenue (MoM)"
        value={`+$${Math.round(revenue / 1000)}.2k`}
        tone="green"
      />
    </section>
  );
}

function Metric({
  icon,
  label,
  value,
  tone = "blue",
}: MetricProps) {
  return (
    <div className={styles.metric}>
      <span className={styles[tone]}>
        <Icon name={icon} />
      </span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </div>
  );
}
