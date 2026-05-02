import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { CloudinaryService } from '../helper/cloudinary.service';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../helper/roles-guard';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, CloudinaryService, RolesGuard],
})
export class ProjectsModule {}
