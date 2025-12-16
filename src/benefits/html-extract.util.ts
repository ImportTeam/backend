import { normalizeProviderName } from './provider-alias.util';

export type ExtractedOffer = {
  provider_name: string;
  discount_type: 'PERCENT' | 'FLAT';
  discount_value: number; // percent or amount
  title?: string;
  start_date?: string; // YYYY-MM-DD
  end_date?: string;   // YYYY-MM-DD
  raw_snippet?: string;
  benefit_kind?: 'DISCOUNT' | 'INSTALLMENT';
};

function strip(html: string): string {
  // 매우 단순한 텍스트 추출 (확장 측에서 텍스트만 넘겨줘도 됨)
  const noScript = html.replaceAll(/<script[\s\S]*?<\/script>/gi, ' ');
  const noStyle = noScript.replaceAll(/<style[\s\S]*?<\/style>/gi, ' ');
  const text = noStyle.replaceAll(/<[^>]+>/g, ' ');
  return text.replaceAll(/\s+/g, ' ').trim();
}

function pad(n: number): string { return n < 10 ? `0${n}` : `${n}`; }
function toYmd(y: number, m: number, d: number): string { return `${y}-${pad(m)}-${pad(d)}`; }

const DATE_RANGE_RE = /(20\d{2})[-.](\d{1,2})[-.](\d{1,2})\s*[~–-]\s*(?:(20\d{2})[-.])?(\d{1,2})[-.](\d{1,2})/i;
const KOREAN_DATE_START_RE = /(20\d{2})\s*년\s*(\d{1,2})\s*월\s*(\d{1,2})/i;
const KOREAN_DATE_END_FULL_RE = /(20\d{2})\s*년\s*(\d{1,2})\s*월\s*(\d{1,2})/i;
const KOREAN_DATE_END_PARTIAL_RE = /(\d{1,2})\s*월\s*(\d{1,2})/i;
const KOREAN_RANGE_SEP_RE = /\s*[~–-]\s*/;
const DATE_UNTIL_RE = /(?:~|까지)\s*(20\d{2})[-.](\d{1,2})[-.](\d{1,2})\s*까지?/i;

const PERCENT_RE = /(\d{1,2})\s?%/;
const FLAT_RE = /(\d[\d,]{2,})\s?원/;
const INSTALLMENT_RE = /(무이자|할부).{0,10}?(\d{1,2})\s?개월/;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const PROVIDER_CONTEXT_REGEX_CACHE = new Map<string, RegExp>();
function getProviderContextRegex(providerKeyword: string): RegExp {
  const cached = PROVIDER_CONTEXT_REGEX_CACHE.get(providerKeyword);
  if (cached) return cached;

  const escaped = escapeRegExp(providerKeyword);
  const regex = new RegExp(
    `${escaped}.{0,80}?(?:(\\d{1,2})\\s?%|(\\d[\\d,]{2,})\\s?원|무이자|할부|개월)`,
    'gi',
  );
  PROVIDER_CONTEXT_REGEX_CACHE.set(providerKeyword, regex);
  return regex;
}

function extractDateRange(windowText: string): { start?: string; end?: string } {
  // 1) 2025.10.14~2025.10.31 or 2025-10-14 ~ 2025-10-31
  let m = DATE_RANGE_RE.exec(windowText);
  if (m) {
    const y1 = Number(m[1]); const mo1 = Number(m[2]); const d1 = Number(m[3]);
    const y2 = m[4] ? Number(m[4]) : y1; const mo2 = Number(m[5]); const d2 = Number(m[6]);
    return { start: toYmd(y1, mo1, d1), end: toYmd(y2, mo2, d2) };
  }
  // 2) 한국어 날짜 범위: "YYYY년 M월 D일 ~ YYYY년 M월 D일" 또는 "YYYY년 M월 D일 ~ M월 D일"
  const startK = KOREAN_DATE_START_RE.exec(windowText);
  if (startK) {
    const y1 = Number(startK[1]);
    const mo1 = Number(startK[2]);
    const d1 = Number(startK[3]);

    const afterStart = windowText.slice(startK.index + startK[0].length);
    const sep = KOREAN_RANGE_SEP_RE.exec(afterStart);
    if (sep) {
      const tail = afterStart.slice(sep.index + sep[0].length);
      // 2-a) 끝 범위가 연도 포함
      const endFull = KOREAN_DATE_END_FULL_RE.exec(tail);
      if (endFull && endFull.index === 0) {
        const y2 = Number(endFull[1]);
        const mo2 = Number(endFull[2]);
        const d2 = Number(endFull[3]);
        return { start: toYmd(y1, mo1, d1), end: toYmd(y2, mo2, d2) };
      }
      // 2-b) 끝 범위가 월/일만 있음 → 시작 연도 사용
      const endPartial = KOREAN_DATE_END_PARTIAL_RE.exec(tail);
      if (endPartial && endPartial.index === 0) {
        const mo2 = Number(endPartial[1]);
        const d2 = Number(endPartial[2]);
        return { start: toYmd(y1, mo1, d1), end: toYmd(y1, mo2, d2) };
      }
    }
  }
  // 3) ~ 2025.10.31 까지
  m = DATE_UNTIL_RE.exec(windowText);
  if (m) {
    const y2 = Number(m[1]); const mo2 = Number(m[2]); const d2 = Number(m[3]);
    return { end: toYmd(y2, mo2, d2) };
  }
  return {};
}

