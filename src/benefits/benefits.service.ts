import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { calcDiscount, isActiveNow, matchMerchant } from './benefit-calculator.util';
import { extractOffersFromHtml, ExtractedOffer } from './html-extract.util';

@Injectable()
export class BenefitsService {
  constructor(private readonly prisma: PrismaService) {}

  async compareForUser(userUuid: string, merchant: string, amount: number) {
    const [methods, offers] = await Promise.all([
      this.prisma.payment_methods.findMany({ where: { user_uuid: userUuid } }),
      this.prisma.benefit_offers.findMany({ where: { active: true } }),
    ]);

    const results = methods.map((m) => {
      // 해당 결제수단에 맞는 혜택을 필터링
      const candidateOffers = offers.filter(
        (o) =>
          o.provider_name.toLowerCase() === m.provider_name.toLowerCase() &&
          isActiveNow(o.start_date, o.end_date) &&
          matchMerchant(merchant, o.merchant_filter) &&
          (!o.min_spend || Number(o.min_spend) <= amount),
      );

      // 가장 큰 절약액 찾기
      let bestSaved = 0;
      let bestOffer: typeof offers[number] | undefined;

      for (const o of candidateOffers) {
        const saved = calcDiscount(
          amount,
          o.discount_type,
          Number(o.discount_value),
          o.max_discount ? Number(o.max_discount) : undefined,
        );
        if (saved > bestSaved) {
          bestSaved = saved;
          bestOffer = o;
        }
      }

      return {
        provider_name: m.provider_name,
        method_seq: m.seq,
        alias: m.alias,
        last4: m.last_4_nums,
        saved: bestSaved,
        offerId: bestOffer?.id,
        title: bestOffer?.title ?? undefined,
      };
    });

    return results.sort((a, b) => b.saved - a.saved);
  }

  async top3ForUser(userUuid: string, merchant: string, amount: number) {
    const compared = await this.compareForUser(userUuid, merchant, amount);
    return compared.slice(0, 3);
  }

  // HTML 또는 텍스트에서 혜택을 추출해 반환
  extractFromHtml(htmlOrText: string) {
    return extractOffersFromHtml(htmlOrText);
  }

  // 추가로 받은 오퍼(확장 추출 결과)를 고려해 비교
  async top3WithExtraOffers(userUuid: string, merchant: string, amount: number, extra: ExtractedOffer[]) {
    // DB 오퍼는 compareForUser 로 계산된 각 결제수단별 bestSaved 기준
    const baseline = await this.compareForUser(userUuid, merchant, amount);

    // extra offers를 각 결제수단에 적용하여 더 큰 절약이 나오면 교체
    const enhanced = baseline.map((b) => {
      const matches = extra.filter((e) => e.provider_name.toLowerCase() === b.provider_name.toLowerCase());
      let extraSaved = 0;
      for (const e of matches) {
  const saved = calcDiscount(amount, e.discount_type, e.discount_value);
        if (saved > extraSaved) extraSaved = saved;
      }
      if (extraSaved > b.saved) {
        return { ...b, saved: extraSaved, title: matches[0]?.title ?? b.title } as any;
      }
      return b;
    });

  const sorted = [...enhanced].sort((a, b) => b.saved - a.saved);
  return sorted.slice(0, 3);
  }
}
