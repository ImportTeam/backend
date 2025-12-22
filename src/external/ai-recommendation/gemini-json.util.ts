import axios from 'axios';

type GeminiPart = { text?: string };
type GeminiCandidate = { content?: { parts?: GeminiPart[] } };
type GeminiResponse = { candidates?: GeminiCandidate[] };

function tryParseJson(text: string): any {
  const trimmed = (text || '').trim();
  if (!trimmed) throw new Error('Empty Gemini response');

  // Direct JSON
  try {
    return JSON.parse(trimmed);
  } catch {
    // continue
  }

  // ```json ... ```
  const fenced =
    trimmed.match(/```json\s*([\s\S]*?)\s*```/i) ||
    trimmed.match(/```\s*([\s\S]*?)\s*```/i);
  if (fenced && fenced[1]) {
    const inner = fenced[1].trim();
    return JSON.parse(inner);
  }

  // Try to extract first JSON object/array block
  const firstObj = trimmed.indexOf('{');
  const firstArr = trimmed.indexOf('[');
  const start =
    firstObj === -1
      ? firstArr
      : firstArr === -1
        ? firstObj
        : Math.min(firstObj, firstArr);
  if (start >= 0) {
    const candidate = trimmed.slice(start).trim();
    return JSON.parse(candidate);
  }

  throw new Error('Failed to parse Gemini response as JSON');
}

export type GeminiGenerateJsonOptions = {
  apiKey: string;
  model: string;
  timeoutMs?: number;
  temperature?: number;
};

export async function geminiGenerateJson<T>(
  prompt: string,
  options: GeminiGenerateJsonOptions,
): Promise<T> {
  const timeoutMs = options.timeoutMs ?? 15000;
  const temperature = options.temperature ?? 0.2;

  // Google Generative Language API (Gemini) REST endpoint
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(options.model)}:generateContent?key=${encodeURIComponent(options.apiKey)}`;

  const resp = await axios.post(
    url,
    {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature,
        // Best-effort: if ignored by API, prompt still enforces JSON-only.
        responseMimeType: 'application/json',
      },
    },
    {
      timeout: timeoutMs,
      headers: {
        'Content-Type': 'application/json',
      },
      // Avoid leaking full request details in logs elsewhere
      validateStatus: (status) => status >= 200 && status < 300,
    },
  );

  const data = resp.data as GeminiResponse;
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const text = parts
    .map((p) => p.text)
    .filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
    .join('\n');

  return tryParseJson(text) as T;
}
