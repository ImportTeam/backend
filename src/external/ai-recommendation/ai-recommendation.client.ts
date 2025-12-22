export interface AiBenefitRecommendationSummaryRequest {
  userUuid: string;
  dashboardContext?: {
    monthlySavingsTrend?: Array<{
      month: string;
      totalSpent: number;
      totalBenefit: number;
      savingsAmount: number;
    }>;
    topMerchant?: { merchantName: string; totalSpent: number } | null;
    topPaymentMethod?: { paymentMethodName: string; thisMonthTotalAmount: number } | null;
  };
  recentSixMonthsSummary: {
    totalSpent: number;
    totalBenefit: number;
    byCategory: Array<{ category: string; spent: number }>;
  };
  paymentMethods: Array<{ seq: bigint; providerName: string; alias?: string | null }>;
  benefitOffersSummary?: Array<{
    providerName: string;
    offers: Array<{
      title: string;
      merchantFilter?: string | null;
      categoryFilter?: string | null;
      discountType: string;
      discountValue: number;
      maxDiscount?: number | null;
      minSpend?: number | null;
    }>;
  }>;
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
  benefitOffersSummary?: Array<{
    providerName: string;
    offers: Array<{
      title: string;
      merchantFilter?: string | null;
      categoryFilter?: string | null;
      discountType: string;
      discountValue: number;
      maxDiscount?: number | null;
      minSpend?: number | null;
    }>;
  }>;
}

export interface AiPaymentMethodTop3Response {
  items: Array<{
    paymentMethodSeq: bigint;
    score: number;
    reasonSummary: string;
  }>;
}

export interface AiMonthlySavingsNarrativeRequest {
  months: Array<{
    month: string;
    totalSpent: number;
    totalBenefit: number;
    savingsAmount: number;
  }>;
}

export interface AiMonthlySavingsNarrativeResponse {
  summary: string;
  highlights: string[];
}

export interface AiRecommendationClient {
  getBenefitRecommendationSummary(
    req: AiBenefitRecommendationSummaryRequest,
  ): Promise<AiBenefitRecommendationSummaryResponse>;

  getRecommendedPaymentMethodsTop3(
    req: AiPaymentMethodTop3Request,
  ): Promise<AiPaymentMethodTop3Response>;

  getMonthlySavingsNarrative(
    req: AiMonthlySavingsNarrativeRequest,
  ): Promise<AiMonthlySavingsNarrativeResponse>;
}
