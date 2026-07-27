// AI Management for Imagine Section (NVIDIA and Groq models)

const getNvidiaApiKey = () => localStorage.getItem('api-key-nvidia') || import.meta.env.VITE_NVIDIA_API_KEY || "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";
const getGroqApiKey = () => localStorage.getItem('api-key-groq') || import.meta.env.VITE_GROQ_API_KEY || "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";

export interface GenerationOptions {
  prompt: string;
  ratio: string;
  mode: string; // 'image' | 'agent'
  model?: string; // Selected Cloudflare model
}

/**
 * Sanitizes the enhanced prompt from Groq to ensure it doesn't contain conversational filler,
 * markdown formatting (like bold/italics), emojis, or double quotes, making it fully valid
 * for NVIDIA NIM and other playground APIs.
 */
function sanitizePrompt(prompt: string): string {
  let cleaned = prompt.trim();

  // 1. Remove common conversational introductory phrases (case-insensitive)
  const prefixesToRemove = [
    /^here is the enhanced prompt:\s*/i,
    /^here is an enhanced version of your prompt:\s*/i,
    /^here is a detailed, artistic prompt based on your input:\s*/i,
    /^sure, here is the enhanced prompt:\s*/i,
    /^enhanced prompt:\s*/i,
    /^enhanced version:\s*/i,
    /^here's an enhanced prompt:\s*/i,
    /^here is the enhanced version:\s*/i,
    /^here is the prompt:\s*/i,
    /^prompt:\s*/i,
    /^the enhanced prompt is:\s*/i,
  ];

  for (const regex of prefixesToRemove) {
    cleaned = cleaned.replace(regex, "");
  }

  cleaned = cleaned.trim();

  // 2. Remove markdown formatting tags (like **bold**, *italics*, and backticks)
  cleaned = cleaned.replace(/^\*\*+([\s\S]*?)\*\*+$/, "$1");
  cleaned = cleaned.replace(/^\*+([\s\S]*?)\*+$/, "$1");
  cleaned = cleaned.replace(/^`+([\s\S]*?)`+$/, "$1");
  cleaned = cleaned.trim();

  // 3. Remove leading and trailing double or single quotation marks
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.substring(1, cleaned.length - 1);
  } else if (cleaned.startsWith("'") && cleaned.endsWith("'")) {
    cleaned = cleaned.substring(1, cleaned.length - 1);
  }
  cleaned = cleaned.trim();

  // Repeat markdown/quote stripping once more in case of nested formats (e.g. **"prompt"**)
  cleaned = cleaned.replace(/^\*\*+([\s\S]*?)\*\*+$/, "$1");
  cleaned = cleaned.replace(/^\*+([\s\S]*?)\*+$/, "$1");
  cleaned = cleaned.trim();
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.substring(1, cleaned.length - 1);
  } else if (cleaned.startsWith("'") && cleaned.endsWith("'")) {
    cleaned = cleaned.substring(1, cleaned.length - 1);
  }
  cleaned = cleaned.trim();

  // 4. Strip emojis (some APIs/Playgrounds crash or show validation errors with emojis)
  cleaned = cleaned.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F0F5}\u{1F004}\u{1F170}-\u{1F251}\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F300}-\u{1F5FF}]/gu, '');

  return cleaned.trim();
}

/**
 * Generates an image using NVIDIA models.
 * Calls the Flux model on NVIDIA GenAI API and returns a base64 Data URL.
 */
