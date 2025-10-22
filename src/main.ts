import 'reflect-metadata';
import './common/bigint-serializer'; // BigInt to JSON
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정 (소셜 로그인을 위해 필요)
  app.enableCors({
    origin: true, // 개발 환경에서는 모든 origin 허용
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('PicSel API')
    .setDescription('Payment Recommendation Backend API (Nest.js + Prisma + MySQL)')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Auth', '일반 로그인 및 회원가입')
    .addTag('Social Login', '소셜 로그인 (Google, Kakao)')
    .addTag('Debug', '개발 및 디버그용 API')
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, doc);

  const prisma = app.get(PrismaService);

  // 개발 모드에서만 seq 정리 자동 실행하고 싶으면:
  if (process.env.NODE_ENV !== 'production') {
    // 지저분하면 AdminService를 DI해서 호출해도 됨
    // 여기서는 간단히 pass (Swagger 버튼으로도 가능)
  }

  await app.listen(3000);
}
bootstrap();
