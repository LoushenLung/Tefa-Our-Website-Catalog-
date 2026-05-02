# Payment Module Documentation

## Overview

Payment Module adalah fitur yang memungkinkan user untuk mengunggah bukti pembayaran berupa foto/gambar untuk order mereka. Admin dapat menyetujui atau menolak bukti pembayaran tersebut.

## Fitur Utama

### 1. Upload Bukti Pembayaran (User)

**Endpoint:** `POST /payments/upload/:orderId`

**Parameter:**

- `orderId` (path param): ID dari order
- `file` (form-data): Foto bukti pembayaran (JPEG, PNG, WebP)

**Request:**

```
POST /payments/upload/1
Headers:
  - Authorization: Bearer <JWT_TOKEN>
  - Content-Type: multipart/form-data

Body:
  - file: [image file]
```

**Response:**

```json
{
  "id": 1,
  "orderId": 1,
  "fileUrl": "https://res.cloudinary.com/...",
  "status": "PENDING",
  "adminNote": null,
  "createdAt": "2025-05-02T10:30:00Z"
}
```

**Status Code:**

- `200`: Berhasil
- `400`: File tidak valid
- `404`: Order tidak ditemukan
- `401`: Unauthorized

---

### 2. Lihat Bukti Pembayaran Terbaru (User)

**Endpoint:** `GET /payments/order/:orderId`

**Parameter:**

- `orderId` (path param): ID dari order

**Response:**

```json
{
  "id": 1,
  "orderId": 1,
  "fileUrl": "https://res.cloudinary.com/...",
  "status": "PENDING",
  "adminNote": null,
  "createdAt": "2025-05-02T10:30:00Z"
}
```

---

### 3. Lihat Semua Bukti Pembayaran untuk Order (User)

**Endpoint:** `GET /payments/order/:orderId/all`

**Parameter:**

- `orderId` (path param): ID dari order

**Response:**

```json
[
  {
    "id": 1,
    "orderId": 1,
    "fileUrl": "https://res.cloudinary.com/...",
    "status": "PENDING",
    "adminNote": null,
    "createdAt": "2025-05-02T10:30:00Z"
  }
]
```

---

### 4. Lihat Semua Bukti Pembayaran (Admin)

**Endpoint:** `GET /payments/admin/all?page=1&limit=10`

**Query Parameters:**

- `page` (optional, default: 1): Halaman
- `limit` (optional, default: 10): Jumlah data per halaman

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "orderId": 1,
      "fileUrl": "https://res.cloudinary.com/...",
      "status": "PENDING",
      "adminNote": null,
      "createdAt": "2025-05-02T10:30:00Z",
      "order": {
        "id": 1,
        "orderCode": "ORD-001",
        "userId": 1,
        "totalPrice": 150000,
        "status": "WAITING_VERIFICATION",
        "user": {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com"
        },
        "items": [
          {
            "id": 1,
            "projectName": "Project 1",
            "price": 150000,
            "quantity": 1
          }
        ]
      }
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

---

### 5. Setujui Bukti Pembayaran (Admin)

**Endpoint:** `PATCH /payments/admin/approve/:paymentProofId`

**Parameter:**

- `paymentProofId` (path param): ID dari bukti pembayaran
- `adminNote` (optional, body): Catatan dari admin

**Request:**

```json
{
  "adminNote": "Pembayaran berhasil diverifikasi"
}
```

**Response:**

```json
{
  "id": 1,
  "orderId": 1,
  "fileUrl": "https://res.cloudinary.com/...",
  "status": "APPROVED",
  "adminNote": "Pembayaran berhasil diverifikasi",
  "createdAt": "2025-05-02T10:30:00Z",
  "order": {
    "id": 1,
    "status": "PAID"
  }
}
```

**Note:** Order status akan otomatis berubah menjadi `PAID`

---

### 6. Tolak Bukti Pembayaran (Admin)

**Endpoint:** `PATCH /payments/admin/reject/:paymentProofId`

**Parameter:**

- `paymentProofId` (path param): ID dari bukti pembayaran
- `adminNote` (required, body): Alasan penolakan

**Request:**

```json
{
  "adminNote": "Nominal tidak sesuai dengan harga pesanan"
}
```

**Response:**

```json
{
  "id": 1,
  "orderId": 1,
  "fileUrl": "https://res.cloudinary.com/...",
  "status": "REJECTED",
  "adminNote": "Nominal tidak sesuai dengan harga pesanan",
  "createdAt": "2025-05-02T10:30:00Z",
  "order": {
    "id": 1,
    "status": "PENDING_PAYMENT"
  }
}
```

**Note:** Order status akan kembali ke `PENDING_PAYMENT`

---

### 7. Lihat Detail Bukti Pembayaran (Admin)

**Endpoint:** `GET /payments/admin/:paymentProofId`

**Parameter:**

- `paymentProofId` (path param): ID dari bukti pembayaran

**Response:**

```json
{
  "id": 1,
  "orderId": 1,
  "fileUrl": "https://res.cloudinary.com/...",
  "status": "PENDING",
  "adminNote": null,
  "createdAt": "2025-05-02T10:30:00Z",
  "order": {
    "id": 1,
    "orderCode": "ORD-001",
    "userId": 1,
    "totalPrice": 150000,
    "status": "WAITING_VERIFICATION",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "items": [
      {
        "id": 1,
        "projectName": "Project 1",
        "price": 150000,
        "quantity": 1
      }
    ]
  }
}
```

---

## Order Status Flow

```
PENDING → PENDING_PAYMENT → WAITING_VERIFICATION (setelah upload bukti)
                                    ↓
                            Admin approve/reject
                                    ↓
                        PAID (jika approve) / PENDING_PAYMENT (jika reject)
```

---

## PaymentProof Status

- **PENDING**: Bukti pembayaran baru diupload, menunggu verifikasi admin
- **APPROVED**: Bukti pembayaran telah disetujui oleh admin
- **REJECTED**: Bukti pembayaran ditolak oleh admin

---

## File Upload Specifications

### Accepted File Types:

- JPEG (`image/jpeg`)
- PNG (`image/png`)
- JPG (`image/jpg`)
- WebP (`image/webp`)

### Max File Size:

Tergantung konfigurasi Multer (default biasanya 10MB)

### Upload Folder di Cloudinary:

`payment-proofs/`

---

## Notes

1. User hanya bisa melihat/mengelola bukti pembayaran untuk order mereka sendiri
2. Admin dapat melihat semua bukti pembayaran dari semua user
3. Ketika user mengupload bukti pembayaran, order status secara otomatis berubah menjadi `WAITING_VERIFICATION`
4. User dapat mengupload bukti pembayaran baru untuk order yang sama (akan replace bukti sebelumnya)
5. Semua file bukti pembayaran disimpan di Cloudinary dengan folder `payment-proofs`

---

## Security Considerations

1. Endpoint yang memerlukan autentikasi user sudah dilindungi dengan JWT Guard
2. User hanya bisa upload bukti pembayaran untuk order mereka sendiri (userId check)
3. Admin endpoints perlu ditambahkan Role Guard untuk memastikan hanya admin yang bisa akses
4. File type validation dilakukan di service layer
5. Sensitive data (order details) hanya ditampilkan kepada admin

---

## Next Steps

1. Tambahkan Role Guard pada admin endpoints untuk keamanan yang lebih baik
2. Tambahkan email notification ketika admin approve/reject payment
3. Tambahkan rate limiting untuk prevent abuse
4. Tambahkan logging untuk audit trail
5. Implementasi payment gateway integration (Midtrans, Stripe, dll) untuk online payment
