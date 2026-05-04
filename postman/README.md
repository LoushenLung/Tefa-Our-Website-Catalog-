# TEFA Backend - Postman Usage Guide

File ini berisi panduan untuk melakukan *testing* semua endpoint API ke Backend TEFA menggunakan Postman.

## 📂 File Structure
- `TEFA-Backend.postman_collection.json` - File koleksi utama yang mencakup seluruh endpoint, digabungkan per modul / resource.

## ⚙️ Setup Awal & Authentication
1. **Import File**: Buka aplikasi Postman > klik `File` -> `Import` > pilih `TEFA-Backend.postman_collection.json`.
2. **Set Environment Variables**:
   - Buat Environment baru di Postman.
   - Tambahkan variabel `baseUrl` (Contoh value: `http://localhost:3000`).
   - Tambahkan variabel `authToken` (Kosongkan nilainya terlebih dahulu).
3. **Mendapatkan Token (Login)**:
   - Buka folder **AUTH** > jalankan **LOGIN**.
   - Salin/copy token dari respons server dan masukkan / tempelkan token tersebut pada tab Environment Variable `authToken`.

> **⚠️ PERHATIAN PENTING TENTANG ROLE:**
> Sistem sekarang sangat bergantung kepada peran (ROLE) dari token yang dipakai! Jangan gunakan token Admin untuk membuat pesanan, dan jangan gunakan token Customer/User untuk memverifikasi pesanan.

---

## 🛒 Flow E-Commerce Lanjutan (User & Admin POV)

Karena kita sudah mengimplementasikan otomatisasi Cart dan validasi sistem Payment Proof. Gunakan urutan berikut untuk mencoba alur transaksi (checkout) dari perspektif masing-masing peran:

### 🧑‍💻 POV 1: Customer (User System)
*Pastikan kamu menggunakan token milik akun dengan role `USER`.*

1. **Memasukkan Produk ke Keranjang**: 
   - Buka folder **CARTS** > **ADD ITEM TO CART**.
   - Input id project dan quantity di body (JSON). Keranjang akan otomatis dibuat untuk User ini jika sebelumnya belum punya.
2. **Lihat Isi Keranjang (Opsional)**:
   - Buka **SHOW MY CART** untuk mengecek total barang sebelum checkout.
3. **Checkout Pesanan**:
   - Buka folder **ORDERS** > **CHECKOUT (FROM CART)**.
   - Pada JSON Body, cukup isi `customerName`, `customerEmail`, dan `customerPhone`.
   - **(Otomatis)** Sistem akan mengkalkulasi harga dari keranjangmu, membuat ID Order, dan langsung menghapus/mengosongkan isi cart User kamu!
4. **Membayar & Tagihan**:
   - Simpan ID Order dari hasil respons Checkout. 
   - Buka folder **PAYMENTS** > **GET BILL**. Masukkan tipe metode dan detail rek tujuan (*hanya untuk info tagihan tambahan sebelum membayar*).
5. **Upload Bukti Bayar**:
   - Buka folder **PAYMENTS** > **UPLOAD PROOF**.
   - Masukkan ID Order pada baris URL. 
   - Ini bertipe **form/data**. Masukkan file foto resep/struk tf anda di key `file`. Status Order Anda akan diubah otomatis ke `WAITING_VERIFICATION`.

### 👨‍💼 POV 2: Administrator (Admin System)
*Ganti tipe `authToken` saat ini dengan token login milik akun ber-role `ADMIN`.*

1. **Mengecek Pesanan yang Masuk**:
   - Buka folder **ORDERS** > **SHOW ALL** atau **SHOW BY ID**.
   - Admin dapat melihat orderan dengan status `WAITING_VERIFICATION`.
2. **Lihat Bukti Transfer User**:
   - Buka folder **PAYMENTS** > **GET PROOF BY ORDER**.
   - Admin akan menerima url *Cloudinary Image* dari resi yang User unggah sebelumnya.
3. **Verifikasi Pembayaran & Rilis**:
   - Buka folder **PAYMENTS** > **VERIFY PAYMENT (ADMIN)**.
   - Modifikasi JSON Body untuk mengirimkan status `APPROVED` atau `REJECTED` beserta nota dari Admin.
   - Status Order secara otomatis bergeser menjadi `PAID` apabila Approved! Selesai.

---

## 📌 Endpoint Rules & General Notes
- **PROJECTS**: Endpoint berjenis form-data untuk mendukung *Cloudinary Image Upload* (`thumbnail`).
  - Menambahkan spesifik array of objects di FormData cukup berikan Value JSON Stringified langsung pada key tersebut, contoh: key = `students` | value = `[{"id": 1, "role": "Ketua Kelompok"}]`.
- **Placeholder**: Ubah variabel string seperti `<UUID-KATEGORI>`, atau angka seperti `:id` menggunakan parameter asli dari database yang sinkron di PC kamu.
- Selalu re-login jika ingin beralih mencoba API dari POV Admin atau User agar meminimalisir error Role atau Ownership di token.