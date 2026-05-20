import type { ReactNode } from "react";
import styles from "./style.module.scss";
import type { IconProps } from "./Icon.props";

export function Icon({ name }: IconProps) {
  const paths: Record<string, ReactNode> = {
    users: (
      <>
        <path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 20v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    bed: (
      <>
        <path d="M2 4v16" />
        <path d="M2 10h20" />
        <path d="M22 10v10" />
        <path d="M4 10V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4" />
        <path d="M8 2v4" />
        <path d="M3 10h18" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </>
    ),
    badge: (
      <>
        <path d="M8 7V3h8v4" />
        <rect x="4" y="7" width="16" height="14" rx="2" />
        <path d="M8 12h8" />
        <path d="M8 16h5" />
      </>
    ),
    chevron: <path d="m6 9 6 6 6-6" />,
    "chevron-left": <path d="m15 18-6-6 6-6" />,
    "chevron-right": <path d="m9 18 6-6-6-6" />,
    mountain: (
      <>
        <path d="m8 21 4-7 3 5 2-3 5 5H8Z" />
        <path d="M2 21 9 9l3 5" />
      </>
    ),
    square: <rect x="5" y="5" width="14" height="14" rx="2" />,
    eye: (
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </>
    ),
    "x-circle": (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </>
    ),
    x: (
      <>
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </>
    ),
    trend: (
      <>
        <path d="m3 17 6-6 4 4 8-8" />
        <path d="M14 7h7v7" />
      </>
    ),
    tasks: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="m9 12 2 2 4-5" />
      </>
    ),
    money: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.icon}
    >
      {paths[name] ?? paths.square}
    </svg>
  );
}
