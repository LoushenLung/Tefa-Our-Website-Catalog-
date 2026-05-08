import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Search, Star, ChevronDown, Loader2 } from "lucide-react";
import { getPublicProjects } from "@/lib/actions/public-catalog";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  thumbnail: string | null;
  averageRating: number;
  totalReviews: number;
  category: { name: string; slug: string };
  badge?: string; // Optional field, might be added later or calculated
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
        {!imgError && product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
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
      </div>

      <div className="flex flex-col flex-1 p-5 gap-3">
        <span className={`self-start text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${accent.text} ${accent.bg}`}>
          {product.category.name}
        </span>

        <h3 className="font-black text-slate-900 text-base leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
          {product.title}
        </h3>

        <StarRating rating={Number(product.averageRating)} reviewCount={product.totalReviews} />

        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{product.description}</p>

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
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await getPublicProjects();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    let result = products;

    if (activeCategory !== "all") {
      result = result.filter((p) => p.category.slug === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.name.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "rating-desc":
        result = [...result].sort((a, b) => b.averageRating - a.averageRating);
        break;
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return result;
  }, [products, search, activeCategory, sortBy]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden selection:bg-red-500 selection:text-white">

      {/* ── HEADER IDENTIK ──────────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-white text-xl">T</div>
            <span className="font-black text-xl tracking-tighter text-slate-900">TEFA <span className="text-red-600">MOKLET</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
            <Link href="/#about" className="hover:text-slate-900 transition-colors">About</Link>
            <Link href="/#majors" className="hover:text-slate-900 transition-colors">Majors</Link>
            <Link href="/catalog" className="text-red-600">Catalog</Link>
          </div>

          <Link
            href="/sign-in"
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-bold transition-all active:scale-95 shadow-md shadow-red-100"
          >
            Sign In
          </Link>
        </div>
      </nav>

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
            <Star size={12} className="fill-red-400 text-red-400" /> {products.length}+ Produk Tersedia
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
      <section className="sticky top-16 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-sm py-4 transition-all">
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

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
             <Loader2 size={48} className="text-red-600 animate-spin" />
             <p className="text-slate-500 font-medium animate-pulse">Memuat katalog inovasi...</p>
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