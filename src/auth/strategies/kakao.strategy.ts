/**
 * Kakao 전략 passport 로 구현 
 */

import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    const config: any = {
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: process.env.KAKAO_REDIRECT_URI,
      // 카카오 이메일 정보를 받기 위한 scope 설정
      scope: ['account_email', 'profile_nickname'],
    };

    // Client Secret이 설정되어 있으면 추가
    if (process.env.KAKAO_CLIENT_SECRET) {
      config.clientSecret = process.env.KAKAO_CLIENT_SECRET;
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
