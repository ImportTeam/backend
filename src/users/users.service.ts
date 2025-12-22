import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID } from 'node:crypto';
import * as bcrypt from 'bcryptjs';
import { UpdateCurrentUserDto } from './dto/update-current-user.dto';

function isEmailUniqueConstraintError(error: unknown): boolean {
  const anyErr = error as any;
  if (!anyErr) return false;
  if (anyErr.code !== 'P2002') return false;
  const target = anyErr.meta?.target;
  if (Array.isArray(target)) return target.includes('email');
  if (typeof target === 'string') return target.includes('email');
  return false;
}

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

  async getCurrentUser(userSeq: bigint | number) {
    const seq = typeof userSeq === 'bigint' ? userSeq : BigInt(userSeq);
    const user = await this.prisma.users.findUnique({
      where: { seq },
      include: { user_settings: true },
    });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    return user;
  }

  async updateCurrentUser(userSeq: bigint | number, dto: UpdateCurrentUserDto) {
    const seq = typeof userSeq === 'bigint' ? userSeq : BigInt(userSeq);

    const hasUserUpdate = typeof dto.name === 'string' || typeof dto.email === 'string';
    const settings = dto.settings;
    const hasSettingsUpdate = Boolean(settings) && Object.keys(settings as object).length > 0;

    if (!hasUserUpdate && !hasSettingsUpdate) {
      return this.getCurrentUser(seq);
    }

    try {
      await this.prisma.$transaction(async (tx) => {
      if (hasUserUpdate) {
        const data: Record<string, any> = {};
        if (typeof dto.name === 'string') data.name = dto.name;
        if (typeof dto.email === 'string') data.email = dto.email;
        if (Object.keys(data).length > 0) {
          await tx.users.update({
            where: { seq },
            data,
          });
        }
      }

      if (hasSettingsUpdate) {
        await tx.user_settings.upsert({
          where: { user_seq: seq },
          create: {
            user_seq: seq,
            dark_mode: settings?.darkMode ?? false,
            notification_enabled: settings?.notificationEnabled ?? true,
            compare_mode: settings?.compareMode ?? 'AUTO',
            currency_preference: settings?.currencyPreference ?? 'KRW',
          },
          update: {
            ...(typeof settings?.darkMode === 'boolean'
              ? { dark_mode: settings.darkMode }
              : {}),
            ...(typeof settings?.notificationEnabled === 'boolean'
              ? { notification_enabled: settings.notificationEnabled }
              : {}),
            ...(typeof settings?.compareMode === 'string'
              ? { compare_mode: settings.compareMode }
              : {}),
            ...(typeof settings?.currencyPreference === 'string'
              ? { currency_preference: settings.currencyPreference }
              : {}),
          },
        });
      }
      });
    } catch (error) {
      if (isEmailUniqueConstraintError(error)) {
        throw new ConflictException('이미 사용 중인 이메일입니다.');
      }
      throw error;
    }

    return this.getCurrentUser(seq);
  }

  async changePassword(userSeq: bigint | number, currentPassword: string, newPassword: string) {
    const seq = typeof userSeq === 'bigint' ? userSeq : BigInt(userSeq);
    const user = await this.prisma.users.findUnique({ where: { seq } });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    if (!user.password_hash) {
      throw new ConflictException('비밀번호가 없는 계정입니다(소셜 로그인 계정).');
    }

    const ok = await bcrypt.compare(currentPassword, user.password_hash || '');
    if (!ok) throw new UnauthorizedException('현재 비밀번호가 일치하지 않습니다.');

    const password_hash = await bcrypt.hash(newPassword, 10);
    await this.prisma.users.update({ where: { seq }, data: { password_hash } });
    return { ok: true };
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

  async listSessionsByUserSeq(userSeq: bigint | number) {
    const seq = typeof userSeq === 'bigint' ? userSeq : BigInt(userSeq);
    return this.prisma.user_sessions.findMany({
      where: { user_seq: seq },
      orderBy: { created_at: 'desc' },
      select: {
        seq: true,
        device_info: true,
        created_at: true,
        expires_at: true,
      },
    });
  }

  async revokeSessionBySeq(userSeq: bigint | number, sessionSeq: bigint | number | string) {
    const seq = typeof userSeq === 'bigint' ? userSeq : BigInt(userSeq);
    const sessionId = typeof sessionSeq === 'bigint' ? sessionSeq : BigInt(sessionSeq);

    const result = await this.prisma.user_sessions.deleteMany({
      where: { seq: sessionId, user_seq: seq },
    });
    if (result.count === 0) throw new NotFoundException('세션을 찾을 수 없습니다.');
    return { ok: true };
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
