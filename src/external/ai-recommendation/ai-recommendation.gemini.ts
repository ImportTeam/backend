import axios from 'axios';
import { Logger, ServiceUnavailableException } from '@nestjs/common';
import { jsonrepair } from 'jsonrepair';
import { z } from 'zod';
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

function isLikelyUnknownFieldBadRequest(err: any, fieldName: string): boolean {
  const status = err?.response?.status;
  if (status !== 400) return false;

  const data = err?.response?.data;
  const text =
    typeof data === 'string'
      ? data
      : data
        ? (() => {
            try {
              return JSON.stringify(data);
            } catch {
              return '';
            }
          })()
        : '';

  if (!text) return false;
  return (
    text.includes(fieldName) ||
    text.toLowerCase().includes(`unknown name \"${fieldName.toLowerCase()}\"`) ||
    text.toLowerCase().includes(`unknown field \"${fieldName.toLowerCase()}\"`)
  );
}

function extractTextFromGemini(res: GeminiGenerateContentResponse): string {
  const text =
    res?.candidates?.[0]?.content?.parts
      ?.map((p) => p.text)
      .filter(Boolean)
      .join('') ?? '';
  return text;
}

function findFirstJsonSlice(candidate: string): string {
  const firstBrace = candidate.indexOf('{');
  const firstBracket = candidate.indexOf('[');
  let start = -1;
  if (firstBrace === -1) start = firstBracket;
  else if (firstBracket === -1) start = firstBrace;
  else start = Math.min(firstBrace, firstBracket);

  if (start === -1) {
    throw new Error('No JSON found in model response');
  }

  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < candidate.length; i++) {
    const ch = candidate[i];

    if (inString) {
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === '\\') {
        escape = true;
        continue;
      }
      if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === '{' || ch === '[') depth++;
    else if (ch === '}' || ch === ']') depth--;

    if (depth === 0) {
      return candidate.slice(start, i + 1).trim();
    }
  }

  // 닫는 괄호가 부족한 경우(잘림 등): 일단 시작부터 끝까지 반환하고 repair에 맡긴다.
  return candidate.slice(start).trim();
}

function extractFirstJsonObject(text: string): any {
  // 모델이 ```json ...``` 형태로 내보내는 경우를 우선 처리
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = (fenced?.[1] ?? text).trim();

  const sliced = findFirstJsonSlice(candidate);

  try {
    return JSON.parse(sliced);
  } catch {
    try {
      return JSON.parse(jsonrepair(sliced));
    } catch {
      throw new Error('Failed to parse JSON from model response');
    }
  }
}

