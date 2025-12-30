import { ApiProperty } from '@nestjs/swagger';

export class RecentSiteTransactionItemDto {
  @ApiProperty({ example: '쿠팡', description: '사이트/거래처(가맹점) 이름' })
  merchantName: string;

  @ApiProperty({
    example: '2025-12-10T11:22:33.000Z',
    description: '결제일(ISO 문자열)',
  })
  paidAt: string;

  @ApiProperty({
    example: '내 신용카드(1111)',
    description: '사용한 결제수단 표시명',
  })
  paymentMethodName: string;

  @ApiProperty({ example: 32000, description: '결제 금액(원)' })
  paidAmount: number;

  @ApiProperty({ example: 1500, description: '할인/적립 금액(원)' })
  discountOrRewardAmount: number;
}

export class RecentSiteTransactionsResponseDto {
  @ApiProperty({
    type: [RecentSiteTransactionItemDto],
    description: '최근 결제 내역 목록',
  })
  data: RecentSiteTransactionItemDto[];

  @ApiProperty({
    description: '페이징 정보',
    example: {
      page: 1,
      size: 10,
      totalCount: 57,
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
