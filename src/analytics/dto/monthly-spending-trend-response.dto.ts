import { ApiProperty } from '@nestjs/swagger';

export class MonthlySpendingTrendItemDto {
  @ApiProperty({ example: '2025-07', description: '월(YYYY-MM)' })
  month: string;

  @ApiProperty({
    example: '2025-07',
    description: '차트 호환 별칭 키(X축 라벨용, =month)',
    required: false,
  })
  name?: string;

  @ApiProperty({ example: 1200000, description: '월별 총 지출 금액(원)' })
  totalSpent: number;

  @ApiProperty({
    example: 1200000,
    description: '차트 호환 별칭 키(=totalSpent)',
    required: false,
  })
  spent?: number;

  @ApiProperty({
    example: 1200000,
    description: '단일 시리즈 차트 호환 별칭 키(=totalSpent)',
    required: false,
  })
  value?: number;
}

export class MonthlySpendingTrendResponseDto {
  @ApiProperty({
    type: [MonthlySpendingTrendItemDto],
    description: '최근 6개월 월간 지출 추이(차트용)',
  })
  data: MonthlySpendingTrendItemDto[];
}
