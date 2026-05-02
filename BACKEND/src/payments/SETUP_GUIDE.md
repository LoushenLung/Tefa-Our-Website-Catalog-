# Setup & Migration Guide - Payment Feature

## File Structure

Berikut adalah struktur file yang telah dibuat untuk payment feature:

```
src/payments/
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
├── PAYMENTS_DOCS.md
└── POSTMAN_EXAMPLES.md
```

## Database Schema

Database schema sudah ready di Prisma schema Anda:

```prisma
enum PaymentProofStatus {
  PENDING
  APPROVED
  REJECTED
}

model PaymentProof {
  id        Int                @id @default(autoincrement())
  orderId   Int
  fileUrl   String
  status    PaymentProofStatus @default(PENDING)
  adminNote String?            @db.Text
  createdAt DateTime           @default(now())

  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)
}

model Order {
  // ... existing fields ...
  paymentProofs PaymentProof[]
}
```

Jika belum ada migration, jalankan:

```bash
npx prisma migrate dev --name add_payment_feature
```

## Step-by-Step Implementation

### 1. Instalasi Dependencies

Pastikan dependencies berikut sudah terinstall:

```bash
npm install @nestjs/platform-express
npm install @nestjs/mapped-types
npm install cloudinary
```

**Status:** ✅ Semua sudah terinstall berdasarkan package.json

### 2. Verifikasi Cloudinary Configuration

Pastikan Cloudinary sudah dikonfigurasi di `src/helper/cloudinary.config.ts`

**Status:** ✅ Sudah ada

### 3. Register PaymentsModule

Module sudah di-register di `src/app.module.ts`

**Status:** ✅ Sudah di-update

### 4. JWT Authentication

Pastikan semua request dilindungi dengan JWT Guard. Tambahkan di main.ts jika belum:

```typescript
import { AuthGuard } from './auth/auth.guard';

// In your main.ts atau app.module.ts
app.useGlobalGuards(new AuthGuard(jwtService, reflector));
```

### 5. Role Guard untuk Admin Endpoints (Recommended)

Buat file `src/helper/admin-guard.ts`:

```typescript
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.role !== 'ADMIN') {
      throw new ForbiddenException('Hanya admin yang bisa akses endpoint ini');
    }

    return true;
  }
}
```

Kemudian gunakan di payment controller admin endpoints:

```typescript
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from '../helper/admin-guard';

@UseGuards(AdminGuard)
@Get('admin/all')
async getAllPaymentProofs(...) {
  // ...
}
```

## API Endpoints

### User Endpoints (Authenticated)

1. **Upload Bukti Pembayaran**

   ```
   POST /payments/upload/:orderId
   ```

2. **Lihat Bukti Pembayaran Terbaru**

   ```
   GET /payments/order/:orderId
   ```

3. **Lihat Semua Bukti Pembayaran**
   ```
   GET /payments/order/:orderId/all
   ```

### Admin Endpoints (Authenticated + Admin Role)

1. **Lihat Semua Pembayaran**

   ```
   GET /payments/admin/all?page=1&limit=10
   ```

2. **Setujui Pembayaran**

   ```
   PATCH /payments/admin/approve/:paymentProofId
   ```

3. **Tolak Pembayaran**

   ```
   PATCH /payments/admin/reject/:paymentProofId
   ```

4. **Lihat Detail Pembayaran**
   ```
   GET /payments/admin/:paymentProofId
   ```

## Testing

### Unit Tests

Jalankan tests:

```bash
npm run test
```

Test files yang tersedia:

- `src/payments/payments.service.spec.ts`
- `src/payments/payments.controller.spec.ts`

### Manual Testing

Gunakan Postman atau cURL (lihat `POSTMAN_EXAMPLES.md`)

### End-to-End Testing

```bash
npm run test:e2e
```

## Database Migrations

### Check Migration Status

```bash
npx prisma migrate status
```

### Apply Latest Migrations

```bash
npx prisma migrate deploy
```

### Generate Prisma Client

```bash
npx prisma generate
```

## Troubleshooting

### Issue 1: File Upload Error

**Error:** `413 Payload Too Large`

**Solution:** Increase file size limit di main.ts:

```typescript
const app = await NestFactory.create(AppModule);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
```

### Issue 2: Cloudinary Upload Failed

**Error:** `Invalid cloudinary configuration`

**Solution:** Pastikan environment variables sudah benar:

```env
CLOUDINARY_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

### Issue 3: User Cannot Access Payment Proof

**Error:** `403 Forbidden` atau `404 Not Found`

**Solution:**

- Pastikan order milik user (check userId)
- Pastikan JWT token valid
- Pastikan orderId benar

### Issue 4: Admin Cannot Approve/Reject

**Error:** `403 Forbidden`

**Solution:**

- Implementasi AdminGuard yang benar
- Pastikan user memiliki role `ADMIN` di database

## Performance Optimization

### 1. Add Database Indexes

Update Prisma schema:

```prisma
model PaymentProof {
  // ...
  orderId   Int

  @@index([orderId])
  @@index([status])
}
```

### 2. Add Caching (Optional)

Implementasi Redis caching untuk frequently accessed data:

```bash
npm install @nestjs/cache-manager cache-manager
```

## Security Considerations

### 1. File Validation

- ✅ Mime type validation
- ✅ File size limit
- ✅ Scan file for malware (recommended)

### 2. Access Control

- ✅ User hanya akses order mereka
- ✅ Admin check (gunakan AdminGuard)
- ✅ JWT validation

### 3. Data Protection

- ✅ Sensitive data tidak di-log
- ✅ Admin notes di-encrypt (recommended)

## Next Steps

### Phase 1: Core Features (Done ✅)

- Payment module structure
- File upload functionality
- Approval/Rejection workflow

### Phase 2: Enhanced Features (Recommended)

- [ ] Email notifications
- [ ] SMS notifications
- [ ] Payment gateway integration (Midtrans, Stripe)
- [ ] Automated approval (based on rules)
- [ ] Payment proof template/checklist

### Phase 3: Advanced Features (Optional)

- [ ] Multi-payment support
- [ ] Partial payment support
- [ ] Payment history export
- [ ] Custom approval workflows
- [ ] Integration with accounting system

## Environment Variables Needed

```env
# Cloudinary
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# JWT
JWT_VERIFY=your_secret_key

# Database
DATABASE_URL=mysql://user:password@host:port/db

# Optional: Notification Services
MAIL_HOST=your_smtp_host
MAIL_PORT=587
MAIL_USER=your_email
MAIL_PASSWORD=your_password

TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
```

## Docker Deployment (Optional)

Tambahkan ke `docker-compose.yml`:

```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=mysql://user:password@db:3306/tefa
      - CLOUDINARY_NAME=${CLOUDINARY_NAME}
      - JWT_VERIFY=${JWT_VERIFY}
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: tefa
    ports:
      - '3306:3306'
```

## Support

Untuk bantuan lebih lanjut, lihat:

- [PAYMENTS_DOCS.md](./PAYMENTS_DOCS.md) - Dokumentasi lengkap API
- [POSTMAN_EXAMPLES.md](./POSTMAN_EXAMPLES.md) - Contoh request
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
