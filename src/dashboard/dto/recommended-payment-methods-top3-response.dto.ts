import { ApiProperty } from '@nestjs/swagger';

export class RecommendedPaymentMethodItemDto {
  @ApiProperty({ example: 1, description: '결제수단 ID' })
  paymentMethodId: number;

  @ApiProperty({ example: '내 신용카드(1111)', description: '결제수단 표시명' })
  paymentMethodName: string;

  @ApiProperty({
    example: '내 신용카드(1111)',
    description: 'Recharts 등 차트 라이브러리 호환을 위한 별칭 키(X축 라벨용)',
    required: false,
  })
  name?: string;

  @ApiProperty({ example: 92, description: '추천 점수(규칙/더미 기반)' })
  score: number;

  @ApiProperty({
    example: 92,
    description: 'Recharts 등 단일 시리즈 차트 호환 별칭 키(=score)',
    required: false,
  })
  value?: number;

  @ApiProperty({
    example: '최근 6개월 쇼핑 지출이 높고, 해당 카드사의 활성 혜택이 많아 우선 추천합니다.',
    description: '추천 사유(요약)',
  })
  reasonSummary: string;
}

export class RecommendedPaymentMethodsTop3ResponseDto {
  @ApiProperty({ type: [RecommendedPaymentMethodItemDto], description: '추천 결제수단 Top3' })
  data: RecommendedPaymentMethodItemDto[];
}
