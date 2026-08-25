const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY_AUTO || import.meta.env.VITE_GROQ_API_KEY || "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";
const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are a real-time intent classifier for a multi-user group chat workspace called Nothric Collab.
Users in a chat room can talk to each other (humans) OR address/follow-up with AI models (Gemini, GPT, Qwen, Mistral, Cohere, Nvidia).

Analyze the incoming message along with recent room conversation history (if provided) and determine if the user is DIRECTLY ADDRESSING, INSTRUCTING, or FOLLOWING UP with an AI model right now.

Guidelines:
1. Direct Mention: If the user names an AI ("gemini explain this", "gpt write code"), TRIGGER (should_trigger = true, target_models = ["gemini"]).
2. Follow-Up / Continuation: If the user is replying to, correcting, reacting to, or continuing a conversation with a model that recently spoke in history (e.g., "that was just a joke", "explain line 2 again", "thanks gemini", "haha good one", "what about in python?"), TRIGGER that recent model (should_trigger = true, target_models = [model_code]).
3. Human-to-Human: If the user is addressing a human teammate ("Alex what time is lunch?"), do NOT trigger (should_trigger = false).
4. General AI Statement: If the user is expressing a general opinion about AI ("I think GPT is cool"), do NOT trigger (should_trigger = false).

Return ONLY valid JSON matching this schema:
{
  "should_trigger": boolean,
  "target_models": string[] // Array of model codes: "gemini", "gpt", "qwen", "mistral", "cohere", "nemotron"
}`;

export interface HistoryContextMessage {
  sender: string;
  text: string;
  model?: string;
}

export async function classifyMessageIntent(
  message: string,
  historyContext?: HistoryContextMessage[]
): Promise<string[]> {
  const text = message.trim();
  if (!text) return [];

  // Check if auto AI picker is disabled in settings
  const isAutoPickerDisabled = localStorage.getItem('collab-auto-ai-picker') === 'false';
  if (isAutoPickerDisabled) return [];

  const contextFormatted = historyContext && historyContext.length > 0
    ? `Recent Room Conversation History:\n${historyContext.map(h => `[${h.sender}${h.model ? ` (Model: ${h.model})` : ''}]: ${h.text}`).join('\n')}\n\nIncoming Message:\n"${text}"`
    : `Incoming Message:\n"${text}"`;

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "qwen/qwen3.6-27b",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: contextFormatted }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1
      })
    });

    if (!response.ok) return [];

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return [];

    const parsed = JSON.parse(content);
    if (parsed.should_trigger && Array.isArray(parsed.target_models) && parsed.target_models.length > 0) {
      const validModels = new Set(['gemini', 'gpt', 'qwen', 'mistral', 'cohere', 'nemotron']);
      return parsed.target_models.filter((m: string) => validModels.has(m.toLowerCase()));
    }
  } catch (err) {
    console.error('Auto AI Picker classification error:', err);
  }

  return [];
}
