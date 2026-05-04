import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

const VALID_ROLES = ['ADMIN', 'USER'];

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string) {
    if (!email) throw new BadRequestException('email is required');
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async create(createUserDto: CreateUserDto) {
    if (!createUserDto.email) throw new BadRequestException('email is required');
    if (!createUserDto.password) throw new BadRequestException('password is required');
    if (!createUserDto.name) throw new BadRequestException('name is required');

    if (createUserDto.role && !VALID_ROLES.includes(createUserDto.role)) {
      throw new BadRequestException(`Invalid role "${createUserDto.role}". Valid roles: ${VALID_ROLES.join(', ')}`);
    }

    const existingUser = await this.prisma.user.findUnique({ where: { email: createUserDto.email } });
    if (existingUser) throw new ConflictException(`User with email "${createUserDto.email}" already exists`);

    if (createUserDto.password.length < 6) {
      throw new BadRequestException('password must be at least 6 characters');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    if (updateUserDto.email) {
      const existingEmail = await this.prisma.user.findFirst({
        where: { email: updateUserDto.email, NOT: { id: Number(id) } },
      });
      if (existingEmail) throw new ConflictException(`Email "${updateUserDto.email}" is already in use`);
    }

    if (updateUserDto.role && !VALID_ROLES.includes(updateUserDto.role)) {
      throw new BadRequestException(`Invalid role "${updateUserDto.role}". Valid roles: ${VALID_ROLES.join(', ')}`);
    }

    if (updateUserDto.password) {
      if (updateUserDto.password.length < 6) {
        throw new BadRequestException('password must be at least 6 characters');
      }
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const data: any = { ...updateUserDto };
    return await this.prisma.user.update({
      where: { id: Number(id) },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    return await this.prisma.user.delete({ where: { id: Number(id) } });
  }
}