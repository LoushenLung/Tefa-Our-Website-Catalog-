"use client";

import Link from "next/link";
import { Search, Store } from "lucide-react";
import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import ContactModal from "./ContactModal";

function HeaderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    const query = searchParams.get("search") || "";
    setSearchQuery(query);
    if (query) {
      setIsSearchFocused(true);
    } else {
      setIsSearchFocused(false);
    }
  }, [searchParams]);

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* Kolom Kiri: Logo (Anchored Left) */}
        <div className="flex-1 flex justify-start items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform shadow-lg shadow-red-200">
              <span className="text-white font-black text-xl italic">T</span>
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tighter">
              TEFA <span className="text-red-600">MOKLET</span>
            </span>
          </Link>
        </div>

        {/* Kolom Tengah: Navlinks (Bener-bener di Tengah) */}
        <div className="hidden lg:flex items-center justify-center gap-10 px-4">
          {[
            { label: "About", href: "/#about" },
            { label: "Majors", href: "/#majors" },
            { label: "Catalog", href: "/catalog" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-sm font-bold tracking-wide transition-all hover:text-red-600 whitespace-nowrap py-1 border-b-2 border-transparent hover:border-red-600 ${
                pathname === link.href ? "text-red-600 border-red-600" : "text-slate-500"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Kolom Kanan: Search, Jual Produk & Auth (Tight & Symmetric) */}
        <div className="flex-1 flex items-center justify-end gap-2 md:gap-3">
          
          {/* Group Search & Contact */}
          <div className="flex items-center gap-2">
            {/* Search Desktop */}
            <div className="relative flex items-center">
              <div 
                className={`hidden xl:flex transition-all duration-300 ease-in-out ${
                  isSearchFocused ? "w-44 lg:w-56" : "w-10"
                }`}
              >
                <form onSubmit={handleSearch} className="w-full h-10 relative flex items-center">
                  <div 
                    className={`flex items-center h-full w-full px-2.5 transition-all duration-300 ${
                      isSearchFocused
                        ? "bg-slate-100 rounded-full shadow-inner ring-1 ring-slate-200"
                        : "bg-white border border-slate-200/60 shadow-sm justify-center cursor-pointer hover:bg-slate-50 hover:shadow-md hover:border-slate-300 rounded-full"
                    }`}
                    onClick={() => !isSearchFocused && searchInputRef.current?.focus()}
                  >
                    <Search 
                      size={18} 
                      className={`shrink-0 transition-colors ${isSearchFocused ? "text-slate-400 mr-2" : "text-slate-500"}`} 
                    />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Cari project..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => {
                        if (!searchQuery.trim()) setIsSearchFocused(false);
                      }}
                      className={`bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400 transition-all duration-300 ${
                        isSearchFocused ? "w-full opacity-100" : "w-0 opacity-0 pointer-events-none"
                      }`}
                    />
                  </div>
                </form>
              </div>
            </div>

            {/* Mau Jual Produk? (mengecil saat search aktif) */}
            <button 
              onClick={() => setIsContactModalOpen(true)}
              className={`hidden xl:flex items-center gap-2 rounded-full border border-red-100 bg-red-50/50 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 group overflow-hidden whitespace-nowrap shadow-sm shadow-red-50 ${
                  isSearchFocused ? "max-w-0 px-0 border-0 opacity-0" : "max-w-[200px] px-3 py-2 opacity-100"
              }`}
            >
              <Store size={14} className="group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Mau Jual Produk?</span>
            </button>
          </div>

          {/* Auth Group */}
          <div className="flex items-center gap-2">
            <Link
              href="/sign-in"
              className="px-4 py-2 text-slate-700 bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 hover:text-red-600 font-bold text-sm transition-all rounded-full"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-bold transition-all shadow-md shadow-red-100 active:scale-95"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

    </nav>
    <ContactModal 
      isOpen={isContactModalOpen} 
      onClose={() => setIsContactModalOpen(false)} 
    />
    </>
  );
}

export default function Header() {
  return (
    <Suspense fallback={null}>
      <HeaderContent />
    </Suspense>
  );
}
