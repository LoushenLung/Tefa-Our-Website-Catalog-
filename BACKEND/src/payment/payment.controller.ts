import {
  Controller,
  Post,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  BadRequestException,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaymentService } from './payment.service';
import { UploadPaymentProofDto } from './dto/upload-payment-proof.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../helper/roles-guard';
import { Role as RoleEnum } from '@prisma/client';
import { Roles } from '../helper/roles.decorator';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('upload-proof/:orderId')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadPaymentProof(
    @Param('orderId', ParseIntPipe) orderId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.paymentService.uploadPaymentProof(orderId, file);
  }

  @Get('proof/:orderId')
  @UseGuards(AuthGuard)
  async getPaymentProof(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.paymentService.getPaymentProof(orderId);
  }

  @Get('bill/:orderId')
  @UseGuards(AuthGuard)
  async getBill(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.paymentService.getBill(orderId);
  }

  @Patch('verify/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([RoleEnum.ADMIN])
  async verifyPayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() verifyPaymentDto: VerifyPaymentDto,
  ) {
    return this.paymentService.verifyPayment(id, verifyPaymentDto);
  }
}