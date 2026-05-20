import styles from "./style.module.scss";
import type { AdminPageHeaderProps } from "./AdminPageHeader.props";

export function AdminPageHeader({
  title,
  subtitle,
  action,
}: AdminPageHeaderProps) {
  return (
    <header className={styles.header}>
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {action}
    </header>
  );
}
