import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserSettingsDto } from './user-settings.dto';

export class CurrentUserResponseDto {
  @ApiProperty({ example: '1', description: '사용자 seq(BigInt -> string)' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  uuid: string;

  @ApiPropertyOptional({ example: 'user@example.com' })
  email?: string | null;

  @ApiProperty({ example: '홍길동' })
  name: string;

  @ApiProperty({ example: 'NONE' })
  socialProvider: string;

  @ApiProperty({ example: false })
  isVerified: boolean;

  @ApiPropertyOptional({ example: '2025-12-03T12:34:56.789Z' })
  verifiedAt?: string | null;

  @ApiProperty({ example: '2025-12-03T12:34:56.789Z' })
  createdAt: string;

  @ApiProperty({ type: UserSettingsDto, nullable: true })
  settings: UserSettingsDto | null;
}
