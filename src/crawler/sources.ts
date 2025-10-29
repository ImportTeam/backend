// 크롤러 수집 대상 기본값
// 실제 프로모션/혜택 페이지 URL로 교체하세요.
// 환경변수 CRAWLER_SOURCES 로 JSON 배열을 전달하면 이 값들을 덮어씁니다.
// 예) [
//   { "provider": "KAKAOPAY", "url": "https://www.kakaopay.com/events" },
//   { "provider": "NAVERPAY", "url": "https://pay.naver.com/event" }
// ]

export type CrawlerSource = { provider: string; url: string };

export const DEFAULT_SOURCES: CrawlerSource[] = [
  { provider: 'KAKAOPAY', url: 'https://www.kakaopay.com' },
  { provider: 'NAVERPAY', url: 'https://pay.naver.com' },
  { provider: 'SHINHAN', url: 'https://www.shinhancard.com' },
  { provider: 'SAMSUNG', url: 'https://www.samsungcard.com' },
];
