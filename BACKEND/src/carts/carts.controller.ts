import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CartsService } from './carts.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) { }

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req, @Body() data: any) {
    data.userId = req.user.sub; // Inject userId JWT Token secara otomatis
    return this.cartsService.create(data);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.cartsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartsService.findOne(Number(id));
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    if(data.userId) delete data.userId; // Cegah injeksi manipulasi ID Keranjang
    return this.cartsService.update(Number(id), data);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartsService.remove(Number(id));
  }
} 
