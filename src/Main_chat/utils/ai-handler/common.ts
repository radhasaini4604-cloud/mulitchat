import { getSystemPrompt } from '../../../groupchat/prompt';

export interface AttachmentData {
  name: string;
  type: string; // 'image' | 'pdf' | etc.
  base64?: string;
  content?: string;
  mimeType?: string;
}

export interface HistoryMessage {
  role: 'user' | 'assistant';
  text: string;
  attachments?: AttachmentData[];
}

export function buildOpenAIMessages(
  promptOrHistory: string | HistoryMessage[], 
  attachments?: AttachmentData[], 
  systemPrompt: string = getSystemPrompt('default')
): { messages: any[], targetModelOverride?: string } {
  let history: HistoryMessage[];
  if (typeof promptOrHistory === 'string') {
    history = [{ role: 'user', text: promptOrHistory, attachments }];
  } else {
    history = promptOrHistory;
  }

  let targetModelOverride: string | undefined = undefined;
  const messages: any[] = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }

  history.forEach((msg) => {
    const role = msg.role;
    const imageAttachment = msg.attachments?.find(a => a.type?.startsWith('image') || a.mimeType?.startsWith('image'));
    if (imageAttachment && imageAttachment.base64) {
      targetModelOverride = "meta-llama/llama-4-scout-17b-16e-instruct";
      messages.push({
        role,
        content: [
          { type: "text", text: msg.text },
          { type: "image_url", image_url: { url: `data:${imageAttachment.mimeType || 'image/png'};base64,${imageAttachment.base64}` } }
        ]
      });
    } else {
      messages.push({ role, content: msg.text });
    }
  });

  return { messages, targetModelOverride };
}

// API Keys & Configs
export let GEMINI_API_KEY = localStorage.getItem('api-key-gemini') || import.meta.env.VITE_GEMINI_API_KEY || "AQ.Ab8RN6K_T5ABmH7rHu1qjX5xvrxquU9jWeCtB-t3f2W1syTjpA";
export let GROQ_API_KEY = localStorage.getItem('api-key-groq') || import.meta.env.VITE_GROQ_API_KEY || "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";
export let CLOUDFLARE_ACCOUNT_ID = localStorage.getItem('api-key-cloudflare-account') || import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID || "a3fc173c2b06b226e3b3be38fe1c126b";
export let CLOUDFLARE_API_TOKEN = localStorage.getItem('api-key-cloudflare-token') || import.meta.env.VITE_CLOUDFLARE_API_TOKEN || "cfat_YhefWQbjhjrbi1F0outvPLvyWgOtkeXVN0Ml1wMZ3fdcf2b1";
export let MISTRAL_API_KEY = localStorage.getItem('api-key-mistral') || import.meta.env.VITE_MISTRAL_API_KEY || "FK0P9RwbNwJ64WbVVKdtZHKV38JKlfpi";
export let COHERE_API_KEY = localStorage.getItem('api-key-cohere') || import.meta.env.VITE_COHERE_API_KEY || "a2MyL0uO4uw8pb8ubcWkBSTnOBwJr8Ii6JlqXSB9";
export let NVIDIA_API_KEY = localStorage.getItem('api-key-nvidia') || import.meta.env.VITE_NVIDIA_API_KEY || "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";
export let TAVILY_API_KEY = localStorage.getItem('api-key-tavily') || import.meta.env.VITE_TAVILY_API_KEY || "";
export let MEM0_API_KEY = localStorage.getItem('api-key-mem0') || import.meta.env.VITE_MEM0_API_KEY || "m0-rPBgzpHeE3vxyb726fS0q5XJoPqiHHRGFW5sUQdb";

