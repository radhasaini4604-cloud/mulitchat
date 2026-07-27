import type { ChatSession, ChatMessage } from './db';

// Native IndexedDB wrapper for Temporary Chats
const DB_NAME = 'NothricTempChatDB';
const DB_VERSION = 1;
const CHATS_STORE = 'temp_chats';
const MESSAGES_STORE = 'temp_messages';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(CHATS_STORE)) {
        db.createObjectStore(CHATS_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(MESSAGES_STORE)) {
        db.createObjectStore(MESSAGES_STORE, { keyPath: 'id' });
      }
    };
  });
}

export async function saveTempChat(chat: ChatSession): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(CHATS_STORE, 'readwrite');
    const store = transaction.objectStore(CHATS_STORE);
    const request = store.put(chat);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getTempChats(): Promise<ChatSession[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(CHATS_STORE, 'readonly');
    const store = transaction.objectStore(CHATS_STORE);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function getTempChat(id: string): Promise<ChatSession | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(CHATS_STORE, 'readonly');
    const store = transaction.objectStore(CHATS_STORE);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteTempChat(id: string): Promise<void> {
  const db = await openDB();
  
  // 1. Delete all messages for this session
  const messages = await getTempMessages(id);
  const deleteMsgPromises = messages.map(msg => {
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(MESSAGES_STORE, 'readwrite');
      const store = transaction.objectStore(MESSAGES_STORE);
      const request = store.delete(msg.id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  });
  await Promise.all(deleteMsgPromises);

  // 2. Delete the chat session
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(CHATS_STORE, 'readwrite');
    const store = transaction.objectStore(CHATS_STORE);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function saveTempMessage(message: ChatMessage): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(MESSAGES_STORE, 'readwrite');
    const store = transaction.objectStore(MESSAGES_STORE);
    const request = store.put(message);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getTempMessages(sessionId: string): Promise<ChatMessage[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(MESSAGES_STORE, 'readonly');
    const store = transaction.objectStore(MESSAGES_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      const allMsgs = request.result || [];
      const filtered = allMsgs.filter((msg: ChatMessage) => msg.sessionId === sessionId);
      // Sort chronologically by timestamp
      filtered.sort((a, b) => a.timestamp - b.timestamp);
      resolve(filtered);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function clearAllTempChats(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CHATS_STORE, MESSAGES_STORE], 'readwrite');
    const chatsStore = transaction.objectStore(CHATS_STORE);
    const messagesStore = transaction.objectStore(MESSAGES_STORE);
    
    chatsStore.clear();
    messagesStore.clear();

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}
