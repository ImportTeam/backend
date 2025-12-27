import axios from 'axios';
import { ServiceUnavailableException } from '@nestjs/common';
import { AiRecommendationGeminiClient } from './ai-recommendation.gemini';

type AxiosPost = typeof axios.post;

jest.mock('axios');

describe('AiRecommendationGeminiClient', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.GEMINI_API_KEY = 'test_api_key';
    process.env.GEMINI_MODEL = 'gemini-test-model';
    (axios.post as unknown as jest.MockedFunction<AxiosPost>).mockReset();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('parses fenced JSON response for benefit summary', async () => {
    (axios.post as unknown as jest.MockedFunction<AxiosPost>).mockResolvedValue({
      data: {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: '```json\n{"recommendation":"A","reasonSummary":"B"}\n```',
                },
              ],
            },
          },
        ],
      },
    } as any);

    const client = new AiRecommendationGeminiClient({
      apiKey: 'test_api_key',
      model: 'gemini-test-model',
    });

    const res = await client.getBenefitRecommendationSummary({
      userUuid: 'u',
      recentSixMonthsSummary: { totalSpent: 1, totalBenefit: 1, byCategory: [] },
      paymentMethods: [],
    });

    expect(res).toEqual({ recommendation: 'A', reasonSummary: 'B' });
  });

  it('converts paymentMethodSeq to BigInt and clamps score', async () => {
    (axios.post as unknown as jest.MockedFunction<AxiosPost>).mockResolvedValue({
      data: {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: '{"items":[{"paymentMethodSeq":"123","score":999,"reasonSummary":"R"},{"paymentMethodSeq":456,"score":-10}]}',
                },
              ],
            },
          },
        ],
      },
    } as any);

    const client = new AiRecommendationGeminiClient({
      apiKey: 'test_api_key',
      model: 'gemini-test-model',
    });

    const res = await client.getRecommendedPaymentMethodsTop3({
      userUuid: 'u',
      recentSixMonthsSummary: { topMerchants: [], byCategory: [] },
      paymentMethods: [
        { seq: BigInt(123), providerName: 'P' },
        { seq: BigInt(456), providerName: 'P2' },
      ],
    });

    expect(res.items).toHaveLength(2);
    expect(res.items[0]).toEqual({
      paymentMethodSeq: BigInt(123),
      score: 100,
      reasonSummary: 'R',
    });
    expect(res.items[1]).toEqual({
      paymentMethodSeq: BigInt(456),
      score: 0,
      reasonSummary: '추천 사유를 생성하지 못했습니다.',
    });
  });

  it('throws ServiceUnavailableException on request failure', async () => {
    (axios.post as unknown as jest.MockedFunction<AxiosPost>).mockRejectedValue({
      message: 'rate limited',
      response: { status: 429, data: { error: 'too many requests' } },
    });

    const client = new AiRecommendationGeminiClient({
      apiKey: 'test_api_key',
      model: 'gemini-test-model',
    });

    await expect(
      client.getMonthlySavingsNarrative({
        months: [{ month: '2025-01', totalSpent: 1, totalBenefit: 1, savingsAmount: 1 }],
      }),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });
});
