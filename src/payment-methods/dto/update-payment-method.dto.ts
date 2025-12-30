/**
 * 결제수단 수정 - DTO
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class UpdatePaymentMethodDto {
  @ApiProperty({
    example: '회사카드',
    description: '사용자 지정 별칭',
    required: false,
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @Length(1, 50)
  alias?: string;

  @ApiProperty({
    example: '12',
    description: '카드 만료 월 (01-12)',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Matches(/^(0[1-9]|1[0-2])$/, {
    message: '만료 월은 01-12 형식이어야 합니다',
  })
  expiry_month?: string;

  @ApiProperty({
    example: '2028',
    description: '카드 만료 년도 (YYYY)',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Matches(/^\d{4}$/, { message: '만료 년도는 4자리 숫자여야 합니다' })
  expiry_year?: string;

  @ApiProperty({
    example: '서울시 강남구 테헤란로 123',
    description: '청구지 주소',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  billing_address?: string;

  @ApiProperty({
    example: '06234',
    description: '청구지 우편번호',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(1, 20)
  billing_zip?: string;
}
