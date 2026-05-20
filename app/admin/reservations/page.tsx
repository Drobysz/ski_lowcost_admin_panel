import { redirect } from "next/navigation";
import { ADMIN_ROUTES } from "@/helper/routes";

export default function ReservationsLegacyPage() {
  redirect(ADMIN_ROUTES.accommodations);
}
