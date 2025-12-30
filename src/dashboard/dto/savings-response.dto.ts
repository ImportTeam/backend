import { ApiProperty } from '@nestjs/swagger';

export class SavingsResponseDto {
  @ApiProperty({ example: 12345, description: '이번 달 총 절약 금액 (원)' })
  savingsAmount: number;

  @ApiProperty({
    example: '12,345원',
    description: '이번 달 총 절약 금액(원화 표시)',
  })
  savingsAmountKrw: string;

  @ApiProperty({ example: 9000, description: '전년 동월 절약 금액 (원)' })
  lastYearSameMonthSavingsAmount: number;

  @ApiProperty({
    example: 3345,
    description: '전년 동월 대비 절약 금액 증감(원)',
  })
  savingsDeltaAmount: number;

  @ApiProperty({
    example: '증가',
    description: '전년 동월 대비 증감 안내(증가/감소/동일)',
  })
  savingsDeltaDirection: '증가' | '감소' | '동일';

  @ApiProperty({
    example: '작년 같은 달보다 3,345원 더 절약했어요.',
    description: '전년 동월 대비 안내 문구',
  })
  compareMessage: string;

  @ApiProperty({ example: 12.34, description: '작년 동월 대비 절약률 (%)' })
  savingsRatePercent: number | null;
}
