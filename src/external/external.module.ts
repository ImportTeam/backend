import { Global, Module, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AI_RECOMMENDATION_CLIENT, POPBILL_CLIENT } from './external.tokens';
import { PopbillClientStub } from './popbill/popbill.stub';
import { AiRecommendationGeminiClient } from './ai-recommendation/ai-recommendation.gemini';
import { AiRecommendationClientStub } from './ai-recommendation/ai-recommendation.stub';
import { AiRecommendationClientWithFallback } from './ai-recommendation/ai-recommendation.fallback';

@Global()
@Module({
  providers: [
    {
      provide: POPBILL_CLIENT,
      useClass: PopbillClientStub,
    },
    {
      provide: AI_RECOMMENDATION_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        // GEMINI API key / model are read from environment via ConfigService
        const apiKey = (config.get<string>('GEMINI_API_KEY') ?? '').trim();
        // Gemini 모델 이름 옵션:
        // - gemini-2.5-flash-lite: 가장 저렴한 모델 (권장)
        // - gemini-2.5-flash: 빠른 모델
        // - gemini-flash-latest: 최신 Flash 모델
        const model = (config.get<string>('GEMINI_MODEL') ?? '').trim();

        if (!apiKey) {
          const logger = new Logger('ExternalModule');
          logger.warn(
            'GEMINI_API_KEY is not set. AI recommendation features will use stub implementation.',
          );
          return new AiRecommendationClientStub();
        }

        const geminiClient = new AiRecommendationGeminiClient({
          apiKey,
          model,
        });

        // 429 에러나 서비스 불가 에러 발생 시 자동으로 stub으로 폴백
        return new AiRecommendationClientWithFallback(geminiClient);
      },
    },
  ],
  exports: [POPBILL_CLIENT, AI_RECOMMENDATION_CLIENT],
})
export class ExternalModule {}
