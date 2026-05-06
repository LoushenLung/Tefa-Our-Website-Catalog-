"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, User, ShoppingBag, LayoutDashboard, Store } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/user", icon: LayoutDashboard },
  { name: "My Orders", href: "/user/orders", icon: ShoppingBag },
  { name: "Profile", href: "/user/profile", icon: User },
];

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-red-600 text-white shadow-sm shadow-red-200">
                    <Store size={18} />
                  </div>
                  <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">SMK Telkom Malang</span>
                </Link>
              </div>
              <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive
                          ? "border-red-500 text-slate-900"
                          : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <item.icon size={16} className="mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center">
              <Link
                href="/sign-in"
                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:block">Sign Out</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden border-t border-slate-200">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive
                      ? "bg-red-50 border-red-500 text-red-700"
                      : "border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800"
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon size={18} className="mr-3" />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
