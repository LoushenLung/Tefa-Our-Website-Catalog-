"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ShoppingCart, 
  Users, 
  GraduationCap,
  Inbox, 
  LogOut,
  Store,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Pesanan", href: "/admin/orders", icon: ShoppingCart },
  { name: "Katalog Produk", href: "/admin/catalogs", icon: ShoppingBag },
  { name: "Akademik", href: "/admin/academic", icon: GraduationCap },
  { name: "Pelanggan", href: "/admin/users", icon: Users },
  { name: "Kotak Masuk", href: "/admin/inbox", icon: Inbox },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-red-600 text-white shadow-sm shadow-red-200">
                <Store size={18} />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">Admin Panel</span>
            </Link>
            <button 
              className="md:hidden text-slate-500 hover:text-slate-700"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive 
                      ? "bg-red-50 text-red-700" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <item.icon size={18} className={isActive ? "text-red-600" : "text-slate-400"} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer (Logout) */}
          <div className="border-t border-slate-200 p-4">
            <Link
              href="/sign-in"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-red-50 hover:text-red-700"
            >
              <LogOut size={18} className="text-slate-400" />
              Sign Out
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm md:px-8">
          <div className="flex items-center gap-4">
            <button 
              className="text-slate-500 hover:text-slate-700 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-slate-800">
              {navigation.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.name || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Admin Profile simple indicator */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-sm">
                A
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:block">Admin User</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
