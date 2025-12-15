import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class StartCardRegistrationRequestDto {
  @ApiPropertyOptional({
    example: 'https://picsel.example.com/payment-methods/add/result',
    description: 'FE에서 카드 등록 완료 후 이동할 URL(선택). 현재는 더미 처리됩니다.',
  })
  @IsOptional()
  @IsString({ message: 'returnUrl은 문자열이어야 합니다.' })
  @MaxLength(500, { message: 'returnUrl은 최대 500자까지 가능합니다.' })
  returnUrl?: string;
}

export class StartCardRegistrationResponseDto {
  @ApiProperty({
    example: 'popbill_stub_useruuid_1734259200000',
    description: '카드 등록 요청 식별자(추후 Popbill 연동 시 교체)',
  })
  requestId: string;

  @ApiProperty({
    example: 'https://example.com/popbill/card-registration (stub)',
    description: '다음 액션 URL(현재는 더미). FE는 이 URL로 이동하거나 WebView를 띄우는 플로우로 연동합니다.',
  })
  nextActionUrl: string;

  @ApiProperty({ example: '2025-12-15T10:10:10.000Z', description: '요청 만료 시각(ISO 문자열)' })
  expiresAt: string;
}
