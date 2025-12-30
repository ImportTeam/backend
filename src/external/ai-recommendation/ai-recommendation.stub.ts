import {
  AiBenefitRecommendationSummaryRequest,
  AiBenefitRecommendationSummaryResponse,
  AiPaymentMethodTop3Request,
  AiPaymentMethodTop3Response,
  AiRecommendationClient,
  AiMonthlySavingsNarrativeRequest,
  AiMonthlySavingsNarrativeResponse,
} from './ai-recommendation.client';

import { createHash } from 'crypto';

function stringifyForPrompt(value: unknown): string {
  return JSON.stringify(value, (_key, v) =>
    typeof v === 'bigint' ? v.toString() : v,
  );
}

export class AiRecommendationClientStub implements AiRecommendationClient {
  async getMonthlySavingsNarrative(
    _req: AiMonthlySavingsNarrativeRequest,
  ): Promise<AiMonthlySavingsNarrativeResponse> {
    const months = _req.months ?? [];
    if (!months.length) {
      return {
        summary: '최근 6개월 데이터가 부족해 추이를 분석할 수 없습니다.',
        highlights: [],
      };
    }

    // 간단한 통계 기반 요약 생성
    const totalSaved = months.reduce((s, m) => s + (m.savingsAmount || 0), 0);
    const avgSaved = Math.round(totalSaved / months.length);
    const last = months[months.length - 1];

    const templates = [
      (t: any) => `최근 ${months.length}개월 동안 총 절약액은 약 ${totalSaved.toLocaleString('ko-KR')}원입니다. 최근 달(${last.month})에는 ${last.savingsAmount.toLocaleString('ko-KR')}원을 절약하셨습니다. 평균 월별 절약액은 약 ${avgSaved.toLocaleString('ko-KR')}원입니다.`,
      (t: any) => `요약: 총 ${totalSaved.toLocaleString('ko-KR')}원 절약, 최근 달(${last.month}) 절약 ${last.savingsAmount.toLocaleString('ko-KR')}원. 한 달 평균은 ${avgSaved.toLocaleString('ko-KR')}원 수준입니다.`,
      (t: any) => `최근 ${months.length}개월의 절감 효과를 보면 총 ${totalSaved.toLocaleString('ko-KR')}원을 절약했고, 직전 달인 ${last.month}에는 ${last.savingsAmount.toLocaleString('ko-KR')}원이 절약되었습니다. 월평균 ${avgSaved.toLocaleString('ko-KR')}원입니다.`,
    ];

    const idx = Math.abs(
      createHash('sha256').update(stringifyForPrompt(months)).digest()[0],
    ) % templates.length;
    const summary = templates[idx](months);
    const highlights = [
      `최근 달(${last.month}) 절약액: ${last.savingsAmount.toLocaleString('ko-KR')}원`,
      `평균 월별 절약액: ${avgSaved.toLocaleString('ko-KR')}원`,
      `총 절약액(기간 합계): ${totalSaved.toLocaleString('ko-KR')}원`,
    ];

    return { summary, highlights };
  }

  async getBenefitRecommendationSummary(
    req: AiBenefitRecommendationSummaryRequest,
  ): Promise<AiBenefitRecommendationSummaryResponse> {
    const topCategory = req.recentSixMonthsSummary.byCategory
      .slice()
      .sort((a, b) => b.spent - a.spent)[0]?.category;

    const topPayment = req.dashboardContext?.topPaymentMethod?.paymentMethodName;

    const recommendation = topPayment
      ? `${topPayment}을 주로 사용하시고 있습니다. 해당 결제수단의 혜택을 우선적으로 확인해 사용하세요.`
      : topCategory
      ? `${topCategory} 지출이 많으므로 해당 카테고리에서 혜택이 좋은 결제수단을 우선 사용하세요.`
      : '사용자의 최근 소비 패턴을 바탕으로 혜택이 좋은 카드를 우선 사용하시길 권합니다.';

    const reasonSummary = topCategory
      ? `최근 6개월간 '${topCategory}' 카테고리의 지출이 상대적으로 높아 해당 카테고리의 혜택을 우선 적용하면 절약에 도움이 됩니다.`
      : '최근 소비 데이터가 제한적이어서 일반적인 혜택 우선 사용을 권장합니다.';

    return { recommendation, reasonSummary };
  }

  async getRecommendedPaymentMethodsTop3(
    req: AiPaymentMethodTop3Request,
  ): Promise<AiPaymentMethodTop3Response> {
    // 간단한 휴리스틱: 보유한 결제수단 중 최근 카테고리와 혜택이 많은 제공사를 우선
    const methods = req.paymentMethods ?? [];
    const offersByProvider = new Map<string, any[]>();
    (req.benefitOffersSummary ?? []).forEach((b) => {
      offersByProvider.set(b.providerName, b.offers || []);
    });

    const topCategories = (req.recentSixMonthsSummary?.byCategory ?? []).slice(0, 3).map((c) => c.category.toLowerCase());

    const scored = methods.map((pm) => {
      const offers = offersByProvider.get(pm.providerName) ?? [];
      let baseScore = 50 + offers.length * 8;
      // 혜택에 topCategories 관련 필터가 있으면 추가 가중치
      for (const o of offers) {
        const cf = (o.categoryFilter ?? '').toString().toLowerCase();
        if (topCategories.some((tc) => tc && cf.includes(tc))) baseScore += 6;
      }
      // cap
      baseScore = Math.min(100, Math.round(baseScore));
      return { pm, score: baseScore };
    });

    scored.sort((a, b) => b.score - a.score);

    return {
      items: scored.slice(0, 3).map((s) => ({
        paymentMethodSeq: s.pm.seq,
        score: s.score,
        reasonSummary: `최근 소비 패턴과 보유 혜택(${(offersByProvider.get(s.pm.providerName) ?? []).length}건)을 고려한 추천입니다.`,
      })),
    };
  }
}
