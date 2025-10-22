import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';

export enum PaymentType {
  CARD = 'CARD',
  PAYPAL = 'PAYPAL',
  APPLEPAY = 'APPLEPAY',
  KAKAOPAY = 'KAKAOPAY',
  NAVERPAY = 'NAVERPAY',
  ETC = 'ETC',
}

export class CreatePaymentMethodDto {
  @ApiProperty({ 
    enum: PaymentType, 
    example: PaymentType.CARD,
    description: '결제 수단 종류'
  })
  @IsEnum(PaymentType)
  type: PaymentType;

  // === 카드 정보 (CARD 타입인 경우 필수) ===
  
  @ApiProperty({ 
    example: '1234567812345678',
    description: '카드 번호 (16자리, 암호화되어 저장됨)',
    required: false
  })
  @IsString()
  @IsOptional()
  @Matches(/^\d{13,19}$/, { message: '카드번호는 13-19자리 숫자여야 합니다' })
  card_number?: string;

  @ApiProperty({ 
    example: '홍길동',
    description: '카드 소유자 이름',
    required: false,
    maxLength: 100
  })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  card_holder_name?: string;

  @ApiProperty({ 
    example: '12',
    description: '카드 만료 월 (01-12)',
    required: false
  })
  @IsString()
  @IsOptional()
  @Matches(/^(0[1-9]|1[0-2])$/, { message: '만료 월은 01-12 형식이어야 합니다' })
  expiry_month?: string;

  @ApiProperty({ 
    example: '2028',
    description: '카드 만료 년도 (YYYY)',
    required: false
  })
  @IsString()
  @IsOptional()
  @Matches(/^\d{4}$/, { message: '만료 년도는 4자리 숫자여야 합니다' })
  expiry_year?: string;

  @ApiProperty({ 
    example: '123',
    description: 'CVV/CVC 코드 (3-4자리, 암호화되어 저장됨)',
    required: false
  })
  @IsString()
  @IsOptional()
  @Matches(/^\d{3,4}$/, { message: 'CVV는 3-4자리 숫자여야 합니다' })
  cvv?: string;

  // === 카드사 정보 ===
  
  @ApiProperty({ 
    example: '신한카드',
    description: '카드사명 또는 간편결제 이름',
    maxLength: 50
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  provider_name: string;

  @ApiProperty({ 
    example: 'VISA',
    description: '카드 브랜드 (자동 감지됨)',
    required: false
  })
  @IsString()
  @IsOptional()
  card_brand?: string;

  // === 청구지 정보 ===
  
  @ApiProperty({ 
    example: '서울시 강남구 테헤란로 123',
    description: '청구지 주소',
    required: false
  })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  billing_address?: string;

  @ApiProperty({ 
    example: '06234',
    description: '청구지 우편번호',
    required: false
  })
  @IsString()
  @IsOptional()
  @Length(1, 20)
  billing_zip?: string;

  // === 부가 정보 ===
  
  @ApiProperty({ 
    example: '주카드',
    description: '사용자 지정 별칭',
    required: false,
    maxLength: 50
  })
  @IsString()
  @IsOptional()
  @Length(1, 50)
  alias?: string;

  @ApiProperty({ 
    example: false,
    description: '주 결제수단 여부',
    required: false,
    default: false
  })
  @IsOptional()
  is_primary?: boolean;
}
