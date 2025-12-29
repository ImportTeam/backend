import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiExtraModels,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from '../users/dto/login.dto';
import type { Request, Response } from 'express';
import { KakaoAuthGuard } from './guards/kakao-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { NaverAuthGuard } from './guards/naver-auth.guard';
import { decodeOAuthState } from './guards/oauth-state.util';
import {
  ErrorResponseDto,
  LoginResponseDto,
  UnauthorizedErrorDto,
} from '../common/dto/swagger-responses.dto';

function normalizeOrigin(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    return new URL(trimmed).origin;
  } catch {
    return null;
  }
}

function getAllowedRedirectOrigins(): Set<string> {
  const raw =
    process.env.OAUTH_REDIRECT_ORIGINS ??
    process.env.CORS_ORIGINS ??
    process.env.FRONTEND_URL;
  const defaults = [
    'https://picsel.vercel.app',
    'https://picsel.kr',
    'https://www.picsel.kr',
  ];

  const list = raw
    ? raw
        .split(',')
        .map((x) => normalizeOrigin(x))
        .filter((x): x is string => Boolean(x))
    : defaults;

  // 개발 환경에서는 로컬 콜백도 허용
  const env = (process.env.NODE_ENV ?? '').trim().toLowerCase();
  const isProd = env === 'production';
  if (!isProd) {
    list.push('http://localhost:3000', 'http://127.0.0.1:3000');
  }

  return new Set(list);
}

type OAuthRequest = Request & {
  user?: unknown;
  query?: Record<string, unknown>;
};

function buildSafeFrontendCallbackUrl(req: OAuthRequest): string {
  const allowlist = getAllowedRedirectOrigins();

  const queryString = (key: string): string | undefined => {
    const v = req.query?.[key];
    return typeof v === 'string' ? v : undefined;
  };

  // 1) state 우선 (가드가 redirect_uri를 state로 전달)
  const statePayload = decodeOAuthState(queryString('state'));
  const candidate =
    typeof statePayload?.redirectUri === 'string'
      ? statePayload.redirectUri
      : (queryString('redirect_uri') ?? null);

  const fallbackOrigin =
    process.env.FRONTEND_URL?.trim() ||
    process.env.NEXT_PUBLIC_FRONTEND_URL?.trim() ||
    'https://picsel.vercel.app';

  const fallback = new URL('/oauth-callback', fallbackOrigin).toString();
  if (!candidate) return fallback;

  try {
    if (typeof candidate !== 'string') return fallback;
    const url = new URL(candidate);
    // 오픈 리다이렉트 방지: origin allowlist
    if (!allowlist.has(url.origin)) return fallback;
    // 콜백 페이지로만 이동 허용
    if (url.pathname !== '/oauth-callback') return fallback;
    return url.toString();
  } catch {
    return fallback;
  }
}