export async function generateWithNvidia(options: GenerationOptions): Promise<string> {
  console.log("Calling NVIDIA generative model with options:", options);

  const apiKey = getNvidiaApiKey();
  const endpoint = "/nvidia-api/v1/genai/black-forest-labs/flux.2-klein-4b";

  // Map ratio to standard dimensions
  let width = 1024;
  let height = 1024;
  if (options.ratio === "16:9") {
    width = 1216;
    height = 688;
  } else if (options.ratio === "9:16") {
    width = 688;
    height = 1216;
  } else if (options.ratio === "4:3") {
    width = 1152;
    height = 864;
  } else if (options.ratio === "3:4") {
    width = 864;
    height = 1152;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt: options.prompt,
      width: width,
      height: height,
      seed: Math.floor(Math.random() * 1000000),
      steps: 4
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`NVIDIA API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const base64Data = data?.artifacts?.[0]?.base64;
  if (!base64Data) {
    throw new Error("No image data found in NVIDIA API response");
  }

  return `data:image/png;base64,${base64Data}`;
}

/**
 * Generates an image using Cloudflare Workers AI models.
 * Calls the selected Flux model on Cloudflare REST API and returns a base64 Data URL.
 */
export async function generateWithCloudflare(options: GenerationOptions): Promise<string> {
  console.log("Calling Cloudflare Workers AI model with options:", options);

  const accountId = import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID || "a3fc173c2b06b226e3b3be38fe1c126b";
  const apiToken = import.meta.env.VITE_CLOUDFLARE_API_TOKEN || "cfat_YhefWQbjhjrbi1F0outvPLvyWgOtkeXVN0Ml1wMZ3fdcf2b1";
  
  const modelId = options.model || "@cf/black-forest-labs/flux-1-schnell";
  const endpoint = `/cloudflare-api/client/v4/accounts/${accountId}/ai/run/${modelId}`;

  // Map ratio to standard dimensions (staying within Megapixel limit)
  let width = 1024;
  let height = 1024;
  if (options.ratio === "16:9") {
    width = 1024;
    height = 576;
  } else if (options.ratio === "9:16") {
    width = 576;
    height = 1024;
  } else if (options.ratio === "4:3") {
    width = 1024;
    height = 768;
  } else if (options.ratio === "3:4") {
    width = 768;
    height = 1024;
  } else if (options.ratio === "2:3") {
    width = 832;
    height = 1248;
  }

  const isMultipart = modelId.includes('flux-2-dev') || modelId.includes('flux-2-klein-4b');

  const headers: HeadersInit = {
    "Authorization": `Bearer ${apiToken}`,
    "Accept": "application/json",
  };

  let body: any;

  if (isMultipart) {
    const formData = new FormData();
    formData.append("prompt", options.prompt);
    formData.append("width", width.toString());
    formData.append("height", height.toString());
    body = formData;
  } else {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify({
      prompt: options.prompt,
      width: width,
      height: height
    });
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: headers,
    body: body
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudflare AI Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const base64Data = data?.result?.image;
  if (!base64Data) {
    throw new Error("No image data found in Cloudflare Workers AI response");
  }

  return `data:image/png;base64,${base64Data}`;
}


/**
 * Generates an image using Groq models.
 * Place your Groq API/SDK logic here.
 */
export async function generateWithGroq(options: GenerationOptions): Promise<void> {
  console.log("Calling Groq generative model with options:", options);
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

/**
 * Calls the Groq API with llama-3.1-8b-instant to enhance the text prompt,
 * making it more professional, detailed, artistic, and visually descriptive.
 */
export async function enhancePromptWithGroq(prompt: string): Promise<string> {
  const apiKey = getGroqApiKey();
  const model = "llama-3.1-8b-instant";
  const endpoint = "https://api.groq.com/openai/v1/chat/completions";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: "You are an expert prompt engineer for Flux image generators. Your job is to take a simple, basic image generation prompt and enhance it. Make it highly professional, detailed, artistic, and visually descriptive. Keep the final enhanced prompt concise and focused, under 45 words, avoiding unnecessary wordiness or repetition. IMPORTANT: You must output ONLY the final enhanced prompt. Do NOT wrap the prompt in quotation marks. Do NOT add any introduction, greeting, explanation, notes, markdown formatting, or asterisks. Your output must start directly with the description of the image."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const rawEnhancedPrompt = data?.choices?.[0]?.message?.content?.trim();
    if (rawEnhancedPrompt) {
      return sanitizePrompt(rawEnhancedPrompt);
    }
    return prompt;
  } catch (error) {
    console.error("Failed to enhance prompt with Groq:", error);
    throw error;
  }
}

/**
 * Calls the Groq API with llama-3.1-8b-instant to summarize the prompt
 * into a concise 2-to-3 word title.
 */
export async function summarizePromptWithGroq(prompt: string): Promise<string> {
  const apiKey = getGroqApiKey();
  const model = "llama-3.1-8b-instant";
  const endpoint = "https://api.groq.com/openai/v1/chat/completions";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: "You are a precise text summarizer. Your job is to take an image prompt description and summarize it into exactly 2 to 3 words. Do NOT include punctuation. Do NOT wrap it in quotation marks. Output ONLY the 2-3 word summary. Example: 'A cozy cabin in the winter forest' -> 'Cozy Winter Cabin'."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 10
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    let summary = data?.choices?.[0]?.message?.content?.trim();
    if (summary) {
      // Clean up punctuation and quotes
      summary = summary.replace(/^["']|["']$/g, "").replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
      return summary;
    }
    return "";
  } catch (error) {
    console.error("Failed to summarize prompt with Groq:", error);
    return "";
  }
}

