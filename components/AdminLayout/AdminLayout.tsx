"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminFooter } from "@/components/AdminFooter";
import { AdminSidebar } from "@/components/AdminSidebar";
import { adminLogout } from "@/helper/api";
import { clearAdminSession, getAdminSession } from "@/helper/auth";
import { ADMIN_ROUTES } from "@/helper/routes";
import styles from "./style.module.scss";
import type { AdminLayoutProps } from "./AdminLayout.props";

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getAdminSession()) {
      router.replace(ADMIN_ROUTES.login);
      return;
    }

    window.setTimeout(() => setReady(true), 0);
  }, [router]);

  async function onLogout() {
    try {
      await adminLogout();
    } catch {
      // Local session cleanup is still valid when the API is unavailable.
    } finally {
      clearAdminSession();
      router.replace(ADMIN_ROUTES.login);
    }
  }

  if (!ready) {
    return null;
  }

  return (
    <main className={styles.shell}>
      <div className={styles.frame}>
        <AdminSidebar onLogout={onLogout} />
        <section className={styles.content}>
          <div className={styles.inner}>{children}</div>
          <AdminFooter />
        </section>
      </div>
    </main>
  );
}
