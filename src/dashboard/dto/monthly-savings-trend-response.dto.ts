import { ApiProperty } from '@nestjs/swagger';

export class MonthlySavingsTrendItemDto {
  @ApiProperty({ example: '2025-07', description: '월(YYYY-MM)' })
  month: string;

  @ApiProperty({ example: 1200000, description: '해당 월 총 지출 금액(원)' })
  totalSpent: number;

  @ApiProperty({ example: 45000, description: '해당 월 적용 혜택(절약) 합계(원)' })
  totalBenefit: number;

  @ApiProperty({ example: 45000, description: '해당 월 절약 금액(원)' })
  savingsAmount: number;
}

export class MonthlySavingsTrendResponseDto {
  @ApiProperty({
    type: [MonthlySavingsTrendItemDto],
    description: '최근 6개월 월간 절약/지출 추이 데이터',
  })
  data: MonthlySavingsTrendItemDto[];
}
