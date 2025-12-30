import { Logger, ServiceUnavailableException } from '@nestjs/common';
import type {
  AiBenefitRecommendationSummaryRequest,
  AiBenefitRecommendationSummaryResponse,
  AiPaymentMethodTop3Request,
  AiPaymentMethodTop3Response,
  AiRecommendationClient,
  AiMonthlySavingsNarrativeRequest,
  AiMonthlySavingsNarrativeResponse,
} from './ai-recommendation.client';
import { AiRecommendationClientStub } from './ai-recommendation.stub';

/**
 * Gemini API 실패 시 자동으로 stub으로 폴백하는 래퍼 클래스
 */
export class AiRecommendationClientWithFallback
  implements AiRecommendationClient
{
  private readonly logger = new Logger(AiRecommendationClientWithFallback.name);
  private readonly stub = new AiRecommendationClientStub();

  constructor(private readonly primary: AiRecommendationClient) {}

  private isRateLimitError(err: any): boolean {
    const status = err?.response?.status ?? err?.status;
    return status === 429;
  }

  private isServiceUnavailableError(err: any): boolean {
    return err instanceof ServiceUnavailableException;
  }

  private isNotFoundError(err: any): boolean {
    const status = err?.response?.status ?? err?.status;
    return status === 404;
  }

  async getMonthlySavingsNarrative(
    req: AiMonthlySavingsNarrativeRequest,
  ): Promise<AiMonthlySavingsNarrativeResponse> {
    try {
      return await this.primary.getMonthlySavingsNarrative(req);
    } catch (err: any) {
      if (
        this.isRateLimitError(err) ||
        this.isServiceUnavailableError(err) ||
        this.isNotFoundError(err)
      ) {
        this.logger.warn(
          `Gemini API unavailable (status=${err?.response?.status ?? 'unknown'}), falling back to stub`,
        );
        return this.stub.getMonthlySavingsNarrative(req);
      }
      throw err;
    }
  }

  async getBenefitRecommendationSummary(
    req: AiBenefitRecommendationSummaryRequest,
  ): Promise<AiBenefitRecommendationSummaryResponse> {
    try {
      return await this.primary.getBenefitRecommendationSummary(req);
    } catch (err: any) {
      if (
        this.isRateLimitError(err) ||
        this.isServiceUnavailableError(err) ||
        this.isNotFoundError(err)
      ) {
        this.logger.warn(
          `Gemini API unavailable (status=${err?.response?.status ?? 'unknown'}), falling back to stub`,
        );
        return this.stub.getBenefitRecommendationSummary(req);
      }
      throw err;
    }
  }

  async getRecommendedPaymentMethodsTop3(
    req: AiPaymentMethodTop3Request,
  ): Promise<AiPaymentMethodTop3Response> {
    try {
      return await this.primary.getRecommendedPaymentMethodsTop3(req);
    } catch (err: any) {
      if (
        this.isRateLimitError(err) ||
        this.isServiceUnavailableError(err) ||
        this.isNotFoundError(err)
      ) {
        this.logger.warn(
          `Gemini API unavailable (status=${err?.response?.status ?? 'unknown'}), falling back to stub`,
        );
        return this.stub.getRecommendedPaymentMethodsTop3(req);
      }
      throw err;
    }
  }
}

