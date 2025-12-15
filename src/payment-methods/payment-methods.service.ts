import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { endOfMonth, startOfMonth, subMonths } from 'date-fns';
import { 
  encrypt, 
  getLast4Digits, 
  validateCardNumber, 
  detectCardBrand 
} from '../common/encryption.util';
import { POPBILL_CLIENT } from '../external';
import type { PopbillClient } from '../external/popbill/popbill.client';

@Injectable()
export class PaymentMethodsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(POPBILL_CLIENT) private readonly popbillClient: PopbillClient,
  ) {}

  private toNumber(value: any) {
    if (value === null || value === undefined) return 0;
    try {
      return Number(value);
    } catch {
      return 0;
    }
  }

  private formatKrw(amount: number) {
    const safe = Number.isFinite(amount) ? amount : 0;
    return `${safe.toLocaleString('ko-KR')}원`;
  }

  // 결제수단 등록
  async create(userUuid: string, dto: CreatePaymentMethodDto) {
    // 카드 번호 유효성 검증 (카드 타입인 경우)
    if (dto.type === 'CARD' && dto.card_number) {
      if (!validateCardNumber(dto.card_number)) {
        throw new BadRequestException('유효하지 않은 카드번호입니다.');
      }

      // 만료일 검증
      if (dto.expiry_month && dto.expiry_year) {
        const now = new Date();
        const expiryDate = new Date(
          parseInt(dto.expiry_year),
          parseInt(dto.expiry_month) - 1,
          1
        );
        
        if (now > expiryDate) {
          throw new BadRequestException('만료된 카드입니다.');
        }
      }
    }

    // is_primary가 true면 기존 주 결제수단을 false로 변경
    if (dto.is_primary) {
      await this.prisma.payment_methods.updateMany({
        where: { user_uuid: userUuid, is_primary: true },
        data: { is_primary: false },
      });
    }

    // 카드번호 암호화 및 마지막 4자리 추출
    let cardNumberHash: string | undefined;
    let last4Nums: string;
    let cardBrand: string | undefined;

    if (dto.card_number) {
      cardNumberHash = encrypt(dto.card_number);
      last4Nums = getLast4Digits(dto.card_number);
      cardBrand = dto.card_brand || detectCardBrand(dto.card_number);
    } else {
      last4Nums = dto.card_number || '0000';
    }

    // CVV 암호화
    const cvvHash = dto.cvv ? encrypt(dto.cvv) : undefined;

    const paymentMethod = await this.prisma.payment_methods.create({
      data: {
        user_uuid: userUuid,
        type: dto.type,
        card_number_hash: cardNumberHash,
        last_4_nums: last4Nums,
        card_holder_name: dto.card_holder_name,
        provider_name: dto.provider_name,
        card_brand: cardBrand,
        expiry_month: dto.expiry_month,
        expiry_year: dto.expiry_year,
        cvv_hash: cvvHash,
        billing_address: dto.billing_address,
        billing_zip: dto.billing_zip,
        alias: dto.alias,
        is_primary: dto.is_primary ?? false,
      },
    });

    return paymentMethod;
  }

  // 내 결제수단 목록 조회
  async findAllByUser(userUuid: string) {
    const paymentMethods = await this.prisma.payment_methods.findMany({
      where: { user_uuid: userUuid },
      orderBy: [
        { is_primary: 'desc' }, // 주 결제수단 먼저
        { created_at: 'desc' },
      ],
    });

    return paymentMethods;
  }

  // 특정 결제수단 조회
  async findOne(seq: bigint, userUuid: string) {
    const paymentMethod = await this.prisma.payment_methods.findUnique({
      where: { seq },
    });

    if (!paymentMethod) {
      throw new NotFoundException('결제수단을 찾을 수 없습니다.');
    }

    // 본인의 결제수단인지 확인
    if (paymentMethod.user_uuid !== userUuid) {
      throw new ForbiddenException('해당 결제수단에 접근할 권한이 없습니다.');
    }

    return paymentMethod;
  }

  // 결제수단 수정
  async update(seq: bigint, userUuid: string, dto: UpdatePaymentMethodDto) {
    // 본인의 결제수단인지 확인
    await this.findOne(seq, userUuid);

    // 만료일 검증
    if (dto.expiry_month && dto.expiry_year) {
      const now = new Date();
      const expiryDate = new Date(
        parseInt(dto.expiry_year),
        parseInt(dto.expiry_month) - 1,
        1
      );
      
      if (now > expiryDate) {
        throw new BadRequestException('만료된 날짜로 설정할 수 없습니다.');
      }
    }

    const updated = await this.prisma.payment_methods.update({
      where: { seq },
      data: {
        alias: dto.alias,
        expiry_month: dto.expiry_month,
        expiry_year: dto.expiry_year,
        billing_address: dto.billing_address,
        billing_zip: dto.billing_zip,
      },
    });

    return updated;
  }

  // 주 결제수단으로 설정
  async setPrimary(seq: bigint, userUuid: string) {
    // 본인의 결제수단인지 확인
    await this.findOne(seq, userUuid);

    // 트랜잭션으로 처리
    await this.prisma.$transaction([
      // 기존 주 결제수단 해제
      this.prisma.payment_methods.updateMany({
        where: { user_uuid: userUuid, is_primary: true },
        data: { is_primary: false },
      }),
      // 새로운 주 결제수단 설정
      this.prisma.payment_methods.update({
        where: { seq },
        data: { is_primary: true },
      }),
    ]);

    return this.findOne(seq, userUuid);
  }

  // 결제수단 삭제
  async remove(seq: bigint, userUuid: string) {
    // 본인의 결제수단인지 확인
    const paymentMethod = await this.findOne(seq, userUuid);

    // 주 결제수단이면 경고
    if (paymentMethod.is_primary) {
      const count = await this.prisma.payment_methods.count({
        where: { user_uuid: userUuid },
      });

      if (count > 1) {
        throw new BadRequestException(
          '주 결제수단입니다. 다른 결제수단을 주 결제수단으로 설정한 후 삭제해주세요.',
        );
      }
    }

    await this.prisma.payment_methods.delete({
      where: { seq },
    });

    return { message: '결제수단이 삭제되었습니다.' };
  }

  // 통계 조회
  async getStatistics(userUuid: string) {
    const paymentMethods = await this.findAllByUser(userUuid);

    const statistics = {
      total: paymentMethods.length,
      byType: {} as Record<string, number>,
      primary: paymentMethods.find(pm => pm.is_primary) || null,
    };

    // 타입별 개수 집계
    paymentMethods.forEach(pm => {
      statistics.byType[pm.type] = (statistics.byType[pm.type] || 0) + 1;
    });

    return statistics;
  }

  /**
   * D1. 카드 추가 흐름 시작 (Popbill 연동)
   * - 현재는 Popbill 실제 호출 없이도 FE 연동이 가능하도록 스텁으로 동작합니다.
   */
  async startCardRegistration(userUuid: string) {
    return this.popbillClient.startCardRegistration({ userUuid });
  }

  /**
   * D2. 카드 상세 정보 조회
   * - 이번 달 사용 금액/횟수
   * - 한도(가능 시 Popbill) / 불가 시 추정치 구조
   */
  async getCardDetail(seq: bigint, userUuid: string) {
    const pm = await this.findOne(seq, userUuid);

    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    const [usageAgg, usageCount] = await Promise.all([
      this.prisma.payment_transactions.aggregate({
        where: {
          user_uuid: userUuid,
          status: 'COMPLETED',
          payment_method_seq: seq,
          created_at: { gte: start, lte: end },
        },
        _sum: { amount: true },
      }),
      this.prisma.payment_transactions.count({
        where: {
          user_uuid: userUuid,
          status: 'COMPLETED',
          payment_method_seq: seq,
          created_at: { gte: start, lte: end },
        },
      }),
    ]);

    const thisMonthTotalAmount = this.toNumber(usageAgg._sum.amount ?? 0);

    // 한도 대체 지표(예: 최근 6개월 평균 사용액 기반) - 확장 포인트
    // - Popbill에서 한도 조회가 불가한 경우, 사용자에게 의미 있는 대체 값을 제공할 수 있습니다.
    const sixMonthsStart = startOfMonth(subMonths(now, 5));
    const sixMonthsAgg = await this.prisma.payment_transactions.aggregate({
      where: {
        user_uuid: userUuid,
        status: 'COMPLETED',
        payment_method_seq: seq,
        created_at: { gte: sixMonthsStart, lte: end },
      },
      _avg: { amount: true },
    });
    const avgAmount = this.toNumber(sixMonthsAgg._avg.amount ?? 0);

    const limit = await this.popbillClient.getCardLimit(userUuid, seq);
    const fallbackEstimatedRemaining = avgAmount > 0 ? Math.max(0, avgAmount * 3) : undefined;

    const paymentMethodName = pm.alias ?? `${pm.provider_name}(${pm.last_4_nums})`;

    return {
      paymentMethodId: Number(pm.seq),
      paymentMethodName,
      type: pm.type,
      providerName: pm.provider_name,
      last4: pm.last_4_nums,
      thisMonthUsage: {
        totalAmount: thisMonthTotalAmount,
        totalAmountKrw: this.formatKrw(thisMonthTotalAmount),
        count: usageCount,
      },
      limit: {
        limitAmount: limit.limitAmount,
        estimatedRemainingAmount: limit.estimatedRemainingAmount ?? fallbackEstimatedRemaining,
        basisMessage:
          limit.basisMessage ||
          (fallbackEstimatedRemaining !== undefined
            ? 'Popbill 한도 조회가 불가하여 최근 6개월 평균 사용액 기반으로 잔여 한도를 추정했습니다.'
            : 'Popbill 한도 조회가 불가하여 잔여 한도를 제공하지 않습니다.'),
      },
    };
  }
}

