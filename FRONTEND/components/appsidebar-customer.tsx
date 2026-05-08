"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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
    Store // Icon tambahan untuk "Jual"
} from "lucide-react";
import { deleteCookie } from "@/lib/client-cookies";

export default function CustomerHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userImage, setUserImage] = useState<string | null>(null);

    useEffect(() => {
        const session = localStorage.getItem("user_session");
        if (session) {
            try {
                const parsedData = JSON.parse(session);
                setUserImage(parsedData.image || null);
            } catch (e) {
                console.error("Session error");
            }
        }
    }, [pathname]);

    const handleLogout = async () => {
        await deleteCookie("accessToken");
        localStorage.removeItem("user_session");
        window.location.href = "/";
    };

    const menuItems = [
        { label: "Dashboard", href: "/customer", icon: LayoutDashboard },
        { label: "My Profile", href: "/customer/profile", icon: User },
        { label: "Keranjang", href: "/customer/cart", icon: ShoppingCart },
        { label: "Catalog", href: "../catalog", icon: BookOpen },
        { label: "Settings", href: "/customer/settings", icon: Settings },
    ];

    return (
        <>
            {/* HEADER */}
            <nav className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-6 lg:px-10">
                    
                    {/* KIRI: Burger & Logo */}
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        
                        <Link href="/customer" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 font-bold text-white shadow-md">
                                T
                            </div>
                            <span className="font-black text-xl tracking-tighter text-slate-900">TEFA <span className="text-red-600">MOKLET</span></span>
                        </Link>
                    </div>

                    {/* KANAN: Search, Jual Produk, Cart, & Profile */}
                    <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
                        
                        {/* Search Desktop */}
                        <div className="relative hidden lg:block">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari project..."
                                className="w-40 lg:w-56 rounded-full border-none bg-slate-100 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                            />
                        </div>

                        {/* TOMBOL MAU JUAL PRODUK? */}
                        <Link 
                            href="/customer/#footer-customer" 
                            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border-2 border-red-100 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 group"
                        >
                            <Store size={16} className="group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-black uppercase tracking-wider">Mau Jual Produk?</span>
                        </Link>

                        <div className="flex items-center gap-2">
                            {/* Cart */}
                            <Link href="/customer/cart" className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors group">
                                <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white border-2 border-white">
                                    0
                                </span>
                            </Link>

                            {/* AVATAR */}
                            <Link 
                                href="/customer/profile"
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