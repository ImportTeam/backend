import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { KakaoStrategy } from './strategies/kakao.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({}), // 옵션은 service에서 signAsync 시 주입
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy, KakaoStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
