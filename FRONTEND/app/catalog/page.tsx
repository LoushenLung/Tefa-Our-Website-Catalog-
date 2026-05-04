"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

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
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "SiAbsen – Sistem Absensi Digital",
    slug: "siabsen-sistem-absensi-digital",
    description:
      "Aplikasi absensi berbasis QR-code real-time untuk sekolah dan instansi. Dilengkapi dashboard analitik, notifikasi orang tua, dan laporan otomatis PDF.",
    price: 4500000,
    currency: "IDR",
    stock: 10,
    status: "PUBLISHED",
    specs: { Platform: "Web + Android", Stack: "Next.js, NestJS, MySQL", Tim: "3 Siswa RPL" },
    category: { name: "Software & Web", slug: "software-web" },
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
    badge: "Terlaris",
  },
  {
    id: "2",
    name: "SmartHome Controller – IoT Hub",
    slug: "smarthome-controller-iot-hub",
    description:
      "Perangkat IoT berbasis ESP32 yang menghubungkan lampu, kipas, dan kunci pintu ke aplikasi mobile. Kontrol rumah dari mana saja via internet.",
    price: 1800000,
    currency: "IDR",
    stock: 5,
    status: "PUBLISHED",
    specs: { MCU: "ESP32", Koneksi: "WiFi + MQTT", Catu Daya: "5V USB-C" },
    category: { name: "IoT & Jaringan", slug: "iot-jaringan" },
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    badge: "Baru",
  },
  {
    id: "3",
    name: "NusantaraQuest – 2D RPG Game",
    slug: "nusantaraquest-2d-rpg-game",
    description:
      "Game RPG 2D berbasis budaya Nusantara dengan 5 chapter cerita, 20+ karakter unik, dan musik tradisional orisinal. Tersedia di PC dan Android.",
    price: 350000,
    currency: "IDR",
    stock: 999,
    status: "PUBLISHED",
    specs: { Engine: "Unity 2022", Platform: "PC & Android", Rating: "E (Semua Umur)" },
    category: { name: "Game & Animasi", slug: "game-animasi" },
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80",
    badge: "Pilihan Editor",
  },
  {
    id: "4",
    name: "CyberShield – Audit Keamanan Jaringan",
    slug: "cybershield-audit-keamanan-jaringan",
    description:
      "Layanan audit keamanan jaringan komprehensif: scanning vulnerabilitas, pentest, dan laporan remediasi lengkap untuk bisnis UMKM hingga enterprise.",
    price: 7500000,
    currency: "IDR",
    stock: 3,
    status: "PUBLISHED",
    specs: { Durasi: "3–5 Hari Kerja", Output: "Laporan PDF 50+ hal", Sertifikasi: "CEH Compliant" },
    category: { name: "IoT & Jaringan", slug: "iot-jaringan" },
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80",
  },
  {
    id: "5",
    name: "BatiKraft – E-Commerce UMKM",
    slug: "batikraft-ecommerce-umkm",
    description:
      "Platform e-commerce siap pakai untuk pelaku UMKM kerajinan. Fitur: manajemen produk, payment gateway, laporan penjualan, dan chatbot CS otomatis.",
    price: 6000000,
    currency: "IDR",
    stock: 7,
    status: "PUBLISHED",
    specs: { CMS: "Custom Admin Panel", Payment: "Midtrans, QRIS", Hosting: "VPS Ready" },
    category: { name: "Software & Web", slug: "software-web" },
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&q=80",
  },
  {
    id: "6",
    name: "LanGuru – Platform E-Learning Bahasa",
    slug: "languru-platform-elearning-bahasa",
    description:
      "Platform belajar bahasa Inggris interaktif dengan metode gamifikasi, live session bersama tutor, dan AI-powered pronunciation checker.",
    price: 2800000,
    currency: "IDR",
    stock: 15,
    status: "PUBLISHED",
    specs: { Fitur: "AI + Gamification", Konten: "500+ Modul", Akses: "Seumur Hidup" },
    category: { name: "Software & Web", slug: "software-web" },
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
    badge: "Hot",
  },
  {
    id: "7",
    name: "ShadowPath – 3D Puzzle Horror Game",
    slug: "shadowpath-3d-puzzle-horror-game",
    description:
      "Game horror puzzle 3D dengan atmosfer mencekam, mekanik cahaya unik, dan 4 ending berbeda berdasarkan pilihan pemain. Optimasi untuk Mid-end PC.",
    price: 120000,
    currency: "IDR",
    stock: 999,
    status: "PUBLISHED",
    specs: { Engine: "Unreal Engine 5", Platform: "PC", Rating: "17+ (Horror)" },
    category: { name: "Game & Animasi", slug: "game-animasi" },
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80",
  },
  {
    id: "8",
    name: "AgroSense – Sensor Pertanian Pintar",
    slug: "agrosense-sensor-pertanian-pintar",
    description:
      "Sistem monitoring lahan pertanian berbasis IoT dengan sensor kelembaban tanah, suhu, dan curah hujan. Data real-time dikirim ke dashboard mobile.",
    price: 2200000,
    currency: "IDR",
    stock: 8,
    status: "PUBLISHED",
    specs: { Sensor: "Soil + DHT22 + Rain", Range: "500m RF", Baterai: "Solar + Li-ion" },
    category: { name: "IoT & Jaringan", slug: "iot-jaringan" },
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80",
    badge: "Inovasi",
  },
  {
    id: "9",
    name: "PixelCraft Studio – Jasa Animasi 2D",
    slug: "pixelcraft-studio-jasa-animasi-2d",
    description:
      "Layanan pembuatan animasi 2D profesional: motion graphic, explainer video, karakter animasi, dan konten media sosial branded untuk bisnis Anda.",
    price: 3500000,
    currency: "IDR",
    stock: 6,
    status: "PUBLISHED",
    specs: { Software: "Adobe Animate, After Effects", Durasi: "30–90 detik", Revisi: "3x Free" },
    category: { name: "Game & Animasi", slug: "game-animasi" },
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80",
  },
];

