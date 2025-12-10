import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID } from 'node:crypto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const exists = await this.prisma.users.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already exists');

    const password_hash = await bcrypt.hash(dto.password, 10);
    return this.prisma.users.create({
      data: {
        uuid: randomUUID(),
        email: dto.email,
        password_hash,
        social_provider: 'NONE',
        name: dto.name,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.users.findUnique({ where: { email } });
  }

  async findBySeq(seq: bigint) {
    return this.prisma.users.findUnique({ where: { seq } });
  }

  // 소셜 로그인 사용자 생성
  async createSocialUser(data: {
    email: string;
    name: string;
    provider: string;
    providerId: string;
  }) {
    return this.prisma.users.create({
      data: {
        uuid: randomUUID(),
        email: data.email,
        name: data.name,
        social_provider: data.provider.toUpperCase(),
        social_id: data.providerId,
        password_hash: null, // 소셜 로그인 사용자는 비밀번호가 없음
      },
    });
  }

  // 링크된 소셜 계정 정보 업데이트 (email로 찾은 기존 사용자에 소셜 정보 추가)
  async linkSocialAccountByEmail(email: string, provider: string, providerId: string) {
    const user = await this.findByEmail(email);
    if (!user) return null;
    return this.prisma.users.update({
      where: { email },
      data: {
        social_provider: provider.toUpperCase(),
        social_id: providerId,
      },
    });
  }

  // 세션(토큰) 생성
  async createSession(data: {
    user_seq: bigint | number;
    access_token: string;
    refresh_token: string;
    expires_at: Date;
    device_info?: string | null;
  }) {
    return this.prisma.user_sessions.create({
      data: {
        user_seq: typeof data.user_seq === 'bigint' ? data.user_seq : BigInt(data.user_seq),
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_at,
        device_info: data.device_info || null,
      },
    });
  }

  // 비밀번호 업데이트 (이메일로 찾음)
  async updatePassword(email: string, newPassword: string) {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('해당 이메일의 사용자를 찾을 수 없습니다.');
    const password_hash = await bcrypt.hash(newPassword, 10);
    return this.prisma.users.update({ where: { email }, data: { password_hash } });
  }

  // 소셜 연동 해제: user_seq로 조회하여 provider 정보 제거
  async unlinkSocialProvider(userSeq: bigint | number, provider: string) {
    const seq = typeof userSeq === 'bigint' ? userSeq : BigInt(userSeq);
    const user = await this.findBySeq(seq);
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    // 소셜 제공자 일치 여부 확인(대소문자 무시)
    if ((user.social_provider || '').toLowerCase() !== (provider || '').toLowerCase()) {
      // 이미 다른 provider가 연결되어 있거나 연결 없음
      return null;
    }

    return this.prisma.users.update({ where: { seq }, data: { social_provider: 'NONE', social_id: null } });
  }

  async findSessionByRefreshToken(refreshToken: string) {
    return this.prisma.user_sessions.findFirst({ where: { refresh_token: refreshToken } });
  }

  async deleteSessionByRefreshToken(refreshToken: string) {
    return this.prisma.user_sessions.deleteMany({ where: { refresh_token: refreshToken } });
  }

  async deleteSessionsByUserSeq(userSeq: bigint | number) {
    const seq = typeof userSeq === 'bigint' ? userSeq : BigInt(userSeq);
    return this.prisma.user_sessions.deleteMany({ where: { user_seq: seq } });
  }

  // 공통 사용자 삭제 (seq 또는 uuid 모두 지원)
  async deleteByUserId(userId: string) {
    const isUuid = userId.includes('-');
    let user: any = null;

    if (isUuid) {
      user = await this.prisma.users.findUnique({ where: { uuid: userId } });
      if (!user) throw new NotFoundException('해당 UUID의 사용자를 찾을 수 없습니다.');
      await this.prisma.users.delete({ where: { uuid: userId } });
    } else {
      const seq = BigInt(userId);
      user = await this.prisma.users.findUnique({ where: { seq } });
      if (!user) throw new NotFoundException('해당 ID의 사용자를 찾을 수 없습니다.');
      await this.prisma.users.delete({ where: { seq } });
    }

    return { deleted: true, userId };
  }
}
