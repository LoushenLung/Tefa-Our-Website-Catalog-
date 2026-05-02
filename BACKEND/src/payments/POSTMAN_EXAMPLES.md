# Postman Collection Examples

## 1. Upload Bukti Pembayaran

```
POST http://localhost:3000/payments/upload/1

Headers:
- Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
- Content-Type: multipart/form-data

Body (form-data):
- file: [select image file]
```

**cURL:**

```bash
curl -X POST http://localhost:3000/payments/upload/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/payment-proof.jpg"
```

---

## 2. Lihat Bukti Pembayaran Terbaru

```
GET http://localhost:3000/payments/order/1

Headers:
- Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**cURL:**

```bash
curl -X GET http://localhost:3000/payments/order/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 3. Lihat Semua Bukti Pembayaran untuk Order

```
GET http://localhost:3000/payments/order/1/all

Headers:
- Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**cURL:**

```bash
curl -X GET http://localhost:3000/payments/order/1/all \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 4. Lihat Semua Bukti Pembayaran (Admin)

```
GET http://localhost:3000/payments/admin/all?page=1&limit=10

Headers:
- Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (Admin Token)
```

**cURL:**

```bash
curl -X GET "http://localhost:3000/payments/admin/all?page=1&limit=10" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 5. Setujui Pembayaran (Admin)

```
PATCH http://localhost:3000/payments/admin/approve/1

Headers:
- Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (Admin Token)
- Content-Type: application/json

Body (JSON):
{
  "adminNote": "Pembayaran berhasil diverifikasi"
}
```

**cURL:**

```bash
curl -X PATCH http://localhost:3000/payments/admin/approve/1 \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"adminNote":"Pembayaran berhasil diverifikasi"}'
```

---

## 6. Tolak Pembayaran (Admin)

```
PATCH http://localhost:3000/payments/admin/reject/1

Headers:
- Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (Admin Token)
- Content-Type: application/json

Body (JSON):
{
  "adminNote": "Nominal tidak sesuai dengan harga pesanan"
}
```

**cURL:**

```bash
curl -X PATCH http://localhost:3000/payments/admin/reject/1 \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"adminNote":"Nominal tidak sesuai dengan harga pesanan"}'
```

---

## 7. Lihat Detail Bukti Pembayaran (Admin)

```
GET http://localhost:3000/payments/admin/1

Headers:
- Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (Admin Token)
```

**cURL:**

```bash
curl -X GET http://localhost:3000/payments/admin/1 \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## Testing Flow

### Scenario 1: User Upload Pembayaran

1. **User membuat order** (menggunakan existing create order endpoint)
2. **User upload bukti pembayaran**
   - POST `/payments/upload/:orderId`
   - Order status berubah ke `WAITING_VERIFICATION`

3. **Admin melihat daftar pembayaran**
   - GET `/payments/admin/all`

4. **Admin melihat detail pembayaran**
   - GET `/payments/admin/:paymentProofId`

5. **Admin setujui pembayaran**
   - PATCH `/payments/admin/approve/:paymentProofId`
   - Order status berubah ke `PAID`

---

### Scenario 2: Pembayaran Ditolak

1. **User upload bukti pembayaran**
   - POST `/payments/upload/:orderId`
   - Order status berubah ke `WAITING_VERIFICATION`

2. **Admin tolak pembayaran**
   - PATCH `/payments/admin/reject/:paymentProofId`
   - Order status kembali ke `PENDING_PAYMENT`

3. **User bisa upload ulang bukti pembayaran**
   - POST `/payments/upload/:orderId`
   - Bukti pembayaran sebelumnya akan diganti

---

## Environment Variables

Pastikan `.env` file memiliki:

```
DATABASE_URL=mysql://user:password@localhost:3306/dbname
JWT_VERIFY=your-secret-key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Response Status Codes

| Status | Meaning                                    |
| ------ | ------------------------------------------ |
| 200    | OK - Request berhasil                      |
| 201    | Created - Resource berhasil dibuat         |
| 400    | Bad Request - Validasi gagal               |
| 401    | Unauthorized - Token tidak valid/tidak ada |
| 403    | Forbidden - User tidak punya akses         |
| 404    | Not Found - Resource tidak ditemukan       |
| 500    | Server Error - Terjadi error di server     |
