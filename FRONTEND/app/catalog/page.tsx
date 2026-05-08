"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Search, Star, ChevronDown, Loader2 } from "lucide-react";
import Header from "@/components/navbar-public";
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
  badge?: string;
}

function seededRating(id: string): { rating: number; reviewCount: number } {
  const seed = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rating = 3.5 + ((seed * 17) % 15) / 10; 
  const reviewCount = 4 + ((seed * 31) % 97);    
  return { rating: Math.round(rating * 10) / 10, reviewCount };
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const RAW_PRODUCTS = [
  {
    id: "1",
    name: "SiAbsen – Sistem Absensi Digital",
    slug: "siabsen-sistem-absensi-digital",
    description: "Aplikasi absensi berbasis QR-code real-time untuk sekolah dan instansi. Dilengkapi dashboard analitik, notifikasi orang tua, dan laporan otomatis PDF.",
    price: 4500000,
    currency: "IDR" as const,
    stock: 10,
    status: "PUBLISHED" as const,
    specs: { Platform: "Web + Android", Stack: "Next.js, NestJS, MySQL", Tim: "3 Siswa RPL" },
    category: { name: "Software & Web", slug: "software-web" },
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
    badge: "Terlaris",
  },
  {
    id: "2",
    name: "SmartHome Controller – IoT Hub",
    slug: "smarthome-controller-iot-hub",
    description: "Perangkat IoT berbasis ESP32 yang menghubungkan lampu, kipas, dan kunci pintu ke aplikasi mobile. Kontrol rumah dari mana saja via internet.",
    price: 1800000,
    currency: "IDR" as const,
    stock: 5,
    status: "PUBLISHED" as const,
    specs: { MCU: "ESP32", Koneksi: "WiFi + MQTT", "Catu Daya": "5V USB-C" },
    category: { name: "IoT & Jaringan", slug: "iot-jaringan" },
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    badge: "Baru",
  },
  {
    id: "3",
    name: "NusantaraQuest – 2D RPG Game",
    slug: "nusantaraquest-2d-rpg-game",
    description: "Game RPG 2D berbasis budaya Nusantara dengan 5 chapter cerita, 20+ karakter unik, dan musik tradisional orisinal. Tersedia di PC dan Android.",
    price: 350000,
    currency: "IDR" as const,
    stock: 999,
    status: "PUBLISHED" as const,
    specs: { Engine: "Unity 2022", Platform: "PC & Android", Rating: "E (Semua Umur)" },
    category: { name: "Game & Animasi", slug: "game-animasi" },
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80",
    badge: "Pilihan Editor",
  },
  {
    id: "4",
    name: "CyberShield – Audit Keamanan Jaringan",
    slug: "cybershield-audit-keamanan-jaringan",
    description: "Layanan audit keamanan jaringan komprehensif: scanning vulnerabilitas, pentest, dan laporan remediasi lengkap untuk bisnis UMKM hingga enterprise.",
    price: 7500000,
    currency: "IDR" as const,
    stock: 3,
    status: "PUBLISHED" as const,
    specs: { Durasi: "3–5 Hari Kerja", Output: "Laporan PDF 50+ hal", Sertifikasi: "CEH Compliant" },
    category: { name: "IoT & Jaringan", slug: "iot-jaringan" },
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80",
  },
  {
    id: "5",
    name: "BatiKraft – E-Commerce UMKM",
    slug: "batikraft-ecommerce-umkm",
    description: "Platform e-commerce siap pakai untuk pelaku UMKM kerajinan. Fitur: manajemen produk, payment gateway, laporan penjualan, dan chatbot CS otomatis.",
    price: 6000000,
    currency: "IDR" as const,
    stock: 7,
    status: "PUBLISHED" as const,
    specs: { CMS: "Custom Admin Panel", Payment: "Midtrans, QRIS", Hosting: "VPS Ready" },
    category: { name: "Software & Web", slug: "software-web" },
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&q=80",
  },
  {
    id: "6",
    name: "LanGuru – Platform E-Learning Bahasa",
    slug: "languru-platform-elearning-bahasa",
    description: "Platform belajar bahasa Inggris interaktif dengan metode gamifikasi, live session bersama tutor, dan AI-powered pronunciation checker.",
    price: 2800000,
    currency: "IDR" as const,
    stock: 15,
    status: "PUBLISHED" as const,
    specs: { Fitur: "AI + Gamification", Konten: "500+ Modul", Akses: "Seumur Hidup" },
    category: { name: "Software & Web", slug: "software-web" },
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
    badge: "Hot",
  },
  {
    id: "7",
    name: "ShadowPath – 3D Puzzle Horror Game",
    slug: "shadowpath-3d-puzzle-horror-game",
    description: "Game horror puzzle 3D dengan atmosfer mencekam, mekanik cahaya unik, dan 4 ending berbeda berdasarkan pilihan pemain. Optimasi untuk Mid-end PC.",
    price: 120000,
    currency: "IDR" as const,
    stock: 999,
    status: "PUBLISHED" as const,
    specs: { Engine: "Unreal Engine 5", Platform: "PC", Rating: "17+ (Horror)" },
    category: { name: "Game & Animasi", slug: "game-animasi" },
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80",
  },
  {
    id: "8",
    name: "AgroSense – Sensor Pertanian Pintar",
    slug: "agrosense-sensor-pertanian-pintar",
    description: "Sistem monitoring lahan pertanian berbasis IoT dengan sensor kelembaban tanah, suhu, dan curah hujan. Data real-time dikirim ke dashboard mobile.",
    price: 2200000,
    currency: "IDR" as const,
    stock: 8,
    status: "PUBLISHED" as const,
    specs: { Sensor: "Soil + DHT22 + Rain", Range: "500m RF", Baterai: "Solar + Li-ion" },
    category: { name: "IoT & Jaringan", slug: "iot-jaringan" },
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80",
    badge: "Inovasi",
  },
  {
    id: "9",
    title: "PixelCraft Studio – Jasa Animasi 2D",
    slug: "pixelcraft-studio-jasa-animasi-2d",
    description: "Layanan pembuatan animasi 2D profesional: motion graphic, explainer video, karakter animasi, dan konten media sosial branded untuk bisnis Anda.",
    price: 3500000,
    currency: "IDR" as const,
    stock: 6,
    status: "PUBLISHED" as const,
    specs: { Software: "Adobe Animate, After Effects", Durasi: "30–90 detik", Revisi: "3x Free" },
    category: { name: "Game & Animasi", slug: "game-animasi" },
    thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80",
  },
];

const PRODUCTS: Product[] = RAW_PRODUCTS.map((p: any) => ({
  ...p,
  ...seededRating(p.id),
  averageRating: seededRating(p.id).rating,
  totalReviews: seededRating(p.id).reviewCount,
}));

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
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getPublicProjects();
        // Mapping response to match our Product interface if needed
        const formattedProducts: Product[] = (data || []).map((item: any) => ({
          id: String(item.id),
          title: item.title || "Tanpa Judul",
          slug: item.slug || String(item.id),
          description: item.description || "Belum ada deskripsi.",
          price: Number(item.price) || 0,
          thumbnail: item.thumbnail || null,
          averageRating: Number(item.averageRating) || 0,
          totalReviews: Number(item.totalReviews) || 0,
          category: item.category || { name: "Lainnya", slug: "other" },
          status: item.status || "PUBLISHED",
          badge: item.badge || null,
        }));
        setProducts(formattedProducts);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError("Gagal memuat data katalog.");
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
  }, [search, activeCategory, sortBy]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden selection:bg-red-500 selection:text-white">

      {/* ── HEADER ──────────────────────────────────────────────────── */}
      <Header />

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
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 size={48} className="text-red-600 animate-spin" />
            <p className="text-slate-500 font-medium">Memuat katalog produk...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
             <div className="text-red-600 font-bold">{error}</div>
             <button 
               onClick={() => window.location.reload()}
               className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold"
             >
               Coba Lagi
             </button>
          </div>
        ) : (
          <>
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

        {filtered.length > 0 ? (
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
      </>
    )}

        {filtered.length > 0 && !isLoading && (
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
