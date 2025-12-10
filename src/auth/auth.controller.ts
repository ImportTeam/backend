import { Controller, Post, Get, Req, UseGuards, Body, Param, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiExtraModels, ApiExcludeEndpoint } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { 
  LoginResponseDto, 
  ErrorResponseDto,
  UnauthorizedErrorDto 
} from '../common/dto/swagger-responses.dto';

@ApiTags('인증')
@ApiExtraModels(ErrorResponseDto, UnauthorizedErrorDto, LoginResponseDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('refresh')
  @ApiOperation({ summary: '리프레시 토큰으로 액세스 토큰 재발급' })
  @ApiBody({ schema: { properties: { refresh_token: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: '토큰 재발급 성공' })
  async refresh(@Body() body: { refresh_token: string }) {
    return this.authService.refreshTokens(body.refresh_token);
  }

  @Post('logout')
  @ApiOperation({ summary: '로그아웃 (세션 무효화)' })
  @ApiBody({ schema: { properties: { refresh_token: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  async logout(@Body() body: { refresh_token?: string }) {
    return this.authService.logout(body.refresh_token || '');
  }

  @Get(':provider')
  @ApiParam({ name: 'provider', required: true, description: '소셜 로그인 제공자', schema: { type: 'string', enum: ['google', 'kakao', 'naver'] } })
  @ApiOperation({ summary: '소셜 로그인 시작', description: 'provider: google|kakao|naver — 해당 제공자의 로그인 플로우로 리다이렉트합니다.' })
  async providerLoginRedirectGet(@Param('provider') provider: string, @Res() res: any) {
    const p = (provider || '').toLowerCase();
    if (!['google', 'kakao', 'naver'].includes(p)) {
      return res.status(400).json({ error: 'Invalid provider' });
    }
    return res.redirect(`/api/auth/${p}`);
  }

  @Post(':provider/login')
  @ApiParam({ name: 'provider', required: true, description: '소셜 로그인 제공자', schema: { type: 'string', enum: ['google', 'kakao', 'naver'] } })
  @ApiOperation({ summary: '소셜 로그인 시작(POST)', description: 'POST로 시작해야 하는 클라이언트를 위한 별칭. 해당 제공자의 로그인 플로우로 리다이렉트합니다.' })
  async providerLoginRedirectPost(@Param('provider') provider: string, @Res() res: any) {
    const p = (provider || '').toLowerCase();
    if (!['google', 'kakao', 'naver'].includes(p)) {
      return res.status(400).json({ error: 'Invalid provider' });
    }
    return res.redirect(`/api/auth/${p}`);
  }

  @Get(':provider/callback')
  @ApiParam({ name: 'provider', required: true, description: '소셜 로그인 제공자', schema: { type: 'string', enum: ['google', 'kakao', 'naver'] } })
  @ApiOperation({ summary: '소셜 로그인 콜백', description: 'provider: google|kakao|naver — 콜백을 provider-specific 콜백으로 리다이렉트합니다.' })
  async providerCallbackRedirect(@Param('provider') provider: string, @Res() res: any) {
    const p = (provider || '').toLowerCase();
    if (!['google', 'kakao', 'naver'].includes(p)) {
      return res.status(400).json({ error: 'Invalid provider' });
    }
    return res.redirect(`/api/auth/${p}/callback`);
  }

  @ApiExcludeEndpoint()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ 
    summary: '소셜 로그인 시작 (Google)', 
    description: '사용자가 Google 계정으로 로그인할 때 사용합니다. 프런트엔드는 이 엔드포인트로 이동하여 Google 인증 페이지로 리다이렉트됩니다.' 
  })
  @ApiResponse({ status: 302, description: 'Google 로그인 페이지로 리다이렉트' })
  async googleLogin() {
  }

  @ApiExcludeEndpoint()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ 
    summary: '소셜 로그인 콜백 (Google)', 
    description: 'Google 인증을 완료한 후 호출됩니다. 성공 시 사용자 세션을 생성하고 액세스/리프레시 토큰을 반환합니다. 실패 시 오류를 반환합니다.' 
  })
  @ApiResponse({ status: 200, description: '소셜 로그인 성공, JWT 토큰 반환', type: LoginResponseDto })
  @ApiResponse({ status: 400, description: '로그인 실패', type: ErrorResponseDto })
  async googleCallback(@Req() req: any) {
    return this.authService.socialLogin(req.user);
  }

  // Kakao
  @ApiExcludeEndpoint()
  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({ summary: '소셜 로그인 시작 (Kakao)', description: '카카오 계정으로 로그인 시 사용합니다.' })
  @ApiResponse({ status: 302, description: 'Kakao 로그인 페이지로 리다이렉트' })
  async kakaoLogin() {
    return { redirect: true };
  }

  @ApiExcludeEndpoint()
  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({ summary: '소셜 로그인 콜백 (Kakao)', description: '카카오 인증 완료 후 토큰을 발급하고 세션을 생성합니다.' })
  @ApiResponse({ status: 200, description: '소셜 로그인 성공, JWT 토큰 반환', type: LoginResponseDto })
  @ApiResponse({ status: 400, description: '이메일 정보가 제공되지 않음', type: ErrorResponseDto })
  async kakaoCallback(@Req() req: any) {
    return this.authService.socialLogin(req.user);
  }

  // Naver
  @ApiExcludeEndpoint()
  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  @ApiOperation({ summary: '소셜 로그인 시작 (Naver)', description: '네이버 계정으로 로그인 시 사용합니다.' })
  @ApiResponse({ status: 302, description: 'Naver 로그인 페이지로 리다이렉트' })
  async naverLogin() {
    return { redirect: true };
  }

  @ApiExcludeEndpoint()
  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  @ApiOperation({ summary: '소셜 로그인 콜백 (Naver)', description: '네이버 인증 완료 후 토큰을 발급하고 세션을 생성합니다.' })
  @ApiResponse({ status: 200, description: '소셜 로그인 성공, JWT 토큰 반환', type: LoginResponseDto })
  @ApiResponse({ status: 400, description: '이메일 정보가 제공되지 않음', type: ErrorResponseDto })
  async naverCallback(@Req() req: any) {
    return this.authService.socialLogin(req.user);
  }
  @Post('login')
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  @ApiOperation({ 
    summary: '일반 로그인', 
    description: '사용자가 이메일/비밀번호로 로그인합니다. 성공 시 액세스/리프레시 토큰과 발급 시각(issued_at)을 반환합니다. 인증 필요: 없음.'
  })
  @ApiBody({ 
    type: LoginDto,
    examples: {
      example1: {
        value: {
          email: 'user@example.com',
          password: 'Password123!'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: '로그인 성공, JWT 토큰 반환',
    type: LoginResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: '인증 실패 (이메일 또는 비밀번호 오류)',
    type: ErrorResponseDto 
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  
}
