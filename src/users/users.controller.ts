import { Body, Controller, Delete, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { 
  ErrorResponseDto,
  UnauthorizedErrorDto,
} from '../common/dto/swagger-responses.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserResponseDto } from './dto/current-user-response.dto';
import { UpdateCurrentUserDto } from './dto/update-current-user.dto';
import { UserSessionDto } from './dto/user-session.dto';
import { MeResponseDto } from './dto/me-response.dto';
import { UpdateMeResponseDto } from './dto/update-me-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('사용자 관리')
@ApiExtraModels(
  ErrorResponseDto,
  UnauthorizedErrorDto,
  CurrentUserResponseDto,
  MeResponseDto,
  UpdateMeResponseDto,
  UserSessionDto,
)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: '현재 사용자 정보 조회', description: '프론트 연동 가이드(/users/me) 호환 엔드포인트입니다.' })
  @ApiResponse({ status: 200, type: MeResponseDto })
  async getMe(@Req() req: any): Promise<MeResponseDto> {
    const user = req.user;
    const row = await this.users.getCurrentUser(BigInt(user.sub));

    return {
      seq: row.seq.toString(),
      uuid: row.uuid,
      email: row.email,
      name: row.name,
      social_provider: row.social_provider,
      social_id: row.social_id,
      preferred_payment_seq: row.preferred_payment_seq
        ? row.preferred_payment_seq.toString()
        : null,
      created_at: row.created_at.toISOString?.() ?? (row.created_at as any),
      updated_at: row.updated_at.toISOString?.() ?? (row.updated_at as any),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자 정보 수정', description: '프론트 연동 가이드(/users/me) 호환. 이름/이메일 및 설정을 수정합니다.' })
  @ApiResponse({ status: 200, type: UpdateMeResponseDto })
  async updateMe(@Req() req: any, @Body() dto: UpdateCurrentUserDto): Promise<UpdateMeResponseDto> {
    const user = req.user;
    const row = await this.users.updateCurrentUser(BigInt(user.sub), dto);

    return {
      message: '사용자 정보가 수정되었습니다.',
      user: {
        seq: row.seq.toString(),
        uuid: row.uuid,
        email: row.email,
        name: row.name,
        updated_at: row.updated_at.toISOString?.() ?? (row.updated_at as any),
      },
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자 계정 삭제', description: '프론트 연동 가이드(/users/me) 호환 엔드포인트입니다.' })
  async deleteMe(@Req() req: any) {
    const user = req.user;
    await this.users.deleteByUserId(user.uuid || String(user.sub));
    return { message: '계정이 삭제되었습니다.' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me/password')
  @ApiBearerAuth()
  @ApiOperation({ summary: '비밀번호 변경', description: '현재 비밀번호 확인 후 새 비밀번호로 변경합니다.' })
  async changeMyPassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    const user = req.user;
    await this.users.changePassword(BigInt(user.sub), dto.currentPassword, dto.newPassword);
    return { message: '비밀번호가 변경되었습니다.' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('current')
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자 탈퇴', description: '현재 로그인한 사용자의 계정을 삭제합니다.' })
  async deleteCurrentUser(@Req() req: any) {
    const user = req.user;
    await this.users.deleteByUserId(user.uuid || String(user.sub));
    return { message: 'User deleted' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('current')
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 정보 조회', description: '현재 로그인한 사용자의 기본 정보/설정을 조회합니다.' })
  @ApiResponse({ status: 200, type: CurrentUserResponseDto })
  async getCurrentUser(@Req() req: any): Promise<CurrentUserResponseDto> {
    const user = req.user;
    const row = await this.users.getCurrentUser(BigInt(user.sub));

    return {
      id: row.seq.toString(),
      uuid: row.uuid,
      email: row.email,
      name: row.name,
      socialProvider: row.social_provider,
      isVerified: row.is_verified,
      verifiedAt: row.verified_at?.toISOString?.() ?? (row.verified_at as any) ?? null,
      createdAt: row.created_at.toISOString?.() ?? (row.created_at as any),
      settings: row.user_settings
        ? {
            darkMode: row.user_settings.dark_mode,
            notificationEnabled: row.user_settings.notification_enabled,
            compareMode: row.user_settings.compare_mode,
            currencyPreference: row.user_settings.currency_preference,
            updatedAt:
              row.user_settings.updated_at?.toISOString?.() ??
              (row.user_settings.updated_at as any),
          }
        : null,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('current')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '내 정보 수정',
    description: '이름 및 사용자 설정(darkMode/notificationEnabled/compareMode/currencyPreference)을 수정합니다.',
  })
  @ApiResponse({ status: 200, type: CurrentUserResponseDto })
  async updateCurrentUser(
    @Req() req: any,
    @Body() dto: UpdateCurrentUserDto,
  ): Promise<CurrentUserResponseDto> {
    const user = req.user;
    const row = await this.users.updateCurrentUser(BigInt(user.sub), dto);

    return {
      id: row.seq.toString(),
      uuid: row.uuid,
      email: row.email,
      name: row.name,
      socialProvider: row.social_provider,
      isVerified: row.is_verified,
      verifiedAt: row.verified_at?.toISOString?.() ?? (row.verified_at as any) ?? null,
      createdAt: row.created_at.toISOString?.() ?? (row.created_at as any),
      settings: row.user_settings
        ? {
            darkMode: row.user_settings.dark_mode,
            notificationEnabled: row.user_settings.notification_enabled,
            compareMode: row.user_settings.compare_mode,
            currencyPreference: row.user_settings.currency_preference,
            updatedAt:
              row.user_settings.updated_at?.toISOString?.() ??
              (row.user_settings.updated_at as any),
          }
        : null,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('sessions')
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 세션 목록', description: '현재 사용자 세션 목록을 조회합니다(토큰은 노출하지 않음).' })
  @ApiResponse({ status: 200, type: UserSessionDto, isArray: true })
  async listSessions(@Req() req: any): Promise<UserSessionDto[]> {
    const user = req.user;
    const rows = await this.users.listSessionsByUserSeq(BigInt(user.sub));
    return rows.map((r) => ({
      id: r.seq.toString(),
      deviceInfo: r.device_info,
      createdAt: r.created_at.toISOString?.() ?? (r.created_at as any),
      expiresAt: r.expires_at.toISOString?.() ?? (r.expires_at as any),
    }));
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('sessions/:seq')
  @ApiBearerAuth()
  @ApiParam({ name: 'seq', required: true, description: '세션 seq' })
  @ApiOperation({ summary: '세션 강제 로그아웃', description: '특정 세션을 무효화합니다.' })
  async revokeSession(@Req() req: any, @Param('seq') seq: string) {
    const user = req.user;
    return this.users.revokeSessionBySeq(BigInt(user.sub), seq);
  }
}
