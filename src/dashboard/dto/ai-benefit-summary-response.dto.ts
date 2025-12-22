import { ApiProperty } from '@nestjs/swagger';

export class AiBenefitSummaryResponseDto {
  @ApiProperty({
    example: '이번 달에는 생활/쇼핑 영역의 혜택이 큰 카드/페이를 우선 사용해보세요.',
    description: '추천 결과(요약)',
  })
  recommendation: string;

  @ApiProperty({
    example: "최근 6개월 기준 '쇼핑' 지출 비중이 높아 해당 영역 혜택 중심으로 추천합니다.",
    description: '추천 사유(요약)',
  })
  reasonSummary: string;

  @ApiProperty({
    required: false,
    description: '추천 카드/페이 리스트(3~5개)',
    example: [
      { providerName: 'KAKAOPAY', why: '생활/편의점 지출에 적립 효율이 좋아요' },
    ],
  })
  items?: Array<{ providerName: string; why: string }>;
}
