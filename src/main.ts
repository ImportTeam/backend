import 'reflect-metadata';
import './common/bigint-serializer';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { CustomLoggerService } from './common/logger/logger.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import type { NextFunction, Request, Response } from 'express';
import { spawnSync } from 'child_process';
import { join } from 'path';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldAutoSeedOnStartup(): boolean {
  if ((process.env.AUTO_DB_SEED ?? '').trim().toLowerCase() === 'false') {
    return false;
  }
  if ((process.env.NODE_ENV ?? '').trim().toLowerCase() === 'production') {
    return false;
  }
  // 개발/테스트 환경에서만 시드
  const env = (process.env.NODE_ENV ?? '').trim().toLowerCase();
  const isDevLike = env === 'development' || env === 'test' || env === '';
  if (!isDevLike) return false;
  // DB가 없으면 스킵
  if (!process.env.DATABASE_URL) return false;
  return true;
}

async function runSeedOnStartupIfEnabled(): Promise<void> {
  if (!shouldAutoSeedOnStartup()) return;

  const seedPath = join(process.cwd(), 'prisma', 'seed.ts');
  console.log(`[Bootstrap] AUTO_DB_SEED enabled. Running seed: ${seedPath}`);

  const requireDbSeed = (process.env.REQUIRE_DB_SEED ?? '')
    .trim()
    .toLowerCase()
    .startsWith('t');

  const maxAttempts = Number(process.env.AUTO_DB_SEED_RETRIES ?? 5);
  const retryDelayMs = Number(process.env.AUTO_DB_SEED_RETRY_DELAY_MS ?? 1500);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    // nest start:dev / ts-node 환경에서 동작하도록 ts-node/register 사용
    const result = spawnSync(
      process.execPath,
      ['-r', 'ts-node/register', seedPath],
      {
        cwd: process.cwd(),
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: process.env.NODE_ENV || 'test' },
      },
    );

    if (result.status === 0) {
      return;
    }

    const isLast = attempt === maxAttempts;
    if (isLast) {
      if (requireDbSeed) {
        throw new Error(
          `DB seed failed on startup (exit code: ${result.status})`,
        );
      }
      console.warn(
        `[Bootstrap] DB seed failed on startup (exit code: ${result.status}). ` +
          `Continuing without seed. (Set REQUIRE_DB_SEED=true to fail hard)`,
      );
      return;
    }

    console.warn(
      `[Bootstrap] DB seed failed (attempt ${attempt}/${maxAttempts}). Retrying in ${retryDelayMs}ms...`,
    );
    await sleep(retryDelayMs);
  }
}

function normalizeCorsOrigin(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    return new URL(trimmed).origin;
  } catch {
    return null;
  }
}

function getAllowedCorsOrigins(): string[] {
  const raw = process.env.CORS_ORIGINS ?? process.env.FRONTEND_URL;
  const defaults = [
    'https://picsel.kr',
    'https://www.picsel.kr',
    'https://picsel.kro.kr',
    'https://13.125.151.228',
    'http://13.125.151.228',
  ];

  if (!raw) return defaults;

  const parsed = raw
    .split(',')
    .map((item) => normalizeCorsOrigin(item))
    .filter((item): item is string => Boolean(item));

  return parsed.length > 0 ? Array.from(new Set(parsed)) : defaults;
}

