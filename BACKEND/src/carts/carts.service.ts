import { Injectable } from '@nestjs/common';  
import { PrismaService } from '../../prisma/prisma.service';  
  
@Injectable()  
export class CartsService {  
  constructor(private prisma: PrismaService) {}  
  
  async create(data: any) {  
    return await this.prisma.cart.create({ 
      data: {
        ...data,
        userId: Number(data.userId)
      } 
    });
  }
  async findAll() {
    return await this.prisma.cart.findMany({ include: { items: true } });
  }
  async findOne(id: number) {
    return await this.prisma.cart.findUnique({ where: { id: Number(id) }, include: { items: true } });
  }
  async update(id: number, data: any) {
    return await this.prisma.cart.update({ where: { id: Number(id) }, data });
  }
  async remove(id: number) {
    return await this.prisma.cart.delete({ where: { id: Number(id) } });
}}