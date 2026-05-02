import { IsNotEmpty, IsString, IsEmail, MinLength, IsOptional } from 'class-validator';
import { Role } from '../../../generated/prisma';
import { IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role = Role.USER;
}
