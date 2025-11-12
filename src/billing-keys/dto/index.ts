import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum BillingKeyMethod {
  CARD = 'CARD',
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  PAYPAL = 'PAYPAL',
}

export class IssueBillingKeyDto {
  @IsString()
  @IsOptional()
  channelKey?: string;

  @IsEnum(BillingKeyMethod)
  billingKeyMethod: BillingKeyMethod;

  @IsString()
  @IsOptional()
  storeId?: string;

  @IsString()
  @IsOptional()
  customData?: string;
}

export class ListBillingKeysDto {
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

export class GetBillingKeyDto {
  @IsString()
  @IsOptional()
  storeId?: string;
}
