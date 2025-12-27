import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { buildOAuthStateFromRequest } from './oauth-state.util';

@Injectable()
export class NaverAuthGuard extends AuthGuard('naver') {
  getAuthenticateOptions(ctx: ExecutionContext): Record<string, unknown> {
    const state = buildOAuthStateFromRequest(ctx);
    return { state };
  }
}
