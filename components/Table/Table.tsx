import styles from "./style.module.scss";
import type { TableProps } from "./Table.props";

export function Table({ columns, children, footer, className = "" }: TableProps) {
  return (
    <section className={`${styles.card} ${className}`}>
      <div className={styles.scroll}>
        <div className={styles.header}>
          {columns.map((column) => (
            <span key={column.label} className={column.className}>
              {column.label}
            </span>
          ))}
        </div>
        {children}
      </div>
      {footer}
    </section>
  );
}
