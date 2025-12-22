export interface AiBenefitRecommendationSummaryRequest {
  userUuid: string;
  recentSixMonthsSummary: {
    totalSpent: number;
    totalBenefit: number;
    byCategory: Array<{ category: string; spent: number }>;
  };
  paymentMethods: Array<{ seq: bigint; providerName: string; alias?: string | null }>;
}

export interface AiBenefitRecommendationSummaryResponse {
  recommendation: string;
  reasonSummary: string;

  // Gemini 연동 시: 추천 카드/페이 리스트
  items?: Array<{
    providerName: string;
    why: string;
  }>;
}

export interface AiMonthlySavingsTrendRequest {
  userUuid: string;
  monthly: Array<{
    month: string; // YYYY-MM
    totalSpent: number;
    totalBenefit: number;
    savingsAmount: number;
  }>;
  byCategory: Array<{ category: string; spent: number }>;
}

export interface AiMonthlySavingsTrendResponse {
  summary: string;
  insights: string[];
  months: Array<{
    month: string;
    status: 'GOOD' | 'OK' | 'BAD';
    comment: string;
  }>;
}

export interface AiPaymentMethodTop3Request {
  userUuid: string;
  recentSixMonthsSummary: {
    topMerchants: Array<{ merchantName: string; spent: number }>;
    byCategory: Array<{ category: string; spent: number }>;
  };
  paymentMethods: Array<{ seq: bigint; providerName: string; alias?: string | null }>;
}

export interface AiPaymentMethodTop3Response {
  items: Array<{
    // JSON 전송 호환성을 위해 string으로 반환하도록 확장
    paymentMethodSeq: bigint | string;
    score: number;
    reasonSummary: string;

    // Gemini 연동 시: 할인 방식/혜택 간단 설명
    discountSummary?: string;
  }>;
}

export interface AiRecommendationClient {
  getBenefitRecommendationSummary(
    req: AiBenefitRecommendationSummaryRequest,
  ): Promise<AiBenefitRecommendationSummaryResponse>;

  getMonthlySavingsTrendInsight(
    req: AiMonthlySavingsTrendRequest,
  ): Promise<AiMonthlySavingsTrendResponse>;

  getRecommendedPaymentMethodsTop3(
    req: AiPaymentMethodTop3Request,
  ): Promise<AiPaymentMethodTop3Response>;
}
