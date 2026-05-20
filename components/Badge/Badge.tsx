import styles from "./style.module.scss";
import type { BadgeProps } from "./Badge.props";

export function Badge({ tone, children }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}
