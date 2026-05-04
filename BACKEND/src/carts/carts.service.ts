import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CartsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    if (!data.userId) throw new BadRequestException('userId is required');

    const user = await this.prisma.user.findUnique({ where: { id: Number(data.userId) } });
    if (!user) throw new NotFoundException(`User with id ${data.userId} not found`);

    const existingCart = await this.prisma.cart.findFirst({ where: { userId: Number(data.userId) } });
    if (existingCart) throw new BadRequestException(`User with id ${data.userId} already has a cart`);

    return await this.prisma.cart.create({
      data: {
        ...data,
        userId: Number(data.userId),
      },
    });
  }

  async findAll() {
    return await this.prisma.cart.findMany({ include: { items: true } });
  }

  async findOne(id: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: Number(id) },
      include: { items: true },
    });
    if (!cart) throw new NotFoundException(`Cart with id ${id} not found`);
    return cart;
  }

  async update(id: number, data: any) {
    const cart = await this.prisma.cart.findUnique({ where: { id: Number(id) } });
    if (!cart) throw new NotFoundException(`Cart with id ${id} not found`);

    if (data.userId) {
      const user = await this.prisma.user.findUnique({ where: { id: Number(data.userId) } });
      if (!user) throw new NotFoundException(`User with id ${data.userId} not found`);

      const existingCart = await this.prisma.cart.findFirst({
        where: { userId: Number(data.userId), NOT: { id: Number(id) } },
      });
      if (existingCart) throw new BadRequestException(`User with id ${data.userId} already has a cart`);
    }

    return await this.prisma.cart.update({
      where: { id: Number(id) },
      data: {
        ...data,
        ...(data.userId && { userId: Number(data.userId) }),
      },
    });
  }

  async remove(id: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: Number(id) },
      include: { items: true },
    });
    if (!cart) throw new NotFoundException(`Cart with id ${id} not found`);
    if (cart.items.length > 0) {
      throw new BadRequestException(`Cannot delete cart with id ${id} because it still has ${cart.items.length} item(s) inside`);
    }

    return await this.prisma.cart.delete({ where: { id: Number(id) } });
  }
}