const CATEGORIES = [
  { label: "Semua", slug: "all" },
  { label: "Software & Web", slug: "software-web" },
  { label: "IoT & Jaringan", slug: "iot-jaringan" },
  { label: "Game & Animasi", slug: "game-animasi" },
];

const SORT_OPTIONS = [
  { label: "Terbaru", value: "newest" },
  { label: "Harga: Rendah → Tinggi", value: "price-asc" },
  { label: "Harga: Tinggi → Rendah", value: "price-desc" },
  { label: "Nama A–Z", value: "name-asc" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatIDR(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

const BADGE_COLORS: Record<string, string> = {
  Terlaris: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Baru: "bg-green-500/20 text-green-400 border-green-500/30",
  "Pilihan Editor": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Hot: "bg-red-500/20 text-red-400 border-red-500/30",
  Inovasi: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const CATEGORY_ACCENT: Record<string, string> = {
  "Software & Web": "text-red-400",
  "IoT & Jaringan": "text-blue-400",
  "Game & Animasi": "text-purple-400",
};

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="group relative flex flex-col bg-zinc-900 border border-white/8 rounded-2xl overflow-hidden hover:border-white/20 hover:shadow-[0_0_40px_rgba(220,38,38,0.12)] transition-all duration-300">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-zinc-800">
        {!imgError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent" />

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-bold border rounded-full backdrop-blur-sm ${BADGE_COLORS[product.badge] ?? "bg-white/10 text-white border-white/20"}`}>
            {product.badge}
          </span>
        )}

        {/* Stock indicator */}
        <span className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${product.stock > 0 ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
          {product.stock > 0 ? (product.stock < 5 ? `Sisa ${product.stock}` : "Tersedia") : "Habis"}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Category */}
        <span className={`text-xs font-bold tracking-widest uppercase ${CATEGORY_ACCENT[product.category.name] ?? "text-zinc-400"}`}>
          {product.category.name}
        </span>

        {/* Name */}
        <h3 className="font-bold text-white text-base leading-snug group-hover:text-red-400 transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">{product.description}</p>

        {/* Specs pills */}
        <div className="flex flex-wrap gap-1.5 mt-1">
          {Object.entries(product.specs)
            .slice(0, 2)
            .map(([k, v]) => (
              <span key={k} className="px-2 py-0.5 bg-white/5 border border-white/8 rounded-md text-xs text-zinc-400">
                <span className="text-zinc-600">{k}:</span> {v}
              </span>
            ))}
        </div>

        {/* Footer: price + CTA */}
        <div className="flex items-end justify-between mt-auto pt-4 border-t border-white/8">
          <div>
            <div className="text-xs text-zinc-600 mb-0.5">Mulai dari</div>
            <div className="text-lg font-black text-white">{formatIDR(product.price)}</div>
          </div>
          <Link
            href={`/catalog/${product.slug}`}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-xl transition-all active:scale-95 hover:shadow-[0_0_15px_rgba(220,38,38,0.4)]"
          >
            Detail →
          </Link>
        </div>
      </div>
    </article>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CatalogPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filtered = useMemo(() => {
    let result = PRODUCTS.filter((p) => p.status === "PUBLISHED");

    // Category filter
    if (activeCategory !== "all") {
      result = result.filter((p) => p.category.slug === activeCategory);
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.name.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // newest — keep original order
        break;
    }

    return result;
  }, [search, activeCategory, sortBy]);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-red-500 selection:text-white">
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-xl">
                T
              </div>
              <span className="font-bold text-xl tracking-tighter">
                TEFA <span className="text-red-500">MOKLET</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
              <Link href="/#about" className="hover:text-white transition-colors">About</Link>
              <Link href="/#tefa" className="hover:text-white transition-colors">TEFA</Link>
              <Link href="/#majors" className="hover:text-white transition-colors">Majors</Link>
              <Link href="/catalog" className="text-white">Catalog</Link>
            </div>

            <Link
              href="/sign-in"
              className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-zinc-200 transition-all active:scale-95"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero / Header ──────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-zinc-500 hover:text-white text-sm transition-colors">Home</Link>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-300 text-sm font-medium">Katalog Produk</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-500">
            Katalog Produk
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Temukan karya inovatif siswa-siswi TEFA SMK Telkom Malang — dari software, solusi IoT, hingga game & animasi berkualitas industri.
          </p>
        </div>
      </section>

      {/* ── Filter & Search Bar ────────────────────────────────────────────── */}
      <section className="sticky top-16 z-40 bg-black/80 backdrop-blur-md border-b border-white/8 px-4 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Category Tabs */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                id={`cat-${cat.slug}`}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  activeCategory === cat.slug
                    ? "bg-red-600 border-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.35)]"
                    : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/30 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search + Sort */}
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                id="catalog-search"
                type="text"
                placeholder="Cari produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50 transition-colors"
              />
            </div>
            <select
              id="catalog-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-sm text-zinc-300 focus:outline-none focus:border-red-500/50 transition-colors cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ── Product Grid ───────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Result count */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-zinc-500 text-sm">
            Menampilkan{" "}
            <span className="text-white font-semibold">{filtered.length}</span>{" "}
            produk
            {activeCategory !== "all" && (
              <> di <span className="text-red-400">{CATEGORIES.find((c) => c.slug === activeCategory)?.label}</span></>
            )}
            {search && (
              <> untuk "<span className="text-white">{search}</span>"</>
            )}
          </p>
          {(search || activeCategory !== "all") && (
            <button
              onClick={() => { setSearch(""); setActiveCategory("all"); }}
              className="text-xs text-zinc-500 hover:text-white transition-colors underline underline-offset-2"
            >
              Reset filter
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
            <div className="w-20 h-20 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Produk tidak ditemukan</h3>
              <p className="text-zinc-500 text-sm">Coba kata kunci atau kategori yang berbeda.</p>
            </div>
            <button
              onClick={() => { setSearch(""); setActiveCategory("all"); }}
              className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-xl transition-all active:scale-95"
            >
              Lihat Semua Produk
            </button>
          </div>
        )}

        {/* Stats strip */}
        {filtered.length > 0 && (
          <div className="mt-20 grid grid-cols-3 gap-6 py-10 border-t border-white/8">
            {[
              { value: `${PRODUCTS.length}+`, label: "Total Produk" },
              { value: "3", label: "Kategori Unggulan" },
              { value: "100%", label: "Karya Siswa" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black text-red-500 mb-1">{stat.value}</div>
                <div className="text-sm text-zinc-500 uppercase tracking-widest font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="py-12 px-4 border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-xl">T</div>
            <span className="font-bold text-xl tracking-tighter">TEFA MOKLET</span>
          </div>
          <div className="text-zinc-500 text-sm">© 2026 SMK Telkom Malang. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">Instagram</a>
            <a href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">Website</a>
            <a href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
