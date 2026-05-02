import { Module } from '@nestjs/common';
import { MajorsService } from './majors.service';
import { MajorsController } from './majors.controller';
import { PrismaModule } from '../../../prisma/prisma.module';
import { AuthModule } from '../../auth/auth.module';
import { RolesGuard } from '../../helper/roles-guard';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [MajorsController],
  providers: [MajorsService, RolesGuard],
})
export class MajorsModule {}
