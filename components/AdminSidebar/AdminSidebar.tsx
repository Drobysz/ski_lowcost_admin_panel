"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icon";
import { getAdminSession } from "@/helper/auth";
import { initials } from "@/helper/format";
import { ADMIN_ROUTES } from "@/helper/routes";
import styles from "./style.module.scss";
import type { AdminSidebarProps } from "./AdminSidebar.props";

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname();
  const adminName = getAdminSession()?.adminName ?? "Admin";
  const items = [
    { href: ADMIN_ROUTES.users, label: "Users", icon: "users" },
    { href: ADMIN_ROUTES.rooms, label: "Rooms", icon: "bed" },
    {
      href: ADMIN_ROUTES.accommodations,
      label: "Reservations",
      icon: "calendar",
    },
  ];

  return (
    <aside className={styles.sidebar}>
      <div>
        <h1>Admin Panel</h1>
        <p>Zarza-Ski Management</p>
      </div>
      <nav className={styles.nav}>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={pathname === item.href ? styles.active : ""}
          >
            <Icon name={item.icon} />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className={styles.profile}>
        <div className={styles.divider} />
        <div className={styles.person}>
          <span>{initials(adminName)}</span>
          <div>
            <strong>{adminName}</strong>
            <small>System Admin</small>
          </div>
        </div>
        <button type="button" onClick={onLogout}>
          Sign out
        </button>
      </div>
    </aside>
  );
}
