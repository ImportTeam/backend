import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { BadRequestException, HttpException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

function normalizeOAuthCallbackUrl(callbackUrl: string, provider: string): string {
  try {
    const url = new URL(callbackUrl);
    const expectedPath = `/api/auth/${provider}/callback`;

    if (url.pathname === `/auth/${provider}/callback`) {
      url.pathname = expectedPath;
      return url.toString();
    }

    return callbackUrl;
  } catch {
    return callbackUrl;
  }
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    const prodCallbackURL = configService.get<string>('GOOGLE_REDIRECT_PROD_URI');
    const devCallbackURL = configService.get<string>('GOOGLE_REDIRECT_DEV_URI') || 'http://localhost:3000/api/auth/google/callback';
    const nodeEnv = (configService.get<string>('NODE_ENV') ?? process.env.NODE_ENV ?? '')
      .trim()
      .toLowerCase();
    const isProd = nodeEnv === 'production';
    const selectedCallbackURL = isProd ? (prodCallbackURL || devCallbackURL) : devCallbackURL;
    const callbackURL = normalizeOAuthCallbackUrl(selectedCallbackURL, 'google');

    if (!isProd) {
      const logger = new Logger(GoogleStrategy.name);
      logger.log(`Callback URL: ${callbackURL} (env=${nodeEnv || 'unknown'})`);
    }

    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    try {
      const { id, name, emails, photos } = profile;
      const email = emails?.[0]?.value;
      if (!email) {
        return done(
          new BadRequestException(
            '이메일 정보가 필요합니다. Google 로그인 시 이메일 제공에 동의해주세요.',
          ),
          undefined,
        );
      }

      const user = {
        email,
        name: name?.givenName || name?.familyName || email.split('@')[0],
        picture: photos?.[0]?.value,
        provider: 'google',
        providerId: String(id),
      };
      return done(null, user);
    } catch (error) {
      if (error instanceof HttpException) return done(error, undefined);
      return done(new UnauthorizedException('구글 로그인에 실패했습니다.'), undefined);
    }
  }
}
