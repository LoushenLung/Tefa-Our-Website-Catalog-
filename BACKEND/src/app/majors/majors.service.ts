import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateMajorDto } from './dto/create-major.dto';
import { UpdateMajorDto } from './dto/update-major.dto';

@Injectable()
export class MajorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMajorDto: CreateMajorDto) {
    return await this.prisma.major.create({
      data: { name: createMajorDto.name },
    });
  }

  async findAll() {
    return await this.prisma.major.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: number) {
    return await this.prisma.major.findUnique({ where: { id: Number(id) } });
  }

  async update(id: number, updateMajorDto: UpdateMajorDto) {
    return await this.prisma.major.update({
      where: { id: Number(id) },
      data: { name: updateMajorDto.name },
    });
  }

  async remove(id: number) {
    return await this.prisma.major.delete({ where: { id: Number(id) } });
  }
}
