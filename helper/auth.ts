"use client";

import type { LoginValues } from "@/interface/auth.interface";
import type { TokenPair } from "@/interface/api.interface";
import { ADMIN_ROUTES } from "./routes";

const ACCESS_KEY = "zarza_admin_access_token";
const REFRESH_KEY = "zarza_admin_refresh_token";
const ADMIN_NAME_KEY = "zarza_admin_name";

export function getAdminSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const accessToken = window.sessionStorage.getItem(ACCESS_KEY);
  const refreshToken = window.sessionStorage.getItem(REFRESH_KEY);
  const adminName = window.sessionStorage.getItem(ADMIN_NAME_KEY) ?? "Admin";

  if (!accessToken || !refreshToken) {
    return null;
  }

  return { accessToken, refreshToken, adminName };
}

export function setAdminSession(tokens: TokenPair, adminName = "Admin") {
  window.sessionStorage.setItem(ACCESS_KEY, tokens.access_token);
  window.sessionStorage.setItem(REFRESH_KEY, tokens.refresh_token);
  window.sessionStorage.setItem(ADMIN_NAME_KEY, adminName);
}

export function clearAdminSession() {
  window.sessionStorage.removeItem(ACCESS_KEY);
  window.sessionStorage.removeItem(REFRESH_KEY);
  window.sessionStorage.removeItem(ADMIN_NAME_KEY);
}

export function canUseDemoLogin(values: LoginValues) {
  return values.name === "admin" && values.password === "password123";
}

export function demoTokens(): TokenPair {
  return {
    access_token: "demo-admin-access-token",
    refresh_token: "demo-admin-refresh-token",
  };
}

export function requireAdminSession() {
  const session = getAdminSession();

  if (!session) {
    window.location.href = ADMIN_ROUTES.login;
    return null;
  }

  return session;
}
