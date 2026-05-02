import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
  Request,
  BadRequestException,
  Query,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // User upload bukti pembayaran
  @Post('upload/:orderId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPaymentProof(
    @Param('orderId') orderId: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('File bukti pembayaran harus disertakan');
    }

    return await this.paymentsService.uploadPaymentProof(
      Number(orderId),
      file,
      req.user.sub,
    );
  }

  // User lihat bukti pembayaran mereka
  @Get('order/:orderId')
  async getPaymentProof(
    @Param('orderId') orderId: string,
    @Request() req: any,
  ) {
    return await this.paymentsService.getPaymentProof(
      Number(orderId),
      req.user.sub,
    );
  }

  // User lihat semua bukti pembayaran untuk order
  @Get('order/:orderId/all')
  async getPaymentProofs(
    @Param('orderId') orderId: string,
    @Request() req: any,
  ) {
    return await this.paymentsService.getPaymentProofs(
      Number(orderId),
      req.user.sub,
    );
  }

  // Admin lihat semua pembayaran dengan pagination
  @Get('admin/all')
  async getAllPaymentProofs(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Request() req: any,
  ) {
    // Check if user is admin (pastikan ada role check di guard)
    return await this.paymentsService.getAllPaymentProofs(
      Number(page),
      Number(limit),
    );
  }

  // Admin approve pembayaran
  @Patch('admin/approve/:paymentProofId')
  async approvePayment(
    @Param('paymentProofId') paymentProofId: string,
    @Body() body: { adminNote?: string },
    @Request() req: any,
  ) {
    // Check if user is admin
    return await this.paymentsService.approvePayment(
      Number(paymentProofId),
      body?.adminNote,
    );
  }

  // Admin reject pembayaran
  @Patch('admin/reject/:paymentProofId')
  async rejectPayment(
    @Param('paymentProofId') paymentProofId: string,
    @Body() body: { adminNote: string },
    @Request() req: any,
  ) {
    if (!body?.adminNote) {
      throw new BadRequestException(
        'Alasan penolakan (adminNote) harus disertakan',
      );
    }

    // Check if user is admin
    return await this.paymentsService.rejectPayment(
      Number(paymentProofId),
      body.adminNote,
    );
  }

  // Admin lihat detail pembayaran
  @Get('admin/:paymentProofId')
  async getPaymentById(
    @Param('paymentProofId') paymentProofId: string,
    @Request() req: any,
  ) {
    // Check if user is admin
    return await this.paymentsService.getPaymentById(Number(paymentProofId));
  }
}
