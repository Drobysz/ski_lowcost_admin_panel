"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/Icon";
import styles from "./style.module.scss";
import type { ModalProps } from "./Modal.props";

export function Modal({
  isOpen,
  eyebrow,
  title,
  children,
  footer,
  isDismissible = true,
  onClose,
  onSubmit,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && isDismissible) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className={styles.dialog}
      >
        <div className={styles.header}>
          <div>
            <p>{eyebrow}</p>
            <h2 id="modal-title">{title}</h2>
          </div>
          <button type="button" aria-label="Close modal" onClick={onClose}>
            <Icon name="x" />
          </button>
        </div>
        {onSubmit ? (
          <form onSubmit={onSubmit} className={styles.body}>
            {children}
            {footer ? <div className={styles.footer}>{footer}</div> : null}
          </form>
        ) : (
          <div className={styles.body}>
            {children}
            {footer ? <div className={styles.footer}>{footer}</div> : null}
          </div>
        )}
      </div>
    </div>
  );
}
