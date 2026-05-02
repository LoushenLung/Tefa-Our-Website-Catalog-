# Payment Feature - Quick Reference

## What Was Created

### Module Files

- ✅ `payments.module.ts` - Module definition
- ✅ `payments.controller.ts` - API endpoints
- ✅ `payments.service.ts` - Business logic
- ✅ `payments.controller.spec.ts` - Controller tests
- ✅ `payments.service.spec.ts` - Service tests

### DTO & Entity Files

- ✅ `dto/create-payment.dto.ts` - Create payment DTO
- ✅ `dto/update-payment.dto.ts` - Update payment DTO
- ✅ `entities/payment-proof.entity.ts` - Payment proof entity

### Documentation Files

- ✅ `PAYMENTS_DOCS.md` - Complete API documentation
- ✅ `POSTMAN_EXAMPLES.md` - API request examples
- ✅ `SETUP_GUIDE.md` - Setup and implementation guide
- ✅ `QUICK_REFERENCE.md` - This file

### Modified Files

- ✅ `src/app.module.ts` - Added PaymentsModule import

## Database Status

### Already Exists in Prisma Schema

```
✅ PaymentProofStatus enum (PENDING, APPROVED, REJECTED)
✅ PaymentProof model
✅ Order relationships
✅ OrderStatus enum (includes WAITING_VERIFICATION, PAID)
```

**No migrations needed** - schema already supports payment feature!

## Key Features

### For Users

```
📤 Upload payment proof (foto bukti pembayaran)
👁️ View their payment proof status
🔍 See history of payment attempts
```

### For Admin

```
📋 View all pending payments with pagination
✅ Approve payments
❌ Reject payments with reason
📊 View detailed payment information
```

## API Routes Overview

| Method | Route                          | Purpose                 | Auth  |
| ------ | ------------------------------ | ----------------------- | ----- |
| POST   | `/payments/upload/:orderId`    | Upload bukti pembayaran | User  |
| GET    | `/payments/order/:orderId`     | Get latest proof        | User  |
| GET    | `/payments/order/:orderId/all` | Get all proofs          | User  |
| GET    | `/payments/admin/all`          | List all payments       | Admin |
| PATCH  | `/payments/admin/approve/:id`  | Approve payment         | Admin |
| PATCH  | `/payments/admin/reject/:id`   | Reject payment          | Admin |
| GET    | `/payments/admin/:id`          | Get detail              | Admin |

## Order Status Flow

```
User creates order
        ↓
PENDING
        ↓
PENDING_PAYMENT (checkout complete)
        ↓
User uploads bukti pembayaran
        ↓
WAITING_VERIFICATION (waiting for admin review)
        ↓
┌─────────────────────────┬──────────────────────┐
│                         │                      │
Admin approves      Admin rejects
│                         │
↓                         ↓
PAID             PENDING_PAYMENT (try again)
```

## Implementation Checklist

- [ ] Database migrations run (if needed)
- [ ] Dependencies installed
- [ ] Environment variables configured (Cloudinary)
- [ ] JWT authentication working
- [ ] PaymentsModule registered in AppModule
- [ ] Admin guard implemented (optional but recommended)
- [ ] Tests running successfully
- [ ] Postman collection imported and tested
- [ ] Frontend integration completed

## Common Tasks

### Test Upload Endpoint

```bash
curl -X POST http://localhost:3000/payments/upload/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@payment.jpg"
```

### Get Admin Dashboard Data

```bash
curl -X GET "http://localhost:3000/payments/admin/all?page=1&limit=10" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Approve Payment

```bash
curl -X PATCH http://localhost:3000/payments/admin/approve/1 \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"adminNote":"Approved"}'
```

## Integration with Frontend

### React/Next.js Example

```typescript
// Upload payment proof
async function uploadPaymentProof(orderId: number, file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`/api/payments/upload/${orderId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return response.json();
}

// Get payment status
async function getPaymentStatus(orderId: number) {
  const response = await fetch(`/api/payments/order/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
}
```

## File Upload Specifications

### Supported Formats

- ✅ JPEG
- ✅ PNG
- ✅ JPG
- ✅ WebP

### Storage

- 📁 Cloudinary folder: `payment-proofs/`
- 🔒 Secure URL format

## Troubleshooting Quick Links

| Problem                   | Solution                            |
| ------------------------- | ----------------------------------- |
| 413 Payload Too Large     | Increase file size limit in main.ts |
| Invalid Cloudinary config | Check .env variables                |
| File upload fails         | Verify MIME type and size           |
| Unauthorized error        | Check JWT token validity            |
| Forbidden on admin routes | Implement AdminGuard                |

## File Structure Summary

```
BACKEND/
└── src/
    └── payments/                    ← NEW MODULE
        ├── dto/
        │   ├── create-payment.dto.ts
        │   └── update-payment.dto.ts
        ├── entities/
        │   └── payment-proof.entity.ts
        ├── payments.controller.ts
        ├── payments.controller.spec.ts
        ├── payments.service.ts
        ├── payments.service.spec.ts
        ├── payments.module.ts
        ├── PAYMENTS_DOCS.md           ← Read this first
        ├── POSTMAN_EXAMPLES.md        ← For API testing
        ├── SETUP_GUIDE.md             ← For implementation
        └── QUICK_REFERENCE.md         ← This file
```

## What's Next?

### Immediate (Required)

1. Run database migrations (if needed)
2. Test upload endpoint with Postman
3. Verify Cloudinary integration
4. Test approval/rejection flow

### Short-term (Recommended)

1. Implement AdminGuard for security
2. Add email notifications on approval/rejection
3. Add rate limiting
4. Write more comprehensive tests

### Long-term (Nice to have)

1. Payment gateway integration
2. Automated approval rules
3. Payment analytics dashboard
4. Multi-language support

## Support Documents

- 📖 **PAYMENTS_DOCS.md** - Complete API documentation with all endpoints
- 🧪 **POSTMAN_EXAMPLES.md** - Ready-to-use Postman requests
- 🛠️ **SETUP_GUIDE.md** - Detailed setup instructions
- ⚡ **QUICK_REFERENCE.md** - This file (quick overview)

## Version Info

- Created: May 2, 2026
- NestJS: ^11.0.1
- Prisma: ^6.16.2
- Cloudinary: ^2.8.0
- Node.js: Recommended 18+

---

**Questions or issues? Check SETUP_GUIDE.md for troubleshooting section.**