export function extractOffersFromHtml(htmlOrText: string): ExtractedOffer[] {
  const text = /<\w+/.test(htmlOrText) ? strip(htmlOrText) : htmlOrText; // html이면 태그 제거

  // 카드사/페이 키워드 근처에서 % 또는 금액(원)을 찾는다
  const providers = [
    '국민', 'KB', 'KB국민', '신한', '삼성', '현대', '롯데', '우리', '농협', 'NH', '하나', 'BC', '비씨',
    '카카오페이', 'KakaoPay', '네이버페이', 'NaverPay'
  ];

  const candidates: ExtractedOffer[] = [];

  for (const p of providers) {
    // 컨텍스트 범위(양옆 80자 내)에서 % 또는 숫자+원 찾기, 혹은 무이자/할부 문구 탐지
    const regex = getProviderContextRegex(p);
    // 캐시된 /g 정규식은 호출 간 lastIndex가 남을 수 있어 매번 초기화
    regex.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(text))) {
      const windowStart = Math.max(0, m.index - 80);
      const windowEnd = Math.min(text.length, m.index + 160);
      const win = text.slice(windowStart, windowEnd);

      const percentMatch = PERCENT_RE.exec(win);
      const flatMatch = FLAT_RE.exec(win);
      const installmentMatch = INSTALLMENT_RE.exec(win);

      const { start, end } = extractDateRange(win);
      const provider_name = normalizeProviderName(p);

      if (percentMatch) {
        const percent = Number(percentMatch[1]);
        candidates.push({
          provider_name,
          discount_type: 'PERCENT',
          discount_value: percent,
          title: `${provider_name} ${percent}% 할인`,
          start_date: start,
          end_date: end,
          raw_snippet: win.trim(),
          benefit_kind: 'DISCOUNT',
        });
      } else if (flatMatch) {
        const flat = Number(flatMatch[1].replaceAll(',', ''));
        candidates.push({
          provider_name,
          discount_type: 'FLAT',
          discount_value: flat,
          title: `${provider_name} ${flat}원 할인`,
          start_date: start,
          end_date: end,
          raw_snippet: win.trim(),
          benefit_kind: 'DISCOUNT',
        });
      } else if (installmentMatch) {
        // 무이자/할부는 금액 절감으로 직접 환산하기 어려우므로 0원 할인으로 표기, kind로 구분
        candidates.push({
          provider_name,
          discount_type: 'FLAT',
          discount_value: 0,
          title: `${provider_name} ${installmentMatch[2]}개월 ${installmentMatch[1]}`,
          start_date: start,
          end_date: end,
          raw_snippet: win.trim(),
          benefit_kind: 'INSTALLMENT',
        });
      }
    }
  }

  // 중복 제거(동일 provider+type+value+날짜)
  const uniq = new Map<string, ExtractedOffer>();
  for (const c of candidates) {
    const key = `${c.provider_name}|${c.discount_type}|${c.discount_value}|${c.start_date ?? ''}|${c.end_date ?? ''}|${c.benefit_kind ?? ''}`;
    if (!uniq.has(key)) uniq.set(key, c);
  }
  return [...uniq.values()];
}
