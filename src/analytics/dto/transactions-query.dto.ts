import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsDateString, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

function toStringArray(value: any): string[] | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return undefined;
}

function toNumberArray(value: any): number[] | undefined {
  const arr = toStringArray(value);
  if (!arr) return undefined;
  return arr
    .map((v) => Number(v))
    .filter((n) => Number.isFinite(n));
}

export class AnalyticsTransactionsQueryDto {
  @ApiPropertyOptional({
    example: '2025-07-01T00:00:00.000Z',
    description: '조회 시작일(ISO 문자열). 미지정 시 최근 6개월 시작으로 처리됩니다.',
  })
  @IsOptional()
  @IsDateString({}, { message: 'from은 ISO 날짜 문자열이어야 합니다.' })
  from?: string;

  @ApiPropertyOptional({
    example: '2025-12-31T23:59:59.999Z',
    description: '조회 종료일(ISO 문자열). 미지정 시 현재 시각으로 처리됩니다.',
  })
  @IsOptional()
  @IsDateString({}, { message: 'to는 ISO 날짜 문자열이어야 합니다.' })
  to?: string;

  @ApiPropertyOptional({
    example: '쇼핑,생활',
    description: '카테고리 필터(복수). 쉼표로 구분하거나 배열로 전달할 수 있습니다.',
  })
  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  @IsArray({ message: 'categories는 배열 형태여야 합니다.' })
  @IsString({ each: true, message: 'categories의 각 값은 문자열이어야 합니다.' })
  categories?: string[];

  @ApiPropertyOptional({
    example: '쿠팡,GS편의점',
    description: '쇼핑몰/거래처 필터(복수). 쉼표로 구분하거나 배열로 전달할 수 있습니다.',
  })
  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  @IsArray({ message: 'merchants는 배열 형태여야 합니다.' })
  @IsString({ each: true, message: 'merchants의 각 값은 문자열이어야 합니다.' })
  merchants?: string[];

  @ApiPropertyOptional({
    example: '1,2',
    description: '결제수단 ID 필터(복수). 쉼표로 구분하거나 배열로 전달할 수 있습니다.',
  })
  @IsOptional()
  @Transform(({ value }) => toNumberArray(value))
  @IsArray({ message: 'paymentMethodIds는 배열 형태여야 합니다.' })
  paymentMethodIds?: number[];

  @ApiPropertyOptional({ example: 1000, description: '최소 금액(원)' })
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  minAmount?: number;

  @ApiPropertyOptional({ example: 500000, description: '최대 금액(원)' })
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  maxAmount?: number;

  @ApiPropertyOptional({ example: 1, description: '페이지 번호(1부터 시작)' })
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  @IsInt({ message: 'page는 정수여야 합니다.' })
  @Min(1, { message: 'page는 1 이상이어야 합니다.' })
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, description: '페이지 크기(최대 50)' })
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  @IsInt({ message: 'size는 정수여야 합니다.' })
  @Min(1, { message: 'size는 1 이상이어야 합니다.' })
  @Max(50, { message: 'size는 최대 50까지 가능합니다.' })
  size?: number = 20;
}
