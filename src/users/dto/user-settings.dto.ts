import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserSettingsDto {
  @ApiProperty({ example: false })
  darkMode: boolean;

  @ApiProperty({ example: true })
  notificationEnabled: boolean;

  @ApiProperty({ example: 'AUTO' })
  compareMode: string;

  @ApiProperty({ example: 'KRW' })
  currencyPreference: string;

  @ApiPropertyOptional({ example: '2025-12-03T12:34:56.789Z' })
  updatedAt?: string;
}
