import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';  
import { CartsService } from './carts.service';  
  
@Controller('carts')  
export class CartsController {  
  constructor(private readonly cartsService: CartsService) {}  
  
  @Post()  
  create(@Body() data: any) {  
    return this.cartsService.create(data);  
  }  
  
  @Get()  
  findAll() {  
    return this.cartsService.findAll();  
  }  
  
  @Get(':id')  
  findOne(@Param('id') id: number) {
    return this.cartsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() data: any) {
    return this.cartsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
  }  
} 
