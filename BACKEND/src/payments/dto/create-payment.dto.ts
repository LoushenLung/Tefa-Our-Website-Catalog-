export class CreatePaymentDto {
  orderId: number;
  paymentMethode?: string;
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  notes?: string;
}
