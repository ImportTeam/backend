import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

type ExpiryUnit = 's' | 'm' | 'h' | 'd';

function parseDurationToMs(duration: string | undefined) {
  if (!duration) return 0;
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 0;
  const value = Number(match[1]);
  const unit = match[2] as ExpiryUnit;
  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
}

function isPrismaUniqueConstraintError(error: unknown): boolean {
  const anyErr = error as any;
  return Boolean(anyErr && anyErr.code === 'P2002');
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: { email: string; password: string }) {
    const { email, password } = loginDto;

    try {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      this.logger.warn(`[Login] user not found (email=${String(email)})`);
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    // Social-only accounts may not have a password hash.
    // Also, bcryptjs can throw if hash format is invalid/empty.
    if (!user.password_hash) {
      this.logger.warn(
        `[Login] social-only or missing password_hash (email=${String(email)}, userSeq=${user.seq?.toString?.() ?? String(user.seq)})`,
      );
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    let isPasswordValid = false;
    try {
      isPasswordValid = await bcrypt.compare(password, user.password_hash);
      } catch (error) {
        this.logger.warn(
          `[Login] bcrypt.compare error: ${String(error?.message || error)}`,
        );
      isPasswordValid = false;
    }
    if (!isPasswordValid) {
      this.logger.warn(
        `[Login] password mismatch (email=${String(email)}, userSeq=${user.seq?.toString?.() ?? String(user.seq)})`,
      );
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    const payload = {
        sub: user.seq.toString(),
        uuid: user.uuid,
        email: user.email,
    };
    const jwtAccessExp = process.env.JWT_EXPIRES_IN || '1h';
    const jwtRefreshExp = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

      let accessToken: string;
      let refreshToken: string;
      try {
        accessToken = await this.jwtService.signAsync(
      payload as any,
      { expiresIn: jwtAccessExp } as any,
    );
        refreshToken = await this.jwtService.signAsync(
          { sub: user.seq.toString(), uuid: user.uuid } as any,
      { expiresIn: jwtRefreshExp } as any,
    );
      } catch (error) {
        this.logger.error(
          `[Login] Failed to generate tokens: ${String(error?.message || error)}`,
        );
        throw new InternalServerErrorException(
          '토큰 생성 중 오류가 발생했습니다.',
        );
      }

    const accessMs = parseDurationToMs(jwtAccessExp) || 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + accessMs);

      try {
    await this.usersService.createSession({
          user_seq: user.seq,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt,
    });
      } catch (error) {
        this.logger.error(
          `[Login] Failed to create session: ${String(error?.message || error)}`,
        );
        throw new InternalServerErrorException(
          '세션 생성 중 오류가 발생했습니다.',
        );
      }

    const issuedAt = new Date().toISOString();

    return {
      message: '로그인 성공',
      access_token: accessToken,
      refresh_token: refreshToken,
      issued_at: issuedAt,
      user: {
          id: user.seq,
          uuid: user.uuid,
          email: user.email,
          name: user.name,
      },
    };
    } catch (error) {
      // 이미 HttpException인 경우 그대로 재던지기
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      // 예상치 못한 오류인 경우 로깅하고 401로 변환
      this.logger.error(
        `[Login] Unexpected error: ${String(error?.message || error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new UnauthorizedException('로그인에 실패했습니다.');
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash || '',
    );
    if (!isPasswordValid) return null;
    return user;
  }

  async register(dto: CreateUserDto) {
    const created = await this.usersService.create(dto);

    const payload = {
      sub: created.seq.toString(),
      uuid: created.uuid,
      email: created.email,
    };
    const jwtAccessExp = process.env.JWT_EXPIRES_IN || '1h';
    const jwtRefreshExp = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    const accessToken = await this.jwtService.signAsync(
      payload as any,
      { expiresIn: jwtAccessExp } as any,
    );
    const refreshToken = await this.jwtService.signAsync(
      { sub: created.seq.toString(), uuid: created.uuid } as any,
      { expiresIn: jwtRefreshExp } as any,
    );

    const accessMs = parseDurationToMs(jwtAccessExp) || 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + accessMs);

    await this.usersService.createSession({
      user_seq: created.seq,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt,
    });

    return {
      message: '회원가입 및 로그인 성공',
      access_token: accessToken,
      refresh_token: refreshToken,
      issued_at: new Date().toISOString(),
      user: {
        id: created.seq,
        uuid: created.uuid,
        email: created.email,
        name: created.name,
      },
    };
  }

  async sendPasswordReset(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user)
      throw new NotFoundException('해당 이메일 사용자를 찾을 수 없습니다.');

    const token = await this.jwtService.signAsync(
      { sub: user.seq.toString(), email: user.email } as any,
      { expiresIn: '1h' } as any,
    );
    return { reset_token: token };
  }

  async resetPassword(token: string, newPassword: string) {
    const payload = await this.jwtService
      .verifyAsync(token, { secret: process.env.JWT_SECRET })
      .catch(() => {
        throw new UnauthorizedException('Invalid or expired reset token');
      });

    const email = (payload as any).email;
    if (!email) throw new UnauthorizedException('Invalid token payload');

    await this.usersService.updatePassword(email, newPassword);
    return { message: 'Password updated' };
  }

  async socialLogin(socialUser: any) {
    if (!socialUser || typeof socialUser !== 'object') {
      throw new BadRequestException(
        '소셜 로그인 사용자 정보가 유효하지 않습니다.',
      );
    }

    const { email, name, provider, providerId } = socialUser;
    if (!email || typeof email !== 'string') {
      throw new BadRequestException('이메일 정보가 필요합니다.');
    }
    if (
      !provider ||
      typeof provider !== 'string' ||
      !providerId ||
      typeof providerId !== 'string'
    ) {
      throw new BadRequestException(
        '소셜 로그인 제공자 정보가 유효하지 않습니다.',
      );
    }

    let user = await this.usersService.findByEmail(email);

    try {
      if (user) {
        if (!user.social_id || user.social_provider === 'NONE') {
          await this.usersService.linkSocialAccountByEmail(
            email,
            provider,
            providerId,
          );
          user = await this.usersService.findByEmail(email);
        }
      } else {
        user = await this.usersService.createSocialUser({
          email,
          name,
          provider,
          providerId,
        });
      }
    } catch (error) {
      // Race condition: another request created the same email concurrently.
      if (isPrismaUniqueConstraintError(error)) {
        user = await this.usersService.findByEmail(email);
        if (!user) {
          throw new ConflictException(
            '이미 존재하는 이메일입니다. 다시 시도해주세요.',
          );
        }
      } else {
        throw error;
      }
    }

    if (!user)
      throw new InternalServerErrorException(
        '사용자 생성/링크 후 사용자 정보를 확인할 수 없습니다.',
      );
    const payload = {
      sub: user.seq.toString(),
      uuid: user.uuid,
      email: user.email,
    };
    const jwtAccessExp = process.env.JWT_EXPIRES_IN || '1h';
    const jwtRefreshExp = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    const accessToken = await this.jwtService.signAsync(
      payload as any,
      { expiresIn: jwtAccessExp } as any,
    );
    const refreshToken = await this.jwtService.signAsync(
      { sub: user.seq.toString(), uuid: user.uuid } as any,
      { expiresIn: jwtRefreshExp } as any,
    );

    const accessMs = parseDurationToMs(jwtAccessExp) || 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + accessMs);

    await this.usersService.createSession({
      user_seq: user.seq,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt,
    });

    const issuedAt = new Date().toISOString();

    return {
      message: '소셜 로그인 성공',
      access_token: accessToken,
      refresh_token: refreshToken,
      issued_at: issuedAt,
      user: {
        id: user.seq,
        uuid: user.uuid,
        email: user.email,
        name: user.name,
        provider,
      },
    };
  }

  private async generateTokensForUser(user: any) {
    const jwtAccessExp = process.env.JWT_EXPIRES_IN || '1h';
    const jwtRefreshExp = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    const payload = {
      sub: user.seq.toString(),
      uuid: user.uuid,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(
      payload as any,
      { expiresIn: jwtAccessExp } as any,
    );
    const refreshToken = await this.jwtService.signAsync(
      { sub: user.seq.toString(), uuid: user.uuid } as any,
      { expiresIn: jwtRefreshExp } as any,
    );

    const accessMs = parseDurationToMs(jwtAccessExp) || 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + accessMs);

    await this.usersService.createSession({
      user_seq: user.seq,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      issuedAt: new Date().toISOString(),
    };
  }

  async verifyEmailToken(token: string) {
    const payload = await this.jwtService
      .verifyAsync(token, { secret: process.env.JWT_SECRET })
      .catch(() => {
        throw new UnauthorizedException('Invalid or expired token');
      });
    return { valid: true, payload };
  }

  async refreshTokens(refreshToken: string) {
    if (!refreshToken)
      throw new UnauthorizedException('Refresh token required');

    try {
    const refreshSecret =
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
      if (!refreshSecret) {
        this.logger.error('[Refresh] JWT secret not configured');
        throw new InternalServerErrorException(
          '서버 설정 오류가 발생했습니다.',
        );
      }

    const payload = await this.jwtService
      .verifyAsync(refreshToken, { secret: refreshSecret })
        .catch((error) => {
          this.logger.warn(
            `[Refresh] Token verification failed: ${String(error?.message || error)}`,
          );
        throw new UnauthorizedException('Invalid or expired refresh token');
      });

    const session =
      await this.usersService.findSessionByRefreshToken(refreshToken);
      if (!session) {
        this.logger.warn('[Refresh] Session not found for refresh token');
      throw new UnauthorizedException(
        'Session not found or refresh token revoked',
      );
      }

    const user = await this.usersService.findBySeq(session.user_seq as bigint);
      if (!user) {
        this.logger.warn(
          `[Refresh] User not found for session (user_seq=${session.user_seq})`,
        );
      throw new UnauthorizedException('Invalid or expired refresh token');
      }

    const accessExp = process.env.JWT_EXPIRES_IN || '1h';
    const refreshExp = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

      let accessToken: string;
      let newRefreshToken: string;
      try {
        accessToken = await this.jwtService.signAsync(
      { sub: user.seq.toString(), uuid: user.uuid, email: user.email } as any,
      { expiresIn: accessExp } as any,
    );
        newRefreshToken = await this.jwtService.signAsync(
      { sub: user.seq.toString(), uuid: user.uuid } as any,
      { expiresIn: refreshExp, secret: refreshSecret } as any,
    );
      } catch (error) {
        this.logger.error(
          `[Refresh] Failed to generate tokens: ${String(error?.message || error)}`,
        );
        throw new InternalServerErrorException(
          '토큰 생성 중 오류가 발생했습니다.',
        );
      }

    const accessMs = parseDurationToMs(accessExp) || 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + accessMs);

      try {
    await this.usersService.deleteSessionByRefreshToken(refreshToken);
    await this.usersService.createSession({
      user_seq: user.seq,
      access_token: accessToken,
      refresh_token: newRefreshToken,
      expires_at: expiresAt,
    });
      } catch (error) {
        this.logger.error(
          `[Refresh] Failed to update session: ${String(error?.message || error)}`,
        );
        // 세션 업데이트 실패는 심각한 오류이지만, 이미 토큰은 생성했으므로
        // 클라이언트에게는 500 오류를 반환
        throw new InternalServerErrorException(
          '세션 업데이트 중 오류가 발생했습니다.',
        );
      }

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
      issued_at: new Date().toISOString(),
    };
    } catch (error) {
      // 이미 HttpException인 경우 그대로 재던지기
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      // 예상치 못한 오류인 경우 로깅하고 401로 변환
      this.logger.error(
        `[Refresh] Unexpected error: ${String(error?.message || error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new UnauthorizedException('토큰 갱신에 실패했습니다.');
    }
  }

  async logout(refreshToken: string) {
    if (!refreshToken) return { ok: true };
    await this.usersService.deleteSessionByRefreshToken(refreshToken);
    return { ok: true };
  }

  async deleteUser(userId: string) {
    return this.usersService.deleteByUserId(userId);
  }
}
