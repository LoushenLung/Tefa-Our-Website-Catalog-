"use client";

import Link from "next/link";
import { Search, LogIn, UserPlus } from "lucide-react";

export default function Navbar() {
  return (
    // Mengubah text-white menjadi text-slate-900 dan bg-white/70 untuk efek glassmorphism cerah
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/70 backdrop-blur-md text-slate-900">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-8 lg:px-16">
        
        {/* KIRI: Logo Brand */}
        <div className="flex items-center">
          <Link href="/" className="group flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 font-bold text-xl text-white transition-transform group-hover:scale-110">
              T
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900">
              TEFA
            </span>
          </Link>
        </div>

        {/* TENGAH: Menu Navigasi */}
        <div className="hidden flex-1 items-center justify-center md:flex ml-10">
          <div className="flex items-center gap-10">
            <Link 
              href="#about" 
              className="text-sm font-bold text-slate-500 transition-colors hover:text-red-600"
            >
              About
            </Link>
            <Link 
              href="#tefa" 
              className="text-sm font-bold text-slate-500 transition-colors hover:text-red-600"
            >
              TEFA
            </Link>
            <Link 
              href="#majors" 
              className="text-sm font-bold text-slate-500 transition-colors hover:text-red-600"
            >
              Majors
            </Link>
            <Link 
              href="#products" 
              className="text-sm font-bold text-slate-500 transition-colors hover:text-red-600"
            >
              Products
            </Link>
            <Link 
              href="/catalog" 
              className="text-sm font-bold text-slate-500 transition-colors hover:text-red-600"
            >
              Catalog
            </Link>
          </div>
        </div>

        {/* KANAN: Search & Auth (Lebih ke kanan) */}
        <div className="flex items-center gap-6">
          {/* Search Bar - Warna Border & Text disesuaikan */}
          <div className="relative hidden xl:block">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Cari produk..."
              className="w-40 rounded-full border border-slate-200 bg-slate-100 py-1.5 pl-9 pr-4 text-xs text-slate-900 outline-none transition-all focus:w-52 focus:border-red-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/sign-in"
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:text-red-600"
            >
              <LogIn size={18} />
              <span className="hidden sm:inline">Login</span>
            </Link>
            
            <Link
              href="/sign-up"
              className="flex items-center gap-2 rounded-full bg-red-600 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-red-200 transition-all hover:bg-red-700 active:scale-95"
            >
              <UserPlus size={18} />
              <span>Sign Up</span>
            </Link>
          </div>
        </div>

      </div>
    </nav>
  );
}