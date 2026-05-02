import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { PrismaModule } from '../../../prisma/prisma.module';
import { AuthModule } from '../../auth/auth.module';
import { RolesGuard } from '../../helper/roles-guard';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [StudentsController],
  providers: [StudentsService, RolesGuard],
})
export class StudentsModule {}
