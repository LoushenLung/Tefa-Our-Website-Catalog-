import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../helper/roles-guard';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, RolesGuard],
})
export class CategoriesModule {}
