/**
 * Kakao 전략 passport 로 구현 
 */

import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly configService: ConfigService) {
    // 프로덕션 URL이 설정되어 있으면 사용, 없으면 개발 URL 사용 (Fallback)
    const prodCallbackURL = configService.get<string>('KAKAO_REDIRECT_PROD_URI');
    const devCallbackURL = configService.get<string>('KAKAO_REDIRECT_DEV_URI');
    const callbackURL = prodCallbackURL || devCallbackURL;

    // Client Secret 가져오기
    const clientSecret = configService.get<string>('KAKAO_CLIENT_SECRET');

    const config: any = {
      clientID: configService.get<string>('KAKAO_CLIENT_ID'),
      callbackURL: callbackURL,
      // 카카오 이메일 정보를 받기 위한 scope 설정
      scope: ['account_email', 'profile_nickname'],
    };

    // Client Secret이 설정되어 있으면 추가
    if (clientSecret) {
      config.clientSecret = clientSecret;
    }

    super(config);
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
    try {
      const kakaoAccount = profile._json?.kakao_account;
      const properties = profile._json?.properties;
      
      // 실제 이메일이 제공되지 않으면 에러 처리
      const email = kakaoAccount?.email;
      if (!email) {
        console.error('카카오 이메일 정보를 받아올 수 없습니다. 카카오 개발자 콘솔에서 이메일 동의 항목을 확인하세요.');
        return done(new Error('이메일 정보가 필요합니다. 카카오 로그인 시 이메일 제공에 동의해주세요.'), null);
      }

      const user = {
        email: email,
        name: profile.username || profile.displayName || kakaoAccount?.profile?.nickname || properties?.nickname || 'Kakao User',
        picture: properties?.profile_image || kakaoAccount?.profile?.profile_image_url,
        provider: 'kakao',
        providerId: String(profile.id), // 숫자를 문자열로 변환
      };
      
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
}
