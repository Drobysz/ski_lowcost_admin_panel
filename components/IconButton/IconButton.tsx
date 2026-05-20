import { Icon } from "@/components/Icon";
import styles from "./style.module.scss";
import type { IconButtonProps } from "./IconButton.props";

export function IconButton({ icon, label, ...props }: IconButtonProps) {
  return (
    <button
      {...props}
      aria-label={label}
      title={label}
      type={props.type ?? "button"}
      className={styles.button}
    >
      <Icon name={icon} />
    </button>
  );
}
