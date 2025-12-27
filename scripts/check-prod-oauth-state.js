/*
  Verifies whether production OAuth start redirect includes `state=`.
  - Does NOT follow redirects (stops at 302)
  - Prints Location + whether state is present

  Run:
    node scripts/check-prod-oauth-state.js

  Optional custom URL:
    node scripts/check-prod-oauth-state.js "https://api.picsel.kr/api/auth/google?redirect_uri=https://picsel.vercel.app/oauth-callback"
*/

const https = require('node:https');

const DEFAULT_TARGET =
  'https://api.picsel.kr/api/auth/google?redirect_uri=https://picsel.vercel.app/oauth-callback';

function toSingleHeaderValue(value) {
  if (Array.isArray(value)) return value[0];
  return value;
}

function hasStateParam(location) {
  try {
    const url = new URL(location);
    // exact param presence check
    if (url.searchParams.has('state')) return true;
  } catch {
    // fall back to raw check for non-standard/relative locations
  }
  return /(?:\?|&)state=/.test(location);
}

function requestOnce(targetUrl) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      targetUrl,
      {
        method: 'GET',
        headers: {
          // keep it simple & deterministic
          'user-agent': 'picsel-oauth-state-check/1.0',
          accept: '*/*',
        },
      },
      (res) => {
        const statusCode = res.statusCode ?? 0;
        const location = toSingleHeaderValue(res.headers.location);

        // We intentionally do not consume the body; end quickly.
        res.resume();
        res.on('end', () => {
          resolve({ statusCode, location });
        });
      },
    );

    req.on('error', reject);
    req.end();
  });
}

async function main() {
  const target = process.argv[2] || DEFAULT_TARGET;

  const { statusCode, location } = await requestOnce(target);

  const locationStr = typeof location === 'string' ? location : '';
  const statePresent = locationStr ? hasStateParam(locationStr) : false;
  const patchApplied = statePresent;

  console.log(`status: ${statusCode}`);
  console.log(`Location: ${locationStr || '(missing)'}`);
  console.log(`statePresent: ${statePresent}`);
  console.log(`PATCH_APPLIED = ${patchApplied}`);

  // Exit code is informational: 0 always, per requirement.
}

main().catch((err) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`error: ${message}`);
  process.exitCode = 1;
});
