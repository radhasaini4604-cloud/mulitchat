import { supabase } from '../../lib/supabase';

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  summary?: string;
  pinned?: boolean;
  archived?: boolean;
  userId?: string;
  projectId?: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  sender: 'user' | 'assistant';
  text: string;
  model?: string;
  attachments?: any[];
  processingType?: 'pdf' | 'image' | 'file' | 'text';
  isImageGeneration?: boolean;
  isGenerating?: boolean;
  imagePrompt?: string;
  searchSources?: any[];
  timestamp: number;
}


export async function getCurrentUserId(): Promise<string | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || null;
  } catch (err) {
    console.error('Error getting supabase session:', err);
    return null;
  }
}

// LocalStorage helpers for Guest Mode and Local Fallbacks
function getLocalChats(): ChatSession[] {
  const data = localStorage.getItem('guest_chats');
  if (data && data.includes('mock-1')) {
    localStorage.removeItem('guest_chats');
    localStorage.removeItem('guest_messages');
    return [];
  }
  if (!data) {
    localStorage.setItem('guest_chats', JSON.stringify([]));
    localStorage.setItem('guest_messages', JSON.stringify({}));
    return [];
  }
  try {
    return JSON.parse(data) || [];
  } catch {
    return [];
  }
}

function saveLocalChats(chats: ChatSession[]) {
  localStorage.setItem('guest_chats', JSON.stringify(chats));
}

function getLocalMessages(sessionId: string): ChatMessage[] {
  const data = localStorage.getItem('guest_messages');
  if (!data) return [];
  try {
    const allMsgs = JSON.parse(data) || {};
    return allMsgs[sessionId] || [];
  } catch {
    return [];
  }
}

function saveLocalMessage(message: ChatMessage) {
  const data = localStorage.getItem('guest_messages');
  let allMsgs: Record<string, ChatMessage[]> = {};
  if (data) {
    try {
      allMsgs = JSON.parse(data) || {};
    } catch {}
  }
  if (!allMsgs[message.sessionId]) {
    allMsgs[message.sessionId] = [];
  }
  const idx = allMsgs[message.sessionId].findIndex(m => m.id === message.id);
  if (idx > -1) {
    allMsgs[message.sessionId][idx] = message;
  } else {
    allMsgs[message.sessionId].push(message);
  }
  localStorage.setItem('guest_messages', JSON.stringify(allMsgs));
}

export async function clearAllChatsFromDB(): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) {
    localStorage.removeItem('guest_chats');
    localStorage.removeItem('guest_messages');
    return;
  }
  
  try {
    // Delete from chats directly; cascade delete will handle messages
    const { error } = await supabase.from('chats').delete().eq('user_id', userId);
    if (error) throw error;
    
    localStorage.removeItem(`chats_fallback:${userId}`);
  } catch (err) {
    console.error("Failed to clear chats from Supabase:", err);
    localStorage.removeItem(`chats_fallback:${userId}`);
    throw err;
  }
}

export async function saveChat(chat: ChatSession): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) {
    const chats = getLocalChats();
    const idx = chats.findIndex(c => c.id === chat.id);
    if (idx > -1) {
      chats[idx] = chat;
    } else {
      chats.push(chat);
    }
    saveLocalChats(chats);
    return;
  }
  
  chat.userId = userId;
  
  try {
    const { error } = await supabase
      .from('chats')
      .upsert({
        id: chat.id,
        title: chat.title,
        created_at: new Date(chat.createdAt).toISOString(),
        summary: chat.summary,
        pinned: chat.pinned,
        archived: chat.archived,
        project_id: chat.projectId,
        user_id: userId
      });
    if (error) throw error;
  } catch (err) {
    console.warn("Failed to save chat to Supabase. Falling back to localStorage.", err);
    const fallbackChats = await getChats();
    const idx = fallbackChats.findIndex(c => c.id === chat.id);
    if (idx > -1) {
      fallbackChats[idx] = chat;
    } else {
      fallbackChats.push(chat);
    }
    localStorage.setItem(`chats_fallback:${userId}`, JSON.stringify(fallbackChats));
  }
}

export async function getChats(): Promise<ChatSession[]> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return getLocalChats();
  }
  
  try {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', userId);
      
    if (error) throw error;
    
    return (data || []).map(row => ({
      id: row.id,
      title: row.title,
      createdAt: new Date(row.created_at).getTime(),
      summary: row.summary,
      pinned: row.pinned,
      archived: row.archived,
      projectId: row.project_id,
      userId: row.user_id
    }));
  } catch (err) {
    console.warn("Failed to fetch chats from Supabase. Falling back to localStorage.", err);
    const fallbackData = localStorage.getItem(`chats_fallback:${userId}`);
    return fallbackData ? JSON.parse(fallbackData) : [];
  }
}

