// Usage:
//   node scripts/test/probe-login.mjs
//   node scripts/test/probe-login.mjs https://api.picsel.kr
//   node scripts/test/probe-login.mjs https://www.picsel.kr
//   EMAIL=... PASSWORD=... node scripts/test/probe-login.mjs
//
// Purpose:
// - Quickly verify whether requests are going to the backend (api.picsel.kr)
//   or accidentally to the frontend (www.picsel.kr), and inspect status/body.

const bases = process.argv.slice(2);
const targets = (bases.length ? bases : [
  'https://api.picsel.kr',
  'https://www.picsel.kr',
]).map((b) => b.replace(/\/$/, ''));

const email = process.env.EMAIL ?? 'noone@example.com';
const password = process.env.PASSWORD ?? 'wrong';

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function summarizeBody(text) {
  const json = safeJsonParse(text);
  if (json) return JSON.stringify(json, null, 2).slice(0, 2000);
  return (text || '').slice(0, 2000);
}

async function probe(base) {
  const url = `${base}/api/auth/login`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const text = await res.text();
  console.log('---');
  console.log('URL:', url);
  console.log('STATUS:', res.status);
  console.log('BODY:', summarizeBody(text));
}

(async () => {
  for (const base of targets) {
    try {
      await probe(base);
    } catch (err) {
      console.log('---');
      console.log('URL base:', base);
      console.log('ERROR:', err?.message ?? String(err));
    }
  }
})();
