import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch('toggle-2fa')
  @UseGuards(AuthGuard)
  toggleTwoFactor(
    @Body('enable') enable: boolean,
    @Body('userId') userId: number, // Opsional, buat Admin
    @Request() req,
  ) {
    let targetId = req.user.sub;

    // Jika yang akses adalah ADMIN dan dia ngirim userId target, pake ID itu
    if (userId && req.user.role === 'ADMIN') {
      targetId = Number(userId);
    } 
    // Jika bukan Admin tapi coba-coba ngirim userId orang lain
    else if (userId && req.user.sub !== Number(userId)) {
      throw new ForbiddenException('Hanya ADMIN yang bisa mengubah setting user lain.');
    }
    
    return this.usersService.toggleTwoFactor(targetId, enable);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
