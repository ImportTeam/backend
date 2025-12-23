import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { BadRequestException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
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
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(private readonly configService: ConfigService) {
    const prodCallbackURL = configService.get<string>('NAVER_REDIRECT_PROD_URI');
    const devCallbackURL = configService.get<string>('NAVER_REDIRECT_DEV_URI') || 'http://localhost:3000/api/auth/naver/callback';
    const nodeEnv = (configService.get<string>('NODE_ENV') ?? process.env.NODE_ENV ?? '')
      .trim()
      .toLowerCase();
    const isProd = nodeEnv === 'production';
    const selectedCallbackURL = isProd ? (prodCallbackURL || devCallbackURL) : devCallbackURL;
    const callbackURL = normalizeOAuthCallbackUrl(selectedCallbackURL, 'naver');

    console.log(`[NaverStrategy] Callback URL: ${callbackURL} (env=${nodeEnv || 'unknown'})`);

    super({
      clientID: configService.get<string>('NAVER_CLIENT_ID'),
      clientSecret: configService.get<string>('NAVER_CLIENT_SECRET'),
      callbackURL: callbackURL,
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<any> {
    try {
      const naverResponse = profile._json?.response || profile._json;

      const email = naverResponse?.email;
      if (!email) {
        console.error('네이버 이메일 정보를 받아올 수 없습니다. 네이버 개발자 센터에서 이메일 동의 항목을 확인하세요.');
        console.error('Profile structure:', JSON.stringify(profile._json, null, 2));
        return done(
          new BadRequestException(
            '이메일 정보가 필요합니다. 네이버 로그인 시 이메일 제공에 동의해주세요.',
          ),
          null,
        );
      }

      const user = {
        email: email,
        name: naverResponse?.name || naverResponse?.nickname || profile.displayName || profile.username || 'Naver User',
        picture: naverResponse?.profile_image || naverResponse?.profile_image_url,
        provider: 'naver',
        providerId: String(naverResponse?.id || profile.id),
      };

      done(null, user);
    } catch (error) {
      console.error('Naver validate error:', error);
      if (error instanceof HttpException) return done(error, null);
      return done(new UnauthorizedException('네이버 로그인에 실패했습니다.'), null);
    }
  }
}

