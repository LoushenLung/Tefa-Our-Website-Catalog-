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
    
    // Pisahkan 'students' jika masih dikirim dari client lama
    if (normalized.students) {
      delete normalized.students;
    }

    return normalized;
  }

  async create(data: any) {
    const projectData = this.normalizeProjectData(data);

    return await this.prisma.project.create({
      data: projectData,
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
    const projectData = this.normalizeProjectData(data);

    const updateQuery: any = {
      where: { id: Number(id) },
      data: projectData,
    };

    return await this.prisma.project.update(updateQuery);
  }

  async remove(id: number) {
    return await this.prisma.project.delete({ where: { id: Number(id) } });
  }
}
