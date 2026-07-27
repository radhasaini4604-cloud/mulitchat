import { getSystemPrompt } from '../../prompt';
import type { HistoryMessage } from '../common';
import { 
  buildOpenAIMessages, 
  MISTRAL_API_KEY 
} from '../common';

export async function queryMistral(
  prompt: string,
  model: string = 'open-mistral-nemo',
  signal?: AbortSignal
): Promise<string> {
  const url = 'https://api.mistral.ai/v1/chat/completions';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MISTRAL_API_KEY}`,
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
      throw new Error(`Mistral HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (error) {
    console.error('Mistral query failed:', error);
    throw error;
  }
}

export async function streamMistral(
  promptOrHistory: string | HistoryMessage[],
  onChunk: (text: string) => void,
  model: string = 'open-mistral-nemo',
  signal?: AbortSignal
): Promise<string> {
  const url = 'https://api.mistral.ai/v1/chat/completions';
  const { messages } = buildOpenAIMessages(promptOrHistory, undefined);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MISTRAL_API_KEY}`,
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
      throw new Error(`Mistral stream HTTP error! status: ${response.status}`);
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
            const chunk = parsed.choices?.[0]?.delta?.content || '';
            if (chunk) {
              fullText += chunk;
              onChunk(fullText);
            }
          } catch (e) {
            console.warn('Failed to parse Mistral stream chunk:', e);
          }
        }
      }
    }
    return fullText;
  } catch (error) {
    console.error('Mistral streaming failed:', error);
    throw error;
  }
}
