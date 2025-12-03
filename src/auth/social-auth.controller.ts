import { Controller, Get, Post, Req, UseGuards, Delete, Param, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiExtraModels } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginResponseDto, ErrorResponseDto } from '../common/dto/swagger-responses.dto';

@ApiExtraModels(ErrorResponseDto, LoginResponseDto)
@ApiTags('소셜 로그인')
@Controller('auth')
export class SocialAuthController {
  constructor(private readonly authService: AuthService) {}

  // Google
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google 소셜 로그인 시작', description: 'Google OAuth 인증 페이지로 리다이렉트합니다.' })
  @ApiResponse({ status: 302, description: 'Google 로그인 페이지로 리다이렉트' })
  async googleLogin() {
    // 리다이렉트는 Guard에서 처리
  }

  @Post('google/login')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google 로그인 (POST 별칭)', description: '명세 경로 지원용 별칭' })
  async googleLoginPost() {
    return { redirect: true };
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google 로그인 콜백', description: 'Google OAuth 인증 후 콜백을 처리하고 JWT 토큰을 발급합니다.' })
  @ApiResponse({ status: 200, description: '소셜 로그인 성공, JWT 토큰 반환', type: LoginResponseDto })
  @ApiResponse({ status: 400, description: '로그인 실패', type: ErrorResponseDto })
  async googleCallback(@Req() req: any) {
    return this.authService.socialLogin(req.user);
  }

  @Post('google/login/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google 로그인 콜백 (POST 별칭)', description: '명세 경로 지원용 별칭' })
  @ApiResponse({ status: 200, description: '로그인 성공', type: LoginResponseDto })
  @ApiResponse({ status: 400, description: '로그인 실패', type: ErrorResponseDto })
  async googleCallbackPost(@Req() req: any) {
    return this.authService.socialLogin(req.user);
  }

  @Delete('google/delete/:userId')
  @ApiOperation({ summary: 'Google 사용자 삭제', description: 'UUID 또는 숫자 ID로 계정을 삭제합니다.' })
  @ApiResponse({ status: 200, description: '사용자 삭제 성공' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음', type: ErrorResponseDto })
  @HttpCode(200)
  async deleteGoogleUser(@Param('userId') userId: string) {
    return this.authService.deleteUser(userId);
  }

  // Kakao
  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({ summary: 'Kakao 소셜 로그인 시작', description: 'Kakao OAuth 인증 페이지로 리다이렉트합니다.' })
  @ApiResponse({ status: 302, description: 'Kakao 로그인 페이지로 리다이렉트' })
  async kakaoLogin() {
    return { redirect: true };
  }

  @Post('kakao/login')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({ summary: 'Kakao 로그인 (POST 별칭)', description: '명세 경로 지원용 별칭' })
  async kakaoLoginPost() {
    return { redirect: true };
  }

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({ summary: 'Kakao 로그인 콜백', description: 'Kakao OAuth 인증 후 콜백을 처리하고 JWT 토큰을 발급합니다.' })
  @ApiResponse({ status: 200, description: '소셜 로그인 성공, JWT 토큰 반환', type: LoginResponseDto })
  @ApiResponse({ status: 400, description: '이메일 정보가 제공되지 않음', type: ErrorResponseDto })
  async kakaoCallback(@Req() req: any) {
    return this.authService.socialLogin(req.user);
  }

  @Post('kakao/login/callback')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({ summary: 'Kakao 로그인 콜백 (POST 별칭)', description: '명세 경로 지원용 별칭' })
  @ApiResponse({ status: 200, description: '로그인 성공', type: LoginResponseDto })
  @ApiResponse({ status: 400, description: '로그인 실패', type: ErrorResponseDto })
  async kakaoCallbackPost(@Req() req: any) {
    return this.authService.socialLogin(req.user);
  }

  @Delete('kakao/delete/:userId')
  @ApiOperation({ summary: 'Kakao 사용자 삭제', description: 'UUID 또는 숫자 ID로 계정을 삭제합니다.' })
  @ApiResponse({ status: 200, description: '사용자 삭제 성공' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음', type: ErrorResponseDto })
  @HttpCode(200)
  async deleteKakaoUser(@Param('userId') userId: string) {
    return this.authService.deleteUser(userId);
  }

  // Naver
  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  @ApiOperation({ summary: 'Naver 소셜 로그인 시작', description: 'Naver OAuth 인증 페이지로 리다이렉트합니다.' })
  @ApiResponse({ status: 302, description: 'Naver 로그인 페이지로 리다이렉트' })
  async naverLogin() {
    return { redirect: true };
  }

  @Post('naver/login')
  @UseGuards(AuthGuard('naver'))
  @ApiOperation({ summary: 'Naver 로그인 (POST 별칭)', description: '명세 경로 지원용 별칭' })
  async naverLoginPost() {
    return { redirect: true };
  }

  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  @ApiOperation({ summary: 'Naver 로그인 콜백', description: 'Naver OAuth 인증 후 콜백을 처리하고 JWT 토큰을 발급합니다.' })
  @ApiResponse({ status: 200, description: '소셜 로그인 성공, JWT 토큰 반환', type: LoginResponseDto })
  @ApiResponse({ status: 400, description: '이메일 정보가 제공되지 않음', type: ErrorResponseDto })
  async naverCallback(@Req() req: any) {
    return this.authService.socialLogin(req.user);
  }

  @Post('naver/login/callback')
  @UseGuards(AuthGuard('naver'))
  @ApiOperation({ summary: 'Naver 로그인 콜백 (POST 별칭)', description: '명세 경로 지원용 별칭' })
  @ApiResponse({ status: 200, description: '로그인 성공', type: LoginResponseDto })
  @ApiResponse({ status: 400, description: '로그인 실패', type: ErrorResponseDto })
  async naverCallbackPost(@Req() req: any) {
    return this.authService.socialLogin(req.user);
  }

  @Delete('naver/delete/:userId')
  @ApiOperation({ summary: 'Naver 사용자 삭제', description: 'UUID 또는 숫자 ID로 계정을 삭제합니다.' })
  @ApiResponse({ status: 200, description: '사용자 삭제 성공' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음', type: ErrorResponseDto })
  @HttpCode(200)
  async deleteNaverUser(@Param('userId') userId: string) {
    return this.authService.deleteUser(userId);
  }
}
