"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Search, Star, ChevronDown, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: "IDR" | "USD";
  stock: number;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  specs: Record<string, string>;
  category: { name: string; slug: string };
  image: string;
  badge?: string;
  rating: number;
  reviewCount: number;
}

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
  { label: "Nama A–Z", value: "name-asc" },
];

function formatIDR(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

const BADGE_STYLES: Record<string, string> = {
  Terlaris: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Baru: "bg-green-50 text-green-700 border-green-200",
  "Pilihan Editor": "bg-purple-50 text-purple-700 border-purple-200",
  Hot: "bg-red-50 text-red-700 border-red-200",
  Inovasi: "bg-blue-50 text-blue-700 border-blue-200",
};

const CATEGORY_ACCENT: Record<string, { text: string; bg: string }> = {
  "Software & Web": { text: "text-red-600", bg: "bg-red-50" },
  "IoT & Jaringan": { text: "text-blue-600", bg: "bg-blue-50" },
  "Game & Animasi": { text: "text-purple-600", bg: "bg-purple-50" },
};

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star;
          const half = !filled && rating >= star - 0.5;
          return (
            <div key={star} className="relative w-3.5 h-3.5">
              <Star size={14} className="text-slate-200 fill-slate-200 absolute inset-0" />
              {(filled || half) && (
                <div className={`absolute inset-0 overflow-hidden ${half ? "w-1/2" : "w-full"}`}>
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <span className="text-xs font-bold text-slate-700">{rating.toFixed(1)}</span>
      <span className="text-xs text-slate-400">({reviewCount})</span>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false);
  const accent = CATEGORY_ACCENT[product.category.name] ?? { text: "text-slate-500", bg: "bg-slate-100" };

  return (
    <article className="group relative flex flex-col bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-slate-200/60 hover:border-red-100 transition-all duration-300">
      <div className="relative h-52 overflow-hidden bg-slate-100">
        {!imgError && product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {product.badge && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-bold border rounded-full bg-white/90 backdrop-blur-sm ${BADGE_STYLES[product.badge] ?? "text-slate-600 border-slate-200"}`}>
            {product.badge}
          </span>
        )}

        <span className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold rounded-full bg-white/90 backdrop-blur-sm border ${
          product.stock === 0
            ? "text-red-600 border-red-200"
            : product.stock < 5
            ? "text-orange-600 border-orange-200"
            : "text-green-600 border-green-200"
        }`}>
          {product.stock === 0 ? "Habis" : product.stock < 5 ? `Sisa ${product.stock}` : "Tersedia"}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-5 gap-3">
        <span className={`self-start text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${accent.text} ${accent.bg}`}>
          {product.category.name}
        </span>

        <h3 className="font-black text-slate-900 text-base leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
          {product.name}
        </h3>

        <StarRating rating={product.rating} reviewCount={product.reviewCount} />

        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{product.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {Object.entries(product.specs)
            .slice(0, 2)
            .map(([k, v]) => (
              <span key={k} className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-500">
                <span className="text-slate-400">{k}:</span> {v}
              </span>
            ))}
        </div>

        <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-100">
          <div>
            <div className="text-xs text-slate-400 mb-0.5">Mulai dari</div>
            <div className="text-lg font-black text-slate-900">{formatIDR(product.price)}</div>
          </div>
          <Link
            href={`/catalog/${product.slug}`}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all active:scale-95 shadow-md shadow-red-100"
          >
            <ShoppingCart size={14} />
            Detail
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const searchParams = useSearchParams();

  // Initialize search from URL query parameter if present
  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearch(decodeURIComponent(query));
    }
  }, [searchParams]);

  // ─── Fetch Data dari Backend ───────────────────────────────────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/projects`); 
        
        if (!response.ok) {
          throw new Error("Gagal mengambil data katalog dari server.");
        }
        
        const data = await response.json();
        const productArray = Array.isArray(data) ? data : data.data || [];

        // Mapping response dari backend ke state yang dibutuhkan UI
        const formattedProducts: Product[] = productArray.map((item: any) => ({
          id: String(item.id),
          name: item.title || "Tanpa Judul",
          slug: item.slug || String(item.id),
          description: item.description || "Belum ada deskripsi untuk project ini.",
          price: Number(item.price) || 0,
          currency: "IDR",
          stock: Number(item.stock) || 10,
          status: item.status || "PUBLISHED",
          specs: item.specs || { Kreator: "Siswa TEFA" },
          image: item.thumbnail || "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
          category: item.category ? { name: item.category.name, slug: item.category.slug } : { name: "Produk Karya", slug: "all" }, 
          badge: item.badge || null,
          
          // Ambil rating dari backend, jika kosong/tidak ada maka fallback ke 0
          rating: Number(item.rating) || 0,
          
          // Ambil total penjualan/review dari backend, jika kosong fallback ke 0
          reviewCount: Number(item.sold) || Number(item.reviewCount) || 0, 
        }));

        setProducts(formattedProducts);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat menghubungi server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ─── Filter & Sort Logic ───────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = products.filter((p) => p.status === "PUBLISHED");

    if (activeCategory !== "all") {
      result = result.filter((p) => p.category.slug === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.name.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "rating-desc":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }, [search, activeCategory, sortBy, products]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden selection:bg-red-500 selection:text-white">

      {/* ── Hero / Header Catalog ──────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 px-6 lg:px-12 bg-slate-50 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-red-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-6 text-sm">
            <Link href="/" className="text-slate-400 hover:text-red-600 transition-colors">Home</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-semibold">Katalog Produk</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold uppercase tracking-wider mb-4">
            <Star size={12} className="fill-red-400 text-red-400" /> Hasil Karya Terbaik
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-4">
            Katalog <span className="text-red-600 underline decoration-red-200 underline-offset-8">Produk</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
            Temukan karya inovatif siswa-siswi TEFA SMK Telkom Malang — dari software, solusi IoT, hingga game & animasi berkualitas industri.
          </p>
        </div>
      </section>

      {/* ── DESAIN FILTER & SEARCH BAR ────────────────────────────────────────────── */}
      <section className="sticky top-16 z-30 bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-sm py-4 transition-all">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          <div className="relative w-full lg:max-w-md group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400 group-focus-within:text-red-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Cari produk inovatif..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-100 rounded-2xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-50 transition-all shadow-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
            
            <div className="flex p-1 bg-slate-50 rounded-2xl border border-slate-200/60 overflow-x-auto w-full sm:w-auto no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                    activeCategory === cat.slug
                      ? "bg-white text-red-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-auto min-w-[180px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none px-4 pr-10 py-3 bg-white border-2 border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-50 transition-all cursor-pointer shadow-sm"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <ChevronDown size={16} className="text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Product Grid ───────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-slate-500 text-sm">
            Menampilkan{" "}
            <span className="text-slate-900 font-bold">{filtered.length}</span>{" "}
            produk
            {activeCategory !== "all" && (
              <> di <span className="text-red-600 font-semibold">{CATEGORIES.find((c) => c.slug === activeCategory)?.label}</span></>
            )}
            {search && (
              <> untuk &quot;<span className="text-slate-900 font-semibold">{search}</span>&quot;</>
            )}
          </p>
          {(search || activeCategory !== "all") && (
            <button
              onClick={() => { setSearch(""); setActiveCategory("all"); }}
              className="text-xs text-slate-400 hover:text-red-600 transition-colors underline underline-offset-2 font-medium"
            >
              Reset filter
            </button>
          )}
        </div>

        {/* State Kondisional: Loading, Error, atau Tampilkan Data */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-4">
            <Loader2 className="animate-spin text-red-500" size={48} />
            <p className="font-semibold text-slate-600">Menyinkronkan dengan server...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-1">Gagal Memuat Data</h3>
              <p className="text-slate-500 max-w-md">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all active:scale-95 shadow-md shadow-red-100 mt-2"
            >
              Coba Lagi
            </button>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
              <Search size={32} className="text-slate-300" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 mb-1">Produk tidak ditemukan</h3>
              <p className="text-slate-500 text-sm">Coba kata kunci atau kategori yang berbeda.</p>
            </div>
            <button
              onClick={() => { setSearch(""); setActiveCategory("all"); }}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all active:scale-95 shadow-md shadow-red-100"
            >
              Lihat Semua Produk
            </button>
          </div>
        )}

        {filtered.length > 0 && !isLoading && !error && (
          <div className="mt-20 grid grid-cols-3 gap-6 py-10 border-t border-slate-100">
            {[
              { value: `${products.length}+`, label: "Total Produk" },
              { value: "3", label: "Kategori Unggulan" },
              { value: "100%", label: "Karya Siswa" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black text-red-600 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400 uppercase tracking-widest font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="py-16 bg-white border-t border-slate-100 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-white text-xl">T</div>
              <span className="font-black text-xl tracking-tighter text-slate-900">TEFA MOKLET</span>
            </div>
            <p className="text-slate-400 text-sm italic">"The Future is Ours"</p>
          </div>
          <div className="text-slate-500 text-sm">© 2026 SMK Telkom Malang. Dibuat dengan dedikasi tinggi.</div>
          <div className="flex gap-6">
            {["Instagram", "Website", "LinkedIn"].map((social) => (
              <Link key={social} href="#" className="text-slate-400 hover:text-red-600 font-bold transition-colors">
                {social}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}