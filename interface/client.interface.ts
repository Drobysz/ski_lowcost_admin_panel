export type SkiingLevel = "beginner" | "medium" | "confirmed";

export interface Client {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  address: string;
  birth_date: string;
  tel: string;
  skiing_level: SkiingLevel;
  height: string | number;
  weight: number;
  shoe_size: number;
  role?: "client" | "admin";
}
