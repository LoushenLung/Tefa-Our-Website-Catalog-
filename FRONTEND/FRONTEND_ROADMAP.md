# 🚀 Blueprint & Roadmap Pengembangan Frontend TEFA Moklet Catalog

Dokumen ini adalah cetak biru (*blueprint*) berstandar industri (Production-Grade) untuk pengembangan sisi Frontend dari proyek **TEFA Moklet Catalog** (Next.js + NestJS). 

> **Development Note**: Mengingat proyek saat ini masih dalam tahap *rapid development*, implementasi awal akan berfokus pada pendekatan **Client-Side Rendering (CSR)** untuk mempercepat iterasi, sebelum secara bertahap mengadopsi kapabilitas SSR penuh jika dibutuhkan nanti.

---

## Phase 0: Architecture Foundation
*Membangun pondasi yang kokoh sebelum menulis fitur UI. Fase ini krusial untuk mencegah arsitektur yang sulit di-*scale*.*

### 1. Struktur Folder (Feature-Sliced Design / Domain-Driven)
- [ ] Terapkan hierarki yang memisahkan logika dan UI:
  - `app/`: Routing utama (Next.js), layout global, providers.
  - `features/`: Logika bisnis interaktif (misal: `cart`, `auth`, `catalog`).
  - `entities/`: Representasi visual entitas bisnis (misal: `product`, `user`).
  - `services/`: Lapisan abstraksi API (jangan memanggil API langsung dari komponen).
  - `shared/`: Komponen UI dasar (*dumb components*), *hooks*, dan *utils*.

### 2. API Service Layer & Abstraction
- [ ] Buat file *service* (misal: `services/catalog.service.ts`) untuk sentralisasi panggilan API.
- [ ] Terapkan *interceptor* (seperti Axios interceptor) untuk *auto-injection* token auth dan penanganan *retry policy*.

### 3. Environment Strategy & Type Safety
- [ ] Pisahkan *environment variables* (`.env.local`, `.env.development`, `.env.production`).
- [ ] Terapkan *Typing Strategy* (sinkronisasi DTO dari NestJS ke Frontend) agar perubahan di backend langsung terdeteksi sebagai error TypeScript di frontend.

### 4. Auth Architecture (CSR Focus)
- [ ] Bangun alur autentikasi berbasis klien (JWT). 
- [ ] Buat komponen pelindung (seperti *Higher Order Component* atau Custom Hook) untuk menjaga *Protected Routes* di sisi klien sebelum render halaman.

---

## Phase 1: Stability
*Mencegah aplikasi *crash* dan menstandarisasi penanganan error.*

### 1. Penanganan Error Terpusat (Error Taxonomy)
- [ ] Buat pemetaan error yang jelas (Network Error, Auth Error, Validation Error, Server Error).
- [ ] Sinkronisasikan pesan error dari API (NestJS Exception Filter) langsung ke komponen Toast Notifikasi.

### 2. Validasi & Boundary
- [ ] Gunakan **React Hook Form** + **Zod** untuk validasi form *end-to-end* yang *type-safe*.
- [ ] Implementasikan `error.tsx` dan `loading.tsx` di Next.js untuk mencegah *blank screen* saat *runtime error*.

---

## Phase 2: Data Layer (Server State)
*Mengelola data yang berasal dari backend.*

### 1. TanStack Query (React Query)
- [ ] Hindari penggunaan `fetch` manual di dalam `useEffect`.
- [ ] Gunakan arsitektur *Query Key Factory* agar *cache invalidation* terstruktur (contoh: `queryKey: ['products', category]`).

### 2. Optimasi Pengambilan Data
- [ ] Atur *StaleTime* yang sesuai untuk mengurangi beban *request* ke server.
- [ ] Implementasikan *Optimistic Updates* (misal: saat klik "Like", UI langsung berubah tanpa menunggu respon server).

---

## Phase 3: State Layer (Client State)
*Mengelola state murni yang hanya ada di sisi browser.*

### 1. Zustand untuk Global State
- [ ] Gunakan **Zustand** *hanya* untuk state klien seperti: UI State (Modal terbuka/tertutup), Filter State, dan Session Data.
- [ ] Implementasikan *middleware persist* untuk menyimpan state Keranjang Belanja (Cart) di `localStorage`.
- **Aturan Emas**: Jangan menduplikasi data dari *Server State* (React Query) ke *Client State* (Zustand).

---

## Phase 4: Design System & UX Foundation
*Standarisasi visual dan kerangka *User Experience*.*

### 1. Design Tokens & Primitives
- [ ] Terapkan arsitektur styling dengan **Tailwind + CVA (Class Variance Authority)** atau pola **shadcn/ui**.
- [ ] Buat variabel *Design Tokens* untuk *Typography*, *Spacing*, *Radius*, *Shadow*, dan *Semantic Colors*. Jangan menggunakan *styling adhoc*.

### 2. Information Architecture & Accessibility
- [ ] Sediakan *Empty States* (halaman kosong) dan *No-Result States* yang informatif dan estetik.
- [ ] Pastikan navigasi mendukung *keyboard accessibility* dan *Screen Reader* (`aria-label`).

---

## Phase 5: UX Polish
*Memberikan "feel" premium pada aplikasi.*

### 1. Feedback & Animasi (Gunakan Secara Bijak)
- [ ] Ganti loading putar dengan **Skeleton Loaders** yang rapi.
- [ ] Gunakan **Framer Motion** hanya untuk transisi halaman atau interaksi mikro yang krusial (hindari *layout thrashing*).
- [ ] Implementasikan notifikasi yang jelas dan responsif (Toasts).

---

## Phase 6: Performance & Optimization (CSR Focused)
*Kecepatan aplikasi di sisi browser.*

### 1. Optimasi Navigasi & Aset
- [ ] Terapkan *Route Prefetch Strategy* agar perpindahan halaman instan.
- [ ] Gunakan `next/image` untuk kompresi dan *lazy-loading* gambar otomatis.
- [ ] Lakukan *Bundle Analysis* untuk memastikan ukuran file JavaScript tidak membengkak (lakukan *Code Splitting*).

---

## Phase 7: Production Engineering
*Langkah terakhir sebelum rilis skala besar (Enterprise-grade).*

### 1. Testing Strategy
- [ ] **Unit Test**: Gunakan *Vitest* atau *Jest* untuk logika kalkulasi dan fungsi utilitas.
- [ ] **Component Test**: Gunakan *React Testing Library* untuk interaksi UI kritis.
- [ ] **E2E Test**: Gunakan *Playwright* atau *Cypress* untuk alur utama seperti Checkout dan Login.

### 2. Monitoring & Security
- [ ] Integrasikan alat pemantauan error (*Error Tracking*) seperti **Sentry**.
- [ ] Terapkan mitigasi keamanan: *Sanitization* untuk mencegah XSS, pembatasan ukuran file *upload*, dan manajemen proteksi formulir.

---
*Roadmap ini merupakan blueprint arsitektur yang memastikan proyek berawal sebagai MVP (Minimum Viable Product) yang lincah (CSR), namun memiliki tulang punggung (*backbone*) berskala enterprise.*
