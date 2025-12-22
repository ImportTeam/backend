import type {
  AiBenefitRecommendationSummaryRequest,
  AiBenefitRecommendationSummaryResponse,
  AiMonthlySavingsTrendRequest,
  AiMonthlySavingsTrendResponse,
  AiPaymentMethodTop3Request,
  AiPaymentMethodTop3Response,
  AiRecommendationClient,
} from './ai-recommendation.client';
import { geminiGenerateJson } from './gemini-json.util';

function pickEnv(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : undefined;
}

export class AiRecommendationClientGemini implements AiRecommendationClient {
  private readonly apiKey: string | undefined;
  private readonly model: string;

  constructor() {
    this.apiKey = pickEnv('GEMINI_API_KEY');
    this.model = pickEnv('GEMINI_MODEL') ?? 'gemini-1.5-flash';
  }

  private ensureReady(): void {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }
  }

  async getMonthlySavingsTrendInsight(
    req: AiMonthlySavingsTrendRequest,
  ): Promise<AiMonthlySavingsTrendResponse> {
    this.ensureReady();

    const prompt = [
      'You are a finance analytics assistant for a Korean consumer app.',
      'Task: Convert the provided 6-month spending/benefit summary into a 6-month saving status trend.',
      'Return ONLY valid JSON. No markdown. No extra keys.',
      '',
      'JSON schema:',
      '{',
      '  "summary": string,',
      '  "insights": string[],',
      '  "months": Array<{',
      '    "month": "YYYY-MM",',
      '    "status": "GOOD"|"OK"|"BAD",',
      '    "comment": string',
      '  }>',
      '}',
      '',
      'Guidelines:',
      '- Use savingsRate = totalBenefit / max(totalSpent,1).',
      '- status GOOD if savingsRate >= 0.06, OK if >= 0.02, else BAD.',
      '- Keep comments short (<= 40 Korean chars).',
      '',
      'Input JSON:',
      JSON.stringify(req),
    ].join('\n');

    return geminiGenerateJson<AiMonthlySavingsTrendResponse>(prompt, {
      apiKey: this.apiKey!,
      model: this.model,
      temperature: 0.2,
      timeoutMs: 15000,
    });
  }

  async getBenefitRecommendationSummary(
    req: AiBenefitRecommendationSummaryRequest,
  ): Promise<AiBenefitRecommendationSummaryResponse> {
    this.ensureReady();

    const prompt = [
      'You are a recommendation engine for payment benefits (cards/pays) for Korean users.',
      'Task: Recommend better cards/pays based on the provided dashboard summary.',
      'Return ONLY valid JSON. No markdown. No extra keys.',
      '',
      'JSON schema:',
      '{',
      '  "recommendation": string,',
      '  "reasonSummary": string,',
      '  "items": Array<{',
      '    "providerName": string,',
      '    "why": string',
      '  }>',
      '}',
      '',
      'Guidelines:',
      '- "items" should be 3 to 5 recommendations.',
      '- Prefer providers NOT already in user paymentMethods (if possible).',
      '- Keep why short (<= 80 Korean chars).',
      '',
      'Input JSON:',
      JSON.stringify(req),
    ].join('\n');

    return geminiGenerateJson<AiBenefitRecommendationSummaryResponse>(prompt, {
      apiKey: this.apiKey!,
      model: this.model,
      temperature: 0.3,
      timeoutMs: 15000,
    });
  }

  async getRecommendedPaymentMethodsTop3(
    req: AiPaymentMethodTop3Request,
  ): Promise<AiPaymentMethodTop3Response> {
    this.ensureReady();

    const prompt = [
      "You are a recommendation engine for selecting the best payment method among the user's existing methods.",
      'Task: Pick EXACTLY top 3 payment methods (from the provided list) and explain discount briefly.',
      'Return ONLY valid JSON. No markdown. No extra keys.',
      '',
      'JSON schema:',
      '{',
      '  "items": Array<{',
      '    "paymentMethodSeq": string,',
      '    "score": number,',
      '    "reasonSummary": string,',
      '    "discountSummary": string',
      '  }>',
      '}',
      '',
      'Constraints:',
      '- items length MUST be 3.',
      '- paymentMethodSeq MUST match one of req.paymentMethods[].seq (as string).',
      '- score: 0..100.',
      '- reasonSummary <= 100 Korean chars.',
      '- discountSummary <= 80 Korean chars.',
      '',
      'Input JSON:',
      JSON.stringify(req),
    ].join('\n');

    return geminiGenerateJson<AiPaymentMethodTop3Response>(prompt, {
      apiKey: this.apiKey!,
      model: this.model,
      temperature: 0.2,
      timeoutMs: 15000,
    });
  }
}
