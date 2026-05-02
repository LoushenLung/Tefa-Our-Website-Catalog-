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
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { RolesGuard, Role } from '../../helper/roles-guard';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(Number(id));
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(Number(id), updateStudentDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(Number(id));
  }
}
