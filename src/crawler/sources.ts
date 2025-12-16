export type CrawlerSource = { provider: string; url: string };

export const DEFAULT_SOURCES: CrawlerSource[] = [
  { provider: 'KAKAOPAY', url: 'https://www.kakaopay.com' },
  { provider: 'NAVERPAY', url: 'https://pay.naver.com' },
  { provider: 'SHINHAN', url: 'https://www.shinhancard.com' },
  { provider: 'SAMSUNG', url: 'https://www.samsungcard.com' },
];
