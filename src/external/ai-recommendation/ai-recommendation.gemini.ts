import axios from 'axios';
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

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};

function extractTextFromGemini(res: GeminiGenerateContentResponse): string {
  const text =
    res?.candidates?.[0]?.content?.parts
      ?.map((p) => p.text)
      .filter(Boolean)
      .join('') ?? '';
  return text;
}

function extractFirstJsonObject(text: string): any {
  // 모델이 ```json ...``` 형태로 내보내는 경우를 우선 처리
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = (fenced?.[1] ?? text).trim();

  // 가장 바깥 {} 또는 []를 찾아 파싱 시도
  const firstBrace = candidate.indexOf('{');
  const firstBracket = candidate.indexOf('[');
  let start = -1;
  if (firstBrace === -1) start = firstBracket;
  else if (firstBracket === -1) start = firstBrace;
  else start = Math.min(firstBrace, firstBracket);

  if (start === -1) {
    throw new Error('No JSON found in model response');
  }

  const sliced = candidate.slice(start).trim();

  // 단순 JSON.parse 시도
  try {
    return JSON.parse(sliced);
  } catch {
    // 뒤에 설명이 붙는 경우가 있어 끝까지 브루트포스로 잘라가며 시도
    for (let end = sliced.length; end > start + 1; end--) {
      const sub = sliced.slice(0, end);
      try {
        return JSON.parse(sub);
      } catch {
        // continue
      }
    }
    throw new Error('Failed to parse JSON from model response');
  }
}

