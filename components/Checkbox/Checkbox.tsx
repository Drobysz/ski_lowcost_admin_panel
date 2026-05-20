import styles from "./style.module.scss";
import type { CheckboxProps } from "./Checkbox.props";

export function Checkbox({ label, className = "", ...props }: CheckboxProps) {
  return (
    <label className={`${styles.checkbox} ${className}`}>
      <input {...props} type="checkbox" />
      <span>{label}</span>
    </label>
  );
}
