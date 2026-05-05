import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../helper/roles-guard';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ContactsController],
  providers: [ContactsService, RolesGuard],
})
export class ContactsModule {}
