import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: '사용자 UUID' })
  uuid: string;

  @ApiProperty({ example: 'test@example.com', description: '사용자 이메일' })
  email: string;

  @ApiProperty({ example: '홍길동', description: '사용자 이름' })
  name: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', nullable: true, description: '프로필 이미지' })
  profileImage?: string | null;
}

export class LoginResponseDto {
  @ApiProperty({ example: '로그인 성공' })
  message: string;

  @ApiProperty({
    type: 'object',
    description: '로그인 응답 데이터',
    example: {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      issuedAt: '2025-12-08T11:00:00.000Z',
      user: {
        uuid: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        name: '홍길동',
        profileImage: null,
      },
    },
    properties: {
      accessToken: {
        type: 'string',
        description: 'JWT 액세스 토큰 (Authorization 헤더에 사용)',
      },
      refreshToken: {
        type: 'string',
        description: 'JWT 리프래시 토큰 (장기 토큰)',
      },
      issuedAt: {
        type: 'string',
        description: '토큰 발급 시각 (ISO 8601)',
      },
      user: {
        type: 'object',
        description: '사용자 정보',
        properties: {
          uuid: { type: 'string' },
          email: { type: 'string' },
          name: { type: 'string' },
          profileImage: { type: 'string', nullable: true },
        },
      },
    },
  })
  data: {
    accessToken: string;
    refreshToken?: string;
    issuedAt?: string;
    user: AuthUserDto;
  };
}

export class RegisterResponseDto {
  @ApiProperty({ example: '회원가입 성공' })
  message: string;

  @ApiProperty({
    description: '등록된 사용자 정보',
    type: AuthUserDto,
  })
  data: AuthUserDto;
}

export class PaymentMethodResponseDto {
  @ApiProperty({ example: 1, description: '결제 수단 시퀀스' })
  seq: number;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001', description: '결제 수단 UUID' })
  uuid: string;

  @ApiProperty({ example: '1111', description: '카드 마지막 4자리' })
  last4: string;

  @ApiProperty({ example: 'VISA', enum: ['VISA', 'MASTERCARD', 'AMEX'] })
  cardType: string;

  @ApiProperty({ example: '내 신용카드', description: '사용자 지정 별명' })
  alias: string;

  @ApiProperty({ example: true, description: '기본 결제 수단 여부' })
  isPrimary: boolean;

  @ApiProperty({ example: '2025-11-12T13:59:44.000Z', description: '등록 일시' })
  createdAt: string;
}

export class PaymentMethodsListResponseDto {
  @ApiProperty({ example: '결제 수단 목록 조회 성공' })
  message: string;

  @ApiProperty({
    type: 'array',
    description: '결제 수단 목록',
    example: [
      {
        seq: 1,
        uuid: '550e8400-e29b-41d4-a716-446655440001',
        last4: '1111',
        cardType: 'VISA',
        alias: '내 신용카드',
        isPrimary: true,
        createdAt: '2025-11-12T13:59:44.000Z',
      },
      {
        seq: 2,
        uuid: '550e8400-e29b-41d4-a716-446655440002',
        last4: '2222',
        cardType: 'MASTERCARD',
        alias: '회사 카드',
        isPrimary: false,
        createdAt: '2025-11-11T10:30:00.000Z',
      },
    ],
  })
  data: PaymentMethodResponseDto[];
}

export class BenefitItemDto {
  @ApiProperty({ example: 'PERCENT', enum: ['PERCENT', 'FLAT'], description: '할인 유형' })
  type: string;

  @ApiProperty({ example: 2, description: '할인 값 (PERCENT: %, FLAT: 원)' })
  value: number;

  @ApiProperty({ example: '편의점 2% 할인', description: '할인 설명' })
  description: string;
}

export class CardBenefitDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  cardUuid: string;

  @ApiProperty({ example: 'BC 신용카드' })
  cardName: string;

  @ApiProperty({ example: '1111', description: '카드 마지막 4자리' })
  last4: string;

  @ApiProperty({
    type: [BenefitItemDto],
    description: '적용 가능한 혜택 목록',
  })
  benefits: BenefitItemDto[];

  @ApiProperty({ example: 1000, description: '50,000원 기준 예상 할인액' })
  totalBenefit: number;
}

export class BenefitsCompareResponseDto {
  @ApiProperty({
    type: 'array',
    description: '카드별 혜택 비교 목록',
    example: [
      {
        cardUuid: '550e8400-e29b-41d4-a716-446655440001',
        cardName: 'BC 신용카드',
        last4: '1111',
        benefits: [
          {
            type: 'PERCENT',
            value: 2,
            description: '편의점 2% 할인',
          },
        ],
        totalBenefit: 1000,
      },
      {
        cardUuid: '550e8400-e29b-41d4-a716-446655440002',
        cardName: '신한 카드',
        last4: '2222',
        benefits: [
          {
            type: 'PERCENT',
            value: 1.5,
            description: '편의점 1.5% 할인',
          },
        ],
        totalBenefit: 750,
      },
    ],
  })
  data: CardBenefitDto[];
}

export class PaymentTransactionDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002' })
  id: string;

  @ApiProperty({ example: 'GS편의점', description: '가맹점명' })
  merchantName: string;

  @ApiProperty({ example: '50000', description: '결제 금액' })
  amount: string;

  @ApiProperty({ example: 'KRW' })
  currency: string;

  @ApiProperty({ example: 'COMPLETED', enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'] })
  status: string;

  @ApiProperty({ example: '1000', description: '혜택액' })
  benefitValue: string;

  @ApiProperty({ example: '2% 할인', nullable: true })
  benefitDesc?: string | null;

  @ApiProperty({ example: '2025-11-12T13:59:44.000Z' })
  createdAt: string;
}

export class PaymentRecordResponseDto {
  @ApiProperty({ example: '결제 기록 성공' })
  message: string;

  @ApiProperty({
    type: PaymentTransactionDto,
    description: '기록된 결제 거래',
    example: {
      id: '550e8400-e29b-41d4-a716-446655440002',
      merchantName: 'GS편의점',
      amount: '50000',
      currency: 'KRW',
      status: 'COMPLETED',
      benefitValue: '1000',
      benefitDesc: '2% 할인',
      createdAt: '2025-11-12T13:59:44.000Z',
    },
  })
  data: PaymentTransactionDto;
}

export class ErrorResponseDto {
  @ApiProperty({ example: 400, description: 'HTTP 상태 코드' })
  statusCode: number;

  @ApiProperty({ example: '이메일이 이미 존재합니다', description: '에러 메시지(호환용)' })
  message: string;

  @ApiProperty({ example: 'ConflictException', description: '에러 타입(호환용)' })
  errorType: string;

  @ApiProperty({
    description: '공통 에러 포맷',
    example: {
      code: 'CONFLICT',
      message: '이메일이 이미 존재합니다',
      details: {
        field: 'email',
      },
    },
  })
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export class UnauthorizedErrorDto {
  @ApiProperty({ example: 401 })
  statusCode: number;

  @ApiProperty({ example: '유효하지 않은 토큰입니다' })
  message: string;

  @ApiProperty({ example: 'UnauthorizedException' })
  error: string;
}
