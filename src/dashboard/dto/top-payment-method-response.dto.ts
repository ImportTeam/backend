import { ApiProperty } from '@nestjs/swagger';

export class TopPaymentMethodResponseDto {
  @ApiProperty({ example: 1, description: '결제수단 ID' })
  paymentMethodId: number;

  @ApiProperty({
    example: '내 신용카드(1111)',
    description: '결제수단 식별 명칭 (alias 또는 카드사)',
  })
  paymentMethodName: string;

  @ApiProperty({
    example: 250000,
    description: '해당 결제수단의 이번달 총 사용 금액 (원)',
  })
  thisMonthTotalAmount: number;

  @ApiProperty({
    example: '250,000원',
    description: '이번 달 사용 금액(원화 표시)',
  })
  thisMonthTotalAmountKrw: string;

  @ApiProperty({
    example: 'AMOUNT',
    description: '최다 기준(AMOUNT 또는 COUNT)',
  })
  basis: 'AMOUNT' | 'COUNT';
}
