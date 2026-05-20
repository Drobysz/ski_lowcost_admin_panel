import styles from "./style.module.scss";
import type { LoadingStateProps } from "./LoadingState.props";

export function LoadingState({ rows = 3 }: LoadingStateProps) {
  return (
    <div className={styles.loading}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className={styles.row} />
      ))}
    </div>
  );
}
