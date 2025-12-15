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
    paymentMethodSeq: bigint;
    score: number;
    reasonSummary: string;
  }>;
}

export interface AiRecommendationClient {
  getBenefitRecommendationSummary(
    req: AiBenefitRecommendationSummaryRequest,
  ): Promise<AiBenefitRecommendationSummaryResponse>;

  getRecommendedPaymentMethodsTop3(
    req: AiPaymentMethodTop3Request,
  ): Promise<AiPaymentMethodTop3Response>;
}
