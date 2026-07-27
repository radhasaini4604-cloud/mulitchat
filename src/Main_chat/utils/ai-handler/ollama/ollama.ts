import { getSystemPrompt } from '../../prompt';
import type { HistoryMessage } from '../common';

export async function queryOllama(
  prompt: string,
  model: string = 'qwen3.5:4b',
  systemPrompt?: string,
  signal?: AbortSignal
): Promise<string> {
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const url = isLocal ? '/ollama-api/api/generate' : 'http://localhost:11434/api/generate';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        model, 
        prompt, 
        system: systemPrompt || getSystemPrompt(), 
        stream: false, 
        options: { num_ctx: 1024, num_keepalive: "1m" } 
      }),
      signal,
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.response || '';
  } catch (error) {
    console.error('Ollama connection/fetch failed:', error);
    throw error;
  }
}

export async function streamOllama(
  promptOrHistory: string | HistoryMessage[],
  onChunk: (text: string) => void,
  model: string = 'qwen3.5:4b',
  systemPrompt?: string,
  signal?: AbortSignal
): Promise<string> {
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const url = isLocal ? '/ollama-api/api/chat' : 'http://localhost:11434/api/chat';

  try {
    const messages: any[] = [];
    const system = systemPrompt || getSystemPrompt();
    if (system) {
      messages.push({ role: 'system', content: system });
    }

    if (typeof promptOrHistory === 'string') {
      messages.push({ role: 'user', content: promptOrHistory });
    } else {
      promptOrHistory.forEach((msg) => {
        messages.push({
          role: msg.role,
          content: msg.text
        });
      });
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        model, 
        messages,
        stream: true, 
        options: { num_ctx: 2048, num_keepalive: "1m" } 
      }),
      signal,
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

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
        if (line.trim() === '') continue;
        try {
          const parsed = JSON.parse(line);
          const chunk = parsed.message?.content || '';
          if (chunk) {
            fullText += chunk;
            onChunk(fullText);
          }
        } catch (e) {
          console.warn('Failed to parse JSON line from stream:', e);
        }
      }
    }
    return fullText;
  } catch (error) {
    console.error('Ollama streaming fetch failed:', error);
    throw error;
  }
}

export async function getLocalOllamaModels(): Promise<string[]> {
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const url = isLocal ? '/ollama-api/api/tags' : 'http://localhost:11434/api/tags';

  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return (data.models || []).map((m: any) => m.name);
    }
  } catch (e) {
    console.warn("Local Ollama is not running or unreachable:", e);
  }
  return [];
}
