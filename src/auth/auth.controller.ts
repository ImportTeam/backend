import { Controller, Post, Get, Req, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiTags('Auth')
  @ApiOperation({ 
    summary: '일반 로그인', 
    description: '이메일과 비밀번호로 로그인하여 JWT 토큰을 발급받습니다.'
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: '로그인 성공, JWT 토큰 반환' })
  @ApiResponse({ status: 401, description: '인증 실패 (이메일 또는 비밀번호 오류)' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // 구글 로그인 시작
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiTags('Social Login')
  @ApiOperation({ 
    summary: 'Google 소셜 로그인 시작',
    description: 'Google OAuth 인증 페이지로 리다이렉트합니다.'
  })
  @ApiResponse({ status: 302, description: 'Google 로그인 페이지로 리다이렉트' })
  async googleLogin() {
    // 이 엔드포인트는 단순히 구글 로그인 페이지로 리다이렉트함
  }

  // 구글 로그인 콜백
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiTags('Social Login')
  @ApiOperation({ 
    summary: 'Google 로그인 콜백',
    description: 'Google OAuth 인증 후 콜백을 처리하고 JWT 토큰을 발급합니다.'
  })
  @ApiResponse({ status: 200, description: '소셜 로그인 성공, JWT 토큰 반환' })
  async googleCallback(@Req() req) {
    return this.authService.socialLogin(req.user);
  }

  // 카카오 로그인 시작
  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  @ApiTags('Social Login')
  @ApiOperation({ 
    summary: 'Kakao 소셜 로그인 시작',
    description: 'Kakao OAuth 인증 페이지로 리다이렉트합니다.'
  })
  @ApiResponse({ status: 302, description: 'Kakao 로그인 페이지로 리다이렉트' })
  async kakaoLogin() {}

  // 카카오 로그인 콜백
  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  @ApiTags('Social Login')
  @ApiOperation({ 
    summary: 'Kakao 로그인 콜백',
    description: 'Kakao OAuth 인증 후 콜백을 처리하고 JWT 토큰을 발급합니다. 이메일 동의가 필요합니다.'
  })
  @ApiResponse({ status: 200, description: '소셜 로그인 성공, JWT 토큰 반환' })
  @ApiResponse({ status: 400, description: '이메일 정보가 제공되지 않음' })
  async kakaoCallback(@Req() req) {
    return this.authService.socialLogin(req.user);
  }
}
