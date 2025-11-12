/**
 * Google 전략 passport 로 구현 
 */

import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    // NODE_ENV에 따라 다른 Redirect URI 사용
    const callbackURL = 
      process.env.NODE_ENV === 'development' 
        ? process.env.GOOGLE_REDIRECT_DEV_URI 
        : process.env.GOOGLE_REDIRECT_URI;

    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
