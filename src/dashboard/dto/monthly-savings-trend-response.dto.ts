import { ApiProperty } from '@nestjs/swagger';

export class MonthlySavingsTrendItemDto {
  @ApiProperty({ example: '2025-07', description: '월(YYYY-MM)' })
  month: string;

  @ApiProperty({
    example: '2025-07',
    description: 'Recharts 등 차트 라이브러리 호환을 위한 별칭 키(X축 라벨용)',
    required: false,
  })
  name?: string;

  @ApiProperty({ example: 1200000, description: '해당 월 총 지출 금액(원)' })
  totalSpent: number;

  @ApiProperty({
    example: 1200000,
    description: '차트 호환 별칭 키(=totalSpent)',
    required: false,
  })
  spent?: number;

  @ApiProperty({
    example: 45000,
    description: '해당 월 적용 혜택(절약) 합계(원)',
  })
  totalBenefit: number;

  @ApiProperty({
    example: 45000,
    description: '차트 호환 별칭 키(=totalBenefit)',
    required: false,
  })
  benefit?: number;

  @ApiProperty({ example: 45000, description: '해당 월 절약 금액(원)' })
  savingsAmount: number;

  @ApiProperty({
    example: 45000,
    description: '차트 호환 별칭 키(=savingsAmount)',
    required: false,
  })
  saved?: number;

  @ApiProperty({
    example: 45000,
    description: 'Recharts 등 단일 시리즈 차트 호환 별칭 키(=savingsAmount)',
    required: false,
  })
  value?: number;
}

export class MonthlySavingsNarrativeDto {
  @ApiProperty({
    example:
      '최근 6개월 동안 절약액은 전반적으로 완만한 상승세이며, 11월에 가장 크게 증가했습니다.',
    description: '월간 절약 추이에 대한 AI 요약(문장 1~2개 권장)',
  })
  summary: string;

  @ApiProperty({
    example: [
      '10월 대비 11월 절약액이 크게 증가',
      '9월 지출 급증 이후 절약액이 회복',
    ],
    description: '핵심 포인트(짧은 bullet 2~4개 권장)',
    type: [String],
  })
  highlights: string[];
}

export class MonthlySavingsTrendResponseDto {
  @ApiProperty({
    type: [MonthlySavingsTrendItemDto],
    description: '최근 6개월 월간 절약/지출 추이 데이터',
  })
  data: MonthlySavingsTrendItemDto[];

  @ApiProperty({
    type: MonthlySavingsNarrativeDto,
    description: 'Gemini 기반 월간 절약 추이 요약',
  })
  ai: MonthlySavingsNarrativeDto;
}
