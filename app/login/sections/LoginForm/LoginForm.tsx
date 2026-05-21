"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { adminLogin } from "@/helper/api";
import {
  getAdminSession,
  setAdminSession,
} from "@/helper/auth";
import { ADMIN_ROUTES } from "@/helper/routes";
import { fieldErrors, loginSchema } from "@/helper/validation";
import styles from "./style.module.scss";

export function LoginForm() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (getAdminSession()) {
      router.replace(ADMIN_ROUTES.users);
    }
  }, [router]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFormErrors({});

    const formData = new FormData(event.currentTarget);
    const parsed = loginSchema.safeParse({
      name: formData.get("name"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      setFormErrors(fieldErrors(parsed.error));
      return;
    }

    setIsSaving(true);
    try {
      const tokens = await adminLogin(parsed.data);
      setAdminSession(tokens, parsed.data.name);
      router.replace(ADMIN_ROUTES.users);
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Unable to sign in with these credentials.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <h2>Welcome back</h2>
      <p>Sign in with your admin credentials.</p>
      <Input
        label="Admin name"
        name="name"
        placeholder="admin"
        autoComplete="username"
        error={formErrors.name}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="password123"
        autoComplete="current-password"
        error={formErrors.password}
      />
      {error ? <div className={styles.error}>{error}</div> : null}
      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
