"use client";

import { usePathname } from "next/navigation";
import NavbarPublic from "./navbar-public";
import CustomerHeader from "./appsidebar-customer";

export default function NavbarRoot({ initialIsLoggedIn }: { initialIsLoggedIn: boolean }) {
  const pathname = usePathname();
  const hasLocalSession =
    typeof window !== "undefined" && !!window.localStorage.getItem("user_session");
  const isLoggedIn = initialIsLoggedIn || hasLocalSession;

  // Route yang punya layout/header sendiri, jadi global navbar harus dimatikan.
  if (
    pathname.startsWith("/customer") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/auth")
  ) {
    return null;
  }

  // Jika user sudah login, tampilkan header customer pada halaman utama user.
  if (isLoggedIn) return <CustomerHeader />;

  // Halaman publik (tanpa auth)
  return <NavbarPublic />;
}