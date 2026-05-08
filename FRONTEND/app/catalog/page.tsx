"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Search, Star, ChevronDown, Loader2 } from "lucide-react";
import { getPublicProjects } from "@/lib/actions/public-catalog";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  thumbnail: string | null;
  averageRating: number;
  totalReviews: number;
  category: { name: string; slug: string };
  status: string;
}

// ─── Helpers & Config ────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: "Semua", slug: "all" },
  { label: "Software & Web", slug: "software-web" },
  { label: "IoT & Jaringan", slug: "iot-jaringan" },
  { label: "Game & Animasi", slug: "game-animasi" },
];

const SORT_OPTIONS = [
  { label: "Terbaru", value: "newest" },
  { label: "Rating Tertinggi", value: "rating-desc" },
  { label: "Harga: Rendah → Tinggi", value: "price-asc" },
  { label: "Harga: Tinggi → Rendah", value: "price-desc" },
];

const formatIDR = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

// ─── Sub-Components ──────────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-xl hover:border-red-100 transition-all duration-300">
      <div className="relative h-52 bg-slate-100 overflow-hidden">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <Search size={40} strokeWidth={1} />
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1 gap-3">
        <span className="self-start text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-red-50 text-red-600">
          {product.category.name}
        </span>
        
        <h3 className="font-black text-slate-900 text-base leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
          {product.title}
        </h3>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star 
                key={s} 
                size={14} 
                className={product.averageRating >= s ? "text-yellow-400 fill-yellow-400" : "text-slate-200 fill-slate-200"} 
              />
            ))}
          </div>
          <span className="text-xs font-bold text-slate-700">{product.averageRating.toFixed(1)}</span>
          <span className="text-xs text-slate-400">({product.totalReviews})</span>
        </div>

        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
          {product.description || "Tidak ada deskripsi tersedia."}
        </p>

        <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-50">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Mulai dari</p>
            <p className="text-lg font-black text-slate-900">{formatIDR(product.price)}</p>
          </div>
          <Link
            href={`/catalog/${product.slug}`}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl transition-all active:scale-95 shadow-md shadow-red-100"
          >
            <ShoppingCart size={14} />
            DETAIL
          </Link>
        </div>
      </div>
    </article>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getPublicProjects();
        
        // NORMALISASI DATA: Menangani error (data || []).map is not a function
        const rawItems = Array.isArray(response) ? response : (response?.data || []);
        
        const formatted = rawItems.map((item: any) => ({
          id: String(item.id),
          title: item.title || "Tanpa Judul",
          slug: item.slug || String(item.id),
          description: item.description || "",
          price: Number(item.price) || 0,
          thumbnail: item.thumbnail || null,
          averageRating: Number(item.averageRating) || 0,
          totalReviews: Number(item.totalReviews) || 0,
          category: item.category || { name: "Lainnya", slug: "other" },
          status: item.status || "PUBLISHED",
        }));

        setProducts(formatted);
      } catch (err) {
        console.error("Catalog fetch error:", err);
        setError("Gagal memuat data katalog produk.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => p.status === "PUBLISHED");

    if (activeCategory !== "all") {
      result = result.filter((p) => p.category.slug === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    // Sort Logic
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sortBy === "rating-desc") result.sort((a, b) => b.averageRating - a.averageRating);

    return result;
  }, [products, search, activeCategory, sortBy]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* HERO SECTION */}
      <section className="pt-32 pb-16 px-6 lg:px-12 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-600 text-[10px] font-black uppercase mb-4">
            🔥 Inovasi Terbaru Siswa
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            Katalog <span className="text-red-600 underline decoration-red-200 underline-offset-8">Produk</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
            Temukan solusi teknologi terbaik mulai dari Website, IoT, hingga Game hasil karya siswa SMK Telkom Malang.
          </p>
        </div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-100 rounded-full blur-3xl opacity-40" />
      </section>

      {/* FILTER & SEARCH BAR (Sticky) */}
      <section className="sticky top-16 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-100 py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-4 items-center">
          
          <div className="relative w-full lg:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Cari project inovatif..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-red-500/20 transition-all outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === cat.slug
                      ? "bg-white text-red-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 bg-slate-100 border-none rounded-2xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-red-500/20 outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>
          </div>

        </div>
      </section>

      {/* PRODUCT GRID SECTION */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-red-600" size={40} />
            <p className="text-slate-500 font-bold">Memuat katalog...</p>
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-red-500 font-bold">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold"
            >
              Coba Lagi
            </button>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <Search className="mx-auto text-slate-200 mb-4" size={64} />
            <h3 className="text-lg font-black text-slate-900">Produk Tidak Ditemukan</h3>
            <p className="text-slate-400 text-sm">Coba gunakan kata kunci atau kategori yang berbeda.</p>
          </div>
        )}
      </main>

      {/* FOOTER SIMPLE */}
      <footer className="bg-white border-t border-slate-100 py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            © 2026 TEFA MOKLET - SMK Telkom Malang
          </p>
        </div>
      </footer>
    </div>
  );
}