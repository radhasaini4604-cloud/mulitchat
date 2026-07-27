import { MEM0_API_KEY } from '../common';

/**
 * Get or generate a persistent User ID for Mem0 tracking.
 */
export function getMem0UserId(): string {
  if (typeof window === 'undefined') return 'guest_user';
  let storedId = localStorage.getItem('nothric_mem0_user_id');
  if (!storedId) {
    storedId = `nothric_user_${Math.random().toString(36).substring(2, 10)}`;
    localStorage.setItem('nothric_mem0_user_id', storedId);
  }
  return storedId;
}

/**
 * Asynchronously save a fact or conversation turn into Mem0.
 */
export async function addMem0Memory(text: string, userId?: string): Promise<void> {
  if (!text || text.trim().length < 5) return;
  const uid = userId || getMem0UserId();
  const apiKey = MEM0_API_KEY;

  if (!apiKey) return;

  try {
    const res = await fetch("https://api.mem0.ai/v3/memories/add/", {
      method: "POST",
      headers: {
        "Authorization": `Token ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: text }],
        user_id: uid
      })
    });
    if (!res.ok) {
      console.warn("Mem0 Add Memory Warning:", res.status, await res.text());
    } else {
      console.log("🧠 Mem0: Successfully saved conversation turn to long-term memory.");
    }
  } catch (err) {
    console.warn("Mem0 Add Memory Exception:", err);
  }
}

/**
 * Search Mem0 for relevant long-term user memories.
 * Returns a formatted system prompt string or empty string.
 */
export async function searchMem0Memories(query: string, userId?: string): Promise<string> {
  if (!query || query.trim().length < 3) return "";
  const uid = userId || getMem0UserId();
  const apiKey = MEM0_API_KEY;

  if (!apiKey) return "";

  try {
    const res = await fetch("https://api.mem0.ai/v3/memories/search/", {
      method: "POST",
      headers: {
        "Authorization": `Token ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: query,
        filters: {
          user_id: uid
        }
      })
    });

    if (!res.ok) {
      console.warn("Mem0 Search Warning:", res.status);
      return "";
    }

    const data = await res.json();
    let memories: string[] = [];

    if (Array.isArray(data)) {
      memories = data.map((m: any) => m.memory).filter(Boolean);
    } else if (data && Array.isArray(data.results)) {
      memories = data.results.map((m: any) => m.memory).filter(Boolean);
    }

    if (memories.length === 0) return "";

    console.log(`🧠 Mem0: Injected ${memories.length} long-term memories into model system prompt.`);
    return `[USER LONG-TERM PREFERENCES & MEMORIES]\n${memories.map(m => `- ${m}`).join('\n')}\n(Use these user preferences naturally when framing your answer.)\n\n`;
  } catch (err) {
    console.warn("Mem0 Search Exception:", err);
    return "";
  }
}

export interface Mem0MemoryItem {
  id: string;
  memory: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetch all memories stored for a given user.
 */
export async function getMem0UserMemories(userId?: string): Promise<Mem0MemoryItem[]> {
  const uid = userId || getMem0UserId();
  const apiKey = MEM0_API_KEY;
  if (!apiKey) return [];

  try {
    const res = await fetch("https://api.mem0.ai/v3/memories/search/", {
      method: "POST",
      headers: {
        "Authorization": `Token ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: "user preference fact requirement detail context",
        filters: { user_id: uid }
      })
    });

    if (!res.ok) return [];
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data?.results || []);
    return list.map((item: any) => ({
      id: item.id,
      memory: item.memory,
      user_id: item.user_id || uid,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
  } catch (err) {
    console.warn("Mem0 Get Memories Exception:", err);
    return [];
  }
}

/**
 * Delete a specific memory by ID.
 */
export async function deleteMem0Memory(memoryId: string): Promise<boolean> {
  const apiKey = MEM0_API_KEY;
  if (!apiKey || !memoryId) return false;

  try {
    const res = await fetch(`https://api.mem0.ai/v1/memories/${memoryId}/`, {
      method: "DELETE",
      headers: {
        "Authorization": `Token ${apiKey}`
      }
    });
    return res.ok;
  } catch (err) {
    console.warn("Mem0 Delete Memory Exception:", err);
    return false;
  }
}

/**
 * Clear all long-term memories for a specific user.
 */
export async function clearMem0UserMemories(userId?: string): Promise<boolean> {
  try {
    const memories = await getMem0UserMemories(userId);
    await Promise.all(memories.map(m => deleteMem0Memory(m.id)));
    return true;
  } catch (err) {
    console.warn("Mem0 Clear User Memories Exception:", err);
    return false;
  }
}

