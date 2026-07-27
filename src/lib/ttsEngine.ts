// Split text into small sentence chunks
function splitIntoSentences(text: string): string[] {
  // Split by sentence punctuation followed by space or line breaks
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

async function fetchWithRetry(url: string, options: RequestInit, retries = 3, delay = 800): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429) {
        console.warn(`[TTS] Rate limited (429). Retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
        await new Promise((res) => setTimeout(res, delay));
        delay *= 1.5;
        continue;
      }
      return response;
    } catch (err) {
      if (i === retries - 1) throw err;
      console.warn(`[TTS] Fetch exception. Retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
      await new Promise((res) => setTimeout(res, delay));
      delay *= 1.5;
    }
  }
  throw new Error("TTS fetch failed after maximum retries");
}

class TtsEngine {
  private currentAudio: HTMLAudioElement | null = null;
  private isSpeaking = false;
  private isLoading = false;
  private currentMessageId: string | null = null;
  private sentenceQueue: string[] = [];
  private currentSentenceIdx = 0;
  private voiceKey = 'luna';
  
  // Cache of pre-fetched sentence audios (Object URLs)
  private audioCache = new Map<number, string>();
  
  // Callbacks to update UI states
  private stateChangeListeners = new Set<(msgId: string | null, isSpeaking: boolean, isLoading: boolean) => void>();

  public registerStateCallback(cb: (msgId: string | null, isSpeaking: boolean, isLoading: boolean) => void) {
    this.stateChangeListeners.add(cb);
    // Emit current state immediately
    cb(this.currentMessageId, this.isSpeaking, this.isLoading);
    return () => {
      this.stateChangeListeners.delete(cb);
    };
  }

  private notifyListeners() {
    this.stateChangeListeners.forEach(cb => {
      cb(this.currentMessageId, this.isSpeaking, this.isLoading);
    });
  }

  public getSpeakingState() {
    return { messageId: this.currentMessageId, isSpeaking: this.isSpeaking };
  }

  // Toggles speech playback for a message
  public toggleSpeak(messageId: string, text: string) {
    if (this.currentMessageId === messageId && this.isSpeaking) {
      this.stop();
      return;
    }

    this.stop();
    this.currentMessageId = messageId;
    this.voiceKey = localStorage.getItem('settings-tts-voice') || 'luna';
    
    // Clean markdown and formatting from text for natural speech reading
    const cleanText = text
      .replace(/[\*\#\`\_\-\+\>\=\[\]\(\)]/g, ' ') // remove markdown symbols
      .replace(/https?:\/\/\S+/g, '') // remove URLs
      .trim();

    this.sentenceQueue = splitIntoSentences(cleanText);
    
    if (this.sentenceQueue.length === 0) return;

    this.currentSentenceIdx = 0;
    this.audioCache.clear();
    this.isSpeaking = true;
    this.isLoading = true;
    this.notifyListeners();

    // Play the first sentence immediately
    this.playIndex(0);
  }

  public stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    
    // Revoke all cached object URLs to free up memory
    this.audioCache.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {}
    });
    this.audioCache.clear();

    const oldSpeaking = this.isSpeaking || this.isLoading;
    this.isSpeaking = false;
    this.isLoading = false;
    this.currentMessageId = null;

    if (oldSpeaking) {
      this.notifyListeners();
    }
  }

  private async fetchSentenceAudio(sentence: string): Promise<string | null> {
    const accountId = import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID || "a3fc173c2b06b226e3b3be38fe1c126b";
    const apiToken = import.meta.env.VITE_CLOUDFLARE_API_TOKEN || "cfat_YhefWQbjhjrbi1F0outvPLvyWgOtkeXVN0Ml1wMZ3fdcf2b1";
    const url = `/cloudflare-api/client/v4/accounts/${accountId}/ai/run/@cf/deepgram/aura-2-en`;

    try {
      const response = await fetchWithRetry(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: sentence,
          speaker: this.voiceKey
        })
      });

      if (!response.ok) {
        throw new Error(`Cloudflare Workers AI TTS returned HTTP ${response.status}`);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (err) {
      console.error("TTS fetch sentence failed:", err);
      return null;
    }
  }

  // Pre-fetch a sentence and store the object URL
  private async prefetchIndex(idx: number) {
    if (idx >= this.sentenceQueue.length) return;
    if (this.audioCache.has(idx)) return;

    const sentence = this.sentenceQueue[idx];
    const objectUrl = await this.fetchSentenceAudio(sentence);
    if (objectUrl) {
      this.audioCache.set(idx, objectUrl);
    }
  }

  private async playIndex(idx: number) {
    if (!this.isSpeaking || idx >= this.sentenceQueue.length) {
      this.stop();
      return;
    }

    this.currentSentenceIdx = idx;
    let objectUrl = this.audioCache.get(idx);

    // If not cached yet, fetch it now
    if (!objectUrl) {
      objectUrl = (await this.fetchSentenceAudio(this.sentenceQueue[idx])) || undefined;
      if (objectUrl) {
        this.audioCache.set(idx, objectUrl);
      }
    }

    if (idx === 0) {
      this.isLoading = false;
      this.notifyListeners();
    }

    if (!objectUrl) {
      // Skip to next sentence if fetch fails
      this.playNext();
      return;
    }

    // Pre-fetch the next sentence in the background immediately
    this.prefetchIndex(idx + 1);

    this.currentAudio = new Audio(objectUrl);
    this.currentAudio.play().catch((err) => {
      console.warn("Audio playback aborted:", err);
      this.playNext();
    });

    this.currentAudio.onended = () => {
      this.playNext();
    };
  }

  private playNext() {
    this.playIndex(this.currentSentenceIdx + 1);
  }
}

export const ttsEngine = new TtsEngine();
