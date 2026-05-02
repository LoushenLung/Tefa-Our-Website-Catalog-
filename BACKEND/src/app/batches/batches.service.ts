import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';

@Injectable()
export class BatchesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBatchDto: CreateBatchDto) {
    return await this.prisma.batch.create({
      data: { year: createBatchDto.year },
    });
  }

  async findAll() {
    return await this.prisma.batch.findMany({ orderBy: { year: 'asc' } });
  }

  async findOne(id: number) {
    return await this.prisma.batch.findUnique({ where: { id: Number(id) } });
  }

  async update(id: number, updateBatchDto: UpdateBatchDto) {
    return await this.prisma.batch.update({
      where: { id: Number(id) },
      data: { year: updateBatchDto.year },
    });
  }

  async remove(id: number) {
    return await this.prisma.batch.delete({ where: { id: Number(id) } });
  }
}
