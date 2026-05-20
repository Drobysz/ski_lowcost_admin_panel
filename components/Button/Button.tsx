import styles from "./style.module.scss";
import type { ButtonProps } from "./Button.props";

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`${styles.button} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
