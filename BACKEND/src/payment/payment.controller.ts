import {
  Controller,
  Post,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaymentService } from './payment.service';
import { UploadPaymentProofDto } from './dto/upload-payment-proof.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('bill/:orderId')
  async getBill(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.paymentService.getBill(orderId);
  }

  @Post('upload-proof/:orderId')
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
  async getPaymentProof(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.paymentService.getPaymentProof(orderId);
  }
}