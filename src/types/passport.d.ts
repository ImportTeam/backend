declare module 'passport-google-oauth20' {
  import { Strategy as PassportStrategy } from 'passport-strategy';

  export interface Profile {
    id: string;
    displayName: string;
    name?: {
      familyName?: string;
      givenName?: string;
    };
    emails?: Array<{ value: string; verified?: boolean }>;
    photos?: Array<{ value: string }>;
    provider: string;
    _raw: string;
    _json: any;
  }

  export type VerifyCallback = (
    err?: Error | null,
    user?: any,
    info?: any,
  ) => void;
  export type VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) => void;

  export class Strategy extends PassportStrategy {
    constructor(options: any, verify: VerifyFunction);
    name: string;
  }
}

declare module 'passport-kakao' {
  import { Strategy as PassportStrategy } from 'passport-strategy';

  export class Strategy extends PassportStrategy {
    constructor(options: any, verify: any);
    name: string;
  }
}

declare module 'passport-naver' {
  import { Strategy as PassportStrategy } from 'passport-strategy';

  export class Strategy extends PassportStrategy {
    constructor(options: any, verify: any);
    name: string;
  }
}

declare module 'passport-jwt' {
  import { Strategy as PassportStrategy } from 'passport-strategy';

  export interface ExtractJwt {
    fromAuthHeaderAsBearerToken(): (req: any) => string | null;
    fromHeader(header_name: string): (req: any) => string | null;
    fromBodyField(field_name: string): (req: any) => string | null;
    fromUrlQueryParameter(param_name: string): (req: any) => string | null;
    fromExtractors(
      extractors: Array<(req: any) => string | null>,
    ): (req: any) => string | null;
  }

  export const ExtractJwt: ExtractJwt;

  export interface StrategyOptions {
    jwtFromRequest: (req: any) => string | null;
    secretOrKey: string;
    issuer?: string;
    audience?: string;
    algorithms?: string[];
    ignoreExpiration?: boolean;
    passReqToCallback?: boolean;
  }

  export class Strategy extends PassportStrategy {
    constructor(
      options: StrategyOptions,
      verify: (payload: any, done: any) => void,
    );
    name: string;
  }
}
