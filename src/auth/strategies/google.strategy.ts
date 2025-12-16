import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
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
    const callbackURL = normalizeOAuthCallbackUrl(
      prodCallbackURL || devCallbackURL,
      'google',
    );

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
      providerId: String(id),
    };
    done(null, user);
  }
}
