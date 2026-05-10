"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CreditCard,
  ExternalLink,
  Search,
  Filter,
  Loader2
} from "lucide-react";
import { fetchUserOrders } from "@/app/customer/actions/orders";

interface OrderItem {
  id: number;
  projectId: number | null;
  projectName: string;
  price: number;
  thumbnail: string | null;
  quantity: number;
}

interface Order {
  id: number;
  orderCode: string;
  totalPrice: number;
  status: "PENDING" | "PENDING_PAYMENT" | "WAITING_VERIFICATION" | "PAID" | "REJECTED" | "CANCELLED";
  customerName: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchUserOrders();
        setOrders(data);
      } catch (err: any) {
        console.error("Order fetch error:", err);
        setError(err.message || "Terjadi kesalahan saat menghubungi server.");
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const getStatusConfig = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
      case "PENDING_PAYMENT":
        return {
          label: "Menunggu Pembayaran",
          icon: Clock,
          color: "text-orange-600 bg-orange-50 border-orange-100",
          iconColor: "text-orange-400"
        };
      case "WAITING_VERIFICATION":
        return {
          label: "Menunggu Verifikasi",
          icon: AlertCircle,
          color: "text-blue-600 bg-blue-50 border-blue-100",
          iconColor: "text-blue-400"
        };
      case "PAID":
        return {
          label: "Selesai",
          icon: CheckCircle2,
          color: "text-green-600 bg-green-50 border-green-100",
          iconColor: "text-green-400"
        };
      case "REJECTED":
      case "CANCELLED":
        return {
          label: "Dibatalkan",
          icon: XCircle,
          color: "text-red-600 bg-red-50 border-red-100",
          iconColor: "text-red-400"
        };
      default:
        return {
          label: status,
          icon: AlertCircle,
          color: "text-slate-600 bg-slate-50 border-slate-100",
          iconColor: "text-slate-400"
        };
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filterStatus === "ALL") return true;
    if (filterStatus === "ACTIVE") return ["PENDING", "PENDING_PAYMENT", "WAITING_VERIFICATION"].includes(order.status);
    if (filterStatus === "COMPLETED") return order.status === "PAID";
    if (filterStatus === "CANCELLED") return ["REJECTED", "CANCELLED"].includes(order.status);
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest">
            <Package size={12} /> Riwayat Transaksi
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Pesanan Saya</h1>
          <p className="text-slate-500">Pantau status pembayaran dan akses produk digitalmu di sini.</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-100">
          {[
            { id: "ALL", label: "Semua" },
            { id: "ACTIVE", label: "Aktif" },
            { id: "COMPLETED", label: "Selesai" },
            { id: "CANCELLED", label: "Batal" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterStatus === tab.id
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-red-50 rounded-full animate-pulse"></div>
            <Loader2 className="absolute inset-0 m-auto text-red-600 animate-spin" size={32} />
          </div>
          <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-[10px]">Memuat Pesanan...</p>
        </div>
      ) : error ? (
        <div className="py-20 flex flex-col items-center text-center gap-6 bg-white rounded-[3rem] border border-red-100 border-dashed">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500">
            <AlertCircle size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900">Ups! Terjadi Kesalahan</h3>
            <p className="text-slate-500 max-w-sm">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-10 py-4 bg-red-600 text-white font-black rounded-2xl shadow-lg shadow-red-100 hover:bg-red-700 transition-all active:scale-95"
          >
            Coba Lagi
          </button>
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const config = getStatusConfig(order.status);
            const date = new Date(order.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });

            return (
              <div
                key={order.id}
                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-red-100 transition-all overflow-hidden group"
              >
                {/* Order Top Bar */}
                <div className="px-8 py-5 bg-slate-50/50 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Code</p>
                      <p className="font-black text-slate-900 group-hover:text-red-600 transition-colors">{order.orderCode}</p>
                    </div>
                    <div className="w-px h-8 bg-slate-200 hidden sm:block" />
                    <div className="space-y-0.5 hidden sm:block">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tanggal</p>
                      <p className="font-bold text-slate-600">{date}</p>
                    </div>
                  </div>

                  <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${config.color} text-xs font-black`}>
                    <config.icon size={14} className={config.iconColor} />
                    {config.label}
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-8 grid md:grid-cols-3 gap-10">
                  <div className="md:col-span-2 space-y-6">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-6 items-center">
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                          <Image
                            src={item.thumbnail || "/placeholder.png"}
                            alt={item.projectName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h4 className="font-black text-slate-900">{item.projectName}</h4>
                          <p className="text-slate-500 text-sm">{item.quantity} x Rp {item.price.toLocaleString("id-ID")}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-slate-900">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary & Actions */}
                  <div className="md:col-span-1 space-y-6 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-10">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Pembayaran</p>
                      <p className="text-2xl font-black text-red-600">Rp {order.totalPrice.toLocaleString("id-ID")}</p>
                    </div>

                    <div className="space-y-3">
                      {order.status === "PENDING_PAYMENT" && (
                        <button className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100">
                          <CreditCard size={18} />
                          Bayar Sekarang
                        </button>
                      )}

                      <Link
                        href={`/orders/${order.id}`}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-white border-2 border-slate-100 text-slate-700 font-black rounded-xl hover:border-red-200 hover:text-red-600 transition-all"
                      >
                        Lihat Detail
                        <ChevronRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center text-center gap-6 bg-white rounded-[3rem] border border-slate-100 border-dashed">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
            <Package size={48} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900">Belum Ada Pesanan</h3>
            <p className="text-slate-500">Sepertinya kamu belum pernah melakukan transaksi.</p>
          </div>
          <Link
            href="/catalog"
            className="px-10 py-4 bg-red-600 text-white font-black rounded-2xl shadow-lg shadow-red-100 hover:bg-red-700 transition-all active:scale-95"
          >
            Mulai Belanja
          </Link>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-12 p-8 bg-slate-900 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="relative z-10 space-y-2">
          <h3 className="text-xl font-black">Butuh bantuan dengan pesananmu?</h3>
          <p className="text-slate-400 text-sm">Tim support kami siap membantu kendala pembayaran atau akses produkmu.</p>
        </div>
        <button className="relative z-10 px-8 py-3 bg-white text-slate-900 font-black rounded-xl hover:bg-red-500 hover:text-white transition-all whitespace-nowrap">
          Hubungi Admin
        </button>
      </div>
    </div>
  );
}
