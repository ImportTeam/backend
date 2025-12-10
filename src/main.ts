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

    // NOTE: Removed request rewrite middleware. Keep routes consistent
    // so that Swagger and runtime paths both use the `/api` global prefix.

    // 디버그: 모든 들어오는 요청의 원본 URL을 로깅합니다.
    // OAuth 리다이렉트가 어떤 경로로 들어오는지 확인하기 위해 추가함.
    app.use((req: any, _res: any, next: any) => {
      logger.debug && logger.debug(`[Incoming Request] ${req.method} originalUrl=${req.originalUrl} url=${req.url}`);
      next();
    });

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
    // API prefix를 /api 로 통일
    app.setGlobalPrefix('api');

    console.log('[Bootstrap] Applying Global Pipes...');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    console.log('[Bootstrap] Setting up Swagger...');
    const config = new DocumentBuilder()
      .setTitle('PicSel API')
      .setDescription('PicSel 결제 추천 백엔드 API (NestJS + Prisma)\n\n인증: Bearer 토큰을 Authorization 헤더에 포함해 사용합니다.\n예: `Authorization: Bearer <JWT>`')
      .setVersion('1.0.0')
      .addBearerAuth()
      // 도메인 기반 태그 정의 (한글 태그명, 컨트롤러 @ApiTags와 일치)
      .addTag('시스템', '기본 헬스체크 및 루트 엔드포인트')
      .addTag('인증', '이메일/비밀번호 로그인, 토큰 재발급 및 로그아웃')
      .addTag('사용자 관리', '사용자 탈퇴 등 계정 라이프사이클 관리')
      .addTag('본인 인증', 'PASS/Certified 본인인증 요청/검증/상태/이력 조회 전반')
      .addTag('결제수단', '결제수단 등록/조회/수정/삭제 및 주 결제수단 설정')
      .addTag('빌링키', '정기 결제를 위한 빌링키 발급/조회/삭제/기본 설정')
      .addTag('결제 내역', '결제 내역 기록 및 적용 혜택/통계 정보 제공')
      .addTag('혜택', '혜택 비교/추출/추천 관련 API')
      .addTag('대시보드', '절약 금액, Top 가맹점/결제수단 등 요약 통계 조회')
      .addTag('테스트', '내부 테스트 및 실험용 API')
      .addTag('디버그', '개발/운영 편의를 위한 관리자·디버그용 API (일부 비공개)')
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
