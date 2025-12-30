import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { BenefitsService } from '../benefits/benefits.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly benefits: BenefitsService,
  ) {}

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

  private async computeBestBenefitForMethod(
    methodSeq: bigint,
    merchant: string,
    amount: number,
  ) {
    const method = await this.prisma.payment_methods.findUnique({
      where: { seq: methodSeq },
    });
    if (!method) return { value: 0, title: undefined as string | undefined };

    const offers = await this.prisma.benefit_offers.findMany({
      where: {
        active: true,
        provider_name: method.provider_name,
      },
    });

    let best = 0;
    let title: string | undefined;
    for (const o of offers) {
      const passFilter =
        !o.merchant_filter ||
        merchant.toLowerCase().includes(o.merchant_filter.toLowerCase());
      if (!passFilter) continue;
      const minOk = !o.min_spend || Number(o.min_spend) <= amount;
      if (!minOk) continue;

      let cap = Number.MAX_SAFE_INTEGER;
      if (o.max_discount) cap = Number(o.max_discount);

      let val = 0;
      if (o.discount_type === 'PERCENT') {
        val = (amount * Number(o.discount_value)) / 100;
      } else {
        val = Number(o.discount_value);
      }
      val = Math.min(val, cap);

      if (val > best) {
        best = Math.floor(val);
        title = o.title ?? undefined;
      }
    }
    return { value: best, title };
  }

  async record(opts: {
    userUuid: string;
    merchant: string;
    amount: number;
    paymentMethodSeq?: string;
  }) {
    const { userUuid, merchant, amount } = opts;

    let methodSeq: bigint | undefined;
    if (opts.paymentMethodSeq) {
      methodSeq = BigInt(opts.paymentMethodSeq);
    } else {
      // 자동 추천 1위를 선택
      const top = await this.benefits.top3ForUser(userUuid, merchant, amount);
      methodSeq = top[0]?.method_seq;
    }

    // 해당 수단으로 저장되는 혜택 계산
    let benefitValue = 0;
    let benefitDesc: string | undefined;
    if (methodSeq) {
      const r = await this.computeBestBenefitForMethod(
        methodSeq,
        merchant,
        amount,
      );
      benefitValue = r.value;
      benefitDesc = r.title;
    }

    const saved = await this.prisma.payment_transactions.create({
      data: {
        uuid: uuidv4(),
        user_uuid: userUuid,
        payment_method_seq: methodSeq,
        merchant_name: merchant,
        category: this.classifyCategory(merchant),
        amount,
        benefit_value: benefitValue,
        benefit_desc: benefitDesc,
        compared_at: new Date(),
      },
    });

    return saved;
  }
}
