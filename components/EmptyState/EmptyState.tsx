import styles from "./style.module.scss";
import type { EmptyStateProps } from "./EmptyState.props";

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className={styles.state}>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}
