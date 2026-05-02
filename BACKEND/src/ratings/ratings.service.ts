import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, data: any) {
    const rating = await this.prisma.rating.create({
      data: {
        ...data,
        projectId: Number(data.projectId), // ← fix here
        userId: Number(userId),
      },
    });

    const agg = await this.prisma.rating.aggregate({
      where: { projectId: Number(data.projectId) },
      _avg: { score: true },
      _count: { score: true },
    });

    await this.prisma.project.update({
      where: { id: Number(data.projectId) },
      data: {
        averageRating: agg._avg.score || 0,
        totalReviews: agg._count.score || 0,
      },
    });

    return rating;
  }

  async findByProject(projectId: number) {
    return await this.prisma.rating.findMany({
      where: { projectId: Number(projectId) },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  }
}