export async function deleteChatFromDB(id: string): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) {
    const chats = getLocalChats();
    const filtered = chats.filter(c => c.id !== id);
    saveLocalChats(filtered);
    
    const data = localStorage.getItem('guest_messages');
    if (data) {
      try {
        const allMsgs = JSON.parse(data) || {};
        delete allMsgs[id];
        localStorage.setItem('guest_messages', JSON.stringify(allMsgs));
      } catch {}
    }
    return;
  }
  
  try {
    // Delete from chats directly; cascade delete will handle messages
    const { error } = await supabase.from('chats').delete().eq('id', id);
    if (error) throw error;
    
    // Clean up local fallback if online delete was successful
    const fallbackChatsData = localStorage.getItem(`chats_fallback:${userId}`);
    if (fallbackChatsData) {
      const fallbackChats = JSON.parse(fallbackChatsData) as ChatSession[];
      const filtered = fallbackChats.filter(c => c.id !== id);
      localStorage.setItem(`chats_fallback:${userId}`, JSON.stringify(filtered));
    }
    localStorage.removeItem(`messages_fallback:${id}`);
  } catch (err) {
    console.error("Failed to delete chat from Supabase:", err);
    throw err;
  }
}

export async function saveMessage(message: ChatMessage): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) {
    saveLocalMessage(message);
    return;
  }
  
  try {
    const { error } = await supabase
      .from('messages')
      .upsert({
        id: message.id,
        session_id: message.sessionId,
        sender: message.sender,
        text: message.text,
        model: message.model,
        attachments: message.attachments || null,
        timestamp: message.timestamp
      });
    if (error) throw error;
  } catch (err) {
    console.warn("Failed to save message to Supabase. Falling back to localStorage.", err);
    const fallbackMsgs = await getMessages(message.sessionId);
    const idx = fallbackMsgs.findIndex(m => m.id === message.id);
    if (idx > -1) {
      fallbackMsgs[idx] = message;
    } else {
      fallbackMsgs.push(message);
    }
    localStorage.setItem(`messages_fallback:${message.sessionId}`, JSON.stringify(fallbackMsgs));
  }
}

export async function getMessages(sessionId: string): Promise<ChatMessage[]> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return getLocalMessages(sessionId);
  }
  
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true });
      
    if (error) throw error;
    
    return (data || []).map(row => ({
      id: row.id,
      sessionId: row.session_id,
      sender: row.sender,
      text: row.text,
      model: row.model,
      attachments: row.attachments || [],
      timestamp: Number(row.timestamp)
    }));
  } catch (err) {
    console.warn("Failed to fetch messages from Supabase. Falling back to localStorage.", err);
    const fallbackData = localStorage.getItem(`messages_fallback:${sessionId}`);
    return fallbackData ? JSON.parse(fallbackData) : [];
  }
}

export async function deleteMessagesFromDB(ids: string[]): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) {
    const data = localStorage.getItem('guest_messages');
    if (data) {
      try {
        const allMsgs = JSON.parse(data) || {};
        for (const sessionId in allMsgs) {
          allMsgs[sessionId] = allMsgs[sessionId].filter((m: any) => !ids.includes(m.id));
        }
        localStorage.setItem('guest_messages', JSON.stringify(allMsgs));
      } catch (err) {
        console.error("Failed to delete guest messages:", err);
      }
    }
    return;
  }

  try {
    const { error } = await supabase.from('messages').delete().in('id', ids);
    if (error) throw error;
  } catch (err) {
    console.warn("Failed to delete messages from Supabase. Falling back to localStorage.", err);
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('messages_fallback:')) {
        const val = localStorage.getItem(key);
        if (val) {
          try {
            const msgs = JSON.parse(val);
            if (Array.isArray(msgs)) {
              const filtered = msgs.filter(m => !ids.includes(m.id));
              localStorage.setItem(key, JSON.stringify(filtered));
            }
          } catch {}
        }
      }
    }
  }
}

export interface ProjectItem {
  id: string;
  name: string;
  owner: 'me' | 'shared';
  createdAt: number;
  pinned?: boolean;
  userId?: string;
}

function getLocalProjects(): ProjectItem[] {
  const data = localStorage.getItem('guest_projects');
  if (!data) {
    const initial: ProjectItem[] = [];
    localStorage.setItem('guest_projects', JSON.stringify(initial));
    return initial;
  }
  try {
    const parsed = JSON.parse(data) || [];
    const filtered = parsed.filter((p: ProjectItem) => !['1', '2', '3', '4'].includes(p.id));
    if (filtered.length !== parsed.length) {
      localStorage.setItem('guest_projects', JSON.stringify(filtered));
      return filtered;
    }
    return parsed;
  } catch {
    return [];
  }
}

