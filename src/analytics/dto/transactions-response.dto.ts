import { ApiProperty } from '@nestjs/swagger';

export class AnalyticsTransactionItemDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: '거래 ID' })
  id: string;

  @ApiProperty({ example: '쿠팡', description: '거래처/쇼핑몰' })
  merchantName: string;

  @ApiProperty({ example: '쇼핑', description: '카테고리(서버 분류, 한국어 라벨)' })
  category: string;

  @ApiProperty({ example: '2025-12-10T11:22:33.000Z', description: '거래 날짜(ISO 문자열)' })
  transactionAt: string;

  @ApiProperty({ example: 32000, description: '거래 소비액(원)' })
  spendAmount: number;

  @ApiProperty({ example: 30500, description: '실 결제 금액(원) = 소비액 - 할인/적립' })
  paidAmount: number;

  @ApiProperty({ example: 1500, description: '할인/적립 금액(원)' })
  discountOrRewardAmount: number;

  @ApiProperty({ example: 1, description: '결제수단 ID(없을 수 있음)' })
  paymentMethodId: number | null;

  @ApiProperty({ example: '내 신용카드(1111)', description: '결제수단 표시명' })
  paymentMethodName: string | null;
}

export class AnalyticsTransactionsResponseDto {
  @ApiProperty({ type: [AnalyticsTransactionItemDto], description: '거래 상세 목록' })
  data: AnalyticsTransactionItemDto[];

  @ApiProperty({
    description: '페이징 정보',
    example: {
      page: 1,
      size: 20,
      totalCount: 123,
      hasNext: true,
    },
  })
  pagination: {
    page: number;
    size: number;
    totalCount: number;
    hasNext: boolean;
  };
}
