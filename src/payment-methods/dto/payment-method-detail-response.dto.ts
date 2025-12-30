import { ApiProperty } from '@nestjs/swagger';

export class PaymentMethodLimitInfoDto {
  @ApiProperty({
    example: 5000000,
    required: false,
    description:
      '카드 한도(원). Popbill에서 제공 가능할 때만 포함될 수 있습니다.',
  })
  limitAmount?: number;

  @ApiProperty({
    example: 3500000,
    required: false,
    description:
      '추정 잔여 한도(원). Popbill 한도 조회가 불가할 때 대체로 제공될 수 있습니다.',
  })
  estimatedRemainingAmount?: number;

  @ApiProperty({
    example: 'Popbill 한도 조회 더미 응답입니다. (paymentMethodSeq=1)',
    required: false,
    description: '한도 정보 산정 근거/안내(한국어)',
  })
  basisMessage?: string;
}

export class PaymentMethodThisMonthUsageDto {
  @ApiProperty({ example: 250000, description: '이번 달 사용 금액(원)' })
  totalAmount: number;

  @ApiProperty({
    example: '250,000원',
    description: '이번 달 사용 금액(원화 표시)',
  })
  totalAmountKrw: string;

  @ApiProperty({ example: 12, description: '이번 달 사용 횟수' })
  count: number;
}

export class PaymentMethodDetailResponseDto {
  @ApiProperty({ example: 1, description: '결제수단 ID' })
  paymentMethodId: number;

  @ApiProperty({
    example: '내 신용카드',
    description: '별칭(없으면 카드사/뒷자리 기반)',
  })
  paymentMethodName: string;

  @ApiProperty({ example: 'CARD', description: '결제수단 타입' })
  type: string;

  @ApiProperty({ example: '신한카드', description: '카드사/제공자명' })
  providerName: string;

  @ApiProperty({ example: '1234', description: '카드번호 뒷자리(표시용)' })
  last4: string;

  @ApiProperty({
    type: PaymentMethodThisMonthUsageDto,
    description: '이번 달 사용 요약',
  })
  thisMonthUsage: PaymentMethodThisMonthUsageDto;

  @ApiProperty({
    type: PaymentMethodLimitInfoDto,
    description: '한도 정보(가능 시 Popbill 기반)',
  })
  limit: PaymentMethodLimitInfoDto;
}