function saveLocalProjects(projects: ProjectItem[]) {
  localStorage.setItem('guest_projects', JSON.stringify(projects));
}

export async function getProjects(): Promise<ProjectItem[]> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return getLocalProjects();
  }
  
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId);
      
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return [];
    }
    
    return data.map(row => ({
      id: row.id,
      name: row.name,
      owner: row.owner,
      createdAt: new Date(row.created_at).getTime(),
      pinned: row.pinned,
      userId: row.user_id
    }));
  } catch (err) {
    console.warn("Failed to fetch projects from Supabase. Falling back to localStorage.", err);
    const fallbackData = localStorage.getItem(`projects_fallback:${userId}`);
    if (fallbackData) {
      return JSON.parse(fallbackData);
    }
    return [];
  }
}

export async function saveProject(project: ProjectItem): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) {
    const projects = getLocalProjects();
    const idx = projects.findIndex(p => p.id === project.id);
    if (idx > -1) {
      projects[idx] = project;
    } else {
      projects.push(project);
    }
    saveLocalProjects(projects);
    return;
  }
  
  project.userId = userId;
  
  try {
    const { error } = await supabase
      .from('projects')
      .upsert({
        id: project.id,
        name: project.name,
        owner: project.owner,
        created_at: new Date(project.createdAt).toISOString(),
        pinned: project.pinned,
        user_id: userId
      });
    if (error) throw error;
  } catch (err) {
    console.warn("Failed to save project to Supabase. Falling back to localStorage.", err);
    const fallbackProjects = await getProjects();
    const idx = fallbackProjects.findIndex(p => p.id === project.id);
    if (idx > -1) {
      fallbackProjects[idx] = project;
    } else {
      fallbackProjects.push(project);
    }
    localStorage.setItem(`projects_fallback:${userId}`, JSON.stringify(fallbackProjects));
  }
}

export async function deleteProjectFromDB(id: string): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) {
    const projects = getLocalProjects();
    const filtered = projects.filter(p => p.id !== id);
    saveLocalProjects(filtered);
    return;
  }
  
  try {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  } catch (err) {
    console.warn("Failed to delete project from Supabase. Falling back to localStorage.", err);
    const fallbackProjects = await getProjects();
    const filtered = fallbackProjects.filter(p => p.id !== id);
    localStorage.setItem(`projects_fallback:${userId}`, JSON.stringify(filtered));
  }
}

export function getFriendlyDate(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const days = Math.floor(diff / (3600000 * 24));
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

export async function getSharedChat(id: string): Promise<ChatSession | null> {
  try {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    if (data) {
      return {
        id: data.id,
        title: data.title,
        createdAt: new Date(data.created_at).getTime(),
        summary: data.summary,
        pinned: data.pinned,
        archived: data.archived,
        projectId: data.project_id,
        userId: data.user_id
      };
    }
  } catch (err) {
    console.warn("Failed to fetch shared chat from Supabase, checking localStorage fallback", err);
  }
  
  const guestChats = getLocalChats();
  const guestChat = guestChats.find(c => c.id === id);
  if (guestChat) return guestChat;
  
  const userId = await getCurrentUserId();
  if (userId) {
    const fallbackData = localStorage.getItem(`chats_fallback:${userId}`);
    if (fallbackData) {
      const fallbackChats: ChatSession[] = JSON.parse(fallbackData);
      const chat = fallbackChats.find(c => c.id === id);
      if (chat) return chat;
    }
  }
  
  return null;
}

export async function getSharedMessages(sessionId: string): Promise<ChatMessage[]> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true });
    if (error) throw error;
    if (data && data.length > 0) {
      return data.map(row => ({
        id: row.id,
        sessionId: row.session_id,
        sender: row.sender,
        text: row.text,
        model: row.model,
        attachments: row.attachments,
        timestamp: row.timestamp
      }));
    }
  } catch (err) {
    console.warn("Failed to fetch shared messages from Supabase, checking localStorage fallback", err);
  }
  
  const guestMsgs = getLocalMessages(sessionId);
  if (guestMsgs && guestMsgs.length > 0) {
    return guestMsgs.map(m => ({
      id: m.id,
      sessionId: m.sessionId,
      sender: m.sender,
      text: m.text,
      model: m.model,
      attachments: m.attachments,
      timestamp: m.timestamp
    }));
  }
  
  return [];
}

