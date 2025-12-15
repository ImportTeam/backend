import { ApiProperty } from '@nestjs/swagger';

export class CategorySpendingItemDto {
  @ApiProperty({ example: '쇼핑', description: '카테고리 라벨(한국어)' })
  label: string;

  @ApiProperty({ example: 1250000, description: '카테고리 합산 지출 금액(원)' })
  value: number;

  @ApiProperty({ example: 42.5, description: '전체 대비 비율(%)' })
  ratioPercent: number;
}

export class CategorySpendingResponseDto {
  @ApiProperty({ example: '최근 6개월', description: '집계 기간 설명' })
  rangeLabel: string;

  @ApiProperty({ example: 2940000, description: '최근 6개월 총 지출(원)' })
  totalValue: number;

  @ApiProperty({
    type: [CategorySpendingItemDto],
    description: '카테고리별 지출 합산(파이차트용)',
  })
  data: CategorySpendingItemDto[];
}
