import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  private normalizeProjectData(data: any) {
    const normalized: any = { ...data };
    
    // Hapus properti lama jika masih dikirim
    if (normalized.studentId !== undefined) {
      delete normalized.studentId;
    }
    
    if (data.categoryId !== undefined) {
      normalized.categoryId = Number(data.categoryId);
    }
    
    // Pisahkan 'students' dari data utama (akan dihandle terpisah)
    delete normalized.students;

    return normalized;
  }

  private parseStudentsData(studentsData: any) {
    if (!studentsData) return undefined;
    
    let parsed: any[] = [];
    if (typeof studentsData === 'string') {
      try {
        parsed = JSON.parse(studentsData);
      } catch (e) {
        return undefined;
      }
    } else if (Array.isArray(studentsData)) {
      parsed = studentsData;
    }

    if (parsed.length > 0) {
      return {
        create: parsed.map((s: any) => ({
          student: { connect: { id: Number(s.studentId || s.id) } },
          role: s.role || null,
        })),
      };
    }
    return undefined;
  }

  async create(data: any) {
    const projectData = this.normalizeProjectData(data);
    const studentsRelation = this.parseStudentsData(data.students);

    if (studentsRelation) {
      projectData.students = studentsRelation;
    }

    return await this.prisma.project.create({
      data: projectData,
    });
  }

  async findAll() {
    return await this.prisma.project.findMany({
      include: {
        category: true,
        students: { 
          include: { 
            student: { include: { major: true, batch: true } } 
          }
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.project.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
        students: { 
          include: { 
            student: { include: { major: true, batch: true } } 
          }
        },
      },
    });
  }

  async update(id: number, data: any) {
    const projectData = this.normalizeProjectData(data);
    const studentsRelation = this.parseStudentsData(data.students);

    const updateQuery: any = {
      where: { id: Number(id) },
      data: projectData,
    };

    // Jika ada update data students, kita hapus relasi lama, lalu buat baru
    if (studentsRelation) {
      updateQuery.data.students = {
        deleteMany: {}, // Hapus record pivot lama
        ...studentsRelation // Buat record pivot baru
      };
    }

    return await this.prisma.project.update(updateQuery);
  }

  async remove(id: number) {
    return await this.prisma.project.delete({ where: { id: Number(id) } });
  }
}
