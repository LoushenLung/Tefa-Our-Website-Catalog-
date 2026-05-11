import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post('toggle')
  toggle(@Request() req, @Body() createWishlistDto: CreateWishlistDto) {
    const userId = req.user.id;
    return this.wishlistsService.toggleWishlist(userId, createWishlistDto);
  }

  @Get()
  findMyWishlist(@Request() req) {
    const userId = req.user.id;
    return this.wishlistsService.findByUser(userId);
  }

  @Get('check/:projectId')
  checkStatus(@Request() req, @Param('projectId') projectId: string) {
    const userId = req.user.id;
    return this.wishlistsService.checkStatus(userId, +projectId);
  }
}
