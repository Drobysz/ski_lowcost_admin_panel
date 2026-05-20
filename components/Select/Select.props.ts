import type { ButtonHTMLAttributes } from "react";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "value" | "defaultValue" | "onChange"
  > {
  name?: string;
  label?: string;
  options: SelectOption[];
  error?: string;
  icon?: string;
  value?: string;
  defaultValue?: string;
  required?: boolean;
  onValueChange?: (value: string) => void;
}
