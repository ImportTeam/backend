import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AI_RECOMMENDATION_CLIENT, POPBILL_CLIENT } from './external.tokens';
import { PopbillClientStub } from './popbill/popbill.stub';
import { AiRecommendationClientStub } from './ai-recommendation/ai-recommendation.stub';
import { AiRecommendationGeminiClient } from './ai-recommendation/ai-recommendation.gemini';

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
        const apiKey = (config.get<string>('GEMINI_API_KEY') ?? '').trim();
        if (apiKey) {
          return new AiRecommendationGeminiClient({
            apiKey,
            model: config.get<string>('GEMINI_MODEL') ?? undefined,
          });
        }
        return new AiRecommendationClientStub();
      },
    },
  ],
  exports: [POPBILL_CLIENT, AI_RECOMMENDATION_CLIENT],
})
export class ExternalModule {}
