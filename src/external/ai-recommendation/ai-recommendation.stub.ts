import {
  AiBenefitRecommendationSummaryRequest,
  AiBenefitRecommendationSummaryResponse,
  AiMonthlySavingsTrendRequest,
  AiMonthlySavingsTrendResponse,
  AiPaymentMethodTop3Request,
  AiPaymentMethodTop3Response,
  AiRecommendationClient,
} from './ai-recommendation.client';

export class AiRecommendationClientStub implements AiRecommendationClient {
  async getMonthlySavingsTrendInsight(
    req: AiMonthlySavingsTrendRequest,
  ): Promise<AiMonthlySavingsTrendResponse> {
    const months = req.monthly.map((m) => {
      const status: 'GOOD' | 'OK' | 'BAD' = m.savingsAmount > 0 ? 'OK' : 'BAD';
      return {
        month: m.month,
        status,
        comment: m.savingsAmount > 0 ? '혜택이 꾸준히 적용됐어요' : '혜택 적용이 적어요',
      };
    });
    return {
      summary: '최근 6개월 절약 추이 요약(더미).',
      insights: ['소비 패턴을 기반으로 절약을 계산합니다(더미).'],
      months,
    };
  }

  async getBenefitRecommendationSummary(
    req: AiBenefitRecommendationSummaryRequest,
  ): Promise<AiBenefitRecommendationSummaryResponse> {
    const topCategory = req.recentSixMonthsSummary.byCategory.sort((a, b) => b.spent - a.spent)[0]?.category;

    return {
      recommendation: '이번 달에는 생활/쇼핑 영역의 혜택이 큰 카드/페이를 우선 사용해보세요.',
      reasonSummary: topCategory
        ? `최근 6개월 기준 '${topCategory}' 지출 비중이 높아 해당 영역 혜택 중심으로 추천합니다. (LLM 더미 응답)`
        : '최근 6개월 요약 데이터가 충분하지 않아 일반 추천을 제공합니다. (LLM 더미 응답)',
      items: [
        { providerName: 'SAMPLE_CARD', why: '소비 비중이 높은 영역 혜택이 많아요(더미).' },
      ],
    };
  }

  async getRecommendedPaymentMethodsTop3(req: AiPaymentMethodTop3Request): Promise<AiPaymentMethodTop3Response> {
    // 실제 연동 시에는 LLM이 사용자의 소비 패턴/혜택 DB를 종합해 Top3를 반환하도록 교체합니다.
    const base = req.paymentMethods.slice(0, 3);
    return {
      items: base.map((pm, idx) => ({
        paymentMethodSeq: pm.seq,
        score: 100 - idx * 10,
        reasonSummary: `사용자의 소비 패턴을 고려한 추천(더미). 우선순위 ${idx + 1}번입니다.`,
        discountSummary: '할인/적립 방식 요약(더미).',
      })),
    };
  }
}
