import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BenefitsService } from '../benefits/benefits.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly benefits: BenefitsService,
  ) {}

  private async computeBestBenefitForMethod(methodSeq: bigint, merchant: string, amount: number) {
    const method = await this.prisma.payment_methods.findUnique({ where: { seq: methodSeq } });
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
      const passFilter = !o.merchant_filter || merchant.toLowerCase().includes(o.merchant_filter.toLowerCase());
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

  async record(opts: { userUuid: string; merchant: string; amount: number; paymentMethodSeq?: string }) {
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
      const r = await this.computeBestBenefitForMethod(methodSeq, merchant, amount);
      benefitValue = r.value;
      benefitDesc = r.title;
    }

    const saved = await this.prisma.payment_transactions.create({
      data: {
        user_uuid: userUuid,
        payment_method_seq: methodSeq,
        merchant_name: merchant,
        amount,
        benefit_value: benefitValue,
        benefit_desc: benefitDesc,
        compared_at: new Date(),
      },
    });

    return saved;
  }
}
