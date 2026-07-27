import { getSystemPrompt } from '../../prompt';
import type { AttachmentData, HistoryMessage } from '../common';
import { 
  fetchWithRetry, 
  GEMINI_API_KEY 
} from '../common';

export async function queryGemini(
  prompt: string,
  attachments?: AttachmentData[],
  model: string = 'gemini-2.5-flash-lite'
): Promise<string> {
  try {
    const parts: any[] = [{ text: prompt }];
    if (attachments) {
      attachments.forEach(att => {
        if (att.base64 && att.mimeType) {
          parts.push({
            inlineData: {
              mimeType: att.mimeType,
              data: att.base64
            }
          });
        }
      });
    }

    const response = await fetchWithRetry(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          systemInstruction: {
            parts: [{ text: getSystemPrompt() }]
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (error) {
    console.error('Gemini query failed:', error);
    throw error;
  }
}

export async function streamGemini(
  promptOrHistory: string | HistoryMessage[],
  onChunk: (text: string) => void,
  attachments?: AttachmentData[],
  model: string = 'gemini-2.5-flash-lite',
  signal?: AbortSignal
): Promise<string> {
  try {
    const contents: any[] = [];
    let history: HistoryMessage[];
    if (typeof promptOrHistory === 'string') {
      history = [{ role: 'user', text: promptOrHistory, attachments }];
    } else {
      history = promptOrHistory;
    }

    history.forEach((msg) => {
      const role = msg.role === 'assistant' ? 'model' : 'user';
      const parts: any[] = [{ text: msg.text }];
      if (msg.attachments) {
        msg.attachments.forEach(att => {
          if (att.base64 && att.mimeType) {
            parts.push({
              inlineData: {
                mimeType: att.mimeType,
                data: att.base64
              }
            });
          }
        });
      }
      contents.push({ role, parts });
    });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`;

    // Request
    const response = await fetchWithRetry(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: getSystemPrompt() }]
        }
      }),
      signal
    });

    if (!response.ok) {
      throw new Error(`Gemini stream HTTP error! status: ${response.status}`);
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
        if (!cleaned || !cleaned.startsWith('data: ')) continue;
        try {
          const parsed = JSON.parse(cleaned.substring(6));
          const candidate = parsed.candidates?.[0];
          const part = candidate?.content?.parts?.[0];

          if (part) {
            const chunk = part.text || '';
            if (chunk) {
              fullText += chunk;
              onChunk(fullText);
            }
          }
        } catch (e) {
          console.warn('Failed to parse Gemini stream chunk:', e);
        }
      }
    }

    return fullText;
  } catch (error) {
    console.error('Gemini streaming failed:', error);
    throw error;
  }
}
