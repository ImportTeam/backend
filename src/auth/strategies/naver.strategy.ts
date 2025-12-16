import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(private readonly configService: ConfigService) {
    const prodCallbackURL = configService.get<string>('NAVER_REDIRECT_PROD_URI');
    const devCallbackURL = configService.get<string>('NAVER_REDIRECT_DEV_URI') || 'http://localhost:3000/api/auth/naver/callback';
    const callbackURL = prodCallbackURL || devCallbackURL;

    console.log(`[NaverStrategy] Callback URL: ${callbackURL}`);

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
        return done(new Error('이메일 정보가 필요합니다. 네이버 로그인 시 이메일 제공에 동의해주세요.'), null);
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
      done(error, null);
    }
  }
}