function clampScore(score: unknown): number {
  const n = typeof score === 'number' ? score : Number(score);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export class AiRecommendationGeminiClient implements AiRecommendationClient {
  private readonly logger = new Logger(AiRecommendationGeminiClient.name);

  private readonly apiKey: string;
  private readonly model: string;

  constructor(options?: { apiKey?: string; model?: string }) {
    const apiKey = (options?.apiKey ?? process.env.GEMINI_API_KEY ?? '').trim();
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    this.apiKey = apiKey;
    this.model = (options?.model ?? process.env.GEMINI_MODEL ?? 'gemini-1.5-flash').trim();
  }

  private async generateJson<T>(prompt: string): Promise<T> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      this.model,
    )}:generateContent?key=${encodeURIComponent(this.apiKey)}`;

    try {
      const { data } = await axios.post<GeminiGenerateContentResponse>(
        url,
        {
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024,
          },
        },
        {
          timeout: 15000,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const text = extractTextFromGemini(data);
      const json = extractFirstJsonObject(text);
      return json as T;
    } catch (err: any) {
      const logLevel = (process.env.LOG_LEVEL ?? '').trim().toLowerCase();
      const shouldIncludeResponseBody = ['debug', 'verbose', 'silly'].includes(
        logLevel,
      );

      let message: string =
        typeof err?.message === 'string' ? err.message : 'Unknown error';
      const status = err?.response?.status;

      if (shouldIncludeResponseBody && err?.response?.data) {
        try {
          message =
            typeof err.response.data === 'string'
              ? err.response.data
              : JSON.stringify(err.response.data);
        } catch {
          // ignore
        }
      }

      if (message.length > 2000) {
        message = `${message.slice(0, 2000)}...(truncated)`;
      }

      this.logger.error(
        `Gemini request failed: status=${String(status ?? 'unknown')} message=${message}`,
      );
      throw new ServiceUnavailableException('AI 추천 서비스를 사용할 수 없습니다.');
    }
  }

  async getMonthlySavingsNarrative(
    req: AiMonthlySavingsNarrativeRequest,
  ): Promise<AiMonthlySavingsNarrativeResponse> {
    if (!req?.months || req.months.length === 0) {
      return {
        summary: '최근 6개월 데이터가 부족해 추이를 분석할 수 없습니다.',
        highlights: [],
      };
    }

    const prompt =
      `너는 핀테크 소비/혜택 분석가다. 아래 입력(JSON)을 바탕으로 최근 6개월 절약 변화 추이를 분석해라.\n` +
      `반드시 JSON만 출력해라. 설명 문장/마크다운/코드블록 금지.\n\n` +
      `출력 스키마:\n` +
      `{\n` +
      `  "summary": string,\n` +
      `  "highlights": string[]\n` +
      `}\n\n` +
      `입력(JSON):\n` +
      `${JSON.stringify(req)}`;

    const out = await this.generateJson<AiMonthlySavingsNarrativeResponse>(prompt);

    return {
      summary: typeof (out as any)?.summary === 'string' ? (out as any).summary : '요약을 생성하지 못했습니다.',
      highlights: Array.isArray((out as any)?.highlights)
        ? (out as any).highlights.filter((x: any) => typeof x === 'string').slice(0, 6)
        : [],
    };
  }

  async getBenefitRecommendationSummary(
    req: AiBenefitRecommendationSummaryRequest,
  ): Promise<AiBenefitRecommendationSummaryResponse> {
    const prompt =
      `너는 카드/페이 혜택 추천 AI다. 사용자의 최근 소비 요약과 보유 결제수단, 그리고 혜택(크롤링) 요약을 보고 추천을 만들어라.\n` +
      `개인식별정보(이메일/전화/이름)는 언급하지 마라.\n` +
      `반드시 JSON만 출력해라. 설명 문장/마크다운/코드블록 금지.\n\n` +
      `출력 스키마:\n` +
      `{\n` +
      `  "recommendation": string,\n` +
      `  "reasonSummary": string\n` +
      `}\n\n` +
      `입력(JSON):\n` +
        `${JSON.stringify(req)}`;

    const out = await this.generateJson<AiBenefitRecommendationSummaryResponse>(prompt);

    return {
      recommendation:
        typeof (out as any)?.recommendation === 'string'
          ? (out as any).recommendation
          : '추천을 생성하지 못했습니다.',
      reasonSummary:
        typeof (out as any)?.reasonSummary === 'string'
          ? (out as any).reasonSummary
          : '사유를 생성하지 못했습니다.',
    };
  }

  async getRecommendedPaymentMethodsTop3(req: AiPaymentMethodTop3Request): Promise<AiPaymentMethodTop3Response> {
    const prompt =
      `너는 결제수단 추천 AI다. 사용자의 소비 패턴(카테고리/상위 가맹점)과 혜택(크롤링) 요약을 참고하여, 사용자가 보유한 결제수단 중 Top3를 추천해라.\n` +
      `각 추천에는 어떤 할인/적립인지와 어떻게 적용되는지(간략)를 reasonSummary에 포함해라.\n` +
      `반드시 JSON만 출력해라. 설명 문장/마크다운/코드블록 금지.\n\n` +
      `출력 스키마:\n` +
      `{\n` +
      `  "items": [\n` +
      `    {\n` +
      `      "paymentMethodSeq": string,\n` +
      `      "score": number,\n` +
      `      "reasonSummary": string\n` +
      `    }\n` +
      `  ]\n` +
      `}\n\n` +
      `요구사항:\n` +
      `- paymentMethodSeq는 입력의 결제수단 seq를 그대로 문자열로 사용\n` +
      `- score는 0~100 정수\n` +
      `- items는 최대 3개\n\n` +
      `입력(JSON):\n` +
        `${JSON.stringify(req)}`;

    const out = await this.generateJson<any>(prompt);
    const itemsRaw = Array.isArray(out?.items) ? out.items : [];

    const items = itemsRaw
      .map((item: any) => {
        const seqStr = typeof item?.paymentMethodSeq === 'string' ? item.paymentMethodSeq : String(item?.paymentMethodSeq ?? '');
        const score = clampScore(item?.score);
        const reasonSummary = typeof item?.reasonSummary === 'string' ? item.reasonSummary : '';
        if (!seqStr) return null;
        return {
          paymentMethodSeq: BigInt(seqStr),
          score,
          reasonSummary: reasonSummary || '추천 사유를 생성하지 못했습니다.',
        };
      })
      .filter(Boolean)
      .slice(0, 3) as AiPaymentMethodTop3Response['items'];

    return { items };
  }
}