function clampScore(score: unknown): number {
  const n = typeof score === 'number' ? score : Number(score);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function stringifyForPrompt(value: unknown): string {
  return JSON.stringify(value, (_key, v) => (typeof v === 'bigint' ? v.toString() : v));
}

const MonthlySavingsNarrativeStrictSchema = z.object({
  summary: z.string().min(1),
  highlights: z.array(z.string()).optional().default([]),
});

const MonthlySavingsNarrativeLenientSchema = z.object({
  summary: z.string().catch('요약을 생성하지 못했습니다.'),
  highlights: z.array(z.string()).catch([]),
});

const BenefitRecommendationStrictSchema = z.object({
  recommendation: z.string().min(1),
  reasonSummary: z.string().optional().default('사유를 생성하지 못했습니다.'),
});

const BenefitRecommendationLenientSchema = z.object({
  recommendation: z.string().catch('추천을 생성하지 못했습니다.'),
  reasonSummary: z.string().catch('사유를 생성하지 못했습니다.'),
});

const PaymentMethodSeqCoerceSchema = z
  .union([z.string(), z.number(), z.bigint()])
  .transform((v) => String(v))
  .refine((s) => /^\d+$/.test(s), { message: 'paymentMethodSeq must be a numeric string' });

const PaymentMethodTop3ItemStrictSchema = z.object({
  paymentMethodSeq: PaymentMethodSeqCoerceSchema,
  score: z.coerce.number(),
  reasonSummary: z.string().optional().default('추천 사유를 생성하지 못했습니다.'),
});

const PaymentMethodTop3StrictSchema = z.object({
  items: z.array(PaymentMethodTop3ItemStrictSchema),
});

const PaymentMethodTop3LenientSchema = z.object({
  items: z.array(
    z.object({
      paymentMethodSeq: PaymentMethodSeqCoerceSchema,
      score: z.coerce.number().catch(0),
      reasonSummary: z.string().catch('추천 사유를 생성하지 못했습니다.'),
    }),
  ).catch([]),
});

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

  private async generateJson<T>(prompt: string, options?: { schema?: Record<string, any> }): Promise<T> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      this.model,
    )}:generateContent?key=${encodeURIComponent(this.apiKey)}`;

    const logLevel = (process.env.LOG_LEVEL ?? '').trim().toLowerCase();
    const shouldIncludeVerboseLogs = ['debug', 'verbose', 'silly'].includes(logLevel);

    try {
      const schema = options?.schema;

      const makeBody = (useJsonMime: boolean, useSchema: boolean) => ({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024,
          ...(useJsonMime ? { responseMimeType: 'application/json' } : null),
          ...(useSchema && schema ? { responseSchema: schema } : null),
        },
      });

      const post = async (useJsonMime: boolean, useSchema: boolean) =>
        axios.post<GeminiGenerateContentResponse>(url, makeBody(useJsonMime, useSchema), {
          timeout: 15000,
          headers: {
            'Content-Type': 'application/json',
          },
        });

      let data: GeminiGenerateContentResponse;
      try {
        ({ data } = await post(true, Boolean(schema)));
      } catch (err: any) {
        // 1) responseSchema 미지원 폴백
        if (schema && isLikelyUnknownFieldBadRequest(err, 'responseSchema')) {
          ({ data } = await post(true, false));
        }
        // 2) responseMimeType 미지원 폴백
        else if (isLikelyUnknownFieldBadRequest(err, 'responseMimeType')) {
          ({ data } = await post(false, false));
        } else {
          throw err;
        }
      }

      const text = extractTextFromGemini(data);

      try {
        const json = extractFirstJsonObject(text);
        return json as T;
      } catch (parseErr: any) {
        const normalized = (text ?? '').toString().replace(/\s+/g, ' ').trim();
        const excerpt = normalized.length > 800 ? `${normalized.slice(0, 800)}...(truncated)` : normalized;

        if (shouldIncludeVerboseLogs) {
          this.logger.error(
            `Gemini returned non-JSON text. parseError=${String(parseErr?.message ?? parseErr)} excerpt=${excerpt}`,
          );
        } else {
          this.logger.error(
            `Gemini returned non-JSON text. parseError=${String(parseErr?.message ?? parseErr)}`,
          );
        }

        throw new ServiceUnavailableException('AI 추천 서비스를 사용할 수 없습니다.');
      }
    } catch (err: any) {
      const shouldIncludeResponseBody = shouldIncludeVerboseLogs;

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
      `${stringifyForPrompt(req)}`;

    const out = await this.generateJson<AiMonthlySavingsNarrativeResponse>(prompt, {
      schema: {
        type: 'OBJECT',
        properties: {
          summary: { type: 'STRING' },
          highlights: { type: 'ARRAY', items: { type: 'STRING' } },
        },
        required: ['summary', 'highlights'],
      },
    });

    const strict = MonthlySavingsNarrativeStrictSchema.safeParse(out);
    const parsed = strict.success
      ? strict.data
      : (() => {
          this.logger.warn(`MonthlySavingsNarrative schema violation: ${strict.error.message}`);
          return MonthlySavingsNarrativeLenientSchema.parse(out);
        })();

    return {
      summary: parsed.summary,
      highlights: parsed.highlights.filter((x) => typeof x === 'string').slice(0, 6),
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
        `${stringifyForPrompt(req)}`;

    const out = await this.generateJson<AiBenefitRecommendationSummaryResponse>(prompt, {
      schema: {
        type: 'OBJECT',
        properties: {
          recommendation: { type: 'STRING' },
          reasonSummary: { type: 'STRING' },
        },
        required: ['recommendation', 'reasonSummary'],
      },
    });

    const strict = BenefitRecommendationStrictSchema.safeParse(out);
    const parsed = strict.success
      ? strict.data
      : (() => {
          this.logger.warn(`BenefitRecommendationSummary schema violation: ${strict.error.message}`);
          return BenefitRecommendationLenientSchema.parse(out);
        })();

    return {
      recommendation: parsed.recommendation,
      reasonSummary: parsed.reasonSummary,
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
        `${stringifyForPrompt(req)}`;

    const out = await this.generateJson<any>(prompt, {
      schema: {
        type: 'OBJECT',
        properties: {
          items: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                paymentMethodSeq: { type: 'STRING' },
                score: { type: 'NUMBER' },
                reasonSummary: { type: 'STRING' },
              },
              required: ['paymentMethodSeq', 'score', 'reasonSummary'],
            },
          },
        },
        required: ['items'],
      },
    });

    const strict = PaymentMethodTop3StrictSchema.safeParse(out);
    const parsed = strict.success
      ? strict.data
      : (() => {
          this.logger.warn(`PaymentMethodTop3 schema violation: ${strict.error.message}`);
          return PaymentMethodTop3LenientSchema.parse(out);
        })();

    const allowedSeq = new Set((req?.paymentMethods ?? []).map((pm) => pm.seq.toString()));

    const items = parsed.items
      .map((item) => {
        const seqStr = item.paymentMethodSeq;
        if (!allowedSeq.has(seqStr)) return null;

        const score = clampScore(item.score);
        const reasonSummary = (item.reasonSummary ?? '').toString().trim() || '추천 사유를 생성하지 못했습니다.';

        return {
          paymentMethodSeq: BigInt(seqStr),
          score,
          reasonSummary,
        };
      })
      .filter(Boolean)
      .slice(0, 3) as AiPaymentMethodTop3Response['items'];

    return { items };
  }
}
