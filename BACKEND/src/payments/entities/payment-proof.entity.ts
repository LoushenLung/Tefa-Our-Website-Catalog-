export class PaymentProof {
  id: number;
  orderId: number;
  fileUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNote?: string;
  createdAt: Date;
}
