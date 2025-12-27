import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { AiRecommendationGeminiClient } from '../src/external/ai-recommendation/ai-recommendation.gemini';

function loadDotEnvIfPresent(dotEnvPath = path.resolve(process.cwd(), '.env')): void {
  if (!fs.existsSync(dotEnvPath)) return;

  const content = fs.readFileSync(dotEnvPath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const eq = line.indexOf('=');
    if (eq <= 0) continue;

    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();

    // strip optional surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function assertString(v: unknown, name: string): asserts v is string {
  assert(typeof v === 'string', `${name} must be a string`);
}

function assertStringArray(v: unknown, name: string): asserts v is string[] {
  assert(Array.isArray(v), `${name} must be an array`);
  for (const [i, item] of v.entries()) {
    assert(typeof item === 'string', `${name}[${i}] must be a string`);
  }
}

function mask(value: string): string {
  if (value.length <= 6) return '***';
  return `${value.slice(0, 3)}***${value.slice(-3)}`;
}

async function main(): Promise<void> {
  // Ensure env is present even when invoked outside Nest bootstrap
  loadDotEnvIfPresent();

  const apiKey = (process.env.GEMINI_API_KEY ?? '').trim();
  const model = (process.env.GEMINI_MODEL ?? '').trim() || undefined;

  assert(apiKey, 'GEMINI_API_KEY is required for live Gemini smoke test');

  // Create client (never log raw apiKey)
  const client = new AiRecommendationGeminiClient({
    apiKey,
    model,
  });

  console.log('[gemini-live] start');
  console.log(`[gemini-live] model=${model ?? 'default'} apiKey=${mask(apiKey)}`);

  // 1) Monthly savings narrative
  const narrative = await client.getMonthlySavingsNarrative({
    months: [
      { month: '2025-07', totalSpent: 320000, totalBenefit: 18000, savingsAmount: 18000 },
      { month: '2025-08', totalSpent: 410000, totalBenefit: 12000, savingsAmount: 12000 },
      { month: '2025-09', totalSpent: 280000, totalBenefit: 22000, savingsAmount: 22000 },
      { month: '2025-10', totalSpent: 500000, totalBenefit: 9000, savingsAmount: 9000 },
      { month: '2025-11', totalSpent: 350000, totalBenefit: 15000, savingsAmount: 15000 },
      { month: '2025-12', totalSpent: 390000, totalBenefit: 17000, savingsAmount: 17000 },
    ],
  });

  assertString(narrative.summary, 'monthlySavingsNarrative.summary');
  assertStringArray(narrative.highlights, 'monthlySavingsNarrative.highlights');
  assert(narrative.summary.length > 0, 'monthlySavingsNarrative.summary must be non-empty');
  assert(narrative.highlights.length <= 6, 'monthlySavingsNarrative.highlights must be <= 6');

  console.log('[gemini-live] monthlySavingsNarrative OK');

  // 2) Benefit recommendation summary
  const benefitSummary = await client.getBenefitRecommendationSummary({
    userUuid: 'smoke-user',
    dashboardContext: {
      monthlySavingsTrend: [
        { month: '2025-12', totalSpent: 390000, totalBenefit: 17000, savingsAmount: 17000 },
      ],
      topMerchant: { merchantName: '쿠팡', totalSpent: 120000 },
      topPaymentMethod: { paymentMethodName: '신한카드', thisMonthTotalAmount: 210000 },
    },
    recentSixMonthsSummary: {
      totalSpent: 2250000,
      totalBenefit: 93000,
      byCategory: [
        { category: '쇼핑', spent: 800000 },
        { category: '식비', spent: 520000 },
        { category: '교통', spent: 180000 },
      ],
    },
    paymentMethods: [
      { seq: BigInt(101), providerName: 'Shinhan', alias: '신한(101)' },
      { seq: BigInt(202), providerName: 'KakaoPay', alias: '카카오페이(202)' },
    ],
    benefitOffersSummary: [
      {
        providerName: 'Shinhan',
        offers: [
          {
            title: '쿠팡 5% 할인',
            merchantFilter: '쿠팡',
            categoryFilter: '쇼핑',
            discountType: 'PERCENT',
            discountValue: 5,
            maxDiscount: 20000,
            minSpend: 30000,
          },
        ],
      },
    ],
  });

  assertString(benefitSummary.recommendation, 'benefitSummary.recommendation');
  assertString(benefitSummary.reasonSummary, 'benefitSummary.reasonSummary');
  assert(benefitSummary.recommendation.length > 0, 'benefitSummary.recommendation must be non-empty');

  console.log('[gemini-live] benefitRecommendationSummary OK');

  // 3) Payment method Top3
  const top3 = await client.getRecommendedPaymentMethodsTop3({
    userUuid: 'smoke-user',
    recentSixMonthsSummary: {
      topMerchants: [
        { merchantName: '쿠팡', spent: 600000 },
        { merchantName: '스타벅스', spent: 150000 },
      ],
      byCategory: [
        { category: '쇼핑', spent: 800000 },
        { category: '식비', spent: 520000 },
        { category: '생활', spent: 400000 },
      ],
    },
    paymentMethods: [
      { seq: BigInt(101), providerName: 'Shinhan', alias: '신한(101)' },
      { seq: BigInt(202), providerName: 'KakaoPay', alias: '카카오페이(202)' },
      { seq: BigInt(303), providerName: 'NaverPay', alias: '네이버페이(303)' },
    ],
    benefitOffersSummary: [
      {
        providerName: 'KakaoPay',
        offers: [
          {
            title: '편의점 10% 적립',
            merchantFilter: null,
            categoryFilter: '생활',
            discountType: 'PERCENT',
            discountValue: 10,
            maxDiscount: 10000,
            minSpend: 0,
          },
        ],
      },
    ],
  });

  assert(Array.isArray(top3.items), 'top3.items must be an array');
  assert(top3.items.length <= 3, 'top3.items must be <= 3');

  const allowedSeq = new Set(['101', '202', '303']);
  for (const [i, item] of top3.items.entries()) {
    assert(typeof item === 'object' && item !== null, `top3.items[${i}] must be an object`);
    assert(typeof (item as any).paymentMethodSeq === 'bigint', `top3.items[${i}].paymentMethodSeq must be a bigint`);
    assert(typeof (item as any).score === 'number', `top3.items[${i}].score must be a number`);
    assertString((item as any).reasonSummary, `top3.items[${i}].reasonSummary`);

    const seqStr = (item as any).paymentMethodSeq.toString();
    assert(allowedSeq.has(seqStr), `top3.items[${i}].paymentMethodSeq must be one of input seqs`);
    assert((item as any).score >= 0 && (item as any).score <= 100, `top3.items[${i}].score must be 0~100`);
    assert((item as any).reasonSummary.length > 0, `top3.items[${i}].reasonSummary must be non-empty`);
  }

  console.log('[gemini-live] recommendedPaymentMethodsTop3 OK');
  console.log('[gemini-live] done');
}

main().catch((err) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[gemini-live] FAILED: ${message}`);
  process.exitCode = 1;
});
