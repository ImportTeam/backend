import { IsString, IsPhoneNumber, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export enum IdentityVerificationOperator {
  SKT = 'SKT',
  KT = 'KT',
  LG = 'LG',
  MVN = 'MVN',
}

export enum IdentityVerificationMethod {
  SMS = 'SMS',
  APP = 'APP',
}

export class SendIdentityVerificationDto {
  @ApiProperty({ description: '채널 키 (선택)', required: false })
  @IsString()
  @IsOptional()
  channelKey?: string;

  @ApiProperty({ description: '가맹점 스토어 ID (선택)', required: false })
  @IsString()
  @IsOptional()
  storeId?: string;

  @ApiProperty({ description: '사용자 이름', example: '홍길동' })
  @IsString()
  customerName: string;

  @ApiProperty({ description: '사용자 휴대폰 번호', example: '01012345678' })
  @IsString()
  customerPhone: string;

  @ApiProperty({ description: '사용자 이메일 (선택)', example: 'user@example.com', required: false })
  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @ApiProperty({ description: '통신사', enum: IdentityVerificationOperator, example: IdentityVerificationOperator.SKT })
  @IsEnum(IdentityVerificationOperator)
  operator: IdentityVerificationOperator;

  @ApiProperty({ description: '인증 방식', enum: IdentityVerificationMethod, example: IdentityVerificationMethod.SMS })
  @IsEnum(IdentityVerificationMethod)
  method: IdentityVerificationMethod;

  @ApiProperty({ description: '커스텀 데이터 (선택)', required: false })
  @IsString()
  @IsOptional()
  customData?: string;
}

export class ConfirmIdentityVerificationDto {
  @ApiProperty({ description: 'OTP 코드 (선택)', example: '123456', required: false })
  @IsString()
  @IsOptional()
  otp?: string;

  @ApiProperty({ description: '가맹점 스토어 ID (선택)', required: false })
  @IsString()
  @IsOptional()
  storeId?: string;
}

export class ResendIdentityVerificationDto {
  @ApiProperty({ description: '가맹점 스토어 ID (선택)', required: false })
  @IsString()
  @IsOptional()
  storeId?: string;
}

export class GetIdentityVerificationDto {
  @ApiProperty({ description: '가맹점 스토어 ID (선택)', required: false })
  @IsString()
  @IsOptional()
  storeId?: string;
}

export class PageDto {
  @ApiProperty({ description: '페이지 크기', example: 20 })
  size: number;
  @ApiProperty({ description: '오프셋', example: 0 })
  offset: number;
}

export class SortDto {
  @ApiProperty({ description: '정렬 필드', example: 'requestedAt' })
  field: string;
  @ApiProperty({ description: '정렬 순서', example: 'DESC', enum: ['ASC', 'DESC'] })
  order: 'ASC' | 'DESC';
}

export class ListIdentityVerificationsDto {
  @IsOptional()
  @ApiProperty({ description: '페이지 정보', required: false })
  page?: PageDto;

  @IsOptional()
  @ApiProperty({ description: '정렬 정보', required: false })
  sort?: SortDto;

  @IsOptional()
  @ApiProperty({ description: '필터 조건 객체', required: false, example: { status: 'VERIFIED' } })
  filter?: any;
}

/**
 * Pass 인증 (2차 인증) 관련 DTO
 */
export class VerifyPassIdentityDto {
  @ApiProperty({ description: '반환된 본인인증 ID', example: 'iv_1234567890' })
  @IsString()
  returnedIdentityId: string;
}

export class VerifyCertifiedDto {
  @ApiProperty({ description: 'PortOne impUid', example: 'imp_1234567890' })
  @IsString()
  // Accept both `impUid` (camelCase) and `imp_uid` (snake_case) from frontend payloads
  @Transform(({ value, obj }) => value ?? obj?.imp_uid)
  impUid: string;
}

export class PassIdentityVerificationResponseDto {
  @ApiProperty({ description: '본인인증 ID', example: 'iv_1234567890' })
  id: string;
  @ApiProperty({ description: '인증 상태', example: 'VERIFIED' })
  status: string;
  @ApiProperty({ description: '이름', example: '홍길동', required: false })
  name?: string;
  @ApiProperty({ description: '휴대폰 번호', example: '01012345678', required: false })
  phone?: string;
  @ApiProperty({ description: '생년월일', example: '1990-01-01', required: false })
  birthDate?: string;
  @ApiProperty({ description: 'CI', required: false })
  ci?: string;
  @ApiProperty({ description: 'DI', required: false })
  di?: string;
  @ApiProperty({ description: '검증 시각', example: '2025-12-01T12:34:56.000Z' })
  verifiedAt: Date;
  @ApiProperty({ description: '메시지', example: '본인인증이 완료되었습니다' })
  message: string;
}
