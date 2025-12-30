const axios = require('axios');
require('dotenv').config();

const apiKey = (process.env.GEMINI_API_KEY || '').trim();
const model = (process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite').trim();

if (!apiKey) {
  console.error('GEMINI_API_KEY is not set in environment or .env');
  process.exit(2);
}

(async () => {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model,
    )}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const body = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: '간단한 연결 확인용 테스트입니다. 한 줄로 OK 또는 FAIL을 반환해 주세요.' },
          ],
        },
      ],
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 64,
      },
    };

    const res = await axios.post(url, body, {
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' },
    });

    console.log('HTTP status:', res.status);
    console.log('Response body (truncated):\n', JSON.stringify(res.data, null, 2).slice(0, 3000));
    process.exit(0);
  } catch (err) {
    const status = err?.response?.status ?? err?.status ?? 'unknown';
    const data = err?.response?.data ?? err?.message ?? String(err);
    console.error('Request failed. status=', status);
    try {
      console.error('Response/data:', typeof data === 'object' ? JSON.stringify(data, null, 2) : data);
    } catch {
      console.error('Response/data (raw):', String(data));
    }
    process.exit(1);
  }
})();
