import { Module } from '@nestjs/common';
import { BankAccountsService } from './bank-accounts.service';
import { BankAccountsController } from './bank-accounts.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../helper/roles-guard';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [BankAccountsController],
  providers: [BankAccountsService, RolesGuard],
})
export class BankAccountsModule {}
