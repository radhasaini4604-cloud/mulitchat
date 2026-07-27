import { getSystemPrompt } from '../../prompt';
import type { HistoryMessage } from '../common';
import { 
  buildOpenAIMessages, 
  COHERE_API_KEY 
} from '../common';

export async function queryCohere(
  prompt: string,
  model: string = 'command-r-plus-08-2024',
  signal?: AbortSignal
): Promise<string> {
  const url = 'https://api.cohere.com/v2/chat';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: getSystemPrompt() },
          { role: 'user', content: prompt }
        ]
      }),
      signal
    });

    if (!response.ok) {
      throw new Error(`Cohere HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.message?.content?.[0]?.text || '';
  } catch (error) {
    console.error('Cohere query failed:', error);
    throw error;
  }
}

export async function streamCohere(
  promptOrHistory: string | HistoryMessage[],
  onChunk: (text: string) => void,
  model: string = 'command-r-plus-08-2024',
  signal?: AbortSignal
): Promise<string> {
  const url = 'https://api.cohere.com/v2/chat';
  const { messages } = buildOpenAIMessages(promptOrHistory, undefined);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true
      }),
      signal
    });

    if (!response.ok) {
      throw new Error(`Cohere stream HTTP error! status: ${response.status}`);
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
        if (!cleaned) continue;
        if (cleaned.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(cleaned.substring(6));
            if (parsed.type === 'content-delta') {
               const chunk = parsed.delta?.message?.content?.text || '';
               if (chunk) {
                 fullText += chunk;
                 onChunk(fullText);
               }
            }
          } catch (e) {
            console.warn('Failed to parse Cohere stream chunk:', e);
          }
        }
      }
    }
    return fullText;
  } catch (error) {
    console.error('Cohere streaming failed:', error);
    throw error;
  }
}
