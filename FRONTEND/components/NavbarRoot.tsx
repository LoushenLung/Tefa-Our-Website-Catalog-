"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NavbarPublic from "./navbar-public";
import CustomerHeader from "./appsidebar-customer";

export default function NavbarRoot() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Cek session di localStorage
    const session = localStorage.getItem("user_session");
    setIsLoggedIn(!!session);
  }, []);

  // Cegah Hydration Error (SSR mismatch)
  if (!mounted) return <div className="h-16 w-full" />;

  // Jika sedang di dashboard customer (URL /customer/...), 
  // biasanya sidebar sudah dihandle layout dashboard sendiri, maka return null.
  if (pathname.startsWith("/customer")) {
    return null;
  }

  // Jika sudah login dan sedang di katalog atau landing page
  if (isLoggedIn) {
    return <CustomerHeader />;
  }

  // Jika belum login
  return <NavbarPublic serverIsLoggedIn={false} />;
}