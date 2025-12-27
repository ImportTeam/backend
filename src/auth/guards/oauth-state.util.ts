import type { ExecutionContext } from '@nestjs/common';

export type OAuthStatePayload = {
  redirectUri?: string;
};

type RequestWithQuery = {
  query?: Record<string, unknown>;
  originalUrl?: string;
  url?: string;
};

function getFallbackRedirectUri(): string {
  const origin =
    process.env.FRONTEND_URL?.trim() ||
    process.env.NEXT_PUBLIC_FRONTEND_URL?.trim() ||
    'https://picsel.vercel.app';
  return new URL('/oauth-callback', origin).toString();
}

function getRedirectUriFromRawUrl(
  rawUrl: string | undefined,
): string | undefined {
  if (!rawUrl) return undefined;
  try {
    // rawUrl is typically like: /api/auth/google?redirect_uri=...
    const parsed = new URL(rawUrl, 'http://localhost');
    const v = parsed.searchParams.get('redirect_uri');
    return v ?? undefined;
  } catch {
    return undefined;
  }
}

function toBase64Url(input: string): string {
  return Buffer.from(input, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function fromBase64Url(input: string): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(normalized + padding, 'base64').toString('utf8');
}

export function buildOAuthStateFromRequest(ctx: ExecutionContext): string {
  const req = ctx.switchToHttp().getRequest<RequestWithQuery>();
  return buildOAuthStateFromHttpRequest(req);
}

export function buildOAuthStateFromHttpRequest(req: RequestWithQuery): string {
  const redirectUriRaw = req.query?.redirect_uri;
  const redirectUriFromQuery =
    typeof redirectUriRaw === 'string' ? redirectUriRaw : undefined;
  const redirectUriFromUrl = getRedirectUriFromRawUrl(
    req.originalUrl ?? req.url,
  );
  const redirectUri =
    redirectUriFromQuery ?? redirectUriFromUrl ?? getFallbackRedirectUri();

  const payload: OAuthStatePayload = { redirectUri };
  return toBase64Url(JSON.stringify(payload));
}

export function decodeOAuthState(state: unknown): OAuthStatePayload | null {
  if (!state || typeof state !== 'string') return null;
  try {
    const decoded = fromBase64Url(state);
    const parsed: unknown = JSON.parse(decoded);
    if (!parsed || typeof parsed !== 'object') return null;

    const maybeRedirectUri = (parsed as { redirectUri?: unknown }).redirectUri;
    const redirectUri =
      typeof maybeRedirectUri === 'string' ? maybeRedirectUri : undefined;
    return { redirectUri };
  } catch {
    return null;
  }
}
