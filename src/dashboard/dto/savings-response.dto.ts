import { ApiProperty } from '@nestjs/swagger';

export class SavingsResponseDto {
  @ApiProperty({ example: 12345.67, description: '이번 달 총 절약 금액 (원)' })
  savingsAmount: number;

  @ApiProperty({ example: 12.34, description: '작년 동월 대비 절약률 (%)' })
  savingsRatePercent: number | null;
}
