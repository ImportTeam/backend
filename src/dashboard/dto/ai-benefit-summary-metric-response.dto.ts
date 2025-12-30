import { ApiProperty } from '@nestjs/swagger';
import { AiBenefitSummaryResponseDto } from './ai-benefit-summary-response.dto';

export class AiBenefitSummaryMetricResponseDto {
  @ApiProperty({
    type: AiBenefitSummaryResponseDto,
    description: 'AI 추천 혜택 요약',
  })
  data: AiBenefitSummaryResponseDto;
}
