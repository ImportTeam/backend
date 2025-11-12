import { IsString, IsPhoneNumber, IsEmail, IsEnum, IsOptional } from 'class-validator';

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
  @IsString()
  @IsOptional()
  channelKey?: string;

  @IsString()
  @IsOptional()
  storeId?: string;

  @IsString()
  customerName: string;

  @IsString()
  customerPhone: string;

  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @IsEnum(IdentityVerificationOperator)
  operator: IdentityVerificationOperator;

  @IsEnum(IdentityVerificationMethod)
  method: IdentityVerificationMethod;

  @IsString()
  @IsOptional()
  customData?: string;
}

export class ConfirmIdentityVerificationDto {
  @IsString()
  @IsOptional()
  otp?: string;

  @IsString()
  @IsOptional()
  storeId?: string;
}

export class ResendIdentityVerificationDto {
  @IsString()
  @IsOptional()
  storeId?: string;
}

export class GetIdentityVerificationDto {
  @IsString()
  @IsOptional()
  storeId?: string;
}

export class ListIdentityVerificationsDto {
  @IsOptional()
  page?: {
    size: number;
    offset: number;
  };

  @IsOptional()
  sort?: {
    field: string;
    order: 'ASC' | 'DESC';
  };

  @IsOptional()
  filter?: Record<string, any>;
}
