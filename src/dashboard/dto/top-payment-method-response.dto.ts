import { ApiProperty } from '@nestjs/swagger';

export class TopPaymentMethodResponseDto {
  @ApiProperty({ example: '내 신용카드(1111)', description: '결제수단 식별 명칭 (alias 또는 카드사)' })
  paymentMethodName: string;

  @ApiProperty({ example: 250000, description: '해당 결제수단의 이번달 총 사용 금액 (원)' })
  totalAmount: number;
}
