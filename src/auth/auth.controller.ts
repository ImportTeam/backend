import { Controller, Post, Get, Req, UseGuards, Body, Param, Delete, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from '../users/dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

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

  // ---------- Email 전용 라우트 (명세에 맞춘 별칭) ----------
  @Post('email/login')
  @ApiTags('Auth')
  @ApiOperation({ summary: '이메일 로그인', description: '이메일/비밀번호 로그인 (명세 전용 경로)' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: '로그인 성공' })
  async emailLogin(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('email/register')
  @ApiTags('Auth')
  @ApiOperation({ summary: '이메일 회원가입', description: '일반 회원가입 (명세 전용 경로)' })
  @ApiResponse({ status: 200, description: '회원가입 성공' })
  async emailRegister(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return { message: 'User registered', user };
  }

  @Post('email/verify/:token')
  @ApiTags('Auth')
  @ApiOperation({ summary: '이메일 인증(2차)', description: '이메일 인증 토큰(JWT) 검증' })
  async verifyEmail(@Param('token') token: string) {
    return this.authService.verifyEmailToken(token);
  }

  @Delete('email/delete/:userId')
  @ApiTags('Auth')
  @ApiOperation({ summary: '이메일 사용자 삭제', description: 'UUID 또는 숫자 ID로 계정을 삭제합니다.' })
  async deleteEmailUser(@Param('userId') userId: string) {
    return this.authService.deleteUser(userId);
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

  // 명세에 맞춘 POST 별칭
  @Post('google/login')
  @UseGuards(AuthGuard('google'))
  @ApiTags('Social Login')
  @ApiOperation({ summary: 'Google 로그인 (POST 별칭)', description: '명세 경로 지원용 별칭' })
  async googleLoginPost() {
    // Guard가 처리(리다이렉트)하므로 실제 바디는 실행되지 않습니다.
    return { redirect: true };
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

  // 명세에 맞춘 POST 콜백 별칭 (실제 Google은 GET 콜백을 사용)
  @Post('google/login/callback')
  @UseGuards(AuthGuard('google'))
  @ApiTags('Social Login')
  @ApiOperation({ summary: 'Google 로그인 콜백 (POST 별칭)', description: '명세 경로 지원용 별칭' })
  async googleCallbackPost(@Req() req) {
    return this.authService.socialLogin(req.user);
  }

  @Delete('google/delete/:userId')
  @ApiTags('Social Login')
  @ApiOperation({ summary: 'Google 사용자 삭제', description: 'UUID 또는 숫자 ID로 계정을 삭제합니다.' })
  @HttpCode(200)
  async deleteGoogleUser(@Param('userId') userId: string) {
    return this.authService.deleteUser(userId);
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
  async kakaoLogin() {
    // Guard가 처리(리다이렉트)하므로 실제 바디는 실행되지 않습니다.
    return { redirect: true };
  }

  // 명세에 맞춘 POST 별칭
  @Post('kakao/login')
  @UseGuards(AuthGuard('kakao'))
  @ApiTags('Social Login')
  @ApiOperation({ summary: 'Kakao 로그인 (POST 별칭)', description: '명세 경로 지원용 별칭' })
  async kakaoLoginPost() {
    // Guard가 처리(리다이렉트)하므로 실제 바디는 실행되지 않습니다.
    return { redirect: true };
  }

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

  // 명세에 맞춘 POST 콜백 별칭 (실제 Kakao는 GET 콜백을 사용)
  @Post('kakao/login/callback')
  @UseGuards(AuthGuard('kakao'))
  @ApiTags('Social Login')
  @ApiOperation({ summary: 'Kakao 로그인 콜백 (POST 별칭)', description: '명세 경로 지원용 별칭' })
  async kakaoCallbackPost(@Req() req) {
    return this.authService.socialLogin(req.user);
  }

  @Delete('kakao/delete/:userId')
  @ApiTags('Social Login')
  @ApiOperation({ summary: 'Kakao 사용자 삭제', description: 'UUID 또는 숫자 ID로 계정을 삭제합니다.' })
  @HttpCode(200)
  async deleteKakaoUser(@Param('userId') userId: string) {
    return this.authService.deleteUser(userId);
  }
}
