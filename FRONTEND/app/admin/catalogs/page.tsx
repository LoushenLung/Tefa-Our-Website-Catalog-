import { ShoppingBag } from "lucide-react";

export default function AdminCatalogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Katalog Produk</h2>
          <p className="text-sm text-slate-500">Kelola produk, kategori, dan tag katalog.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            Tambah Produk
          </button>
        </div>
      </div>
      
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-8 text-center text-slate-500">
        <ShoppingBag className="mx-auto h-12 w-12 text-slate-300 mb-4" />
        <p>Halaman manajemen katalog sedang dalam pengembangan.</p>
      </div>
    </div>
  );
}
