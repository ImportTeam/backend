import { Global, Module } from '@nestjs/common';
import { AI_RECOMMENDATION_CLIENT, POPBILL_CLIENT } from './external.tokens';
import { PopbillClientStub } from './popbill/popbill.stub';
import { AiRecommendationClientStub } from './ai-recommendation/ai-recommendation.stub';

@Global()
@Module({
  providers: [
    {
      provide: POPBILL_CLIENT,
      useClass: PopbillClientStub,
    },
    {
      provide: AI_RECOMMENDATION_CLIENT,
      useClass: AiRecommendationClientStub,
    },
  ],
  exports: [POPBILL_CLIENT, AI_RECOMMENDATION_CLIENT],
})
export class ExternalModule {}
