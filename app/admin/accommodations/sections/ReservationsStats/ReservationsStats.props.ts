export type ReservationsStatsProps = Record<string, never>;

export interface MetricProps {
  icon: string;
  label: string;
  value: string;
  tone?: "blue" | "orange" | "green";
}
