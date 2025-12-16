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
        password_hash: null,
      },
    });
  }

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

  async updatePassword(email: string, newPassword: string) {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('해당 이메일의 사용자를 찾을 수 없습니다.');
    const password_hash = await bcrypt.hash(newPassword, 10);
    return this.prisma.users.update({ where: { email }, data: { password_hash } });
  }

  async unlinkSocialProvider(userSeq: bigint | number, provider: string) {
    const seq = typeof userSeq === 'bigint' ? userSeq : BigInt(userSeq);
    const user = await this.findBySeq(seq);
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    if ((user.social_provider || '').toLowerCase() !== (provider || '').toLowerCase()) {
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
