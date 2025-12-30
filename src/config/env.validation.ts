import { plainToInstance } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  validateSync,
  IsOptional,
} from 'class-validator';

class EnvironmentVariables {
  @IsNotEmpty()
  @IsString()
  DATABASE_URL: string;

  @IsNotEmpty()
  @IsString()
  JWT_SECRET: string;

  @IsNotEmpty()
  @IsString()
  ENCRYPTION_KEY: string;

  @IsNotEmpty()
  @IsString()
  NODE_ENV: string;

  @IsNotEmpty()
  @IsString()
  GOOGLE_CLIENT_ID: string;

  @IsNotEmpty()
  @IsString()
  GOOGLE_CLIENT_SECRET: string;

  @IsString()
  @IsOptional()
  GOOGLE_REDIRECT_DEV_URI?: string;

  @IsString()
  @IsOptional()
  GOOGLE_REDIRECT_PROD_URI?: string;

  @IsNotEmpty()
  @IsString()
  KAKAO_CLIENT_ID: string;

  @IsNotEmpty()
  @IsString()
  KAKAO_CLIENT_SECRET: string;

  @IsString()
  @IsOptional()
  KAKAO_REDIRECT_DEV_URI?: string;

  @IsString()
  @IsOptional()
  KAKAO_REDIRECT_PROD_URI?: string;

  @IsNotEmpty()
  @IsString()
  NAVER_CLIENT_ID: string;

  @IsNotEmpty()
  @IsString()
  NAVER_CLIENT_SECRET: string;

  @IsString()
  @IsOptional()
  NAVER_REDIRECT_DEV_URI?: string;

  @IsString()
  @IsOptional()
  NAVER_REDIRECT_PROD_URI?: string;

  @IsNotEmpty()
  @IsString()
  GEMINI_API_KEY: string;

  @IsString()
  @IsOptional()
  GEMINI_MODEL?: string;
}

export function validate(config: Record<string, any>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const missingVars = errors
      .map(
        (error) =>
          `${error.property}: ${Object.values(error.constraints || {}).join(', ')}`,
      )
      .join('\n  ');

    throw new Error(
      `❌ Missing or invalid environment variables:\n  ${missingVars}\n\nPlease check your .env file or environment variables.`,
    );
  }

  return validatedConfig;
}
