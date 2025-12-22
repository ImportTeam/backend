import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync, IsOptional } from 'class-validator';

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
  GOOGLE_CLIENT_ID: string;

  @IsNotEmpty()
  @IsString()
  GOOGLE_CLIENT_SECRET: string;

  @IsNotEmpty()
  @IsString()
  GOOGLE_REDIRECT_DEV_URI: string;

  @IsNotEmpty()
  @IsString()
  KAKAO_CLIENT_ID: string;

  @IsNotEmpty()
  @IsString()
  KAKAO_CLIENT_SECRET: string;

  @IsNotEmpty()
  @IsString()
  KAKAO_REDIRECT_DEV_URI: string;

  @IsNotEmpty()
  @IsString()
  NAVER_CLIENT_ID: string;

  @IsNotEmpty()
  @IsString()
  NAVER_CLIENT_SECRET: string;

  @IsNotEmpty()
  @IsString()
  NAVER_REDIRECT_DEV_URI: string;

  GOOGLE_REDIRECT_PROD_URI?: string;
  KAKAO_REDIRECT_PROD_URI?: string;
  NAVER_REDIRECT_PROD_URI?: string;

  @IsNotEmpty()
  @IsString()
  PORTONE_STORE_ID: string;
  PORTONE_API_KEY : string;
  PORTONE_API_SECRET: string;


  @IsNotEmpty()
  @IsString()
  PORTONE_CHANNEL_KEY: string;
  PORTONE_MID_KEY: string;
  @IsString()
  @IsOptional()
  PORTONE_IMP_MERCHANT_ID?: string;

  @IsString()
  @IsOptional()
  PORTONE_PG_PROVIDER?: string;

  @IsNotEmpty()
  @IsString()
  PORTONE_CERTIFIED_API_KEY: string;

  @IsNotEmpty()
  @IsString()
  PORTONE_CERTIFIED_API_SECRET: string;

  @IsNotEmpty()
  @IsString()
  PORTONE_CERTIFIED_CHANEL_KEY: string;

  @IsNotEmpty()
  @IsString()
  NODE_ENV: string;

  @IsString()
  @IsOptional()
  GEMINI_API_KEY?: string;

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
      .map((error) => `${error.property}: ${Object.values(error.constraints || {}).join(', ')}`)
      .join('\n  ');
    
    throw new Error(
      `❌ Missing or invalid environment variables:\n  ${missingVars}\n\nPlease check your .env file or environment variables.`,
    );
  }

  return validatedConfig;
}
