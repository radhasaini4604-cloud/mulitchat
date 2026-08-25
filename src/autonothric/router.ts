// Auto Nothric classification router using Groq Llama 3.1 8B

const GROQ_API_KEY_AUTO = import.meta.env.VITE_GROQ_API_KEY_AUTO || "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";

export async function classifyPrompt(prompt: string): Promise<'gemini' | 'gpt' | 'qwen' | 'mistral'> {
  const url = 'https://api.groq.com/openai/v1/chat/completions';
  const classificationPrompt = `
Classify the user's prompt into one of these exact categories:
- 'code' (for programming, HTML, CSS, Javascript, scripting, math, debugging)
- 'reasoning' (for deep logic, complex multi-step questions, planning, science, calculations)
- 'creative' (for storytelling, essays, summarization, brainstorming, poetry, writing)
- 'conversational' (for general chat, basic questions, greetings, jokes, opinion)

User Prompt: "${prompt}"

Output ONLY one of these words: 'code', 'reasoning', 'creative', or 'conversational'. Do not output anything else.
`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY_AUTO}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.6-27b',
        messages: [{ role: 'user', content: classificationPrompt }],
        temperature: 0.1,
        max_tokens: 10
      })
    });

    if (!response.ok) {
      throw new Error(`Groq Router request failed with status: ${response.status}`);
    }

    const data = await response.json();
    const result = (data?.choices?.[0]?.message?.content || '').trim().toLowerCase().replace(/['"‘“’`]/g, '');

    console.log(`[Auto Nothric] Classification result raw: "${result}"`);

    if (result.includes('code')) {
      return 'qwen'; // Qwen Coder
    } else if (result.includes('reasoning')) {
      return 'gpt'; // GPT 120B
    } else if (result.includes('creative')) {
      return 'mistral'; // Mistral Large
    } else {
      return 'gemini'; // Gemini 2.5 Flash
    }
  } catch (error) {
    console.error('[Auto Nothric] Router classification failed, falling back to Gemini:', error);
    return 'gemini'; // Fallback
  }
}
