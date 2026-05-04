import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryService } from '../helper/cloudinary.service';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async getBill(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    return {
      orderId: order.id,
      orderCode: order.orderCode,
      totalPrice: order.totalPrice,
      status: order.status,
      items: order.items,
    };
  }

  async uploadPaymentProof(orderId: number, file: Express.Multer.File) {
    // Cek apakah order ada dan statusnya PENDING_PAYMENT
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (!['PENDING', 'PENDING_PAYMENT'].includes(order.status)) {
      throw new BadRequestException(
        'Order must be PENDING or PENDING_PAYMENT before uploading proof',
      );
    }

    // Upload file ke Cloudinary
    const uploadResult = await this.cloudinaryService.uploadImage(
      file,
      'payment-proofs',
    );

    // Simpan PaymentProof ke database
    const paymentProof = await this.prisma.paymentProof.create({
      data: {
        orderId,
        fileUrl: uploadResult.secure_url,
      },
    });

    // Update status order ke WAITING_VERIFICATION
    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'WAITING_VERIFICATION' },
    });

    return paymentProof;
  }

  async getPaymentProof(orderId: number) {
    return await this.prisma.paymentProof.findMany({
      where: { orderId },
    });
  }
}
