// 카드사/페이 이름 정규화 유틸

export function normalizeProviderName(raw: string): string {
  const s = raw.trim().toLowerCase();
  const map: Record<string, string> = {
    'kb': 'KB',
    '국민': 'KB',
    '국민카드': 'KB',
    '신한': 'SHINHAN',
    '신한카드': 'SHINHAN',
    '삼성': 'SAMSUNG',
    '삼성카드': 'SAMSUNG',
    '현대': 'HYUNDAI',
    '현대카드': 'HYUNDAI',
    '롯데': 'LOTTE',
    '롯데카드': 'LOTTE',
    '우리': 'WOORI',
    '우리카드': 'WOORI',
    '농협': 'NH',
    'nh': 'NH',
    '농협카드': 'NH',
    '하나': 'HANA',
    '하나카드': 'HANA',
    'bc': 'BC',
    '비씨': 'BC',
    '비씨카드': 'BC',
    'kakaopay': 'KAKAOPAY',
    '카카오페이': 'KAKAOPAY',
    'naverpay': 'NAVERPAY',
    '네이버페이': 'NAVERPAY',
  };
  for (const key of Object.keys(map)) {
    if (s.includes(key)) return map[key];
  }
  return raw.toUpperCase();
}
