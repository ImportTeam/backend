import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum BillingKeyMethod {
  CARD = 'CARD',
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  PAYPAL = 'PAYPAL',
}

export class IssueBillingKeyDto {
  @ApiProperty({ description: '채널 키 (선택)', required: false })
  @IsString()
  @IsOptional()
  channelKey?: string;

  @ApiProperty({ description: '빌링키 발급 방식', enum: BillingKeyMethod, example: BillingKeyMethod.CARD })
  @IsEnum(BillingKeyMethod)
  billingKeyMethod: BillingKeyMethod;

  @ApiProperty({ description: '가맹점 스토어 ID (선택)', required: false })
  @IsString()
  @IsOptional()
  storeId?: string;

  @ApiProperty({ description: '커스텀 데이터 (선택)', required: false })
  @IsString()
  @IsOptional()
  customData?: string;
}

export class BillingPageDto {
  @ApiProperty({ description: '페이지 크기', example: 20 })
  size: number;
  @ApiProperty({ description: '오프셋', example: 0 })
  offset: number;
}

export class BillingSortDto {
  @ApiProperty({ description: '정렬 필드', example: 'createdAt' })
  field: string;
  @ApiProperty({ description: '정렬 순서', enum: ['ASC', 'DESC'], example: 'DESC' })
  order: 'ASC' | 'DESC';
}

export class ListBillingKeysDto {
  @IsOptional()
  @ApiProperty({ description: '페이지 정보', required: false })
  page?: BillingPageDto;

  @IsOptional()
  @ApiProperty({ description: '정렬 정보', required: false })
  sort?: BillingSortDto;

  @IsOptional()
  @ApiProperty({ description: '필터 조건 객체', required: false, example: { isDefault: true } })
  filter?: any;
}

export class GetBillingKeyDto {
  @ApiProperty({ description: '가맹점 스토어 ID (선택)', required: false })
  @IsString()
  @IsOptional()
  storeId?: string;
}
