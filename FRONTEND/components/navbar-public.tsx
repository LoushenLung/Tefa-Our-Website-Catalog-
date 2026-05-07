"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Search, LogIn, UserPlus, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    if (session) {
      try {
        const userData = JSON.parse(session);
        setIsLoggedIn(true);
        setUserRole(userData.role);
      } catch (e) {
        console.error("Session parse error");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  // Pengecekan ini HARUS di bawah useEffect agar tidak melanggar aturan Hook
  if (pathname.startsWith("/customer") || pathname.startsWith("/admin") || pathname.startsWith("/user")) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/70 backdrop-blur-md text-slate-900">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-8 lg:px-16">
        <div className="flex items-center">
          <Link href="/" className="group flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 font-bold text-xl text-white transition-transform group-hover:scale-110 shadow-md">T</div>
            <span className="text-xl font-black tracking-tighter text-slate-900 italic">TEFA</span>
          </Link>
        </div>

        <div className="hidden flex-1 items-center justify-center md:flex ml-10">
          <div className="flex items-center gap-10">
            <Link href="/" className="text-sm font-bold text-slate-500 transition-colors hover:text-red-600">Home</Link>
            <Link href="#about" className="text-sm font-bold text-slate-500 transition-colors hover:text-red-600">About</Link>
            <Link href="/catalog" className="text-sm font-bold text-slate-500 transition-colors hover:text-red-600">Catalog</Link>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden xl:block">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search size={16} />
            </div>
            <input type="text" placeholder="Cari produk..." className="w-40 rounded-full border border-slate-200 bg-slate-100 py-1.5 pl-9 pr-4 text-xs text-slate-900 outline-none transition-all focus:w-52 focus:border-red-500 focus:bg-white" />
          </div>

          <div className="flex items-center gap-2">
            {!isLoggedIn ? (
              <>
                <Link href="/sign-in" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:text-red-600"><LogIn size={18} /> Login</Link>
                <Link href="/sign-up" className="flex items-center gap-2 rounded-full bg-red-600 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-red-200 transition-all hover:bg-red-700 active:scale-95"><UserPlus size={18} /> Sign Up</Link>
              </>
            ) : (
              <>
                <Link href={userRole === "ADMIN" ? "/admin" : "/customer"} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:text-red-600"><LayoutDashboard size={18} /> Dashboard</Link>
                <button onClick={handleLogout} className="flex items-center gap-2 rounded-full bg-slate-100 px-6 py-2 text-sm font-bold text-slate-700 transition-all hover:bg-red-50 hover:text-red-600 active:scale-95 border border-slate-200"><LogOut size={18} /> Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
