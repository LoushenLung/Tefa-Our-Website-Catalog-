"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, LogIn, UserPlus, LogOut, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Cek session di localStorage saat komponen mount
    const session = localStorage.getItem("user_session");
    if (session) {
      const userData = JSON.parse(session);
      setIsLoggedIn(true);
      setUserRole(userData.role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  // PINDAHKAN PENGECEKAN KE SINI (Setelah semua Hook dipanggil)
  if (pathname.startsWith("/customer") || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/70 backdrop-blur-md text-slate-900">
      {/* ... isi navbar kamu ... */}
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-8 lg:px-16">
         {/* Logo, Menu, dll */}
      </div>
    </nav>
  );
}