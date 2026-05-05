import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const VALID_STATUSES = ['PENDING', 'PENDING_PAYMENT', 'WAITING_VERIFICATION', 'PAID', 'CANCELLED', 'REJECTED'];

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async checkout(userId: number, data: any) {
    if (!data.customerName) throw new BadRequestException('customerName is required');
    if (!data.customerEmail) throw new BadRequestException('customerEmail is required');
    if (!data.customerPhone) throw new BadRequestException('customerPhone is required');

    // 1. Ambil cart user
    const cart = await this.prisma.cart.findUnique({
      where: { userId: Number(userId) },
      include: { items: { include: { project: true } } }
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty. Cannot checkout.');
    }

    // 2. Hitung harga dan persiapkan OrderItem
    let totalPrice = 0;
    const orderItemsPayload = cart.items.map(item => {
      const price = Number(item.project.price);
      totalPrice += price * item.quantity;

      return {
        projectId: item.project.id,
        projectName: item.project.title,
        price: price,
        thumbnail: item.project.thumbnail,
        quantity: item.quantity,
      };
    });

    // 3. Generate Order Code acak
    const orderCode = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 4. Lakukan Transaksi (Buat order + Hapus isi keranjang)
    const result = await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderCode,
          userId: Number(userId),
          totalPrice,
          status: 'PENDING_PAYMENT',
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          items: {
            create: orderItemsPayload
          }
        },
        include: { items: true }
      });

      // Kosongkan keranjang setelah checkout
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return order;
    });

    return result;
  }

  async findAll() {
    return await this.prisma.order.findMany({
      include: { items: true, paymentProofs: true },
    });
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: Number(id) },
      include: { items: true, paymentProofs: true },
    });
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);
    return order;
  }

  async update(id: number, data: any) {
    const order = await this.prisma.order.findUnique({ where: { id: Number(id) } });
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);

    if (data.status && !VALID_STATUSES.includes(data.status)) {
      throw new BadRequestException(`Invalid status "${data.status}". Valid statuses: ${VALID_STATUSES.join(', ')}`);
    }

    return await this.prisma.order.update({ where: { id: Number(id) }, data });
  }

  async remove(id: number) {
    const order = await this.prisma.order.findUnique({ where: { id: Number(id) } });
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);

    return await this.prisma.order.delete({ where: { id: Number(id) } });
  }
}