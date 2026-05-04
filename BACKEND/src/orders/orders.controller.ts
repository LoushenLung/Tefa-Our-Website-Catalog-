import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Role } from '../helper/roles-guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req, @Body() data: any) {
    data.userId = req.user.sub; // Inject ID pembeli otomatis dari konversi token JWT
    return this.ordersService.create(data);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    // Idealnya di sini nanti dipisahkan, jika user yang merequest hanya ambil data ordernya saja.
    // Untuk saat ini kita biarkan mengembalikan order secara global.
    return this.ordersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(Number(id));
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.ordersService.update(Number(id), data);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(Number(id));
  }
}
