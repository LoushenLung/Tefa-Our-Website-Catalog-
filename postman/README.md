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
   - Pada JSON Body, cukup isi `message` (catatan pesanan) dan `bankAccountId` (rekening tujuan). Nama, email, dan no HP otomatis diambil dari Auth Token.
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

### 💖 POV 3: Wishlist & Bank Accounts
1. **Mengelola Wishlist (User)**:
   - Gunakan folder **WISHLISTS** > **TOGGLE WISHLIST** untuk menambah/menghapus project dari wishlist kamu (menyertakan `projectId` pada URL).
   - Gunakan **MY WISHLIST** untuk melihat semua project yang disukai.
2. **Melihat Rekening Pembayaran (User/Admin)**:
   - Gunakan folder **BANK ACCOUNTS** > **SHOW ALL** untuk melihat daftar rekening aktif milik pengelola (Admin) yang bisa menjadi referensi `bankAccountId` saat checkout.
   - Admin dapat menambahkan rekening melalui **CREATE (Admin)**.

---

## 🔐 Role-Based Access Control (RBAC) Matrix

Berikut adalah daftar hak akses CRUD berdasarkan Role di sistem:

| Modul | Endpoint | USER | ADMIN | Keterangan |
| :--- | :--- | :---: | :---: | :--- |
| **AUTH** | Login & Verify OTP | ✅ | ✅ | Semua user bisa login & pakai 2FA |
| **USERS** | Toggle 2FA (Self) | ✅ | ✅ | User hanya bisa toggle akun sendiri |
| **USERS** | Toggle 2FA (Others)| ❌ | ✅ | Admin bisa bantu reset 2FA user lain |
| **WISHLISTS** | Toggle & View | ✅ | ✅ | User melihat & mengelola list impian |
| **BANK ACCOUNTS** | View All | ✅ | ✅ | User melihat daftar rekenening admin |
| **BANK ACCOUNTS** | Create | ❌ | ✅ | Admin mengelola data bank |
| **USERS** | CRUD Users | ❌ | ✅ | Hanya Admin yang bisa kelola data user |
| **PROJECTS** | View Projects | ✅ | ✅ | Publik/User bisa lihat katalog |
| **PROJECTS** | Create/Update/Delete| ❌ | ✅ | Hanya Admin yang bisa ubah katalog |
| **CARTS** | Manage Cart | ✅ | ✅ | User kelola belanjaan masing-masing |
| **ORDERS** | Checkout | ✅ | ✅ | User buat pesanan dari cart |
| **ORDERS** | View All Orders | ❌ | ✅ | Admin pantau semua transaksi |
| **PAYMENTS**| Upload Proof | ✅ | ✅ | User unggah struk bayar |
| **PAYMENTS**| Verify Payment | ❌ | ✅ | Admin konfirmasi keabsahan struk |

---

## 🛡️ Panduan Fitur 2FA (Optional)

Sistem 2FA (Two-Factor Authentication) bersifat opsional dan bisa diaktifkan per user.

### Alur Kerja:
1. **Aktivasi**: 
   - Gunakan endpoint `PATCH /users/toggle-2fa`.
   - Masukkan `{"enable": true}` di body.
   - Status 2FA sekarang aktif untuk akun Anda.
2. **Login Dua Tahap**:
   - Jalankan `POST /auth/login`.
   - Respons akan berisi `"requires2FA": true` dan email OTP terkirim ke Gmail Anda.
   - Gunakan kode 6-digit dari email untuk endpoint `POST /auth/verify-otp`.
3. **Penyelamatan Akun**:
   - Jika User kehilangan akses email, **Admin** dapat mematikan 2FA user tersebut melalui `PATCH /users/toggle-2fa` dengan menyertakan `userId` di body request.

---

## 📌 Endpoint Rules & General Notes
- **PROJECTS**: Endpoint berjenis form-data untuk mendukung *Cloudinary Image Upload* (`thumbnail`).
  - Menambahkan spesifik array of objects di FormData cukup berikan Value JSON Stringified langsung pada key tersebut, contoh: key = `students` | value = `[{"id": 1, "role": "Ketua Kelompok"}]`.
- **Placeholder**: Ubah variabel string seperti `<UUID-KATEGORI>`, atau angka seperti `:id` menggunakan parameter asli dari database yang sinkron di PC kamu.
- **Bearer Token**: Semua endpoint (kecuali Login) membutuhkan header `Authorization: Bearer {{authToken}}`.
- Selalu re-login jika ingin beralih mencoba API dari POV Admin atau User agar meminimalisir error Role atau Ownership di token.