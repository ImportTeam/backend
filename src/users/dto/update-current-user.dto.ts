import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserSettingsDto {
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  notificationEnabled?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  darkMode?: boolean;

  @ApiPropertyOptional({ example: 'AUTO' })
  @IsOptional()
  @IsString()
  compareMode?: string;

  @ApiPropertyOptional({ example: 'KRW' })
  @IsOptional()
  @IsString()
  currencyPreference?: string;
}

export class UpdateCurrentUserDto {
  @ApiPropertyOptional({ example: '홍길동' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'newemail@example.com', format: 'email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ type: UpdateUserSettingsDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateUserSettingsDto)
  settings?: UpdateUserSettingsDto;
}
