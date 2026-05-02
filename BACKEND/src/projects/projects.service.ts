import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  private normalizeProjectData(data: any) {
    const normalized: any = { ...data };
    if (data.studentId !== undefined) {
      normalized.studentId = Number(data.studentId);
    }
    if (data.categoryId !== undefined) {
      normalized.categoryId = Number(data.categoryId);
    }
    return normalized;
  }

  async create(data: any) {
    return await this.prisma.project.create({
      data: this.normalizeProjectData(data),
    });
  }

  async findAll() {
    return await this.prisma.project.findMany({
      include: {
        category: true,
        student: { include: { major: true, batch: true } },
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.project.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
        student: { include: { major: true, batch: true } },
      },
    });
  }

  async update(id: number, data: any) {
    return await this.prisma.project.update({
      where: { id: Number(id) },
      data: this.normalizeProjectData(data),
    });
  }

  async remove(id: number) {
    return await this.prisma.project.delete({ where: { id: Number(id) } });
  }
}
