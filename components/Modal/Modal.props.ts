import type { FormEvent, ReactNode } from "react";

export interface ModalProps {
  isOpen: boolean;
  eyebrow: string;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  isDismissible?: boolean;
  onClose: () => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}
