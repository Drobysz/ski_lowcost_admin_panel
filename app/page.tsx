import { redirect } from "next/navigation";
import { ADMIN_ROUTES } from "@/helper/routes";

export default function Home() {
  redirect(ADMIN_ROUTES.users);
}
