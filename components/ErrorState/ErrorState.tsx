import styles from "./style.module.scss";
import type { ErrorStateProps } from "./ErrorState.props";

export function ErrorState({ message }: ErrorStateProps) {
  return <div className={styles.error}>{message}</div>;
}
