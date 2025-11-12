/**
 * Naver 전략 passport 로 구현 
 */

import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    // NODE_ENV에 따라 다른 Redirect URI 사용
    const callbackURL = 
      process.env.NODE_ENV === 'development' 
        ? process.env.NAVER_REDIRECT_DEV_URI 
        : process.env.NAVER_REDIRECT_URI;

    // 네이버 OAuth 설정
    // passport-naver는 내부적으로 네이버 엔드포인트를 사용하므로 기본 설정만 필요
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: callbackURL,
      // 회원이름, 연락처 이메일 주소 스코프
      // 네이버는 profile 스코프로 이름을 받아옴
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<any> {
    try {
      // Naver profile 구조: 네이버는 response 객체로 데이터를 반환
      const naverResponse = profile._json?.response || profile._json;
      
      // 실제 이메일이 제공되지 않으면 에러 처리
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
        providerId: String(naverResponse?.id || profile.id), // 네이버 ID는 response.id에 있음
      };
      
      done(null, user);
    } catch (error) {
      console.error('Naver validate error:', error);
      done(error, null);
    }
  }
}

