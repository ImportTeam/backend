import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { inspect } from 'node:util';

@Injectable()
export class KakaoAuthGuard extends AuthGuard('kakao') {
  private readonly logger = new Logger(KakaoAuthGuard.name);

  private isProdEnv(): boolean {
    return (process.env.NODE_ENV ?? '').toLowerCase() === 'production';
  }

  private extractOAuthErrorDetails(err: any): string | null {
    // passport strategies can attach error payload in various places.
    const oauthError = err?.oauthError;
    const data = oauthError?.data ?? err?.data;
    if (!data) return null;

    if (typeof data === 'string') {
      // Often JSON string: {"error":"invalid_client","error_description":"..."}
      try {
        const parsed = JSON.parse(data);
        const desc =
          parsed?.error_description ||
          parsed?.msg ||
          parsed?.message ||
          parsed?.error_description?.toString();
        const code = parsed?.error || parsed?.code;
        if (code || desc) {
          return [code, desc].filter(Boolean).join(': ');
        }
        return data;
      } catch {
        return data;
      }
    }

    if (typeof data === 'object') {
      const desc = data?.error_description || data?.message || data?.msg;
      const code = data?.error || data?.code;
      if (code || desc) {
        return [code, desc].filter(Boolean).join(': ');
      }
      try {
        return JSON.stringify(data);
      } catch {
        return String(data);
      }
    }

    return String(data);
  }

  private extractPassportInfoMessage(info: any): string | null {
    if (!info) return null;
    if (typeof info?.message === 'string') return info.message;
    if (typeof info === 'string') return info;
    return null;
  }

  private extractErrMessage(err: any): string {
    const direct = typeof err?.message === 'string' ? err.message.trim() : '';
    if (direct) return direct;
    const oauthDetails = this.extractOAuthErrorDetails(err);
    if (oauthDetails) return oauthDetails;
    const name = typeof err?.name === 'string' ? err.name : '';
    return name ? name : 'Kakao auth error';
  }

  handleRequest(err: any, user: any, info: any) {
    if (err) {
      if (err instanceof HttpException) throw err;

      const message = this.extractErrMessage(err);
      const infoMessage = this.extractPassportInfoMessage(info);
      this.logger.error(
        `Passport error: ${message}${infoMessage ? ` (info=${infoMessage})` : ''}`,
        err?.stack,
      );
      // In dev, dump the error object to help diagnose OAuth exchange failures.
      if (!this.isProdEnv()) {
        this.logger.error(`Passport error dump: ${inspect(err, { depth: 5 })}`);
        if (info) {
          this.logger.warn(`Passport info dump: ${inspect(info, { depth: 5 })}`);
        }
      }

      const combined = [message, infoMessage].filter(Boolean).join(' | ');
      const publicMessage = this.isProdEnv()
        ? '카카오 인증 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
        : `카카오 인증 처리 중 오류: ${combined || 'Kakao auth error'}`;

      const upstreamStatus = typeof err?.statusCode === 'number' ? err.statusCode : undefined;
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

      throw new UnauthorizedException(infoMessage || '카카오 인증에 실패했습니다.');
    }

    return user;
  }
}
