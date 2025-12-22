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

  @ApiProperty({ example: 45000, description: '해당 월 적용 혜택(절약) 합계(원)' })
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

export class MonthlySavingsTrendResponseDto {
  @ApiProperty({
    type: [MonthlySavingsTrendItemDto],
    description: '최근 6개월 월간 절약/지출 추이 데이터',
  })
  data: MonthlySavingsTrendItemDto[];

  @ApiProperty({
    required: false,
    description: 'Gemini 기반 절약 추이 요약/인사이트(옵션)',
    example: {
      summary: '최근 2개월 절약률이 개선됐어요.',
      insights: ['쇼핑 비중이 높아 쇼핑 혜택 집중이 유리해요.'],
      months: [{ month: '2025-12', status: 'OK', comment: '혜택 적용이 안정적이에요' }],
    },
  })
  ai?: {
    summary: string;
    insights: string[];
    months: Array<{ month: string; status: 'GOOD' | 'OK' | 'BAD'; comment: string }>;
  };
}
