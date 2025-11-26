/**
 * AUTH 전역 Controller
 * 일반로그인 / 카카오 로그인 / 구글로그인 / 네이버 로그인 지정
 */


import { Controller, Post, Get, Req, UseGuards, Body, Param, Delete, HttpCode } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from '../users/dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { 
  LoginResponseDto, 
  RegisterResponseDto, 
  ErrorResponseDto,
  UnauthorizedErrorDto 
} from '../common/dto/swagger-responses.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @Throttle({ short: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @ApiTags('Auth')
  @ApiOperation({ 
    summary: '일반 로그인', 
    description: '이메일과 비밀번호로 로그인하여 JWT 토큰을 발급받습니다.'
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

  // ---------- Email 전용 라우트 (명세에 맞춘 별칭) ----------
  @Post('email/login')
  @Throttle({ short: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @ApiTags('Auth')
  @ApiOperation({ 
    summary: '이메일 로그인', 
    description: '이메일과 비밀번호로 로그인합니다 (명세 전용 경로)' 
  })
  @ApiBody({ 
    type: LoginDto,
    examples: {
      example1: {
        value: {
          email: 'test@example.com',
          password: 'SecurePassword123!'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: '로그인 성공',
    type: LoginResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: '인증 실패',
    type: ErrorResponseDto 
  })
  async emailLogin(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('email/register')
  @Throttle({ long: { limit: 3, ttl: 300000 } }) // 3 requests per 5 minutes
  @ApiTags('Auth')
  @ApiOperation({ 
    summary: '이메일 회원가입', 
    description: '일반 회원가입 (명세 전용 경로)' 
  })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      example1: {
        value: {
          email: 'newuser@example.com',
          password: 'SecurePassword123!',
          name: '홍길동'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: '회원가입 성공',
    type: RegisterResponseDto 
  })
  @ApiResponse({ 
    status: 409, 
    description: '이미 존재하는 이메일',
    type: ErrorResponseDto 
  })
  async emailRegister(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return { message: 'User registered', user };
  }

  @Post('email/verify/:token')
  @ApiTags('Auth')
  @ApiOperation({ 
    summary: '이메일 인증(2차)', 
    description: '이메일 인증 토큰(JWT) 검증' 
  })
  @ApiParam({
    name: 'token',
    description: '이메일 인증 JWT 토큰',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @ApiResponse({ 
    status: 200, 
    description: '이메일 인증 성공',
    schema: {
      properties: {
        message: { type: 'string', example: '이메일 인증 성공' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: '유효하지 않거나 만료된 토큰',
    type: ErrorResponseDto 
  })
  async verifyEmail(@Param('token') token: string) {
    return this.authService.verifyEmailToken(token);
  }

  @Delete('email/delete/:userId')
  @ApiTags('Auth')
  @ApiOperation({ 
    summary: '이메일 사용자 삭제', 
    description: 'UUID 또는 숫자 ID로 계정을 삭제합니다.' 
  })
  @ApiParam({
    name: 'userId',
    description: '사용자 UUID 또는 시퀀스 ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @ApiResponse({ 
    status: 200, 
    description: '사용자 삭제 성공',
    schema: {
      properties: {
        message: { type: 'string', example: '사용자 삭제 완료' }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: '사용자를 찾을 수 없음',
    type: ErrorResponseDto 
  })
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
  @ApiResponse({ 
    status: 200, 
    description: '소셜 로그인 성공, JWT 토큰 반환',
    type: LoginResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: '로그인 실패',
    type: ErrorResponseDto 
  })
  async googleCallback(@Req() req: any) {
    return this.authService.socialLogin(req.user);
  }

  // 명세에 맞춘 POST 콜백 별칭 (실제 Google은 GET 콜백을 사용)
  @Post('google/login/callback')
  @UseGuards(AuthGuard('google'))
  @ApiTags('Social Login')
  @ApiOperation({ 
    summary: 'Google 로그인 콜백 (POST 별칭)', 
    description: '명세 경로 지원용 별칭' 
  })
  @ApiResponse({ 
    status: 200, 
    description: '로그인 성공',
    type: LoginResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: '로그인 실패',
    type: ErrorResponseDto 
  })
  async googleCallbackPost(@Req() req: any) {
    return this.authService.socialLogin(req.user);
  }

  @Delete('google/delete/:userId')
  @ApiTags('Social Login')
  @ApiOperation({ 
    summary: 'Google 사용자 삭제', 
    description: 'UUID 또는 숫자 ID로 계정을 삭제합니다.' 
  })
  @ApiParam({
    name: 'userId',
    description: '사용자 UUID 또는 시퀀스 ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @ApiResponse({ 
    status: 200, 
    description: '사용자 삭제 성공',
    schema: {
      properties: {
        message: { type: 'string', example: '사용자 삭제 완료' }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: '사용자를 찾을 수 없음',
    type: ErrorResponseDto 
  })
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
  @ApiResponse({ 
    status: 200, 
    description: '소셜 로그인 성공, JWT 토큰 반환',
    type: LoginResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: '이메일 정보가 제공되지 않음',
    type: ErrorResponseDto 
  })
  async kakaoCallback(@Req() req: any) {
    return this.authService.socialLogin(req.user);
  }

  // 명세에 맞춘 POST 콜백 별칭 (실제 Kakao는 GET 콜백을 사용)
  @Post('kakao/login/callback')
  @UseGuards(AuthGuard('kakao'))
  @ApiTags('Social Login')
  @ApiOperation({ 
    summary: 'Kakao 로그인 콜백 (POST 별칭)', 
    description: '명세 경로 지원용 별칭' 
  })
  @ApiResponse({ 
    status: 200, 
    description: '로그인 성공',
    type: LoginResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: '로그인 실패',
    type: ErrorResponseDto 
  })
  async kakaoCallbackPost(@Req() req: any) {
    return this.authService.socialLogin(req.user);
  }

  @Delete('kakao/delete/:userId')
  @ApiTags('Social Login')
  @ApiOperation({ 
    summary: 'Kakao 사용자 삭제', 
    description: 'UUID 또는 숫자 ID로 계정을 삭제합니다.' 
  })
  @ApiParam({
    name: 'userId',
    description: '사용자 UUID 또는 시퀀스 ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @ApiResponse({ 
    status: 200, 
    description: '사용자 삭제 성공',
    schema: {
      properties: {
        message: { type: 'string', example: '사용자 삭제 완료' }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: '사용자를 찾을 수 없음',
    type: ErrorResponseDto 
  })
  @HttpCode(200)
  async deleteKakaoUser(@Param('userId') userId: string) {
    return this.authService.deleteUser(userId);
  }

  // 네이버 로그인 시작
  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  @ApiTags('Social Login')
  @ApiOperation({ 
    summary: 'Naver 소셜 로그인 시작',
    description: 'Naver OAuth 인증 페이지로 리다이렉트합니다.'
  })
  @ApiResponse({ status: 302, description: 'Naver 로그인 페이지로 리다이렉트' })
  async naverLogin() {
    // Guard가 처리(리다이렉트)하므로 실제 바디는 실행되지 않습니다.
    return { redirect: true };
  }

  // 명세에 맞춘 POST 별칭
  @Post('naver/login')
  @UseGuards(AuthGuard('naver'))
  @ApiTags('Social Login')
  @ApiOperation({ summary: 'Naver 로그인 (POST 별칭)', description: '명세 경로 지원용 별칭' })
  async naverLoginPost() {
    // Guard가 처리(리다이렉트)하므로 실제 바디는 실행되지 않습니다.
    return { redirect: true };
  }

  // 네이버 로그인 콜백
  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  @ApiTags('Social Login')
  @ApiOperation({ 
    summary: 'Naver 로그인 콜백',
    description: 'Naver OAuth 인증 후 콜백을 처리하고 JWT 토큰을 발급합니다. 이메일 동의가 필요합니다.'
  })
  @ApiResponse({ 
    status: 200, 
    description: '소셜 로그인 성공, JWT 토큰 반환',
    type: LoginResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: '이메일 정보가 제공되지 않음',
    type: ErrorResponseDto 
  })
  async naverCallback(@Req() req: any) {
    return this.authService.socialLogin(req.user);
  }

  // 명세에 맞춘 POST 콜백 별칭 (실제 Naver는 GET 콜백을 사용)
  @Post('naver/login/callback')
  @UseGuards(AuthGuard('naver'))
  @ApiTags('Social Login')
  @ApiOperation({ 
    summary: 'Naver 로그인 콜백 (POST 별칭)', 
    description: '명세 경로 지원용 별칭' 
  })
  @ApiResponse({ 
    status: 200, 
    description: '로그인 성공',
    type: LoginResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: '로그인 실패',
    type: ErrorResponseDto 
  })
  async naverCallbackPost(@Req() req: any) {
    return this.authService.socialLogin(req.user);
  }

  @Delete('naver/delete/:userId')
  @ApiTags('Social Login')
  @ApiOperation({ 
    summary: 'Naver 사용자 삭제', 
    description: 'UUID 또는 숫자 ID로 계정을 삭제합니다.' 
  })
  @ApiParam({
    name: 'userId',
    description: '사용자 UUID 또는 시퀀스 ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @ApiResponse({ 
    status: 200, 
    description: '사용자 삭제 성공',
    schema: {
      properties: {
        message: { type: 'string', example: '사용자 삭제 완료' }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: '사용자를 찾을 수 없음',
    type: ErrorResponseDto 
  })
  @HttpCode(200)
  async deleteNaverUser(@Param('userId') userId: string) {
    return this.authService.deleteUser(userId);
  }
}
