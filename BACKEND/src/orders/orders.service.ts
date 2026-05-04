import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const VALID_STATUSES = ['PENDING', 'PENDING_PAYMENT', 'WAITING_VERIFICATION', 'PAID', 'CANCELLED'];

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    if (!data.orderCode) throw new BadRequestException('orderCode is required');
    if (!data.userId) throw new BadRequestException('userId is required');
    if (!data.totalPrice) throw new BadRequestException('totalPrice is required');
    if (!data.customerName) throw new BadRequestException('customerName is required');
    if (!data.customerEmail) throw new BadRequestException('customerEmail is required');
    if (!data.customerPhone) throw new BadRequestException('customerPhone is required');

    const existing = await this.prisma.order.findFirst({ where: { orderCode: data.orderCode } });
    if (existing) throw new BadRequestException(`Order with code "${data.orderCode}" already exists`);

    return await this.prisma.order.create({
      data: {
        ...data,
        userId: Number(data.userId),
      },
    });
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