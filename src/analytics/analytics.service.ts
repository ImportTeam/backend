import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { endOfMonth, format, startOfMonth, subMonths } from 'date-fns';
import { AnalyticsTransactionsQueryDto } from './dto/transactions-query.dto';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  private toNumber(value: unknown): number {
    if (value === null || value === undefined) return 0;
    try {
      return Number(value);
    } catch {
      return 0;
    }
  }

  private getLastSixMonthsRange(now = new Date()): { start: Date; end: Date } {
    const start = startOfMonth(subMonths(now, 5));
    const end = endOfMonth(now);
    return { start, end };
  }

  private classifyCategory(merchantName: string): string {
    // 최소 구현: 현재 DB에 category 컬럼이 없으므로 merchant 기반으로 서버에서 분류합니다.
    // 성능/정확도 확장 포인트:
    // - 거래 저장 시 category를 함께 저장
    // - 카테고리 분류 룰/모델(LLM 포함)로 고도화
    const name = (merchantName || '').toLowerCase();
    if (
      name.includes('coupang') ||
      name.includes('쿠팡') ||
      name.includes('11번가') ||
      name.includes('gmarket')
    )
      return '쇼핑';
    if (
      name.includes('스타벅스') ||
      name.includes('coffee') ||
      name.includes('카페') ||
      name.includes('맥도날드') ||
      name.includes('버거') ||
      name.includes('식당')
    )
      return '식비';
    if (
      name.includes('지하철') ||
      name.includes('버스') ||
      name.includes('택시') ||
      name.includes('kakao t') ||
      name.includes('교통')
    )
      return '교통';
    if (
      name.includes('netflix') ||
      name.includes('youtube') ||
      name.includes('spotify') ||
      name.includes('구독')
    )
      return '구독';
    if (
      name.includes('마트') ||
      name.includes('편의점') ||
      name.includes('gs') ||
      name.includes('cu') ||
      name.includes('emart')
    )
      return '생활';
    if (
      name.includes('항공') ||
      name.includes('hotel') ||
      name.includes('숙박') ||
      name.includes('여행')
    )
      return '여행';
    return '기타';
  }

  private parseDateOrThrow(
    value?: string,
    fieldName?: string,
  ): Date | undefined {
    if (!value) return undefined;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) {
      throw new BadRequestException(
        `${fieldName || '날짜'} 형식이 올바르지 않습니다.`,
      );
    }
    return d;
  }

  async getCategorySpendingLastSixMonths(userUuid: string): Promise<unknown> {
    const now = new Date();
    const range = this.getLastSixMonthsRange(now);

    const [grouped, totalAgg] = await Promise.all([
      this.prisma.payment_transactions.groupBy({
        by: ['category'] as const,
        where: {
          user_uuid: userUuid,
          status: 'COMPLETED',
          created_at: { gte: range.start, lte: range.end },
        },
        _sum: { amount: true },
      }),
      this.prisma.payment_transactions.aggregate({
        where: {
          user_uuid: userUuid,
          status: 'COMPLETED',
          created_at: { gte: range.start, lte: range.end },
        },
        _sum: { amount: true },
      }),
    ]);

    const totalValue = this.toNumber(totalAgg._sum.amount ?? 0);
    const data = grouped
      .map((row) => {
        const category = (row as unknown as { category?: string }).category;
        const label = (category ?? '기타').trim()
          ? (category ?? '기타')
          : '기타';
        const value = this.toNumber(row._sum.amount ?? 0);
        return {
          label,
          name: label,
          value,
          ratioPercent:
            totalValue > 0 ? Math.round((value / totalValue) * 10000) / 100 : 0,
        };
      })
      .sort((a, b) => b.value - a.value);

    return {
      rangeLabel: '최근 6개월',
      totalValue,
      data,
    };
  }

  async getMonthlySpendingTrendLastSixMonths(
    userUuid: string,
  ): Promise<unknown> {
    const now = new Date();

    // 성능 확장 포인트:
    // - 현재는 6회 aggregate를 실행합니다.
    // - 실무에서는 월 단위 집계 테이블/배치/캐시(Redis 등)로 최적화하는 것을 권장합니다.
    const monthRanges = Array.from({ length: 6 }, (_, idx) => 5 - idx).map(
      (i) => {
        const monthStart = startOfMonth(subMonths(now, i));
        const monthEnd = endOfMonth(subMonths(now, i));
        return { monthStart, monthEnd, label: format(monthStart, 'yyyy-MM') };
      },
    );

    const aggs = await Promise.all(
      monthRanges.map((r) =>
        this.prisma.payment_transactions.aggregate({
          where: {
            user_uuid: userUuid,
            status: 'COMPLETED',
            created_at: { gte: r.monthStart, lte: r.monthEnd },
          },
          _sum: { amount: true },
        }),
      ),
    );

    const data = aggs.map((agg, idx) => ({
      month: monthRanges[idx].label,
      totalSpent: this.toNumber(agg._sum.amount ?? 0),
      name: monthRanges[idx].label,
      spent: this.toNumber(agg._sum.amount ?? 0),
      value: this.toNumber(agg._sum.amount ?? 0),
    }));

    return { data };
  }

  async getTransactions(
    userUuid: string,
    query: AnalyticsTransactionsQueryDto,
  ): Promise<unknown> {
    const now = new Date();
    const defaultRange = this.getLastSixMonthsRange(now);

    const from =
      this.parseDateOrThrow(query.from, 'from') ?? defaultRange.start;
    const to = this.parseDateOrThrow(query.to, 'to') ?? now;

    if (from > to) {
      throw new BadRequestException('from은 to보다 이후일 수 없습니다.');
    }

    const page = query.page ?? 1;
    const size = query.size ?? 20;
    const skip = (page - 1) * size;

    const where: Prisma.payment_transactionsWhereInput = {
      user_uuid: userUuid,
      status: 'COMPLETED',
      created_at: { gte: from, lte: to },
    };

    if (query.minAmount !== undefined || query.maxAmount !== undefined) {
      where.amount = {};
      if (query.minAmount !== undefined) where.amount.gte = query.minAmount;
      if (query.maxAmount !== undefined) where.amount.lte = query.maxAmount;
    }

    if (query.paymentMethodIds && query.paymentMethodIds.length > 0) {
      where.payment_method_seq = {
        in: query.paymentMethodIds.map((id) => BigInt(id)),
      };
    }

    if (query.merchants && query.merchants.length > 0) {
      // 최소 구현: 완전 일치 기반 IN 필터
      // 확장 포인트: 부분 일치/정규화(공백/특수문자) 등을 적용
      where.merchant_name = { in: query.merchants };
    }

    const categories = query.categories?.map((c) => c.trim()).filter(Boolean);
    if (categories && categories.length > 0) {
      where.category = { in: categories };
    }

    // 카테고리 필터가 있을 경우 정확한 totalCount를 위해 전체를 조회 후 필터링해야 하지만,
    // 현재 단계에서는 "최소 구현"으로 다음 전략을 사용합니다:
    // - DB에서 1차 필터(기간/금액/결제수단/거래처) 적용
    // - 결과를 서버에서 카테고리로 추가 필터
    // - totalCount는 카테고리 필터가 있을 때는 근사치가 될 수 있음
    //   (확장 포인트: category 컬럼 추가/집계 테이블 도입으로 해결)

    const [rawItems, totalCount] = await Promise.all([
      this.prisma.payment_transactions.findMany({
        where,
        orderBy: { created_at: 'desc' },
        take: size,
        skip,
        select: {
          uuid: true,
          category: true,
          merchant_name: true,
          created_at: true,
          amount: true,
          benefit_value: true,
          payment_method_seq: true,
        },
      }),
      this.prisma.payment_transactions.count({ where }),
    ]);

    const filtered = rawItems;

    const methodSeqs = [
      ...new Set(filtered.map((i) => i.payment_method_seq).filter(Boolean)),
    ] as bigint[];
    const methods = methodSeqs.length
      ? await this.prisma.payment_methods.findMany({
          where: { seq: { in: methodSeqs } },
          select: {
            seq: true,
            provider_name: true,
            alias: true,
            last_4_nums: true,
          },
        })
      : [];

    const methodMap = new Map<bigint, string>();
    for (const m of methods) {
      methodMap.set(m.seq, m.alias ?? `${m.provider_name}(${m.last_4_nums})`);
    }

    const items = filtered.map((tx) => {
      const spendAmount = this.toNumber(tx.amount);
      const discountOrRewardAmount = this.toNumber(tx.benefit_value ?? 0);
      const paidAmount = Math.max(0, spendAmount - discountOrRewardAmount);
      const storedCategory = (tx as unknown as { category?: string }).category;
      const category = storedCategory?.trim()
        ? storedCategory
        : this.classifyCategory(tx.merchant_name);
      const pmId = tx.payment_method_seq ? Number(tx.payment_method_seq) : null;

      return {
        id: tx.uuid,
        merchantName: tx.merchant_name,
        category,
        transactionAt: tx.created_at.toISOString(),
        spendAmount,
        paidAmount,
        discountOrRewardAmount,
        paymentMethodId: pmId,
        paymentMethodName: tx.payment_method_seq
          ? methodMap.get(tx.payment_method_seq) || null
          : null,
      };
    });

    return {
      data: items,
      pagination: {
        page,
        size,
        totalCount,
        hasNext: skip + size < totalCount,
      },
    };
  }
}
