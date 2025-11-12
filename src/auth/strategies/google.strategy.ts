/**
 * Google 전략 passport 로 구현 
 */

import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    // 프로덕션 URL이 설정되어 있으면 사용, 없으면 개발 URL 사용 (Fallback)
    const prodCallbackURL = configService.get<string>('GOOGLE_REDIRECT_PROD_URI');
    const devCallbackURL = configService.get<string>('GOOGLE_REDIRECT_DEV_URI') || 'http://localhost:3000/api/auth/google/callback';
    const callbackURL = prodCallbackURL || devCallbackURL;

    console.log(`[GoogleStrategy] Callback URL: ${callbackURL}`);

    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { id, name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      name: name.givenName || name.familyName || emails[0].value.split('@')[0],
      picture: photos[0]?.value,
      provider: 'google',
      providerId: String(id), // 숫자를 문자열로 변환
    };
    done(null, user);
  }
}
