import type { ReactNode } from "react";

export interface TableColumn {
  label: string;
  className?: string;
}

export interface TableProps {
  columns: TableColumn[];
  children: ReactNode;
  footer: ReactNode;
  className?: string;
}
