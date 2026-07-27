import { getSystemPrompt } from '../../prompt';
import type { HistoryMessage } from '../common';
import { 
  buildOpenAIMessages, 
  CLOUDFLARE_ACCOUNT_ID, 
  CLOUDFLARE_API_TOKEN 
} from '../common';

export async function queryCloudflare(
  prompt: string,
  model: string = '@cf/qwen/qwen2.5-coder-32b-instruct',
  signal?: AbortSignal
): Promise<string> {
  const url = `/cloudflare-api/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${model}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: getSystemPrompt() },
          { role: 'user', content: prompt }
        ]
      }),
      signal
    });

    if (!response.ok) {
      throw new Error(`Cloudflare HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.result?.response || data.result?.choices?.[0]?.message?.content || '';
  } catch (error) {
    console.error('Cloudflare query failed:', error);
    throw error;
  }
}

export async function streamCloudflare(
  promptOrHistory: string | HistoryMessage[],
  onChunk: (text: string) => void,
  model: string = '@cf/qwen/qwen2.5-coder-32b-instruct',
  signal?: AbortSignal
): Promise<string> {
  const url = `/cloudflare-api/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${model}`;
  const { messages } = buildOpenAIMessages(promptOrHistory, undefined);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages,
        stream: true
      }),
      signal
    });

    if (!response.ok) {
      throw new Error(`Cloudflare stream HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('Response body is not readable');

    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const cleaned = line.trim();
        if (!cleaned || cleaned === 'data: [DONE]') continue;
        if (cleaned.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(cleaned.substring(6));
            const chunk = parsed.response || parsed.choices?.[0]?.delta?.content || '';
            if (chunk) {
              fullText += chunk;
              onChunk(fullText);
            }
          } catch (e) {
            console.warn('Failed to parse Cloudflare stream chunk:', e);
          }
        }
      }
    }
    return fullText;
  } catch (error) {
    console.error('Cloudflare streaming failed:', error);
    throw error;
  }
}
