import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import styles from "./style.module.scss";
import type { SelectProps } from "./Select.props";

export function Select({
  id,
  name,
  label,
  options,
  error,
  icon,
  value,
  defaultValue,
  disabled,
  required,
  onValueChange,
  className = "",
  ...buttonProps
}: SelectProps) {
  const generatedId = useId();
  const buttonId = id ?? generatedId;
  const listId = `${buttonId}-list`;
  const errorId = `${buttonId}-error`;
  const rootRef = useRef<HTMLLabelElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue ?? options[0]?.value ?? "",
  );
  const selectedValue = value ?? uncontrolledValue;
  const selectedOption =
    options.find((option) => option.value === selectedValue) ?? options[0];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function closeFromOutside(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function closeFromKeyboard(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", closeFromOutside);
    document.addEventListener("keydown", closeFromKeyboard);

    return () => {
      document.removeEventListener("mousedown", closeFromOutside);
      document.removeEventListener("keydown", closeFromKeyboard);
    };
  }, [isOpen]);

  function selectValue(nextValue: string) {
    if (value === undefined) {
      setUncontrolledValue(nextValue);
    }

    onValueChange?.(nextValue);
    setIsOpen(false);
  }

  return (
    <label ref={rootRef} className={`${styles.field} ${className}`}>
      {label ? <span className={styles.label}>{label}</span> : null}
      {name ? (
        <input
          type="hidden"
          name={name}
          value={selectedOption?.value ?? ""}
          required={required}
          disabled={disabled}
        />
      ) : null}
      <span className={styles.controlWrap} data-open={isOpen}>
        {icon ? <Icon name={icon} /> : null}
        <button
          {...buttonProps}
          id={buttonId}
          type="button"
          className={styles.control}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={listId}
          aria-describedby={error ? errorId : undefined}
          onClick={() => setIsOpen((current) => !current)}
        >
          {selectedOption?.label ?? "Select"}
        </button>
        <Icon name="chevron" />
        {isOpen ? (
          <ul
            id={listId}
            className={styles.options}
            role="listbox"
            aria-labelledby={buttonId}
          >
            {options.map((option) => {
              const isSelected = option.value === selectedOption?.value;

              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                >
                  <button
                    type="button"
                    className={styles.option}
                    data-selected={isSelected}
                    onClick={() => selectValue(option.value)}
                  >
                    <span>{isSelected ? "✓" : ""}</span>
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </span>
      {error ? (
        <span id={errorId} className={styles.error}>
          {error}
        </span>
      ) : null}
    </label>
  );
}
