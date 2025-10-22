import { Controller, Post, Get, Req, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '일반 로그인' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // ✅ 구글 로그인 시작
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google 소셜 로그인 시작' })
  async googleLogin() {
    // 이 엔드포인트는 단순히 구글 로그인 페이지로 리다이렉트함
  }

  // ✅ 구글 로그인 콜백
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google 로그인 콜백' })
  async googleCallback(@Req() req) {
    return this.authService.socialLogin(req.user);
  }

  // ✅ 카카오 로그인 시작
  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({ summary: 'Kakao 소셜 로그인 시작' })
  async kakaoLogin() {}

  // ✅ 카카오 로그인 콜백
  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({ summary: 'Kakao 로그인 콜백' })
  async kakaoCallback(@Req() req) {
    return this.authService.socialLogin(req.user);
  }
}