if (typeof window !== 'undefined') {
  window.addEventListener('api-keys-changed', () => {
    GEMINI_API_KEY = localStorage.getItem('api-key-gemini') || import.meta.env.VITE_GEMINI_API_KEY || "AQ.Ab8RN6K_T5ABmH7rHu1qjX5xvrxquU9jWeCtB-t3f2W1syTjpA";
    GROQ_API_KEY = localStorage.getItem('api-key-groq') || import.meta.env.VITE_GROQ_API_KEY || "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";
    CLOUDFLARE_ACCOUNT_ID = localStorage.getItem('api-key-cloudflare-account') || import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID || "a3fc173c2b06b226e3b3be38fe1c126b";
    CLOUDFLARE_API_TOKEN = localStorage.getItem('api-key-cloudflare-token') || import.meta.env.VITE_CLOUDFLARE_API_TOKEN || "cfat_YhefWQbjhjrbi1F0outvPLvyWgOtkeXVN0Ml1wMZ3fdcf2b1";
    MISTRAL_API_KEY = localStorage.getItem('api-key-mistral') || import.meta.env.VITE_MISTRAL_API_KEY || "FK0P9RwbNwJ64WbVVKdtZHKV38JKlfpi";
    COHERE_API_KEY = localStorage.getItem('api-key-cohere') || import.meta.env.VITE_COHERE_API_KEY || "a2MyL0uO4uw8pb8ubcWkBSTnOBwJr8Ii6JlqXSB9";
    NVIDIA_API_KEY = localStorage.getItem('api-key-nvidia') || import.meta.env.VITE_NVIDIA_API_KEY || "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";
    TAVILY_API_KEY = localStorage.getItem('api-key-tavily') || import.meta.env.VITE_TAVILY_API_KEY || "";
    MEM0_API_KEY = localStorage.getItem('api-key-mem0') || import.meta.env.VITE_MEM0_API_KEY || "m0-rPBgzpHeE3vxyb726fS0q5XJoPqiHHRGFW5sUQdb";
  });
}

export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  _maxRetries = 1,
  _delayMs = 1500
): Promise<Response> {
  return fetch(url, options);
}

export interface RoutedParams {
  isRouted: boolean;
  provider: 'gemini' | 'groq' | null;
}

export function checkRouting(attachments?: AttachmentData[]): RoutedParams {
  if (!attachments || attachments.length === 0) {
    return { isRouted: false, provider: null };
  }
  const hasPdf = attachments.some(a => a.type === 'pdf');
  const hasImage = attachments.some(a => a.type === 'image');

  if (hasPdf) {
    return { isRouted: true, provider: 'gemini' };
  }
  if (hasImage) {
    return { isRouted: true, provider: 'groq' };
  }
  return { isRouted: false, provider: null };
}

export interface SearchSource {
  title: string;
  url: string;
  favicon?: string;
  siteName?: string;
}

export interface TavilySearchResult {
  resultsText: string;
  searchSources: SearchSource[];
}

export async function fetchTavilySearch(query: string): Promise<TavilySearchResult> {
  if (!TAVILY_API_KEY) {
    console.warn("Tavily API key is missing. Skipping search.");
    return {
      resultsText: "Error: Web search is currently unavailable (API key missing).",
      searchSources: []
    };
  }

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query: query,
        search_depth: "basic",
        include_answer: false
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const resultsText = data.results
      ?.map((r: any) => `[Source: ${r.title}] (${r.url}): ${r.content}`)
      .join("\n\n") || "No search results found.";

    const searchSources: SearchSource[] = data.results?.map((r: any) => {
      let siteName = '';
      try {
        const urlObj = new URL(r.url);
        siteName = urlObj.hostname.replace('www.', '');
      } catch (e) {
        siteName = 'Web Source';
      }
      return {
        title: r.title || siteName || 'Source',
        url: r.url,
        siteName: siteName,
        favicon: siteName ? `https://www.google.com/s2/favicons?sz=64&domain=${siteName}` : undefined
      };
    }) || [];

    return { resultsText, searchSources };
  } catch (err) {
    console.error("Tavily search request failed:", err);
    return {
      resultsText: `Failed to execute search: ${(err as Error).message}`,
      searchSources: []
    };
  }
}

export const geminiTools = [
  {
    functionDeclarations: [
      {
        name: "web_search",
        description: "Perform a live web search to retrieve real-time facts, recent events, and information for any topic the AI might not know or that occurred recently.",
        parameters: {
          type: "OBJECT",
          properties: {
            query: {
              type: "STRING",
              description: "The search query to retrieve real-time data for."
            }
          },
          required: ["query"]
        }
      }
    ]
  }
];
