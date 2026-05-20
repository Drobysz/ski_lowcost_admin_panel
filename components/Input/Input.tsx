import { Icon } from "@/components/Icon";
import styles from "./style.module.scss";
import type { InputProps } from "./Input.props";

export function Input({ label, error, icon, className = "", ...props }: InputProps) {
  return (
    <label className={`${styles.field} ${className}`}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <span className={styles.controlWrap}>
        {icon ? <Icon name={icon} /> : null}
        <input {...props} className={styles.control} />
      </span>
      {error ? <span className={styles.error}>{error}</span> : null}
    </label>
  );
}
