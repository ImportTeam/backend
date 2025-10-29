import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { createHash } from 'node:crypto';
import { DEFAULT_SOURCES, CrawlerSource } from './sources';

@Injectable()
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name);

  constructor(private readonly prisma: PrismaService) {}

  // 4 환경변수 또는 기본값에서 불러옵니다.
  private getSources(): CrawlerSource[] {
    const raw = process.env.CRAWLER_SOURCES; // JSON 배열 문자열
    if (raw) {
      const parsed = JSON.parse(raw) as unknown as CrawlerSource[];
      if (Array.isArray(parsed)) return parsed;
      this.logger.warn('CRAWLER_SOURCES 형식이 올바르지 않아 기본값을 사용합니다.');
    }
    return DEFAULT_SOURCES;
  }

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async crawlDaily() {
    this.logger.log('Start crawling promotions...');
    const sources = this.getSources();
    if (sources.length === 0) {
      this.logger.warn('크롤링 대상이 비어 있습니다. CRAWLER_SOURCES를 설정하세요.');
      return;
    }
    for (const s of sources) {
      try {
        const html = await axios
          .get(s.url, {
            timeout: 15000,
            headers: {
              // 일부 사이트가 User-Agent 미설정 요청을 차단하는 경우가 있어 설정
              'User-Agent': 'PicSelBot/1.0 (+https://example.com/bot)'
            },
            // 리다이렉트 따라가기
            maxRedirects: 5,
            validateStatus: (status) => status >= 200 && status < 400,
          })
          .then((r) => String(r.data));
        const title = this.extractTitle(html) ?? '프로모션';
        const hash = this.hash(`${s.provider}|${s.url}|${title}`);
        await this.prisma.benefit_offers.upsert({
          where: { hash },
          update: {
            title,
            description: '자동 수집 항목(요약 필요)',
            source_url: s.url,
            active: true,
          },
          create: {
            provider_name: s.provider,
            title,
            description: '자동 수집 항목(요약 필요)',
            discount_type: 'PERCENT',
            discount_value: 0,
            payment_type: 'ETC',
            source_url: s.url,
            hash,
            active: true,
          },
        });
      } catch (e) {
        this.logger.warn(`Crawl failed: ${s.provider} - ${String(e)}`);
      }
    }
    this.logger.log('Crawling finished');
  }

  private extractTitle(html: string): string | undefined {
    const re = /<title[^>]*>([^<]+)<\/title>/i;
    const m = re.exec(html);
    return m?.[1]?.trim();
  }

  private hash(s: string) {
    return createHash('sha256').update(s).digest('hex');
  }
}
