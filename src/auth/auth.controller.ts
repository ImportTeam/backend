/**
 * AUTH 전역 Controller
 * 일반로그인 / 카카오 로그인 / 구글로그인 / 네이버 로그인 지정
 */


import { Controller, Post, Get, Req, UseGuards, Body, Param, Delete, HttpCode } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiExtraModels } from '@nestjs/swagger';
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

@ApiExtraModels(ErrorResponseDto, UnauthorizedErrorDto, LoginResponseDto, RegisterResponseDto)
@ApiTags('로그인')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @Throttle({ short: { limit: 5, ttl: 60000 } }) // 5 requests per minute
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
}
