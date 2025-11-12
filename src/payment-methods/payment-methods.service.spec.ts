import { Test, TestingModule } from '@nestjs/testing';
import { PaymentMethodsService } from './payment-methods.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreatePaymentMethodDto, PaymentType } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';

jest.mock('../common/encryption.util', () => ({
  encrypt: jest.fn((data) => `encrypted_${data}`),
  getLast4Digits: jest.fn((cardNumber) => cardNumber.slice(-4)),
  validateCardNumber: jest.fn((cardNumber) => /^\d{13,19}$/.test(cardNumber)),
  detectCardBrand: jest.fn(() => 'VISA'),
}));

describe('PaymentMethodsService', () => {
  let service: PaymentMethodsService;
  let prismaService: PrismaService;

  const mockUserUuid = '550e8400-e29b-41d4-a716-446655440000';
  const mockSeq = BigInt(1);

  const mockPaymentMethod = {
    seq: mockSeq,
    user_uuid: mockUserUuid,
    type: PaymentType.CARD,
    card_number_hash: 'encrypted_4111111111111111',
    last_4_nums: '1111',
    card_brand: 'VISA',
    expiry_month: '12',
    expiry_year: '2025',
    cvv_hash: 'encrypted_123',
    is_primary: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentMethodsService,
        {
          provide: PrismaService,
          useValue: {
            payment_methods: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              updateMany: jest.fn(),
              count: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentMethodsService>(PaymentMethodsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a payment method with valid card', async () => {
      const createDto: CreatePaymentMethodDto = {
        type: PaymentType.CARD,
        card_number: '4111111111111111',
        expiry_month: '12',
        expiry_year: '2025',
        card_brand: 'VISA',
        cvv: '123',
        provider_name: 'Shinhan Card',
        is_primary: false,
      };

      (prismaService.payment_methods.create as jest.Mock).mockResolvedValue(mockPaymentMethod);

      const result = await service.create(mockUserUuid, createDto);

      expect(result).toEqual(mockPaymentMethod);
      expect(prismaService.payment_methods.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid card number', async () => {
      const createDto: CreatePaymentMethodDto = {
        type: PaymentType.CARD,
        card_number: 'invalid_number',
        expiry_month: '12',
        expiry_year: '2025',
        card_brand: 'VISA',
        cvv: '123',
        provider_name: 'Shinhan Card',
        is_primary: false,
      };

      await expect(service.create(mockUserUuid, createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for expired card', async () => {
      const createDto: CreatePaymentMethodDto = {
        type: PaymentType.CARD,
        card_number: '4111111111111111',
        expiry_month: '01',
        expiry_year: '2020',
        card_brand: 'VISA',
        cvv: '123',
        provider_name: 'Shinhan Card',
        is_primary: false,
      };

      await expect(service.create(mockUserUuid, createDto)).rejects.toThrow(BadRequestException);
    });

    it('should set is_primary to false when adding new primary card', async () => {
      const createDto: CreatePaymentMethodDto = {
        type: PaymentType.CARD,
        card_number: '4111111111111111',
        expiry_month: '12',
        expiry_year: '2025',
        card_brand: 'VISA',
        cvv: '123',
        provider_name: 'Shinhan Card',
        is_primary: true,
      };

      (prismaService.payment_methods.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
      (prismaService.payment_methods.create as jest.Mock).mockResolvedValue({
        ...mockPaymentMethod,
        is_primary: true,
      });

      const result = await service.create(mockUserUuid, createDto);

      expect(prismaService.payment_methods.updateMany).toHaveBeenCalledWith({
        where: { user_uuid: mockUserUuid, is_primary: true },
        data: { is_primary: false },
      });
      expect(result).toBeDefined();
    });
  });

  describe('findAllByUser', () => {
    it('should return all payment methods for a user', async () => {
      const paymentMethods = [mockPaymentMethod, { ...mockPaymentMethod, seq: BigInt(2) }];
      (prismaService.payment_methods.findMany as jest.Mock).mockResolvedValue(paymentMethods);

      const result = await service.findAllByUser(mockUserUuid);

      expect(result).toEqual(paymentMethods);
      expect(prismaService.payment_methods.findMany).toHaveBeenCalledWith({
        where: { user_uuid: mockUserUuid },
        orderBy: [{ is_primary: 'desc' }, { created_at: 'desc' }],
      });
    });
  });

  describe('findOne', () => {
    it('should return a payment method by ID', async () => {
      (prismaService.payment_methods.findUnique as jest.Mock).mockResolvedValue(mockPaymentMethod);

      const result = await service.findOne(mockSeq, mockUserUuid);

      expect(result).toEqual(mockPaymentMethod);
      expect(prismaService.payment_methods.findUnique).toHaveBeenCalledWith({
        where: { seq: mockSeq },
      });
    });

    it('should throw NotFoundException if payment method not found', async () => {
      (prismaService.payment_methods.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(BigInt(999), mockUserUuid)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own the payment method', async () => {
      const otherUserUuid = '550e8400-e29b-41d4-a716-446655440001';
      (prismaService.payment_methods.findUnique as jest.Mock).mockResolvedValue({
        ...mockPaymentMethod,
        user_uuid: otherUserUuid,
      });

      await expect(service.findOne(mockSeq, mockUserUuid)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update a payment method', async () => {
      const updateDto: UpdatePaymentMethodDto = {
        expiry_month: '11',
        expiry_year: '2026',
      };

      (prismaService.payment_methods.findUnique as jest.Mock).mockResolvedValue(mockPaymentMethod);
      (prismaService.payment_methods.update as jest.Mock).mockResolvedValue({
        ...mockPaymentMethod,
        expiry_month: '11',
        expiry_year: '2026',
      });

      const result = await service.update(mockSeq, mockUserUuid, updateDto);

      expect(result).toBeDefined();
      expect(prismaService.payment_methods.update).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user does not own the payment method', async () => {
      const otherUserUuid = '550e8400-e29b-41d4-a716-446655440001';
      const updateDto: UpdatePaymentMethodDto = {
        expiry_month: '12',
        expiry_year: '2025',
      };

      (prismaService.payment_methods.findUnique as jest.Mock).mockResolvedValue({
        ...mockPaymentMethod,
        user_uuid: otherUserUuid,
      });

      await expect(
        service.update(mockSeq, mockUserUuid, updateDto)
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should delete a payment method', async () => {
      const singleMethod = { ...mockPaymentMethod, is_primary: false };
      (prismaService.payment_methods.findUnique as jest.Mock).mockResolvedValue(singleMethod);
      (prismaService.payment_methods.delete as jest.Mock).mockResolvedValue(singleMethod);

      const result = await service.remove(mockSeq, mockUserUuid);

      expect(result).toEqual({ message: '결제수단이 삭제되었습니다.' });
      expect(prismaService.payment_methods.delete).toHaveBeenCalled();
    });

    it('should throw BadRequestException if deleting primary payment method with others', async () => {
      (prismaService.payment_methods.findUnique as jest.Mock).mockResolvedValue(mockPaymentMethod);
      (prismaService.payment_methods.count as jest.Mock).mockResolvedValue(2);

      await expect(service.remove(mockSeq, mockUserUuid)).rejects.toThrow(BadRequestException);
    });

    it('should throw ForbiddenException if user does not own the payment method', async () => {
      const otherUserUuid = '550e8400-e29b-41d4-a716-446655440001';
      (prismaService.payment_methods.findUnique as jest.Mock).mockResolvedValue({
        ...mockPaymentMethod,
        user_uuid: otherUserUuid,
      });

      await expect(service.remove(mockSeq, mockUserUuid)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('setPrimary', () => {
    it('should set payment method as primary', async () => {
      (prismaService.payment_methods.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockPaymentMethod)
        .mockResolvedValueOnce(mockPaymentMethod);
      (prismaService.$transaction as jest.Mock).mockResolvedValue([{ count: 1 }, mockPaymentMethod]);

      const result = await service.setPrimary(mockSeq, mockUserUuid);

      expect(result).toBeDefined();
      expect(prismaService.$transaction).toHaveBeenCalled();
    });
  });

  describe('getStatistics', () => {
    it('should return payment method statistics', async () => {
      const methods = [mockPaymentMethod, { ...mockPaymentMethod, seq: BigInt(2), type: PaymentType.PAYPAL }];
      (prismaService.payment_methods.findMany as jest.Mock).mockResolvedValue(methods);

      const result = await service.getStatistics(mockUserUuid);

      expect(result.total).toBe(2);
      expect(result.byType[PaymentType.CARD]).toBe(1);
      expect(result.byType[PaymentType.PAYPAL]).toBe(1);
      expect(result.primary).toBeDefined();
    });
  });
});
