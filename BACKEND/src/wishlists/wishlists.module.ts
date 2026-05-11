import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../helper/roles-guard';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [WishlistsController],
  providers: [WishlistsService, RolesGuard],
})
export class WishlistsModule {}
