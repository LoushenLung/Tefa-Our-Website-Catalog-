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
    name: "PixelCraft Studio – Jasa Animasi 2D",
    slug: "pixelcraft-studio-jasa-animasi-2d",
    description: "Layanan pembuatan animasi 2D profesional: motion graphic, explainer video, karakter animasi, dan konten media sosial branded untuk bisnis Anda.",
    price: 3500000,
    currency: "IDR" as const,
    stock: 6,
    status: "PUBLISHED" as const,
    specs: { Software: "Adobe Animate, After Effects", Durasi: "30–90 detik", Revisi: "3x Free" },
    category: { name: "Game & Animasi", slug: "game-animasi" },
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80",
  },
];

const PRODUCTS: Product[] = RAW_PRODUCTS.map((p) => ({
  ...p,
  ...seededRating(p.id),
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