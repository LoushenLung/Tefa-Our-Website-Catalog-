import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryService } from '../helper/cloudinary.service';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prismaService: PrismaService;
  let cloudinaryService: CloudinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: PrismaService,
          useValue: {
            order: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            paymentProof: {
              findFirst: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              count: jest.fn(),
            },
          },
        },
        {
          provide: CloudinaryService,
          useValue: {
            uploadImage: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    prismaService = module.get<PrismaService>(PrismaService);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadPaymentProof', () => {
    it('should upload payment proof successfully', async () => {
      const orderId = 1;
      const userId = 1;
      const file = {
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
        originalname: 'payment.jpg',
      } as Express.Multer.File;

      const mockOrder = {
        id: orderId,
        userId,
        status: 'PENDING_PAYMENT',
      };

      const mockUploadResult = {
        secure_url: 'https://example.com/payment.jpg',
      };

      jest
        .spyOn(prismaService.order, 'findUnique')
        .mockResolvedValue(mockOrder as any);
      jest
        .spyOn(cloudinaryService, 'uploadImage')
        .mockResolvedValue(mockUploadResult);
      jest
        .spyOn(prismaService.paymentProof, 'findFirst')
        .mockResolvedValue(null);
      jest.spyOn(prismaService.paymentProof, 'create').mockResolvedValue({
        id: 1,
        orderId,
        fileUrl: mockUploadResult.secure_url,
        status: 'PENDING',
      } as any);

      const result = await service.uploadPaymentProof(orderId, file, userId);

      expect(result).toBeDefined();
      expect(prismaService.order.findUnique).toHaveBeenCalled();
      expect(cloudinaryService.uploadImage).toHaveBeenCalled();
    });
  });
});
