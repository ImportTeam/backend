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
import { Prisma } from '@prisma/client';
import type {
  users as UsersModel,
  user_sessions as UserSessionModel,
  user_settings as UserSettingsModel,
} from '@prisma/client';

function isEmailUniqueConstraintError(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false;
  if (error.code !== 'P2002') return false;

  const target = (error.meta?.target ?? null) as unknown;
  if (Array.isArray(target)) return target.includes('email');
  if (typeof target === 'string') return target.includes('email');
  return false;
}

function normalizeEmail(email: string): string {
  return (email ?? '').trim().toLowerCase();
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private static readonly SEED_TEMPLATE_USER_UUID =
    '550e8400-e29b-41d4-a716-446655440001';

  private static readonly ALLOWED_MERCHANTS = [
    'G\uB9C8\uCF13',
    '11\uBC88\uAC00',
    '\uCFE0\uD321',
    '\uB2E4\uB098\uC640',
  ] as const;

  private async bootstrapNewUserData(
    tx: Prisma.TransactionClient,
    created: { uuid: string; seq: bigint; name: string },
  ): Promise<void> {
    // 최소 기본값: 설정은 항상 보장
    await tx.user_settings.upsert({
      where: { user_seq: created.seq },
      create: {
        user_seq: created.seq,
        dark_mode: false,
        notification_enabled: true,
        compare_mode: 'AUTO',
        currency_preference: 'KRW',
      },
      update: {},
    });

    // 이미 데이터가 있으면 중복 생성 방지
    const [methodsCount, txCount] = await Promise.all([
      tx.payment_methods.count({ where: { user_uuid: created.uuid } }),
      tx.payment_transactions.count({ where: { user_uuid: created.uuid } }),
    ]);
    if (methodsCount > 0 || txCount > 0) return;

    // 홍길동 시드 계정이 없으면(=seed 미실행) 설정만 두고 종료
    const templateUser = await tx.users.findUnique({
      where: { uuid: UsersService.SEED_TEMPLATE_USER_UUID },
      select: { uuid: true },
    });
    if (!templateUser) return;

    const templateMethods = await tx.payment_methods.findMany({
      where: { user_uuid: templateUser.uuid },
      orderBy: { seq: 'asc' },
    });

    const methodSeqMap = new Map<bigint, bigint>();
    for (const tm of templateMethods) {
      const createdMethod = await tx.payment_methods.create({
        data: {
          user_uuid: created.uuid,
          type: tm.type,
          card_number_hash: tm.card_number_hash,
          last_4_nums: tm.last_4_nums,
          card_holder_name: tm.card_holder_name
            ? created.name
            : tm.card_holder_name,
          provider_name: tm.provider_name,
          card_brand: tm.card_brand,
          expiry_month: tm.expiry_month,
          expiry_year: tm.expiry_year,
          cvv_hash: tm.cvv_hash,
          billing_address: tm.billing_address,
          billing_zip: tm.billing_zip,
          alias: tm.alias,
          is_primary: tm.is_primary,
          billing_key_id: null,
          billing_key_status: tm.billing_key_status,
          operator: tm.operator,
        },
      });
      methodSeqMap.set(tm.seq, createdMethod.seq);
    }

    const templateTxs = await tx.payment_transactions.findMany({
      where: { user_uuid: templateUser.uuid },
      orderBy: { created_at: 'asc' },
    });

    if (templateTxs.length === 0) return;

    await tx.payment_transactions.createMany({
      data: templateTxs.map((t, idx) => ({
        uuid: randomUUID(),
        user_uuid: created.uuid,
        payment_method_seq: t.payment_method_seq
          ? (methodSeqMap.get(t.payment_method_seq) ?? null)
          : null,
        // 요청사항: 지출 가맹점은 4개로만
        merchant_name:
          UsersService.ALLOWED_MERCHANTS[
            idx % UsersService.ALLOWED_MERCHANTS.length
          ],
        category: '쇼핑',
        amount: t.amount,
        currency: t.currency,
        benefit_value: t.benefit_value,
        benefit_desc: t.benefit_desc,
        compared_at: t.compared_at,
        portone_payment_id: null,
        portone_transaction_id: t.portone_transaction_id,
        status: t.status,
        created_at: t.created_at,
        updated_at: t.updated_at,
      })),
    });
  }

  async create(dto: CreateUserDto): Promise<UsersModel> {
    const email = normalizeEmail(dto.email);
    const password_hash = await bcrypt.hash(dto.password, 10);
    try {
      return await this.prisma.$transaction(async (tx) => {
        const created = await tx.users.create({
          data: {
            uuid: randomUUID(),
            email,
            password_hash,
            social_provider: 'NONE',
            name: dto.name,
          },
        });
        await this.bootstrapNewUserData(tx, {
          uuid: created.uuid,
          seq: created.seq,
          name: created.name,
        });
        return created;
      });
    } catch (error) {
      if (isEmailUniqueConstraintError(error)) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async findByEmail(email: string): Promise<UsersModel | null> {
    const normalized = normalizeEmail(email);
    if (!normalized) return null;
    return this.prisma.users.findUnique({ where: { email: normalized } });
  }

  async findBySeq(seq: bigint): Promise<UsersModel | null> {
    return this.prisma.users.findUnique({ where: { seq } });
  }

  async getCurrentUser(
    userSeq: bigint | number,
  ): Promise<UsersModel & { user_settings: UserSettingsModel | null }> {
    const seq = typeof userSeq === 'bigint' ? userSeq : BigInt(userSeq);
    const user = await this.prisma.users.findUnique({
      where: { seq },
      include: { user_settings: true },
    });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    return user;
  }

  async updateCurrentUser(
    userSeq: bigint | number,
    dto: UpdateCurrentUserDto,
  ): Promise<UsersModel & { user_settings: UserSettingsModel | null }> {
    const seq = typeof userSeq === 'bigint' ? userSeq : BigInt(userSeq);

    const hasUserUpdate =
      typeof dto.name === 'string' || typeof dto.email === 'string';
    const settings = dto.settings;
    const hasSettingsUpdate =
      Boolean(settings) && Object.keys(settings as object).length > 0;

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

  async changePassword(
    userSeq: bigint | number,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ ok: true }> {
    const seq = typeof userSeq === 'bigint' ? userSeq : BigInt(userSeq);
    const user = await this.prisma.users.findUnique({ where: { seq } });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    if (!user.password_hash) {
      throw new ConflictException(
        '비밀번호가 없는 계정입니다(소셜 로그인 계정).',
      );
    }

    const ok = await bcrypt.compare(currentPassword, user.password_hash || '');
    if (!ok)
      throw new UnauthorizedException('현재 비밀번호가 일치하지 않습니다.');

    const password_hash = await bcrypt.hash(newPassword, 10);
    await this.prisma.users.update({ where: { seq }, data: { password_hash } });
    return { ok: true };
  }

  async createSocialUser(data: {
    email: string;
    name: string;
    provider: string;
    providerId: string;
  }): Promise<UsersModel> {
    const email = normalizeEmail(data.email);
    return this.prisma.$transaction(async (tx) => {
      const created = await tx.users.create({
        data: {
          uuid: randomUUID(),
          email,
          name: data.name,
          social_provider: data.provider.toUpperCase(),
          social_id: data.providerId,
          password_hash: null,
        },
      });
      await this.bootstrapNewUserData(tx, {
        uuid: created.uuid,
        seq: created.seq,
        name: created.name,
      });
      return created;
    });
  }

  async linkSocialAccountByEmail(
    email: string,
    provider: string,
    providerId: string,
  ): Promise<UsersModel | null> {
    const normalized = normalizeEmail(email);
    const user = await this.findByEmail(normalized);
    if (!user) return null;
    return this.prisma.users.update({
      where: { email: normalized },
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
  }): Promise<UserSessionModel> {
    return this.prisma.user_sessions.create({
      data: {
        user_seq:
          typeof data.user_seq === 'bigint'
            ? data.user_seq
            : BigInt(data.user_seq),
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_at,
        device_info: data.device_info || null,
      },
    });
  }

  async updatePassword(
    email: string,
    newPassword: string,
  ): Promise<UsersModel> {
    const normalized = normalizeEmail(email);
    const user = await this.findByEmail(normalized);
    if (!user)
      throw new NotFoundException('해당 이메일의 사용자를 찾을 수 없습니다.');
    const password_hash = await bcrypt.hash(newPassword, 10);
    return this.prisma.users.update({
      where: { email: normalized },
      data: { password_hash },
    });
  }

  async unlinkSocialProvider(
    userSeq: bigint | number,
    provider: string,
  ): Promise<UsersModel | null> {
    const seq = typeof userSeq === 'bigint' ? userSeq : BigInt(userSeq);
    const user = await this.findBySeq(seq);
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    if (
      (user.social_provider || '').toLowerCase() !==
      (provider || '').toLowerCase()
    ) {
      return null;
    }

    return this.prisma.users.update({
      where: { seq },
      data: { social_provider: 'NONE', social_id: null },
    });
  }

  async findSessionByRefreshToken(
    refreshToken: string,
  ): Promise<UserSessionModel | null> {
    return this.prisma.user_sessions.findFirst({
      where: { refresh_token: refreshToken },
    });
  }

  async deleteSessionByRefreshToken(
    refreshToken: string,
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.user_sessions.deleteMany({
      where: { refresh_token: refreshToken },
    });
  }

  async deleteSessionsByUserSeq(
    userSeq: bigint | number,
  ): Promise<Prisma.BatchPayload> {
    const seq = typeof userSeq === 'bigint' ? userSeq : BigInt(userSeq);
    return this.prisma.user_sessions.deleteMany({ where: { user_seq: seq } });
  }

  async listSessionsByUserSeq(
    userSeq: bigint | number,
  ): Promise<
    Array<
      Pick<
        UserSessionModel,
        'seq' | 'device_info' | 'created_at' | 'expires_at'
      >
    >
  > {
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

  async revokeSessionBySeq(
    userSeq: bigint | number,
    sessionSeq: bigint | number | string,
  ): Promise<{ ok: true }> {
    const seq = typeof userSeq === 'bigint' ? userSeq : BigInt(userSeq);
    const sessionId =
      typeof sessionSeq === 'bigint' ? sessionSeq : BigInt(sessionSeq);

    const result = await this.prisma.user_sessions.deleteMany({
      where: { seq: sessionId, user_seq: seq },
    });
    if (result.count === 0)
      throw new NotFoundException('세션을 찾을 수 없습니다.');
    return { ok: true };
  }

  async deleteByUserId(
    userId: string,
  ): Promise<{ deleted: true; userId: string }> {
    const isUuid = userId.includes('-');
    let user: UsersModel | null = null;

    if (isUuid) {
      user = await this.prisma.users.findUnique({ where: { uuid: userId } });
      if (!user)
        throw new NotFoundException('해당 UUID의 사용자를 찾을 수 없습니다.');
      await this.prisma.users.delete({ where: { uuid: userId } });
    } else {
      const seq = BigInt(userId);
      user = await this.prisma.users.findUnique({ where: { seq } });
      if (!user)
        throw new NotFoundException('해당 ID의 사용자를 찾을 수 없습니다.');
      await this.prisma.users.delete({ where: { seq } });
    }

    return { deleted: true, userId };
  }
}
