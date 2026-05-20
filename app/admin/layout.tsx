import { AdminLayout } from "@/components/AdminLayout";
import type { AdminRouteLayoutProps } from "./layout.props";

export default function Layout({ children }: AdminRouteLayoutProps) {
  return <AdminLayout>{children}</AdminLayout>;
}
