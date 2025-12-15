import { ApiProperty } from '@nestjs/swagger';

export class MonthlySpendingTrendItemDto {
  @ApiProperty({ example: '2025-07', description: '월(YYYY-MM)' })
  month: string;

  @ApiProperty({ example: 1200000, description: '월별 총 지출 금액(원)' })
  totalSpent: number;
}

export class MonthlySpendingTrendResponseDto {
  @ApiProperty({
    type: [MonthlySpendingTrendItemDto],
    description: '최근 6개월 월간 지출 추이(차트용)',
  })
  data: MonthlySpendingTrendItemDto[];
}
