import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    const config: any = {
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: process.env.KAKAO_REDIRECT_URI,
      // Kakao는 scope 대신 동의 항목으로 제어
      // scope를 제거하거나 빈 배열로 설정
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
      
      // 이메일 처리: 제공된 이메일 또는 Kakao ID 기반 임시 이메일 생성
      let email = kakaoAccount?.email;
      if (!email) {
        // 이메일 동의를 받지 못한 경우 Kakao ID로 임시 이메일 생성
        email = `kakao_${profile.id}@kakao.local`;
        console.warn(`Kakao 이메일 미제공, 임시 이메일 생성: ${email}`);
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
