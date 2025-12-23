import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
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
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly configService: ConfigService) {
    const prodCallbackURL = configService.get<string>('KAKAO_REDIRECT_PROD_URI');
    const devCallbackURL = configService.get<string>('KAKAO_REDIRECT_DEV_URI') || 'http://localhost:3000/api/auth/kakao/callback';
    const nodeEnv = (configService.get<string>('NODE_ENV') ?? process.env.NODE_ENV ?? '')
      .trim()
      .toLowerCase();
    const isProd = nodeEnv === 'production';
    const selectedCallbackURL = isProd ? (prodCallbackURL || devCallbackURL) : devCallbackURL;
    const callbackURL = normalizeOAuthCallbackUrl(selectedCallbackURL, 'kakao');

    const clientSecret = configService.get<string>('KAKAO_CLIENT_SECRET');

    if (!isProd) {
      const logger = new Logger(KakaoStrategy.name);
      logger.log(`Callback URL: ${callbackURL} (env=${nodeEnv || 'unknown'})`);
    }

    const config: any = {
      clientID: configService.get<string>('KAKAO_CLIENT_ID'),
      callbackURL: callbackURL,
      scope: ['account_email', 'profile_nickname'],
    };

    if (clientSecret) {
      config.clientSecret = clientSecret;
    }

    super(config);
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
    try {
      const kakaoAccount = profile._json?.kakao_account;
      const properties = profile._json?.properties;

      const email = kakaoAccount?.email;
      if (!email) {
        console.error('카카오 이메일 정보를 받아올 수 없습니다. 카카오 개발자 콘솔에서 이메일 동의 항목을 확인하세요.');
        return done(
          new BadRequestException(
            '이메일 정보가 필요합니다. 카카오 로그인 시 이메일 제공에 동의해주세요.',
          ),
          null,
        );
      }

      const user = {
        email: email,
        name: profile.username || profile.displayName || kakaoAccount?.profile?.nickname || properties?.nickname || 'Kakao User',
        picture: properties?.profile_image || kakaoAccount?.profile?.profile_image_url,
        provider: 'kakao',
        providerId: String(profile.id),
      };

      done(null, user);
    } catch (error) {
      if (error instanceof HttpException) return done(error, null);
      return done(new UnauthorizedException('카카오 로그인에 실패했습니다.'), null);
    }
  }
}
