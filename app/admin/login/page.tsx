import { redirect } from "next/navigation";
import { ADMIN_ROUTES } from "@/helper/routes";

export default function LegacyLoginPage() {
  redirect(ADMIN_ROUTES.login);
}
