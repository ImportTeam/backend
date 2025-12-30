import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  endOfMonth,
  format,
  startOfMonth,
  subMonths,
  subYears,
} from 'date-fns';
import { AI_RECOMMENDATION_CLIENT } from '../external';
import type { AiRecommendationClient } from '../external/ai-recommendation/ai-recommendation.client';
import { RecentSiteTransactionsQueryDto } from './dto/recent-site-transactions.query.dto';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);
  constructor(
    private readonly prisma: PrismaService,
    @Inject(AI_RECOMMENDATION_CLIENT)
    private readonly aiClient: AiRecommendationClient,
  ) {}

  private toNumber(value: any) {
    if (value === null || value === undefined) return 0;
    try {
      return Number(value);
    } catch (e) {
      return 0;
    }
  }

  private formatKrw(amount: number) {
    const safe = Number.isFinite(amount) ? amount : 0;
    return `${safe.toLocaleString('ko-KR')}원`;
  }

  private getThisMonthRange(now = new Date()) {
    return {
      start: startOfMonth(now),
      end: endOfMonth(now),
    };
  }

  private getLastSixMonthsRange(now = new Date()) {
    // 최근 6개월(이번 달 포함) 기준
    // 성능 확장 포인트: 실무에서는 원본 트랜잭션을 매번 스캔하지 않도록
    // 월 단위 집계 테이블/배치/캐시(Redis 등)를 붙이는 구조로 확장합니다.
    const start = startOfMonth(subMonths(now, 5));
    const end = endOfMonth(now);
    return { start, end };
  }

  private classifyCategory(merchantName: string) {
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

  private async buildBenefitOffersSummary(
    providerNames: string[],
    topCategories: string[],
  ) {
    const uniqueProviders = Array.from(new Set(providerNames.filter(Boolean)));
    if (uniqueProviders.length === 0) return [];

    // 크롤링 테이블(benefit_offers)에서 제공자별로 최근/활성 혜택 일부만 뽑아 LLM 컨텍스트로 전달
    const offers = await this.prisma.benefit_offers.findMany({
      where: {
        active: true,
        provider_name: { in: uniqueProviders },
      },
      select: {
        provider_name: true,
        title: true,
        merchant_filter: true,
        category_filter: true,
        discount_type: true,
        discount_value: true,
        max_discount: true,
        min_spend: true,
      },
      take: 300,
      orderBy: [{ updated_at: 'desc' }, { created_at: 'desc' }],
    });

    const byProvider = new Map<string, any[]>();
    for (const o of offers) {
      const arr = byProvider.get(o.provider_name) ?? [];
      arr.push(o);
      byProvider.set(o.provider_name, arr);
    }

    const normalize = (v: any) => {
      if (v === null || v === undefined) return null;
      try {
        const n = Number(v);
        return Number.isFinite(n) ? n : null;
      } catch {
        return null;
      }
    };

    return uniqueProviders.map((providerName) => {
      const list = byProvider.get(providerName) ?? [];
      // topCategories 관련/또는 대표성 있는 항목 우선
      const scored = list
        .map((o) => {
          const cf = (o.category_filter ?? '').toString().toLowerCase();
          const score = topCategories.some((c) => cf.includes(c.toLowerCase()))
            ? 2
            : 0;
          return { o, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map(({ o }) => ({
          title: o.title,
          merchantFilter: o.merchant_filter,
          categoryFilter: o.category_filter,
          discountType: o.discount_type,
          discountValue: normalize(o.discount_value) ?? 0,
          maxDiscount: normalize(o.max_discount),
          minSpend: normalize(o.min_spend),
        }));

      return { providerName, offers: scored };
    });
  }

  async getThisMonthSums(userUuid: string) {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    const where: any = {
      created_at: { gte: start, lte: end },
      status: 'COMPLETED',
    };
    where.user_uuid = userUuid;

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

  async getLastYearSameMonthSums(userUuid: string) {
    const now = new Date();
    const lastYear = subYears(now, 1);
    const start = startOfMonth(lastYear);
    const end = endOfMonth(lastYear);

    const where: any = {
      created_at: { gte: start, lte: end },
      status: 'COMPLETED',
    };
    where.user_uuid = userUuid;

    const agg = await this.prisma.payment_transactions.aggregate({
      where,
      _sum: { amount: true, benefit_value: true },
    });

    return {
      totalAmount: this.toNumber(agg._sum.amount ?? 0),
      totalBenefit: this.toNumber(agg._sum.benefit_value ?? 0),
    };
  }

  async getSavingsThisMonth(userUuid: string) {
    const [{ totalAmount, totalBenefit }, lastYear] = await Promise.all([
      this.getThisMonthSums(userUuid),
      this.getLastYearSameMonthSums(userUuid),
    ]);

    // 절약 금액은 이번 달에 실제로 적용된 benefit의 합으로 간주
    const savingsAmount = totalBenefit;
    const lastYearSameMonthSavingsAmount = lastYear.totalBenefit;

    const savingsDeltaAmount = savingsAmount - lastYearSameMonthSavingsAmount;
    const savingsDeltaDirection =
      savingsDeltaAmount > 0
        ? '증가'
        : savingsDeltaAmount < 0
          ? '감소'
          : '동일';
    const compareMessage =
      savingsDeltaDirection === '동일'
        ? '작년 같은 달과 절약 금액이 같아요.'
        : `작년 같은 달보다 ${this.formatKrw(Math.abs(savingsDeltaAmount))} ${savingsDeltaDirection === '증가' ? '더 절약' : '덜 절약'}했어요.`;

    let savingsRatePercent: number | null = null;
    if (lastYear.totalAmount && lastYear.totalAmount > 0) {
      // 작년 동월 대비 절약률 = (lastYear - (thisMonthActual)) / lastYear * 100
      const thisMonthActual = Math.max(0, totalAmount - totalBenefit);
      savingsRatePercent =
        ((lastYear.totalAmount - thisMonthActual) / lastYear.totalAmount) * 100;
      savingsRatePercent = Math.round(savingsRatePercent * 100) / 100; // 소수점 2자리
    }

    return {
      savingsAmount,
      savingsAmountKrw: this.formatKrw(savingsAmount),
      lastYearSameMonthSavingsAmount,
      savingsDeltaAmount,
      savingsDeltaDirection,
      compareMessage,
      savingsRatePercent,
    };
  }

  async getTopMerchant(userUuid: string) {
    const now = new Date();
    const month = this.getThisMonthRange(now);
    const sixMonths = this.getLastSixMonthsRange(now);

    const run = async (start: Date, end: Date) => {
      const where: any = {
        user_uuid: userUuid,
        created_at: { gte: start, lte: end },
        status: 'COMPLETED',
      };

      return this.prisma.payment_transactions.groupBy({
        by: ['merchant_name'],
        where,
        _sum: { amount: true },
        orderBy: { _sum: { amount: 'desc' } },
        take: 1,
      });
    };

    let grouped = await run(month.start, month.end);
    let range: 'THIS_MONTH' | 'LAST_6_MONTHS' = 'THIS_MONTH';
    if (!grouped || grouped.length === 0) {
      grouped = await run(sixMonths.start, sixMonths.end);
      range = 'LAST_6_MONTHS';
    }
    if (!grouped || grouped.length === 0) return null;

    const g = grouped[0];
    const totalSpent = this.toNumber(g._sum.amount ?? 0);
    return {
      range,
      merchantName: g.merchant_name,
      totalSpent,
      totalSpentKrw: this.formatKrw(totalSpent),
    };
  }

  async getTopPaymentMethod(userUuid: string) {
    const now = new Date();
    const month = this.getThisMonthRange(now);
    const sixMonths = this.getLastSixMonthsRange(now);

    const run = async (start: Date, end: Date) => {
      const where: any = {
        user_uuid: userUuid,
        created_at: { gte: start, lte: end },
        status: 'COMPLETED',
        payment_method_seq: { not: null },
      };

      return this.prisma.payment_transactions.groupBy({
        by: ['payment_method_seq'],
        where,
        _sum: { amount: true },
        _count: { _all: true },
        orderBy: { _sum: { amount: 'desc' } },
        take: 1,
      });
    };

    let grouped = await run(month.start, month.end);
    if (!grouped || grouped.length === 0) {
      // 이번 달 데이터가 없으면 최근 6개월 기준으로 보정
      grouped = await run(sixMonths.start, sixMonths.end);
    }
    if (!grouped || grouped.length === 0) return null;

    const g = grouped[0];
    const seq = g.payment_method_seq;
    if (!seq) return null;

    const method = await this.prisma.payment_methods.findUnique({
      where: { seq },
      select: { provider_name: true, alias: true, last_4_nums: true },
    });
    const name = method
      ? (method.alias ?? `${method.provider_name}(${method.last_4_nums})`)
      : 'Unknown';

    // “이번 달 사용 금액”은 요구사항대로 별도 계산
    const monthAgg = await this.prisma.payment_transactions.aggregate({
      where: {
        user_uuid: userUuid,
        payment_method_seq: seq,
        created_at: { gte: month.start, lte: month.end },
        status: 'COMPLETED',
      },
      _sum: { amount: true },
    });
    const thisMonthTotalAmount = this.toNumber(monthAgg._sum.amount ?? 0);

    return {
      paymentMethodId: Number(seq),
      paymentMethodName: name,
      thisMonthTotalAmount,
      thisMonthTotalAmountKrw: this.formatKrw(thisMonthTotalAmount),
      basis: 'AMOUNT',
    };
  }

  private computeSavingsMetric(totalSpent: number, totalBenefit: number) {
    // 현재 단계의 최소 구현: 절약 금액 = benefit 합
    // 확장 포인트: 이후 AI 분석/카테고리별 절약/정책 적용 등을 포함할 수 있도록 함수로 분리
    const savingsAmount = Math.max(0, totalBenefit);
    return { savingsAmount };
  }

  async getMonthlySavingsTrend(userUuid: string) {
    const now = new Date();

    // 성능 확장 포인트:
    // - 지금은 6회 aggregate 쿼리를 실행합니다.
    // - 실무에서는 월 단위 집계 테이블/배치를 통해 O(1) 조회로 최적화하는 것을 권장합니다.
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
          _sum: { amount: true, benefit_value: true },
        }),
      ),
    );

    const items = aggs.map((agg, idx) => {
      const totalSpent = this.toNumber(agg._sum.amount ?? 0);
      const totalBenefit = this.toNumber(agg._sum.benefit_value ?? 0);
      const { savingsAmount } = this.computeSavingsMetric(
        totalSpent,
        totalBenefit,
      );
      const month = monthRanges[idx].label;
      return {
        month,
        // chart-friendly aliases (Recharts 등)
        name: month,
        totalSpent,
        spent: totalSpent,
        totalBenefit,
        benefit: totalBenefit,
        savingsAmount,
        saved: savingsAmount,
        value: savingsAmount,
      };
    });

    let ai = { summary: '', highlights: [] as string[] };
    try {
      ai = await this.aiClient.getMonthlySavingsNarrative({
        months: items.map((m) => ({
          month: m.month,
          totalSpent: m.totalSpent,
          totalBenefit: m.totalBenefit,
          savingsAmount: m.savingsAmount,
        })),
      });
    } catch (err: any) {
      this.logger.warn(
        `AI monthly savings narrative unavailable: ${err?.message ?? err}`,
      );
    }

    return { data: items, ai };
  }

  private async getRecentSixMonthsSummary(userUuid: string) {
    const now = new Date();
    const range = this.getLastSixMonthsRange(now);

    const transactions = await this.prisma.payment_transactions.findMany({
      where: {
        user_uuid: userUuid,
        status: 'COMPLETED',
        created_at: { gte: range.start, lte: range.end },
      },
      select: {
        merchant_name: true,
        amount: true,
        benefit_value: true,
      },
      take: 5000,
      orderBy: { created_at: 'desc' },
    });

    const byCategory = new Map<string, number>();
    let totalSpent = 0;
    let totalBenefit = 0;

    for (const tx of transactions) {
      const spent = this.toNumber(tx.amount);
      const benefit = this.toNumber(tx.benefit_value ?? 0);
      totalSpent += spent;
      totalBenefit += benefit;
      const category = this.classifyCategory(tx.merchant_name);
      byCategory.set(category, (byCategory.get(category) || 0) + spent);
    }

    const byCategoryArr = [...byCategory.entries()]
      .map(([category, spent]) => ({ category, spent }))
      .sort((a, b) => b.spent - a.spent);

    return {
      totalSpent,
      totalBenefit,
      byCategory: byCategoryArr,
    };
  }

  async getAiBenefitSummary(userUuid: string) {
    const summary = await this.getRecentSixMonthsSummary(userUuid);
    const paymentMethods = await this.prisma.payment_methods.findMany({
      where: { user_uuid: userUuid },
      select: { seq: true, provider_name: true, alias: true },
      orderBy: [{ is_primary: 'desc' }, { created_at: 'desc' }],
    });

    const [monthlySavingsTrend, topMerchant, topPaymentMethod] =
      await Promise.all([
        this.getMonthlySavingsTrend(userUuid).then((r: any) => r?.data ?? []),
        this.getTopMerchant(userUuid),
        this.getTopPaymentMethod(userUuid),
      ]);

    const topCategories = summary.byCategory.slice(0, 3).map((c) => c.category);
    const benefitOffersSummary = await this.buildBenefitOffersSummary(
      paymentMethods.map((pm) => pm.provider_name),
      topCategories,
    );

    try {
      const res = await this.aiClient.getBenefitRecommendationSummary({
        userUuid,
        dashboardContext: {
          monthlySavingsTrend: (monthlySavingsTrend || []).map((m: any) => ({
            month: m.month,
            totalSpent: m.totalSpent,
            totalBenefit: m.totalBenefit,
            savingsAmount: m.savingsAmount,
          })),
          topMerchant: topMerchant
            ? {
                merchantName: topMerchant.merchantName,
                totalSpent: topMerchant.totalSpent,
              }
            : null,
          topPaymentMethod: topPaymentMethod
            ? {
                paymentMethodName: topPaymentMethod.paymentMethodName,
                thisMonthTotalAmount: topPaymentMethod.thisMonthTotalAmount,
              }
            : null,
        },
        recentSixMonthsSummary: {
          totalSpent: summary.totalSpent,
          totalBenefit: summary.totalBenefit,
          byCategory: summary.byCategory,
        },
        paymentMethods: paymentMethods.map((pm) => ({
          seq: pm.seq,
          providerName: pm.provider_name,
          alias: pm.alias,
        })),
        benefitOffersSummary,
      });

      return res;
    } catch (err: any) {
      this.logger.warn(
        `AI benefit summary unavailable: ${err?.message ?? err}`,
      );
      return {
        recommendation: '',
        reasonSummary: '',
      };
    }
  }

  async getRecommendedPaymentMethodsTop3(userUuid: string) {
    const summary = await this.getRecentSixMonthsSummary(userUuid);

    const paymentMethods = await this.prisma.payment_methods.findMany({
      where: { user_uuid: userUuid },
      select: {
        seq: true,
        provider_name: true,
        alias: true,
        last_4_nums: true,
      },
      orderBy: [{ is_primary: 'desc' }, { created_at: 'desc' }],
    });

    const activeOffers = await this.prisma.benefit_offers.findMany({
      where: { active: true },
      select: { provider_name: true },
      take: 2000,
    });
    const offerCountByProvider = new Map<string, number>();
    for (const o of activeOffers) {
      offerCountByProvider.set(
        o.provider_name,
        (offerCountByProvider.get(o.provider_name) || 0) + 1,
      );
    }

    let aiTop3 = {
      items: [] as Array<{
        paymentMethodSeq: bigint;
        score: number;
        reasonSummary: string;
      }>,
    };
    try {
      aiTop3 = await this.aiClient.getRecommendedPaymentMethodsTop3({
        userUuid,
        recentSixMonthsSummary: {
          topMerchants: [],
          byCategory: summary.byCategory,
        },
        paymentMethods: paymentMethods.map((pm) => ({
          seq: pm.seq,
          providerName: pm.provider_name,
          alias: pm.alias,
        })),
        benefitOffersSummary: await this.buildBenefitOffersSummary(
          paymentMethods.map((pm) => pm.provider_name),
          summary.byCategory.slice(0, 3).map((c) => c.category),
        ),
      });
    } catch (err: any) {
      this.logger.warn(
        `AI payment method top3 unavailable: ${err?.message ?? err}`,
      );
    }

    const methodNameBySeq = new Map<string, string>();
    for (const pm of paymentMethods) {
      methodNameBySeq.set(
        pm.seq.toString(),
        pm.alias ?? `${pm.provider_name}(${pm.last_4_nums})`,
      );
    }

    const mapped = aiTop3.items
      .map((item) => {
        const seqKey = item.paymentMethodSeq.toString();
        const name = methodNameBySeq.get(seqKey);
        if (!name) return null;
        const score = Math.max(0, Math.min(100, Math.round(item.score)));
        return {
          paymentMethodId: Number(item.paymentMethodSeq),
          paymentMethodName: name,
          name,
          score,
          value: score,
          reasonSummary: item.reasonSummary,
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 3);

    return { data: mapped };
  }

  async getRecentTransactionsBySite(
    userUuid: string,
    query: RecentSiteTransactionsQueryDto,
  ) {
    const page = query.page ?? 1;
    const size = query.size ?? 10;
    const skip = (page - 1) * size;

    const [items, totalCount] = await Promise.all([
      this.prisma.payment_transactions.findMany({
        where: {
          user_uuid: userUuid,
          status: 'COMPLETED',
        },
        orderBy: { created_at: 'desc' },
        take: size,
        skip,
        select: {
          merchant_name: true,
          created_at: true,
          amount: true,
          benefit_value: true,
          payment_method_seq: true,
        },
      }),
      this.prisma.payment_transactions.count({
        where: { user_uuid: userUuid, status: 'COMPLETED' },
      }),
    ]);

    const methodSeqs = [
      ...new Set(items.map((i) => i.payment_method_seq).filter(Boolean)),
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

    const mapped = items.map((tx) => {
      const pmName = tx.payment_method_seq
        ? methodMap.get(tx.payment_method_seq)
        : undefined;
      return {
        merchantName: tx.merchant_name,
        paidAt: tx.created_at.toISOString(),
        paymentMethodName: pmName || '미지정',
        paidAmount: this.toNumber(tx.amount),
        discountOrRewardAmount: this.toNumber(tx.benefit_value ?? 0),
      };
    });

    return {
      data: mapped,
      pagination: {
        page,
        size,
        totalCount,
        hasNext: skip + size < totalCount,
      },
    };
  }
}