function isAllowedCorsOrigin(
  origin: string,
  allowedCorsOriginSet: Set<string>,
  options: {
    allowLocalhost: boolean;
    allowPicselSubdomains: boolean;
  },
): boolean {
  try {
    const url = new URL(origin);
    const normalizedOrigin = url.origin;
    if (allowedCorsOriginSet.has(normalizedOrigin)) return true;

    const hostname = url.hostname.toLowerCase();

    if (
      options.allowPicselSubdomains &&
      (hostname === 'picsel.kr' || hostname.endsWith('.picsel.kr'))
    ) {
      return true;
    }

    if (
      options.allowLocalhost &&
      (hostname === 'localhost' || hostname === '127.0.0.1')
    ) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

async function bootstrap(): Promise<void> {
  try {
    console.log('[Bootstrap] Starting NestJS application...');

    await runSeedOnStartupIfEnabled();

    const isDevelopment = process.env.NODE_ENV === 'development';

    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: isDevelopment
        ? ['error', 'warn', 'log', 'debug', 'verbose']
        : ['error', 'warn', 'log'],
    });

    console.log('[Bootstrap] AppModule created');

    // Prevent cross-origin isolation headers from blocking external resources (e.g., vercel.live scripts)
    // in deployed environments.
    app.use((_req: Request, res: Response, next: NextFunction) => {
      res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
      res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      next();
    });

    const logger: CustomLoggerService = new CustomLoggerService();
    app.useLogger(logger);

    const winstonLogLevel = process.env.LOG_LEVEL || 'info';
    const shouldLogIncomingRequests = ['debug', 'verbose', 'silly'].includes(
      winstonLogLevel,
    );
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.url.startsWith('/swagger')) {
        res.setHeader(
          'Cache-Control',
          'no-store, no-cache, must-revalidate, proxy-revalidate',
        );
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
      next();
    });

    app.use((req: Request, _res: Response, next: NextFunction) => {
      if (shouldLogIncomingRequests) {
        logger.debug(
          `[Incoming Request] ${req.method} originalUrl=${req.originalUrl} url=${req.url}`,
        );
      }
      next();
    });

    console.log('[Bootstrap] Logger initialized');

    console.log(
      `[Bootstrap] NODE_ENV: ${process.env.NODE_ENV}, isDevelopment: ${isDevelopment}`,
    );

    const allowedCorsOrigins = getAllowedCorsOrigins();
    const allowedCorsOriginSet = new Set(allowedCorsOrigins);
    const allowLocalhostCors = (process.env.CORS_ALLOW_LOCALHOST ?? 'false')
      .trim()
      .toLowerCase()
      .startsWith('t');
    const allowPicselSubdomainsValue =
      process.env.CORS_ALLOW_PICSEL_SUBDOMAINS ?? 'true';
    const allowPicselSubdomains = !allowPicselSubdomainsValue
      .trim()
      .toLowerCase()
      .startsWith('f');
    app.enableCors({
      origin: isDevelopment
        ? true
        : (origin, callback) => {
            if (!origin) return callback(null, true);
            return callback(
              null,
              isAllowedCorsOrigin(origin, allowedCorsOriginSet, {
                allowLocalhost: allowLocalhostCors,
                allowPicselSubdomains,
              }),
            );
          },
      credentials: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
      ],
    });
    app.setGlobalPrefix('api');

    console.log('[Bootstrap] Applying Global Pipes...');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );

    console.log('[Bootstrap] Setting up Swagger...');
    const config = new DocumentBuilder()
      .setTitle('PicSel API')
      .setDescription(
        'PicSel 결제 추천 백엔드 API (NestJS + Prisma)\n\n인증: Bearer 토큰을 Authorization 헤더에 포함해 사용합니다.\n예: `Authorization: Bearer <JWT>`',
      )
      .setVersion('1.0.0')
      .addServer('https://api.picsel.kr')
      .addBearerAuth()
      .addTag('시스템', '기본 헬스체크 및 루트 엔드포인트')
      .addTag('인증', '이메일/비밀번호 로그인, 토큰 재발급 및 로그아웃')
      .addTag('사용자 관리', '사용자 탈퇴 등 계정 라이프사이클 관리')
      .addTag(
        '본인 인증',
        'PASS/Certified 본인인증 요청/검증/상태/이력 조회 전반',
      )
      .addTag('결제수단', '결제수단 등록/조회/수정/삭제 및 주 결제수단 설정')
      .addTag('빌링키', '정기 결제를 위한 빌링키 발급/조회/삭제/기본 설정')
      .addTag('결제 내역', '결제 내역 기록 및 적용 혜택/통계 정보 제공')
      .addTag('혜택', '혜택 비교/추출/추천 관련 API')
      .addTag('대시보드', '절약 금액, Top 가맹점/결제수단 등 요약 통계 조회')
      .addTag('소비분석', '카테고리/월간/상세내역 기반 소비 분석 리포트 API')
      .addTag('테스트', '내부 테스트 및 실험용 API')
      .addTag(
        '디버그',
        '개발/운영 편의를 위한 관리자·디버그용 API (일부 비공개)',
      )
      .build();
    const doc = SwaggerModule.createDocument(app, config, {
      deepScanRoutes: true,
    });
    SwaggerModule.setup('swagger', app, doc);

    const port = process.env.PORT || 3000;
    console.log(`[Bootstrap] Starting server on port ${port}...`);

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
