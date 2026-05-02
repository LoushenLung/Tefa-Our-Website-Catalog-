import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProjectsService } from './projects.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Role } from '../helper/roles-guard';
import { CloudinaryService } from '../helper/cloudinary.service';
import 'multer'; // Memuat namespace Express.Multer

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  async create(@Body() data: any, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(
        file,
        'katalog_thumbnail',
      );
      data.thumbnail = uploadResult.secure_url;
    }
    return this.projectsService.create(data);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(Number(id));
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async update(
    @Param('id') id: string,
    @Body() data: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(
        file,
        'katalog_thumbnail',
      );
      data.thumbnail = uploadResult.secure_url;
    }
    return this.projectsService.update(Number(id), data);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.projectsService.remove(id);
  }
}
