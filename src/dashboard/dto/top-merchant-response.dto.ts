import { ApiProperty } from '@nestjs/swagger';

export class TopMerchantResponseDto {
  @ApiProperty({ example: 'GS편의점', description: '쇼핑몰 / 가맹점 이름' })
  merchantName: string;

  @ApiProperty({ example: 500000, description: '해당 쇼핑몰에 대한 이번달 총 지출 금액 (원)' })
  totalSpent: number;
}
