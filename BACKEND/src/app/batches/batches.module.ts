import { Module } from '@nestjs/common';
import { BatchesService } from './batches.service';
import { BatchesController } from './batches.controller';
import { PrismaModule } from '../../../prisma/prisma.module';
import { AuthModule } from '../../auth/auth.module';
import { RolesGuard } from '../../helper/roles-guard';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [BatchesController],
  providers: [BatchesService, RolesGuard],
})
export class BatchesModule {}
