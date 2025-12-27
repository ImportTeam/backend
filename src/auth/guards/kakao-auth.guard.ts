import {
  BadRequestException,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { inspect } from 'node:util';
import { buildOAuthStateFromRequest } from './oauth-state.util';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getProp(value: unknown, key: string): unknown {
  return isRecord(value) ? value[key] : undefined;
}

function getStringProp(value: unknown, key: string): string | undefined {
  const v = getProp(value, key);
  return typeof v === 'string' ? v : undefined;
}

function getNumberProp(value: unknown, key: string): number | undefined {
  const v = getProp(value, key);
  return typeof v === 'number' ? v : undefined;
}

@Injectable()
export class KakaoAuthGuard extends AuthGuard('kakao') {
  private readonly logger = new Logger(KakaoAuthGuard.name);

  getAuthenticateOptions(ctx: ExecutionContext): Record<string, unknown> {
    const state = buildOAuthStateFromRequest(ctx);
    return { state };
  }

  private isProdEnv(): boolean {
    return (process.env.NODE_ENV ?? '').toLowerCase() === 'production';
  }

  private extractOAuthErrorDetails(err: unknown): string | null {
    // passport strategies can attach error payload in various places.
    const oauthError = getProp(err, 'oauthError');
    const data = getProp(oauthError, 'data') ?? getProp(err, 'data');
    if (!data) return null;

    if (typeof data === 'string') {
      // Often JSON string: {"error":"invalid_client","error_description":"..."}
      try {
        const parsed: unknown = JSON.parse(data);

        const desc =
          getStringProp(parsed, 'error_description') ??
          getStringProp(parsed, 'msg') ??
          getStringProp(parsed, 'message');

        const codeRaw = getProp(parsed, 'error') ?? getProp(parsed, 'code');
        const code = typeof codeRaw === 'string' ? codeRaw : undefined;

        if (code || desc) {
          return [code, desc].filter(Boolean).join(': ');
        }
        return data;
      } catch {
        return data;
      }
    }

    if (isRecord(data)) {
      const desc =
        getStringProp(data, 'error_description') ??
        getStringProp(data, 'message') ??
        getStringProp(data, 'msg');
      const codeRaw = getProp(data, 'error') ?? getProp(data, 'code');
      const code = typeof codeRaw === 'string' ? codeRaw : undefined;
      if (code || desc) {
        return [code, desc].filter(Boolean).join(': ');
      }
      try {
        return JSON.stringify(data);
      } catch {
        return inspect(data, { depth: 5 });
      }
    }

    return inspect(data, { depth: 5 });
  }

  private extractPassportInfoMessage(info: unknown): string | null {
    if (!info) return null;
    const message = getStringProp(info, 'message');
    if (message) return message;
    if (typeof info === 'string') return info;
    return null;
  }

  private extractErrMessage(err: unknown): string {
    const direct = (getStringProp(err, 'message') ?? '').trim();
    if (direct) return direct;
    const oauthDetails = this.extractOAuthErrorDetails(err);
    if (oauthDetails) return oauthDetails;
    const name = getStringProp(err, 'name') ?? '';
    return name ? name : 'Kakao auth error';
  }

  handleRequest<TUser = any>(
    err: unknown,
    user: TUser,
    info: unknown,
    _context: ExecutionContext,
    _status?: unknown,
  ): TUser {
    if (err) {
      if (err instanceof HttpException) throw err;

      const message = this.extractErrMessage(err);
      const infoMessage = this.extractPassportInfoMessage(info);
      const stack = getStringProp(err, 'stack');
      this.logger.error(
        `Passport error: ${message}${infoMessage ? ` (info=${infoMessage})` : ''}`,
        stack,
      );
      // In dev, dump the error object to help diagnose OAuth exchange failures.
      if (!this.isProdEnv()) {
        this.logger.error(`Passport error dump: ${inspect(err, { depth: 5 })}`);
        if (info) {
          this.logger.warn(
            `Passport info dump: ${inspect(info, { depth: 5 })}`,
          );
        }
      }

      const combined = [message, infoMessage].filter(Boolean).join(' | ');
      const publicMessage = this.isProdEnv()
        ? '카카오 인증 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
        : `카카오 인증 처리 중 오류: ${combined || 'Kakao auth error'}`;

      const upstreamStatus = getNumberProp(err, 'statusCode');
      if (upstreamStatus === 401) {
        throw new UnauthorizedException(publicMessage);
      }
      throw new BadRequestException(publicMessage);
    }

    if (!user) {
      const infoMessage = this.extractPassportInfoMessage(info);
      if (infoMessage) this.logger.warn(`Passport info: ${infoMessage}`);
      if (!this.isProdEnv() && info) {
        this.logger.warn(`Passport info dump: ${inspect(info, { depth: 5 })}`);
      }

      throw new UnauthorizedException(
        infoMessage || '카카오 인증에 실패했습니다.',
      );
    }

    return user;
  }
}
