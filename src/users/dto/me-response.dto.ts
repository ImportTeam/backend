import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MeResponseDto {
  @ApiProperty({ example: '1', description: '사용자 seq(BigInt -> string)' })
  seq: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  uuid: string;

  @ApiPropertyOptional({ example: 'user@example.com' })
  email?: string | null;

  @ApiProperty({ example: '홍길동' })
  name: string;

  @ApiProperty({ example: 'NONE' })
  social_provider: string;

  @ApiPropertyOptional({ example: null, nullable: true })
  social_id?: string | null;

  @ApiPropertyOptional({ example: '5', description: '기본 결제수단 seq(BigInt -> string)', nullable: true })
  preferred_payment_seq?: string | null;

  @ApiProperty({ example: '2025-01-10T09:30:00.000Z' })
  created_at: string;

  @ApiProperty({ example: '2025-01-13T14:20:00.000Z' })
  updated_at: string;
}
