/* eslint-disable unicicon/prefer-top-level-await */
import 'reflect-metadata';
import './common/bigint-serializer'; // BigInt to JSON
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { CustomLoggerService } from './common/logger/logger.service';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  try {
    console.log('[Bootstrap] Starting NestJS application...');
    
    // Enable Nest's built-in logger for development to get more detailed debug output.
    const isDevelopment = process.env.NODE_ENV === 'development';

    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: isDevelopment ? ['error', 'warn', 'log', 'debug', 'verbose'] : ['error', 'warn', 'log'],
    });

    console.log('[Bootstrap] AppModule created');

    // 커스텀 로거 설정
    const logger = new CustomLoggerService();
    app.useLogger(logger);

    console.log('[Bootstrap] Logger initialized');

    // CORS 설정 (NODE_ENV에 따라 다르게).
    console.log(`[Bootstrap] NODE_ENV: ${process.env.NODE_ENV}, isDevelopment: ${isDevelopment}`);
    
    app.enableCors({
      origin: isDevelopment 
        ? true // 개발 환경: 모든 origin 허용
        : [
            process.env.FRONTEND_URL || 'https://picsel.example.com', // 프로덕션: 특정 도메인만
          ],
      credentials: true,
    });

    // Static Files 서빙 (Public 폴더)
    const staticPath = join(process.cwd(), 'public');
    app.useStaticAssets(staticPath, {
      prefix: '/api/auth/test/public/', // test files
    });

    // API prefix를 /api 로 통일
    app.setGlobalPrefix('api');

    console.log('[Bootstrap] Applying Global Pipes...');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    console.log('[Bootstrap] Setting up Swagger...');
    const config = new DocumentBuilder()
      .setTitle('PicSel API')
      .setDescription('Payment Recommendation Backend API (Nest.js + Prisma + PostgreSQL/Neon)\n\n**인증**: Bearer 토큰을 Authorization 헤더에 포함시켜 사용합니다.\n\n**사용 예시**: `Authorization: Bearer YOUR_JWT_TOKEN`')
      .setVersion('1.0.0')
      .addBearerAuth()
      .addTag('로그인', '일반 로그인 및 회원가입')
      .addTag('소셜 로그인', '소셜 로그인 (Google, Kakao, Naver)')
      .addTag('결제 수단', '결제 수단 관리 (카드 등록/수정/삭제)')
      .addTag('혜택', '결제 혜택 비교 및 추천')
      .addTag('결제', '결제 기록 및 통계')
      .addTag('디버그', '개발 및 디버그용 API')
      .build();
    const doc = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, doc);

    const port = process.env.PORT || 3000;
    console.log(`[Bootstrap] Starting server on port ${port}...`);

    // 모든 호스트에서 접근 가능
    await app.listen(port, '0.0.0.0');
    console.log(`✅ Application is running on port ${port}`);
  } catch (error) {
    console.error('[Bootstrap] Fatal error during initialization:', error);
    if (error instanceof Error) {
      console.error('[Bootstrap] Error message:', error.message);
      console.error('[Bootstrap] Error stack:', error.stack);
    }
    process.exit(1);
  }
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
