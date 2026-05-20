import { z } from "zod";

export const loginSchema = z.object({
  name: z.string().min(1, "Admin name is required."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const clientSchema = z.object({
  first_name: z.string().min(1, "First name is required."),
  last_name: z.string().min(1, "Last name is required."),
  age: z.coerce.number().min(0, "Age must be zero or greater."),
  address: z.string().min(1, "Address is required."),
  birth_date: z.string().min(1, "Birth date is required."),
  tel: z.string().min(1, "Telephone is required."),
  skiing_level: z.enum(["beginner", "medium", "confirmed"]),
  height: z.coerce.number().min(0, "Height is required."),
  weight: z.coerce.number().min(0, "Weight is required."),
  shoe_size: z.coerce.number().min(0, "Shoe size is required."),
  password: z.string().optional(),
  password_confirmation: z.string().optional(),
});

export const adminSchema = z.object({
  name: z.string().min(1, "Admin name is required."),
  password: z.string().optional(),
});

export const roomSchema = z.object({
  num: z.coerce.number().min(1, "Room number is required."),
  nb_lits: z.coerce.number().refine((value) => [2, 4, 6].includes(value), {
    message: "Beds must be 2, 4, or 6.",
  }),
  building_id: z.coerce.number().min(1, "Building is required."),
  floor: z.coerce.number(),
  surface: z.coerce.number().min(1, "Surface is required."),
  view: z.enum(["parking", "mountains"]),
  balcony: z.enum(["1", "0", "true", "false"]),
});

export const accommodationSchema = z.object({
  reservation_id: z.coerce.number().optional(),
  room_id: z.coerce.number().nullable(),
  client_id: z.coerce.number(),
});

export const reservationSchema = z.object({
  client_id: z.coerce.number().min(1, "Client is required."),
  check_in: z.string().min(1, "Check in is required."),
  check_out: z.string().min(1, "Check out is required."),
  total_price: z.coerce.number().optional(),
  status: z.enum([
    "not paid",
    "paid",
    "approaching",
    "in process",
    "finished",
    "cancelled",
  ]),
});

export function fieldErrors(error: unknown) {
  if (!(error instanceof z.ZodError)) {
    return {};
  }

  return Object.fromEntries(
    error.issues.map((issue) => [String(issue.path[0]), issue.message]),
  );
}
