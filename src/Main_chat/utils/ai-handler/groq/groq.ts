import { getSystemPrompt } from '../../prompt';
import type { AttachmentData, HistoryMessage } from '../common';
import { 
  buildOpenAIMessages, 
  GROQ_API_KEY 
} from '../common';

export async function queryGroq(
  prompt: string,
  systemPrompt?: string,
  attachments?: AttachmentData[],
  model: string = "openai/gpt-oss-120b"
): Promise<string> {
  const endpoint = "https://api.groq.com/openai/v1/chat/completions";
  let targetModel = model;
  const messages: any[] = [
    { role: "system", content: systemPrompt || getSystemPrompt() }
  ];

  const imageAttachment = attachments?.find(a => a.type === 'image');
  if (imageAttachment && imageAttachment.base64) {
    targetModel = "meta-llama/llama-4-scout-17b-16e-instruct";
    messages.push({
      role: "user",
      content: [
        { type: "text", text: prompt },
        { type: "image_url", image_url: { url: `data:${imageAttachment.mimeType || 'image/png'};base64,${imageAttachment.base64}` } }
      ]
    });
  } else {
    messages.push({ role: "user", content: prompt });
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: targetModel,
        messages: messages,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "";
  } catch (error) {
    console.error("Groq query failed:", error);
    throw error;
  }
}

export async function streamGroq(
  promptOrHistory: string | HistoryMessage[],
  onChunk: (text: string) => void,
  attachments?: AttachmentData[],
  model: string = "openai/gpt-oss-120b",
  signal?: AbortSignal
): Promise<string> {
  const endpoint = "https://api.groq.com/openai/v1/chat/completions";
  const { messages, targetModelOverride } = buildOpenAIMessages(promptOrHistory, attachments);
  const targetModel = targetModelOverride || model;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: targetModel,
        messages: messages,
        stream: true
      }),
      signal
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API Error (${response.status}): ${errText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("Response body is not readable");

    const decoder = new TextDecoder();
    let fullText = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const cleanedLine = line.trim();
        if (!cleanedLine || cleanedLine === "data: [DONE]") continue;

        if (cleanedLine.startsWith("data: ")) {
          try {
            const parsed = JSON.parse(cleanedLine.substring(6));
            const chunk = parsed.choices?.[0]?.delta?.content || "";
            if (chunk) {
              fullText += chunk;
              onChunk(fullText);
            }
          } catch (e) {
            console.warn("Failed to parse SSE JSON line from Groq stream:", e);
          }
        }
      }
    }

    return fullText;
  } catch (error) {
    console.error("Groq streaming fetch failed:", error);
    throw error;
  }
}
