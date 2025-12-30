import axios from 'axios';
import { Logger, ServiceUnavailableException } from '@nestjs/common';
import { jsonrepair } from 'jsonrepair';
import { z } from 'zod';
import { createHash } from 'crypto';
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
    text
      .toLowerCase()
      .includes(`unknown name \"${fieldName.toLowerCase()}\"`) ||
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
  return JSON.stringify(value, (_key, v) =>
    typeof v === 'bigint' ? v.toString() : v,
  );
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
  .refine((s) => /^\d+$/.test(s), {
    message: 'paymentMethodSeq must be a numeric string',
  });

const PaymentMethodTop3ItemStrictSchema = z.object({
  paymentMethodSeq: PaymentMethodSeqCoerceSchema,
  score: z.coerce.number(),
  reasonSummary: z
    .string()
    .optional()
    .default('추천 사유를 생성하지 못했습니다.'),
});

const PaymentMethodTop3StrictSchema = z.object({
  items: z.array(PaymentMethodTop3ItemStrictSchema),
});

const PaymentMethodTop3LenientSchema = z.object({
  items: z
    .array(
      z.object({
        paymentMethodSeq: PaymentMethodSeqCoerceSchema,
        score: z.coerce.number().catch(0),
        reasonSummary: z.string().catch('추천 사유를 생성하지 못했습니다.'),
      }),
    )
    .catch([]),
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
    // gemini-2.5-flash-lite는 가장 저렴한 모델 (비용 효율적인 요약 작업에 최적화)
    // 테스트 결과 gemini-2.5-flash-lite가 정상 작동 확인됨
    this.model = (
      options?.model ??
      process.env.GEMINI_MODEL ??
      'gemini-2.5-flash-lite'
    ).trim();
  }

  // Simple in-memory cache to avoid repeated LLM calls for identical requests.
  // Keyed by sha256(method + requestPayload). Entries expire after TTL seconds.
  private static cache = new Map<string, { expiresAt: number; value: any }>();
  private static readonly CACHE_TTL_SEC = Number(process.env.AI_CACHE_TTL_SEC ?? '3600');
  private static readonly CACHE_MAX_ENTRIES = Number(process.env.AI_CACHE_MAX_ENTRIES ?? '1000');

  private makeCacheKey(method: string, payload: unknown): string {
    const h = createHash('sha256');
    h.update(method + '|' + stringifyForPrompt(payload));
    return h.digest('hex');
  }

  private getFromCache<T>(key: string): T | null {
    const e = AiRecommendationGeminiClient.cache.get(key);
    if (!e) return null;
    if (Date.now() > e.expiresAt) {
      AiRecommendationGeminiClient.cache.delete(key);
      return null;
    }
    return e.value as T;
  }

  private setCache(key: string, value: unknown): void {
    // simple eviction: if cache grows beyond max, clear oldest ~10%
    if (AiRecommendationGeminiClient.cache.size >= AiRecommendationGeminiClient.CACHE_MAX_ENTRIES) {
      const removeCount = Math.max(1, Math.floor(AiRecommendationGeminiClient.cache.size * 0.1));
      const it = AiRecommendationGeminiClient.cache.keys();
      for (let i = 0; i < removeCount; i++) {
        const k = it.next().value;
        if (!k) break;
        AiRecommendationGeminiClient.cache.delete(k);
      }
    }
    AiRecommendationGeminiClient.cache.set(key, {
      expiresAt: Date.now() + AiRecommendationGeminiClient.CACHE_TTL_SEC * 1000,
      value,
    });
  }

  private async generateJson<T>(
    prompt: string,
    options?: { schema?: Record<string, any> },
  ): Promise<T> {
    // Gemini API 엔드포인트: v1beta 사용
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      this.model,
    )}:generateContent?key=${encodeURIComponent(this.apiKey)}`;
    
    this.logger.debug(`Gemini API 호출: model=${this.model}, url=${url.substring(0, 80)}...`);

    const logLevel = (process.env.LOG_LEVEL ?? '').trim().toLowerCase();
    const shouldIncludeVerboseLogs = ['debug', 'verbose', 'silly'].includes(
      logLevel,
    );

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
          // temperature: 0.2 - 일관된 응답을 위해 낮은 값 유지
          temperature: 0.2,
          // maxOutputTokens: 512 - 비용 절감을 위해 토큰 수 제한 (요약은 간결하게)
          maxOutputTokens: 512,
          ...(useJsonMime ? { responseMimeType: 'application/json' } : null),
          ...(useSchema && schema ? { responseSchema: schema } : null),
        },
      });

      const post = async (useJsonMime: boolean, useSchema: boolean) =>
        axios.post<GeminiGenerateContentResponse>(
          url,
          makeBody(useJsonMime, useSchema),
          {
            timeout: 15000,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

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
        const excerpt =
          normalized.length > 800
            ? `${normalized.slice(0, 800)}...(truncated)`
            : normalized;

        if (shouldIncludeVerboseLogs) {
          this.logger.error(
            `Gemini returned non-JSON text. parseError=${String(parseErr?.message ?? parseErr)} excerpt=${excerpt}`,
          );
        } else {
          this.logger.error(
            `Gemini returned non-JSON text. parseError=${String(parseErr?.message ?? parseErr)}`,
          );
        }

        throw new ServiceUnavailableException(
          'AI 추천 서비스를 사용할 수 없습니다.',
        );
      }
    } catch (err: any) {
      // If model-specific errors like 404 (model not found) or 429 (rate limit)
      // occurred, attempt to fetch available text models and retry sequentially.
      const statusCode = err?.response?.status ?? err?.status;
      if (statusCode === 404 || statusCode === 429) {
        try {
          const candidates = await this.listAvailableTextModels();
          this.logger.warn(
            `Attempting model failover. candidates=${candidates.join(',')}`,
          );

          for (const candidate of candidates) {
            if (candidate === this.model) continue;
            this.logger.log(`Retrying with model=${candidate}`);
            this.model = candidate;
            try {
              // retry the original request once with the new model
              const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
                this.model,
              )}:generateContent?key=${encodeURIComponent(this.apiKey)}`;
              const body = {
                contents: [
                  {
                    role: 'user',
                    parts: [{ text: prompt }],
                  },
                ],
                generationConfig: {
                  temperature: 0.2,
                  maxOutputTokens: 512,
                  ...(options?.schema ? { responseSchema: options?.schema } : null),
                },
              };

              const resp = await axios.post<GeminiGenerateContentResponse>(
                url,
                body,
                {
                  timeout: 15000,
                  headers: { 'Content-Type': 'application/json' },
                },
              );
              const text2 = extractTextFromGemini(resp.data);
              const json2 = extractFirstJsonObject(text2);
              return json2 as T;
            } catch (e) {
              this.logger.warn(`Model ${candidate} failed, trying next`);
              continue;
            }
          }
        } catch (listErr) {
          this.logger.error(`Failed to list models for failover: ${String(listErr?.message ?? listErr)}`);
        }
      }
      const shouldIncludeResponseBody = shouldIncludeVerboseLogs || true; // 404 에러 디버깅을 위해 항상 포함

      let message: string =
        typeof err?.message === 'string' ? err.message : 'Unknown error';
      const status = err?.response?.status;

      // 404 에러의 경우 상세한 응답 본문 확인
      if (status === 404 && err?.response?.data) {
        try {
          const errorData = typeof err.response.data === 'string'
            ? err.response.data
            : JSON.stringify(err.response.data, null, 2);
          message = `404 Not Found: ${errorData}`;
          this.logger.error(
            `Gemini API 404 에러 상세: 모델=${this.model}, 응답=${errorData.substring(0, 500)}`,
          );
        } catch {
          // ignore
        }
      } else if (shouldIncludeResponseBody && err?.response?.data) {
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

      // 404 에러는 모델 이름이나 API 엔드포인트 문제일 수 있음
      if (status === 404) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
          this.model,
        )}:generateContent?key=***`;
        this.logger.error(
          `Gemini API 404 에러: 모델 이름(${this.model}) 또는 API 엔드포인트를 확인하세요. URL: ${url} status=${status} message=${message}`,
        );
      } else {
      this.logger.error(
        `Gemini request failed: status=${String(status ?? 'unknown')} message=${message}`,
      );
      }
      throw new ServiceUnavailableException(
        'AI 추천 서비스를 사용할 수 없습니다.',
      );
    }
  }

  private async listAvailableTextModels(): Promise<string[]> {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(
        this.apiKey,
      )}`;
      const res = await axios.get(url, { timeout: 10000 });
      const data = res.data;
      const models: string[] = [];
      // API may return { models: [{ name: 'models/gemini-2.5-flash-lite', displayName: '...' , category: 'TEXT_OUTPUT' }, ...] }
      if (Array.isArray(data?.models)) {
        for (const m of data.models) {
          const name: string = m?.name ?? m?.model ?? '';
          if (!name) continue;
          const id = name.includes('/') ? name.split('/').pop()! : name;
          const lname = id.toLowerCase();
          // heuristics: include models that are text output/LLM and exclude audio/tts
          const category = (m?.category ?? '').toString().toLowerCase();
          if (category.includes('text') || lname.includes('gemini') || lname.includes('gemma') || lname.includes('gpt')) {
            if (!lname.includes('audio') && !lname.includes('tts') && !lname.includes('dialogue-native-audio')) {
              models.push(id);
            }
          }
        }
      }
      // ensure default preferred ordering: favor flash-lite/flash
      // Preferred fallback order (text-output models only). Derived from available
      // models list provided by the team — TTS/image models are intentionally
      // omitted.
      const preferred = [
        'gemini-3-pro-preview',
        'gemini-3-flash-preview',
        'gemini-2.5-pro',
        'gemini-2.5-flash',
        'gemini-2.5-flash-preview',
        'gemini-2.5-flash-lite',
        'gemini-2.0-flash',
        'gemini-2.0-flash-lite',
      ];
      const sorted = Array.from(new Set([...preferred, ...models]));
      return sorted.filter(Boolean);
    } catch (err) {
      this.logger.warn(`Failed to fetch model list: ${String(err?.message ?? err)}`);
      return [];
    }
  }

  async getMonthlySavingsNarrative(
    req: AiMonthlySavingsNarrativeRequest,
  ): Promise<AiMonthlySavingsNarrativeResponse> {
    const cacheKey = this.makeCacheKey('monthlySavings', req);
    const cached = this.getFromCache<AiMonthlySavingsNarrativeResponse>(cacheKey);
    if (cached) return cached;

    if (!req?.months || req.months.length === 0) {
      const emptyResult: AiMonthlySavingsNarrativeResponse = {
        summary: '최근 6개월 데이터가 부족해 추이를 분석할 수 없습니다.',
        highlights: [],
      };
      this.setCache(cacheKey, emptyResult);
      return emptyResult;
    }

    const prompt =
      `당신은 핀테크 소비 분석 전문가입니다. 사용자의 최근 6개월 절약 데이터를 분석하여 인사이트를 제공하세요.\n\n` +
      `**분석 지침:**\n` +
      `1. 절약액의 증가/감소 추이를 명확히 파악\n` +
      `2. 월별 변화 패턴을 간결하게 요약 (2-3문장)\n` +
      `3. 주요 하이라이트 3-5개를 구체적인 숫자와 함께 제시\n` +
      `4. 사용자가 이해하기 쉬운 자연스러운 한국어로 작성\n\n` +
      `**출력 형식 (JSON만 출력, 다른 텍스트 없음):**\n` +
      `{\n` +
      `  "summary": "최근 6개월 절약 추이를 2-3문장으로 요약",\n` +
      `  "highlights": ["구체적인 숫자와 함께 주요 인사이트 1", "주요 인사이트 2", "주요 인사이트 3"]\n` +
      `}\n\n` +
      `**입력 데이터:**\n` +
      `${stringifyForPrompt(req)}`;

    const out = await this.generateJson<AiMonthlySavingsNarrativeResponse>(
      prompt,
      {
        schema: {
          type: 'OBJECT',
          properties: {
            summary: { type: 'STRING' },
            highlights: { type: 'ARRAY', items: { type: 'STRING' } },
          },
          required: ['summary', 'highlights'],
        },
      },
    );

    const strict = MonthlySavingsNarrativeStrictSchema.safeParse(out);
    const parsed = strict.success
      ? strict.data
      : (() => {
          this.logger.warn(
            `MonthlySavingsNarrative schema violation: ${strict.error.message}`,
          );
          return MonthlySavingsNarrativeLenientSchema.parse(out);
        })();

    const result: AiMonthlySavingsNarrativeResponse = {
      summary: parsed.summary,
      highlights: parsed.highlights
        .filter((x) => typeof x === 'string')
        .slice(0, 6),
    };
    this.setCache(cacheKey, result);
    return result;
  }

  async getBenefitRecommendationSummary(
    req: AiBenefitRecommendationSummaryRequest,
  ): Promise<AiBenefitRecommendationSummaryResponse> {
    const cacheKey = this.makeCacheKey('benefitRecommendation', req);
    const cached = this.getFromCache<AiBenefitRecommendationSummaryResponse>(cacheKey);
    if (cached) return cached;
    const prompt =
      `당신은 카드/페이 혜택 추천 전문가입니다. 사용자의 소비 패턴과 보유 결제수단, 이용 가능한 혜택을 종합 분석하여 실용적인 추천을 제공하세요.\n\n` +
      `**분석 지침:**\n` +
      `1. 사용자의 최근 6개월 소비 패턴(카테고리별 지출, 주요 가맹점)을 분석\n` +
      `2. 보유 결제수단의 혜택과 사용자의 소비 패턴을 매칭\n` +
      `3. 구체적이고 실행 가능한 추천 제시 (예: "이번 달에는 쇼핑 카테고리에서 KB 국민카드 사용 시 5% 적립 가능")\n` +
      `4. 추천 이유를 명확하고 간결하게 설명 (2-3문장)\n` +
      `5. 개인식별정보(이메일/전화번호/이름)는 절대 언급하지 않음\n\n` +
      `**출력 형식 (JSON만 출력, 다른 텍스트 없음):**\n` +
      `{\n` +
      `  "recommendation": "구체적이고 실행 가능한 추천 문장 (1-2문장)",\n` +
      `  "reasonSummary": "추천 이유를 간결하게 설명 (2-3문장)"\n` +
      `}\n\n` +
      `**입력 데이터:**\n` +
      `${stringifyForPrompt(req)}`;

    const out = await this.generateJson<AiBenefitRecommendationSummaryResponse>(
      prompt,
      {
        schema: {
          type: 'OBJECT',
          properties: {
            recommendation: { type: 'STRING' },
            reasonSummary: { type: 'STRING' },
          },
          required: ['recommendation', 'reasonSummary'],
        },
      },
    );

    const strict = BenefitRecommendationStrictSchema.safeParse(out);
    const parsed = strict.success
      ? strict.data
      : (() => {
          this.logger.warn(
            `BenefitRecommendationSummary schema violation: ${strict.error.message}`,
          );
          return BenefitRecommendationLenientSchema.parse(out);
        })();

    const result: AiBenefitRecommendationSummaryResponse = {
      recommendation: parsed.recommendation,
      reasonSummary: parsed.reasonSummary,
    };
    this.setCache(cacheKey, result);
    return result;
  }

  async getRecommendedPaymentMethodsTop3(
    req: AiPaymentMethodTop3Request,
  ): Promise<AiPaymentMethodTop3Response> {
    const cacheKey = this.makeCacheKey('paymentMethodTop3', req);
    const cached = this.getFromCache<AiPaymentMethodTop3Response>(cacheKey);
    if (cached) return cached;
    const prompt =
      `당신은 결제수단 추천 전문가입니다. 사용자의 소비 패턴과 이용 가능한 혜택을 분석하여 최적의 결제수단 Top3를 추천하세요.\n\n` +
      `**분석 지침:**\n` +
      `1. 사용자의 최근 소비 패턴 분석 (주요 카테고리, 상위 가맹점)\n` +
      `2. 각 결제수단의 혜택과 사용자 소비 패턴의 매칭도 평가\n` +
      `3. 혜택 금액/비율이 높은 순서로 우선순위 결정\n` +
      `4. 각 추천에 대해 구체적인 혜택 내용과 적용 방법을 간결하게 설명\n\n` +
      `**출력 형식 (JSON만 출력, 다른 텍스트 없음):**\n` +
      `{\n` +
      `  "items": [\n` +
      `    {\n` +
      `      "paymentMethodSeq": "결제수단 seq (입력값 그대로 문자열)",\n` +
      `      "score": 0-100 사이 정수 (높을수록 추천도 높음),\n` +
      `      "reasonSummary": "구체적인 혜택 내용과 적용 방법 설명 (1-2문장)"\n` +
      `    }\n` +
      `  ]\n` +
      `}\n\n` +
      `**요구사항:**\n` +
      `- items는 최대 3개만 반환\n` +
      `- score는 사용자의 소비 패턴과 혜택 매칭도를 반영한 0-100 정수\n` +
      `- reasonSummary는 "XX 카테고리에서 Y% 적립" 같은 구체적 정보 포함\n\n` +
      `**입력 데이터:**\n` +
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
          this.logger.warn(
            `PaymentMethodTop3 schema violation: ${strict.error.message}`,
          );
          return PaymentMethodTop3LenientSchema.parse(out);
        })();

    const allowedSeq = new Set(
      (req?.paymentMethods ?? []).map((pm) => pm.seq.toString()),
    );

    const items = parsed.items
      .map((item) => {
        const seqStr = item.paymentMethodSeq;
        if (!allowedSeq.has(seqStr)) return null;

        const score = clampScore(item.score);
        const reasonSummary =
          (item.reasonSummary ?? '').toString().trim() ||
          '추천 사유를 생성하지 못했습니다.';

        return {
          paymentMethodSeq: BigInt(seqStr),
          score,
          reasonSummary,
        };
      })
      .filter(Boolean)
      .slice(0, 3) as AiPaymentMethodTop3Response['items'];

    const result: AiPaymentMethodTop3Response = { items };
    this.setCache(cacheKey, result);
    return result;
  }
}
