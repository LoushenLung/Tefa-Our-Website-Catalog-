"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import {
    LayoutDashboard,
    Settings,
    LogOut,
    ShoppingCart,
    User,
    Menu,
    X,
    BookOpen,
    Search,
    Store, // Icon tambahan untuk "Jual"
    Package // Added Package icon
} from "lucide-react";
import { deleteCookie } from "@/lib/client-cookies";
import ContactModal from "./ContactModal";

export default function CustomerHeader() {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [userImage] = useState<string | null>(() => {
        if (typeof window === "undefined") return null;
        const session = localStorage.getItem("user_session");
        if (!session) return null;
        try {
            const parsedData = JSON.parse(session);
            return parsedData.image || null;
        } catch {
            console.error("Session error");
            return null;
        }
    });

    const handleLogout = async () => {
        await deleteCookie("accessToken");
        localStorage.removeItem("user_session");
        window.location.href = "/";
    };

    const menuItems = [
        { label: "Home", href: "/", icon: LayoutDashboard },
        { label: "My Profile", href: "/profile", icon: User },
        { label: "My Orders", href: "/orders", icon: Package }, // Changed to Package icon
        { label: "Keranjang", href: "/cart", icon: ShoppingCart },
        { label: "Catalog", href: "/catalog", icon: BookOpen },
        { label: "Settings", href: "/settings", icon: Settings },
    ];

    return (
        <>
            {/* HEADER */}
            <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md shadow-sm">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12 relative">
                    
                    {/* KIRI: Burger & Logo (1/3 lebar) */}
                    <div className="flex-1 flex items-center gap-6 justify-start">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform shadow-md shadow-red-200">
                                    <span className="text-white font-black text-xl italic">T</span>
                                </div>
                                <span className="text-xl font-black text-slate-900 tracking-tighter hidden sm:inline">
                                    TEFA <span className="text-red-600">MOKLET</span>
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* TENGAH: Navlinks (Terpusat & Terlindungi) */}
                    <div className="hidden lg:flex flex-1 items-center justify-center gap-8 px-4">
                        {[
                            { label: "About", href: "/#about" },
                            { label: "Majors", href: "/#majors" },
                            { label: "Catalog", href: "/catalog" },
                        ].map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={`text-sm font-bold transition-all hover:text-red-600 whitespace-nowrap ${
                                    pathname === link.href ? "text-red-600" : "text-slate-500"
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* KANAN: Search, Jual Produk, Cart, & Profile */}
                    <div className="flex-1 flex items-center gap-2 md:gap-3 justify-end">
                        
                        {/* Search Desktop */}
                        <div className="relative flex items-center">
                            <div 
                                className={`hidden xl:flex transition-all duration-300 ease-in-out ${
                                    isSearchFocused ? "w-44 lg:w-56" : "w-10"
                                }`}
                            >
                                <div 
                                    className={`relative transition-all duration-300 flex items-center h-10 w-full ${
                                        isSearchFocused
                                            ? "bg-slate-100 rounded-full px-4 ring-1 ring-slate-200 shadow-inner"
                                            : "bg-white border border-slate-200/60 shadow-sm justify-center cursor-pointer hover:bg-slate-50 hover:shadow-md hover:border-slate-300 rounded-full"
                                    }`}
                                    onClick={() => !isSearchFocused && searchInputRef.current?.focus()}
                                >
                                    <Search 
                                        size={18} 
                                        className={`transition-colors shrink-0 ${
                                            isSearchFocused ? "text-slate-400 mr-2" : "text-slate-500"
                                        }`} 
                                    />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Cari project..."
                                        onFocus={() => setIsSearchFocused(true)}
                                        onBlur={(e) => {
                                            if (!e.target.value.trim()) setIsSearchFocused(false);
                                        }}
                                        className={`bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400 transition-all duration-300 ${
                                            isSearchFocused ? "w-full opacity-100" : "w-0 opacity-0 pointer-events-none"
                                        }`}
                                    />
                                </div>
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

                        <div className="flex items-center gap-2">
                            {/* Cart */}
                            <Link href="/cart" className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors group">
                                <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                            </Link>

                            {/* AVATAR */}
                            <Link 
                                href="/profile"
                                className="h-10 w-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-slate-500 hover:border-red-500 transition-all overflow-hidden shrink-0"
                            >
                                {userImage ? (
                                    <img src={userImage} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    <User size={20} />
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <ContactModal 
                isOpen={isContactModalOpen} 
                onClose={() => setIsContactModalOpen(false)} 
            />

            {/* SIDEBAR OVERLAY */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR PANEL */}
            <aside className={`
                fixed top-0 left-0 z-[60] h-full w-72 bg-white shadow-2xl transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="flex items-center justify-between p-6 border-b border-slate-50">
                    <div className="flex items-center gap-2 text-red-600">
                        <div className="h-8 w-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">T</div>
                        <span className="font-black text-xl tracking-tighter text-slate-900">TEFA <span className="text-red-600">MENU</span></span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                                    isActive 
                                    ? "bg-red-50 text-red-600 shadow-sm" 
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                            >
                                <item.icon size={20} className={isActive ? "text-red-600" : "text-slate-400"} />
                                <span className="text-sm">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-all"
                    >
                        <LogOut size={20} />
                        <span className="text-sm">Log Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}