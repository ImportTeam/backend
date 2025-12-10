import { Injectable, UnauthorizedException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

type ExpiryUnit = 's' | 'm' | 'h' | 'd';

function parseDurationToMs(duration: string | undefined) {
  if (!duration) return 0;
  // support formats like '1h', '30m', '7d', '3600s'
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

    // calculate expires_at for session
    const accessMs = parseDurationToMs(jwtAccessExp) || 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + accessMs);

    // persist session
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

  // 자주 쓰이는 유효성 검사 도우미: 이메일/비밀번호 확인
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const isPasswordValid = await bcrypt.compare(password, user.password_hash || '');
    if (!isPasswordValid) return null;
    return user;
  }

  // 회원가입: user 생성 후 토큰 발급(선택적 사용)
  async register(dto: CreateUserDto) {
    const created = await this.usersService.create(dto);

    // 토큰 발급 및 세션 생성 (기존 login과 동일한 형식)
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

  // 비밀번호 재설정용 토큰 생성 (이 토큰은 이메일 전송에 사용)
  async sendPasswordReset(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('해당 이메일 사용자를 찾을 수 없습니다.');

    const token = await this.jwtService.signAsync({ sub: user.seq.toString(), email: user.email } as any, { expiresIn: '1h' } as any);
    // 실제로는 이메일 전송 로직이 필요합니다. 여기서는 토큰만 반환합니다.
    return { reset_token: token };
  }

  // 비밀번호 재설정: 토큰 검증 후 비밀번호 변경
  async resetPassword(token: string, newPassword: string) {
    const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET }).catch(() => {
      throw new UnauthorizedException('Invalid or expired reset token');
    });

    const email = (payload as any).email;
    if (!email) throw new UnauthorizedException('Invalid token payload');

    // usersService에서 비밀번호 업데이트 메서드를 사용
    await this.usersService.updatePassword(email, newPassword);
    return { message: 'Password updated' };
  }

  // 소셜 로그인 처리
  async socialLogin(socialUser: any) {
    const { email, name, provider, providerId } = socialUser;

    // 이메일로 기존 사용자 조회
    let user = await this.usersService.findByEmail(email);

    // 사용자가 있으면 (이메일 계정이 이미 존재) 소셜 정보가 비어있다면 링크
    if (user) {
      if (!user.social_id || user.social_provider === 'NONE') {
        await this.usersService.linkSocialAccountByEmail(email, provider, providerId);
        user = await this.usersService.findByEmail(email); // refresh
      }
    } else {
      // 사용자가 없으면 새로 생성
      user = await this.usersService.createSocialUser({
        email,
        name,
        provider,
        providerId,
      });
    }

    // JWT 토큰 생성 (access + refresh)
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

  // 공통: 주어진 사용자로부터 액세스/리프레시 토큰을 발급하고 세션을 생성
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

  // 이메일 인증 토큰 검증 (간단한 JWT 유효성 검사)
  async verifyEmailToken(token: string) {
    const payload = await this.jwtService
      .verifyAsync(token, { secret: process.env.JWT_SECRET })
      .catch(() => {
        throw new UnauthorizedException('Invalid or expired token');
      });
    return { valid: true, payload };
  }

  // Refresh tokens: verify refresh token, ensure session exists, then issue new tokens
  async refreshTokens(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException('Refresh token required');

    const refreshSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    const payload = await this.jwtService.verifyAsync(refreshToken, { secret: refreshSecret }).catch(() => {
      throw new UnauthorizedException('Invalid or expired refresh token');
    });

    // verify session exists
    const session = await this.usersService.findSessionByRefreshToken(refreshToken);
    if (!session) throw new UnauthorizedException('Session not found or refresh token revoked');

    // re-issue tokens
    const user = await this.usersService.findBySeq(session.user_seq as bigint);
    if (!user) throw new NotFoundException('User not found');

    const accessExp = process.env.JWT_EXPIRES_IN || '1h';
    const refreshExp = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

    const accessToken = await this.jwtService.signAsync({ sub: user.seq.toString(), uuid: user.uuid, email: user.email } as any, { expiresIn: accessExp } as any);
    const newRefreshToken = await this.jwtService.signAsync({ sub: user.seq.toString(), uuid: user.uuid } as any, { expiresIn: refreshExp, secret: refreshSecret } as any);

    const accessMs = parseDurationToMs(accessExp) || 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + accessMs);

    // create new session record (or update existing) — here we create a new session and delete old one
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

  // Logout: revoke session by refresh token
  async logout(refreshToken: string) {
    if (!refreshToken) return { ok: true };
    await this.usersService.deleteSessionByRefreshToken(refreshToken);
    return { ok: true };
  }

  // 공통 사용자 삭제 위임
  async deleteUser(userId: string) {
    return this.usersService.deleteByUserId(userId);
  }
}
