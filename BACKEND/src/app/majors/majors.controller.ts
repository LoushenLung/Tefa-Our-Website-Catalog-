import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MajorsService } from './majors.service';
import { CreateMajorDto } from './dto/create-major.dto';
import { UpdateMajorDto } from './dto/update-major.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { RolesGuard, Role } from '../../helper/roles-guard';

@Controller('majors')
export class MajorsController {
  constructor(private readonly majorsService: MajorsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @Post()
  create(@Body() createMajorDto: CreateMajorDto) {
    return this.majorsService.create(createMajorDto);
  }

  @Get()
  findAll() {
    return this.majorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.majorsService.findOne(Number(id));
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMajorDto: UpdateMajorDto) {
    return this.majorsService.update(Number(id), updateMajorDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.majorsService.remove(Number(id));
  }
}
