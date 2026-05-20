import type { Admin } from "@/interface/admin.interface";
import type { Client } from "@/interface/client.interface";

export type UsersModalsProps = Record<string, never>;

export interface ClientFormProps {
  record?: Client;
  readOnly: boolean;
}

export interface AdminFormProps {
  record?: Admin;
  readOnly: boolean;
}

export interface SwitchPromptProps {
  label: string;
  onClick: () => void;
}
