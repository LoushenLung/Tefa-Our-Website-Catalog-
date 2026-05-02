import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryService } from '../helper/cloudinary.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async uploadPaymentProof(
    orderId: number,
    file: Express.Multer.File,
    userId: number,
  ) {
    // Validasi order ada dan milik user
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      throw new NotFoundException(`Order dengan id ${orderId} tidak ditemukan`);
    }

    if (order.userId !== userId) {
      throw new BadRequestException('Anda tidak berhak mengakses order ini');
    }

    if (!file) {
      throw new BadRequestException('File bukti pembayaran harus disertakan');
    }

    // Validasi file adalah gambar
    const allowedMimetypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp',
    ];
    if (!allowedMimetypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'File harus berupa gambar (JPEG, PNG, WebP)',
      );
    }

    // Upload ke Cloudinary
    const uploadResult = await this.cloudinaryService.uploadImage(
      file,
      'payment-proofs',
    );

    // Cek apakah sudah ada payment proof untuk order ini
    const existingProof = await this.prisma.paymentProof.findFirst({
      where: { orderId },
    });

    let paymentProof;
    if (existingProof) {
      // Update existing proof
      paymentProof = await this.prisma.paymentProof.update({
        where: { id: existingProof.id },
        data: {
          fileUrl: uploadResult.secure_url,
          status: 'PENDING',
        },
      });
    } else {
      // Create new proof
      paymentProof = await this.prisma.paymentProof.create({
        data: {
          orderId,
          fileUrl: uploadResult.secure_url,
          status: 'PENDING',
        },
      });
    }

    // Update order status ke WAITING_VERIFICATION
    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'WAITING_VERIFICATION' },
    });

    return paymentProof;
  }

  async getPaymentProof(orderId: number, userId: number) {
    // Validasi order ada dan milik user
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order dengan id ${orderId} tidak ditemukan`);
    }

    if (order.userId !== userId) {
      throw new BadRequestException('Anda tidak berhak mengakses order ini');
    }

    const paymentProof = await this.prisma.paymentProof.findFirst({
      where: { orderId },
    });

    if (!paymentProof) {
      throw new NotFoundException(
        `Bukti pembayaran untuk order ${orderId} tidak ditemukan`,
      );
    }

    return paymentProof;
  }

  async getPaymentProofs(orderId: number, userId: number) {
    // Validasi order ada dan milik user
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order dengan id ${orderId} tidak ditemukan`);
    }

    if (order.userId !== userId) {
      throw new BadRequestException('Anda tidak berhak mengakses order ini');
    }

    return await this.prisma.paymentProof.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Admin functions
  async getAllPaymentProofs(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const proofs = await this.prisma.paymentProof.findMany({
      skip,
      take: limit,
      include: {
        order: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            items: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.paymentProof.count();

    return {
      data: proofs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async approvePayment(paymentProofId: number, adminNote?: string) {
    const paymentProof = await this.prisma.paymentProof.findUnique({
      where: { id: paymentProofId },
    });

    if (!paymentProof) {
      throw new NotFoundException('Bukti pembayaran tidak ditemukan');
    }

    // Update payment proof status
    const updated = await this.prisma.paymentProof.update({
      where: { id: paymentProofId },
      data: {
        status: 'APPROVED',
        adminNote,
      },
      include: {
        order: true,
      },
    });

    // Update order status to PAID
    await this.prisma.order.update({
      where: { id: updated.orderId },
      data: { status: 'PAID' },
    });

    return updated;
  }

  async rejectPayment(paymentProofId: number, adminNote: string) {
    if (!adminNote) {
      throw new BadRequestException('Alasan penolakan harus disertakan');
    }

    const paymentProof = await this.prisma.paymentProof.findUnique({
      where: { id: paymentProofId },
    });

    if (!paymentProof) {
      throw new NotFoundException('Bukti pembayaran tidak ditemukan');
    }

    // Update payment proof status
    const updated = await this.prisma.paymentProof.update({
      where: { id: paymentProofId },
      data: {
        status: 'REJECTED',
        adminNote,
      },
      include: {
        order: true,
      },
    });

    // Update order status back to PENDING_PAYMENT
    await this.prisma.order.update({
      where: { id: updated.orderId },
      data: { status: 'PENDING_PAYMENT' },
    });

    return updated;
  }

  async getPaymentById(paymentProofId: number) {
    const paymentProof = await this.prisma.paymentProof.findUnique({
      where: { id: paymentProofId },
      include: {
        order: {
          include: {
            user: true,
            items: true,
          },
        },
      },
    });

    if (!paymentProof) {
      throw new NotFoundException('Bukti pembayaran tidak ditemukan');
    }

    return paymentProof;
  }
}
