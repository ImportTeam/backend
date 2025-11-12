/* eslint-disable unicorn/prefer-top-level-await */
import 'reflect-metadata';
import './common/bigint-serializer'; // BigInt to JSON
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { CustomLoggerService } from './common/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false, // NestJS 기본 로거 비활성화
  });

  // 커스텀 로거 설정
  const logger = new CustomLoggerService();
  app.useLogger(logger);

  // CORS 설정 (NODE_ENV에 따라 다르게)
  const isDevelopment = process.env.NODE_ENV === 'development';
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

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('PicSel API')
    .setDescription('Payment Recommendation Backend API (Nest.js + Prisma + PostgreSQL/Neon)')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Auth', '일반 로그인 및 회원가입')
    .addTag('Social Login', '소셜 로그인 (Google, Kakao)')
    .addTag('Debug', '개발 및 디버그용 API')
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, doc);

  const port = process.env.PORT || 3000;
  console.log(`Launching NestJS app on port ${port}, URL: http://0.0.0.0:${port}`);

  // 모든 호스트에서 접근 가능
  await app.listen(port, '0.0.0.0');
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
