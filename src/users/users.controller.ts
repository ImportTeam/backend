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

@ApiTags('사용자 관리')
@ApiExtraModels(
  ErrorResponseDto,
  UnauthorizedErrorDto,
  CurrentUserResponseDto,
  UserSessionDto,
)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

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
