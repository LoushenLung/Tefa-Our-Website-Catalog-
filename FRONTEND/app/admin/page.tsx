"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShoppingBag, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from "lucide-react";

const stats = [
  {
    name: "Total Catalogs",
    value: "142",
    change: "+12.5%",
    changeType: "positive",
    icon: ShoppingBag,
  },
  {
    name: "Total Orders",
    value: "854",
    change: "+24.1%",
    changeType: "positive",
    icon: ShoppingCart,
  },
  {
    name: "Active Users",
    value: "1,240",
    change: "+8.2%",
    changeType: "positive",
    icon: Users,
  },
  {
    name: "Revenue",
    value: "Rp 12.5M",
    change: "-3.1%",
    changeType: "negative",
    icon: TrendingUp,
  },
];

const recentOrders = [
  { id: "ORD-001", customer: "Budi Santoso", product: "Website Profil Sekolah", date: "Today", status: "Completed" },
  { id: "ORD-002", customer: "Siti Aminah", product: "Aplikasi Kasir", date: "Yesterday", status: "Processing" },
  { id: "ORD-003", customer: "Ahmad Fauzi", product: "Desain Logo Perusahaan", date: "Yesterday", status: "Completed" },
  { id: "ORD-004", customer: "Diana Putri", product: "Sistem Informasi Desa", date: "May 2, 2026", status: "Pending" },
  { id: "ORD-005", customer: "Rudi Hartono", product: "Aplikasi Absensi", date: "May 1, 2026", status: "Completed" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    if (!session) {
      router.push("/sign-in");
      return;
    }

    const userData = JSON.parse(session);
    if (userData.role !== "admin") {
      alert("Access Denied: Admin only.");
      router.push("/user");
      return;
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <stat.icon size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span 
                className={`flex items-center font-medium ${
                  stat.changeType === "positive" ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {stat.changeType === "positive" ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
                {stat.change}
              </span>
              <span className="ml-2 text-slate-500">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">{order.id}</td>
                  <td className="whitespace-nowrap px-6 py-4">{order.customer}</td>
                  <td className="whitespace-nowrap px-6 py-4">{order.product}</td>
                  <td className="whitespace-nowrap px-6 py-4">{order.date}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span 
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        order.status === "Completed" ? "bg-emerald-100 text-emerald-800" :
                        order.status === "Processing" ? "bg-blue-100 text-blue-800" :
                        "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-200 px-6 py-4">
          <a href="/admin/orders" className="text-sm font-medium text-red-600 hover:text-red-700">
            View all orders &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
