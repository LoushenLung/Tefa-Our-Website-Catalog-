import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto) {
    return await this.prisma.student.create({
      data: {
        nis: createStudentDto.nis,
        name: createStudentDto.name,
        majorId: createStudentDto.majorId,
        batchId: createStudentDto.batchId,
      },
      include: { major: true, batch: true },
    });
  }

  async findAll() {
    return await this.prisma.student.findMany({
      include: { major: true, batch: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    return await this.prisma.student.findUnique({
      where: { id: Number(id) },
      include: { major: true, batch: true },
    });
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    return await this.prisma.student.update({
      where: { id: Number(id) },
      data: {
        nis: updateStudentDto.nis,
        name: updateStudentDto.name,
        majorId: updateStudentDto.majorId,
        batchId: updateStudentDto.batchId,
      },
      include: { major: true, batch: true },
    });
  }

  async remove(id: number) {
    return await this.prisma.student.delete({ where: { id: Number(id) } });
  }
}
