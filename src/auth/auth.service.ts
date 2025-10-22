import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

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

    const payload = { sub: user.seq.toString(), email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    return {
      message: '로그인 성공',
      access_token: accessToken,
      user: {
        id: user.seq,
        email: user.email,
        name: user.name,
      },
    };
  }

  // 소셜 로그인 처리
  async socialLogin(socialUser: any) {
    const { email, name, provider, providerId } = socialUser;

    // 이메일로 기존 사용자 조회
    let user = await this.usersService.findByEmail(email);

    // 사용자가 없으면 새로 생성
    if (!user) {
      user = await this.usersService.createSocialUser({
        email,
        name,
        provider,
        providerId,
      });
    }

    // JWT 토큰 생성
    const payload = { sub: user.seq.toString(), email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    return {
      message: '소셜 로그인 성공',
      access_token: accessToken,
      user: {
        id: user.seq,
        email: user.email,
        name: user.name,
        provider,
      },
    };
  }
}
