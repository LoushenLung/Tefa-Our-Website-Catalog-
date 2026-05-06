import { ShoppingCart } from "lucide-react";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Pesanan & Pembayaran</h2>
          <p className="text-sm text-slate-500">Kelola pesanan pelanggan dan verifikasi bukti pembayaran.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Action buttons could go here */}
        </div>
      </div>
      
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-8 text-center text-slate-500">
        <ShoppingCart className="mx-auto h-12 w-12 text-slate-300 mb-4" />
        <p>Halaman manajemen pesanan sedang dalam pengembangan.</p>
      </div>
    </div>
  );
}