@ApiTags('인증')
@ApiExtraModels(ErrorResponseDto, UnauthorizedErrorDto, LoginResponseDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  @ApiOperation({
    summary: '일반 회원가입',
    description:
      '이메일/비밀번호/이름으로 회원가입 후, 즉시 액세스/리프레시 토큰을 발급합니다. 인증 필요: 없음.',
  })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      example1: {
        value: {
          email: 'user@example.com',
          password: 'Password123!',
          name: '홍길동',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공, JWT 토큰 반환',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '요청 값 오류',
    type: ErrorResponseDto,
  })
  async register(@Body() dto: CreateUserDto): Promise<unknown> {
    return this.authService.register(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: '리프레시 토큰으로 액세스 토큰 재발급' })
  @ApiBody({ schema: { properties: { refresh_token: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: '토큰 재발급 성공' })
  async refresh(
    @Req() req: Request,
    @Body() body?: { refresh_token?: string; refreshToken?: string },
  ): Promise<unknown> {
    const refreshToken =
      body?.refresh_token ??
      body?.refreshToken ??
      // cookie-parser가 붙어있지 않은 환경에서도 안전하게 동작
      (req as any)?.cookies?.refresh_token ??
      (req as any)?.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token required');
    }

    return this.authService.refreshTokens(refreshToken);
  }

  @Post('logout')
  @ApiOperation({ summary: '로그아웃 (세션 무효화)' })
  @ApiBody({ schema: { properties: { refresh_token: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  async logout(
    @Req() req: Request,
    @Body() body?: { refresh_token?: string; refreshToken?: string },
  ): Promise<unknown> {
    const refreshToken =
      body?.refresh_token ??
      body?.refreshToken ??
      (req as any)?.cookies?.refresh_token ??
      (req as any)?.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token required');
    }

    return this.authService.logout(refreshToken);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: '소셜 로그인 시작 (Google)',
    description:
      '사용자가 Google 계정으로 로그인할 때 사용합니다. 프런트엔드는 이 엔드포인트로 이동하여 Google 인증 페이지로 리다이렉트됩니다.',
  })
  @ApiResponse({
    status: 302,
    description: 'Google 로그인 페이지로 리다이렉트',
  })
  googleLogin(): void {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: '소셜 로그인 콜백 (Google)',
    description:
      'Google 인증을 완료한 후 호출됩니다. 성공 시 사용자 세션을 생성하고 액세스/리프레시 토큰을 반환합니다. 실패 시 오류를 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '소셜 로그인 성공, JWT 토큰 반환',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '로그인 실패',
    type: ErrorResponseDto,
  })
  async googleCallback(
    @Req() req: OAuthRequest,
    @Res() res: Response,
  ): Promise<void> {
    const result = await this.authService.socialLogin(req.user);
    const redirectTo = new URL(buildSafeFrontendCallbackUrl(req));
    redirectTo.searchParams.set('access_token', result.access_token);
    redirectTo.searchParams.set('refresh_token', result.refresh_token);
    redirectTo.searchParams.set('issued_at', result.issued_at);
    res.redirect(302, redirectTo.toString());
  }

  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  @ApiOperation({
    summary: '소셜 로그인 시작 (Kakao)',
    description: '카카오 계정으로 로그인 시 사용합니다.',
  })
  @ApiResponse({ status: 302, description: 'Kakao 로그인 페이지로 리다이렉트' })
  kakaoLogin(): { redirect: true } {
    return { redirect: true };
  }

  @Get('kakao/callback')
  @UseGuards(KakaoAuthGuard)
  @ApiOperation({
    summary: '소셜 로그인 콜백 (Kakao)',
    description: '카카오 인증 완료 후 토큰을 발급하고 세션을 생성합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '소셜 로그인 성공, JWT 토큰 반환',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '이메일 정보가 제공되지 않음',
    type: ErrorResponseDto,
  })
  async kakaoCallback(
    @Req() req: OAuthRequest,
    @Res() res: Response,
  ): Promise<void> {
    const result = await this.authService.socialLogin(req.user);
    const redirectTo = new URL(buildSafeFrontendCallbackUrl(req));
    redirectTo.searchParams.set('access_token', result.access_token);
    redirectTo.searchParams.set('refresh_token', result.refresh_token);
    redirectTo.searchParams.set('issued_at', result.issued_at);
    res.redirect(302, redirectTo.toString());
  }

  @Get('naver')
  @UseGuards(NaverAuthGuard)
  @ApiOperation({
    summary: '소셜 로그인 시작 (Naver)',
    description: '네이버 계정으로 로그인 시 사용합니다.',
  })
  @ApiResponse({ status: 302, description: 'Naver 로그인 페이지로 리다이렉트' })
  naverLogin(): { redirect: true } {
    return { redirect: true };
  }

  @Get('naver/callback')
  @UseGuards(NaverAuthGuard)
  @ApiOperation({
    summary: '소셜 로그인 콜백 (Naver)',
    description: '네이버 인증 완료 후 토큰을 발급하고 세션을 생성합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '소셜 로그인 성공, JWT 토큰 반환',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '이메일 정보가 제공되지 않음',
    type: ErrorResponseDto,
  })
  async naverCallback(
    @Req() req: OAuthRequest,
    @Res() res: Response,
  ): Promise<void> {
    const result = await this.authService.socialLogin(req.user);
    const redirectTo = new URL(buildSafeFrontendCallbackUrl(req));
    redirectTo.searchParams.set('access_token', result.access_token);
    redirectTo.searchParams.set('refresh_token', result.refresh_token);
    redirectTo.searchParams.set('issued_at', result.issued_at);
    res.redirect(302, redirectTo.toString());
  }

  @Post('login')
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  @ApiOperation({
    summary: '일반 로그인',
    description:
      '사용자가 이메일/비밀번호로 로그인합니다. 성공 시 액세스/리프레시 토큰과 발급 시각(issued_at)을 반환합니다. 인증 필요: 없음.',
  })
  @ApiBody({
    type: LoginDto,
    examples: {
      example1: {
        value: {
          email: 'user@example.com',
          password: 'Password123!',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '로그인 성공, JWT 토큰 반환',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패 (이메일 또는 비밀번호 오류)',
    type: ErrorResponseDto,
  })
  async login(@Body() loginDto: LoginDto): Promise<unknown> {
    return this.authService.login(loginDto);
  }
}
