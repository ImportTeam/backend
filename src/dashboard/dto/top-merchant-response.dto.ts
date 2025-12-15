import { ApiProperty } from '@nestjs/swagger';

export class TopMerchantResponseDto {
  @ApiProperty({ example: 'THIS_MONTH', description: '집계 범위(THIS_MONTH 또는 LAST_6_MONTHS)' })
  range: 'THIS_MONTH' | 'LAST_6_MONTHS';

  @ApiProperty({ example: 'GS편의점', description: '쇼핑몰 / 가맹점 이름' })
  merchantName: string;

  @ApiProperty({ example: 500000, description: '해당 쇼핑몰에 대한 이번달 총 지출 금액 (원)' })
  totalSpent: number;

  @ApiProperty({ example: '500,000원', description: '총 지출 금액(원화 표시)' })
  totalSpentKrw: string;
}
