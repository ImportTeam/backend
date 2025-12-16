import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserSessionDto {
  @ApiProperty({ example: '10', description: '세션 seq(BigInt -> string)' })
  id: string;

  @ApiPropertyOptional({ example: 'Chrome on Windows', nullable: true })
  deviceInfo?: string | null;

  @ApiProperty({ example: '2025-12-03T12:34:56.789Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-12-03T13:34:56.789Z' })
  expiresAt: string;
}
