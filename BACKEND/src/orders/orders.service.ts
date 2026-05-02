import { Injectable } from '@nestjs/common';  
import { PrismaService } from '../../prisma/prisma.service';  
  
@Injectable()  
export class OrdersService {  
  constructor(private prisma: PrismaService) {}  
  
  async create(data: any) {  
    return await this.prisma.order.create({ 
      data: {
        ...data,
        userId: Number(data.userId)
      } 
    });
  }
  async findAll() {
    return await this.prisma.order.findMany({ include: { items: true, paymentProofs: true } });
  }
  async findOne(id: number) {
    return await this.prisma.order.findUnique({ where: { id: Number(id) }, include: { items: true, paymentProofs: true } });
  }
  async update(id: number, data: any) {
    return await this.prisma.order.update({ where: { id: Number(id) }, data });
  }
  async remove(id: number) {
    return await this.prisma.order.delete({ where: { id: Number(id) } });
} }