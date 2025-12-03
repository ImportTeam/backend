import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { subYears, startOfMonth, endOfMonth } from 'date-fns';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);
  constructor(private readonly prisma: PrismaService) {}

  private toNumber(value: any) {
    if (value === null || value === undefined) return 0;
    try {
      return Number(value);
    } catch (e) {
      return 0;
    }
  }

  async getThisMonthSums(userUuid?: string) {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    const where: any = {
      created_at: { gte: start, lte: end },
      status: 'COMPLETED',
    };
    if (userUuid) where.user_uuid = userUuid;

    const agg = await this.prisma.payment_transactions.aggregate({
      where,
      _sum: {
        amount: true,
        benefit_value: true,
      },
    });

    return {
      totalAmount: this.toNumber(agg._sum.amount ?? 0),
      totalBenefit: this.toNumber(agg._sum.benefit_value ?? 0),
    };
  }

  async getLastYearSameMonthSum(userUuid?: string) {
    const now = new Date();
    const lastYear = subYears(now, 1);
    const start = startOfMonth(lastYear);
    const end = endOfMonth(lastYear);

    const where: any = {
      created_at: { gte: start, lte: end },
      status: 'COMPLETED',
    };
    if (userUuid) where.user_uuid = userUuid;

    const agg = await this.prisma.payment_transactions.aggregate({
      where,
      _sum: { amount: true },
    });

    return this.toNumber(agg._sum.amount ?? 0);
  }

  async getSavingsThisMonth(userUuid?: string) {
    const { totalAmount, totalBenefit } = await this.getThisMonthSums(userUuid);
    const lastYearAmount = await this.getLastYearSameMonthSum(userUuid);

    // 절약 금액은 이번 달에 실제로 적용된 benefit의 합으로 간주
    const savingsAmount = totalBenefit;

    let savingsRatePercent: number | null = null;
    if (lastYearAmount && lastYearAmount > 0) {
      // 작년 동월 대비 절약률 = (lastYear - (thisMonthActual)) / lastYear * 100
      const thisMonthActual = Math.max(0, totalAmount - totalBenefit);
      savingsRatePercent = ((lastYearAmount - thisMonthActual) / lastYearAmount) * 100;
      savingsRatePercent = Math.round(savingsRatePercent * 100) / 100; // 소수점 2자리
    }

    return { savingsAmount, savingsRatePercent };
  }

  async getTopMerchantThisMonth(userUuid?: string) {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    const where: any = { created_at: { gte: start, lte: end }, status: 'COMPLETED' };
    if (userUuid) where.user_uuid = userUuid;

    const grouped = await this.prisma.payment_transactions.groupBy({
      by: ['merchant_name'],
      where,
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: 1,
    });

    if (!grouped || grouped.length === 0) return null;
    const g = grouped[0];
    return { merchantName: g.merchant_name, totalSpent: this.toNumber(g._sum.amount ?? 0) };
  }

  async getTopPaymentMethodThisMonth(userUuid?: string) {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    const where: any = { created_at: { gte: start, lte: end }, status: 'COMPLETED' };
    if (userUuid) where.user_uuid = userUuid;

    const grouped = await this.prisma.payment_transactions.groupBy({
      by: ['payment_method_seq'],
      where,
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: 1,
    });

    if (!grouped || grouped.length === 0) return null;
    const g = grouped[0];
    const seq = g.payment_method_seq;
    if (!seq) return null;

    const method = await this.prisma.payment_methods.findUnique({ where: { seq: seq } });
    let name = 'Unknown';
    if (method) {
      name = method.alias ?? `${method.provider_name}(${method.last_4_nums})`;
    }

    return { paymentMethodName: name, totalAmount: this.toNumber(g._sum.amount ?? 0) };
  }
}
