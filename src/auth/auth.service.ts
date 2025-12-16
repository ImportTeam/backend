import { Injectable, UnauthorizedException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
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

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: { email: string; password: string }) {
    const { email, password } = loginDto;
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('해당 이메일의 사용자를 찾을 수 없습니다.');

    const isPasswordValid = await bcrypt.compare(password, user.password_hash || '');
    if (!isPasswordValid) throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    const payload = { 
      sub: user!.seq.toString(), 
      uuid: user!.uuid, 
      email: user!.email 
    };
    const jwtAccessExp = process.env.JWT_EXPIRES_IN || '1h';
    const jwtRefreshExp = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

    const accessToken = await this.jwtService.signAsync(payload as any, { expiresIn: jwtAccessExp } as any);
    const refreshToken = await this.jwtService.signAsync({ sub: user!.seq.toString(), uuid: user!.uuid } as any, { expiresIn: jwtRefreshExp } as any);

    const accessMs = parseDurationToMs(jwtAccessExp) || 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + accessMs);

    await this.usersService.createSession({
      user_seq: user!.seq,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt,
    });

    const issuedAt = new Date().toISOString();

    return {
      message: '로그인 성공',
      access_token: accessToken,
      refresh_token: refreshToken,
      issued_at: issuedAt,
      user: {
        id: user!.seq,
        uuid: user!.uuid,
        email: user!.email,
        name: user!.name,
      },
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const isPasswordValid = await bcrypt.compare(password, user.password_hash || '');
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
    const accessToken = await this.jwtService.signAsync(payload as any, { expiresIn: jwtAccessExp } as any);
    const refreshToken = await this.jwtService.signAsync({ sub: created.seq.toString(), uuid: created.uuid } as any, { expiresIn: jwtRefreshExp } as any);

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
    if (!user) throw new NotFoundException('해당 이메일 사용자를 찾을 수 없습니다.');

    const token = await this.jwtService.signAsync({ sub: user.seq.toString(), email: user.email } as any, { expiresIn: '1h' } as any);
    return { reset_token: token };
  }

  async resetPassword(token: string, newPassword: string) {
    const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET }).catch(() => {
      throw new UnauthorizedException('Invalid or expired reset token');
    });

    const email = (payload as any).email;
    if (!email) throw new UnauthorizedException('Invalid token payload');

    await this.usersService.updatePassword(email, newPassword);
    return { message: 'Password updated' };
  }

  async socialLogin(socialUser: any) {
    const { email, name, provider, providerId } = socialUser;

    let user = await this.usersService.findByEmail(email);

    if (user) {
      if (!user.social_id || user.social_provider === 'NONE') {
        await this.usersService.linkSocialAccountByEmail(email, provider, providerId);
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

    if (!user) throw new InternalServerErrorException('사용자 생성/링크 후 사용자 정보를 확인할 수 없습니다.');
    const payload = {
      sub: user.seq.toString(),
      uuid: user.uuid,
      email: user.email,
    };
    const jwtAccessExp = process.env.JWT_EXPIRES_IN || '1h';
    const jwtRefreshExp = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    const accessToken = await this.jwtService.signAsync(payload as any, { expiresIn: jwtAccessExp } as any);
    const refreshToken = await this.jwtService.signAsync({ sub: user.seq.toString(), uuid: user.uuid } as any, { expiresIn: jwtRefreshExp } as any);

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
    const payload = { sub: user.seq.toString(), uuid: user.uuid, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload as any, { expiresIn: jwtAccessExp } as any);
    const refreshToken = await this.jwtService.signAsync({ sub: user.seq.toString(), uuid: user.uuid } as any, { expiresIn: jwtRefreshExp } as any);

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
    if (!refreshToken) throw new UnauthorizedException('Refresh token required');

    const refreshSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    const payload = await this.jwtService.verifyAsync(refreshToken, { secret: refreshSecret }).catch(() => {
      throw new UnauthorizedException('Invalid or expired refresh token');
    });

    const session = await this.usersService.findSessionByRefreshToken(refreshToken);
    if (!session) throw new UnauthorizedException('Session not found or refresh token revoked');

    const user = await this.usersService.findBySeq(session.user_seq as bigint);
    if (!user) throw new NotFoundException('User not found');

    const accessExp = process.env.JWT_EXPIRES_IN || '1h';
    const refreshExp = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

    const accessToken = await this.jwtService.signAsync({ sub: user.seq.toString(), uuid: user.uuid, email: user.email } as any, { expiresIn: accessExp } as any);
    const newRefreshToken = await this.jwtService.signAsync({ sub: user.seq.toString(), uuid: user.uuid } as any, { expiresIn: refreshExp, secret: refreshSecret } as any);

    const accessMs = parseDurationToMs(accessExp) || 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + accessMs);

    await this.usersService.deleteSessionByRefreshToken(refreshToken);
    await this.usersService.createSession({
      user_seq: user.seq,
      access_token: accessToken,
      refresh_token: newRefreshToken,
      expires_at: expiresAt,
    });

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
      issued_at: new Date().toISOString(),
    };
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
