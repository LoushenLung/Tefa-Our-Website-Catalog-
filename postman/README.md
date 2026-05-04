TEFA Backend - Postman Usage Guide

### File structure
- `TEFA-Backend.postman_collection.json` - Koleksi utama yang mencakup seluruh CRUD API per sumber daya.

### What is inside the collection
1. **AUTH** - Menghasilkan token JWT (`authToken`) melalui autentikasi kredensial (Login).
2. **USERS** - Create, Read, Update, Delete data user dan admin.
3. **CATEGORIES** - Kategori untuk projek (Create, Read, Update, Delete).
4. **PROJECTS** - Menggantikan fitur entitas Product lama. Punya sistem **Upload Thumbnail ke Cloudinary**.
5. **MAJORS, BATCHES, & STUDENTS** - Database pendukung untuk menginputkan nama-nama Jurusan, Angkatan, dan data Siswa yang diperlukan sebelum membuat/upload Project. Anda bisa menambahkan data siswa secara manual melalui endpoint Create di folder ini.
6. **CARTS** - Fitur keranjang belanja (menggantikan entitas Wishlists).
6. **ORDERS** - Fitur pesanan checkout dan snapshot pelanggan (menggantikan entitas Inquiries).
7. **RATINGS** - Fitur otomatis untuk menambahkan ulasan dan rata-rata bintang ke sebuah projek.

### How to import
1. Buka aplikasi Postman.
2. Klik menu `File` > `Import`.
3. Pilih & telusuri file `postman/TEFA-Backend.postman_collection.json`.
4. Folder akan muncul di bilah kiri sidebar secara otomatis.

### How to set up variables
1. Buat _Environment_ di Postman (contoh: `Local TEFA`).
2. Buat _Variable_ `baseUrl` dengan nilai (value): `http://localhost:3000`.
3. Buat _Variable_ `authToken` dan kosongkan nilainya terlebih dulu.
4. Pilih environment tersebut dari drowdown di pojok kanan atas sebelum mengetes APIs.

### Endpoint Rules & Notes
- Gunakan endpoint berjenis **GET** untuk melist data (tidak butuh tipe upload).
- Anda harus menaruh **Bearer Token** ke header (dengan cara mengisinya di _collection variable_ jika itu adalah _Protected Routes_).
- Fitur **PROJECTS** kini menggunakan mode **form-data** untuk `POST (Create)` & `PATCH (Update)` guna menangani berkas/file gambar agar lolos menuju _Cloudinary_. Jangan pakai tipe format "raw JSON" di bagian ini!
- **MENAMBAHKAN MULTIPLE STUDENTS DI PROJECTS:** Karena skema yang baru mendukung fitur banyak murid untuk satu project (beserta perannya), khusus untuk mengunggah siswanya buka tab body di Postman, tambahkan Key baru bernama `students`. Pilih tipe text dan isikan value berformat "JSON stringified" seperti ini: `[{"id": 1, "role": "Ketua Kelompok"}, {"id": 2, "role": "UI/UX Designer"}]`
- Ganti String Placeholder yang ada seperti `<UUID-KATEGORI>`, `<UUID-PROJECT>`, dll dengan UUID/ID sungguhan dari database yang baru Anda Create/Insert.

### How to get a token
1. Buka folder `AUTH`.
2. Kirim permintaan (Send Request) `LOGIN`.
3. Salin/Copy output token yang dihasilkan, dan masukkan ke _value_ variable bernama `authToken` Anda di environment.
TEFA Backend - Postman Usage Guide

File structure
- `TEFA-Backend.postman_collection.json` - main collection with CRUD folders per resource

What is inside the collection
- `AUTH` - login request to get `authToken`
- `USERS` - create, list, detail, update, delete user
- `CATEGORIES` - create, list, detail, update, delete category
- `PRODUCTS` - create, list, detail, update, delete product
- `WISHLISTS` - create, list, detail, update, delete wishlist item
- `INQUIRIES` - create, list, detail, update, delete inquiry

How to import
1. Open Postman.
2. Click `File` > `Import`.
3. Select `postman/TEFA-Backend.postman_collection.json`.
4. After import, the folders should appear in the left sidebar.

How to set up variables
1. Create a Postman environment, for example `Local TEFA`.
2. Add `baseUrl` with value like `http://localhost:3000`.
3. Add `authToken` and leave it empty at first.
4. Select that environment from the top-right dropdown before sending requests.

How to use the CRUD folders correctly
- Use `CREATE` for `POST` requests.
- Use `SHOW ALL` for `GET` list endpoints.
- Use `SHOW BY ID` for single-resource `GET` endpoints and replace `:id` with the actual UUID.
- Use `UPDATE` for `PATCH` requests.
- Use `DELETE` for removing data.
- For protected routes, put `Bearer {{authToken}}` in the `Authorization` header.

How to get a token
1. Open the `AUTH` folder.
2. Send the `LOGIN` request.
3. Copy the returned token into `authToken` in your environment.

Local testing flow
1. Start the backend locally.
2. Import the collection.
3. Set the environment variables.
4. Send `AUTH > LOGIN` first.
5. Use the token for protected requests.
6. Run the `CREATE` request for a category first, then use its UUID in `PRODUCTS > CREATE`.

Notes
- The collection is a template, so replace placeholder values like `<uuid>` or ID numbers with real IDs from your database.
- The PROJECTS endpoints use form-data for uploads. To associate multiple students with a project, use the `students` key in form-data and set the value to a stringified JSON array: `[{"id": 1, "role": "Ketua Kelompok"}]`.
- The structure is meant to be similar to your example: grouped folders and CRUD verbs.
- If you want, I can also add a ready-to-import Postman environment file next.