"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NavbarPublic from "./navbar-public";
import CustomerHeader from "./appsidebar-customer";

export default function NavbarRoot({ initialIsLoggedIn }: { initialIsLoggedIn: boolean }) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Cek session di localStorage
    const session = localStorage.getItem("user_session");
    setIsLoggedIn(!!session);
  }, []);

  // Cegah Hydration Error (SSR mismatch)
  if (!mounted) return <div className="h-16 w-full" />;

  // Jika sedang di dashboard customer (URL /customer/...), return null.
  if (pathname.startsWith("/customer")) {
    return null;
  }

  // Khusus halaman Catalog: Jika sudah login pakai sidebar customer
  if (pathname.startsWith("/catalog")) {
    if (isLoggedIn) return <CustomerHeader />;
    return <NavbarPublic />;
  }

  // Halaman public lainnya (seperti Home): Selalu pakai NavbarPublic (tanpa tombol Dashboard/Logout)
  return <NavbarPublic />;
}