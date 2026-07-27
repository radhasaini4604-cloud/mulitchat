import { useState, useRef, useEffect, useCallback } from 'react';
import {
  queryGroq,
  streamGroq,
  streamGemini,
  streamCloudflare,
  streamMistral,
  streamCohere,
  streamOllama,
} from '../utils/aiHandler';
import type { HistoryMessage, AttachmentData } from '../utils/aiHandler';
import { getMessages, saveMessage, saveChat, getChats } from '../utils/db';
import type { ChatMessage, ChatSession } from '../utils/db';
import { saveTempChat, saveTempMessage, getTempMessages } from '../utils/tempDb';
import { uploadFileToBucket } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { addMem0Memory, searchMem0Memories } from '../utils/ai-handler/mem0/mem0Handler';

async function saveChatMessage(message: ChatMessage): Promise<void> {
  if (message.sessionId.startsWith('temp_')) {
    return saveTempMessage(message);
  }
  return saveMessage(message);
}

async function saveChatSession(chat: ChatSession): Promise<void> {
  if (chat.id.startsWith('temp_')) {
    return saveTempChat(chat);
  }
  return saveChat(chat);
}

async function getChatMessages(sessionId: string): Promise<ChatMessage[]> {
  if (sessionId.startsWith('temp_')) {
    return getTempMessages(sessionId);
  }
  return getMessages(sessionId);
}

async function fetchBase64FromUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    const blob = await res.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const commaIdx = result.indexOf(',');
        resolve(commaIdx !== -1 ? result.substring(commaIdx + 1) : result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error('Failed to fetch base64 from url:', url, err);
    return '';
  }
}

const MODELS_LIST = ['gemini', 'gpt', 'qwen', 'mistral', 'cohere', 'nemotron'];

// Helper to open IndexedDB for model selections
const openSelectionDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('Main_chat_selection_db', 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('session_models')) {
        db.createObjectStore('session_models', { keyPath: 'sessionId' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const getSessionModelsFromDB = async (sessionId: string): Promise<string[] | null> => {
  try {
    const db = await openSelectionDB();
    return new Promise((resolve) => {
      const tx = db.transaction('session_models', 'readonly');
      const store = tx.objectStore('session_models');
      const req = store.get(sessionId);
      req.onsuccess = () => {
        if (req.result && Array.isArray(req.result.models)) {
          resolve(req.result.models);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    console.error('Error reading from Selection IndexedDB:', err);
    return null;
  }
};

const saveSessionModelsToDB = async (sessionId: string, models: string[]): Promise<void> => {
  try {
    const db = await openSelectionDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('session_models', 'readwrite');
      const store = tx.objectStore('session_models');
      const req = store.put({ sessionId, models });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Error saving to Selection IndexedDB:', err);
  }
};

const getInitialModels = (): string[] => {
  try {
    const saved = localStorage.getItem('nothric_selected_model');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return ['gemini'];
};

export interface Message {
  id: string;
  sender: 'user' | 'model';
  text: string;
  attachments?: any[];
  isSearching?: boolean;
  searchQuery?: string;
  searchSources?: any[];
  isGenerating?: boolean;
  isStreamCompleted?: boolean;
  model?: string;
}

interface UseMain_chatChatOptions {
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;
  attachedFiles: File[];
  setAttachedFiles: (files: File[]) => void;
  expandedModel: string | null;
  isTemporary?: boolean;
}

export function useMain_chatChat({
  activeSessionId,
  setActiveSessionId,
  attachedFiles,
  setAttachedFiles,
  expandedModel,
  isTemporary,
}: UseMain_chatChatOptions) {
  const { user } = useAuth();

  const [activeModels, setActiveModels] = useState<string[]>(getInitialModels);
  const [isLoadingHistory, setIsLoadingHistory] = useState(!!activeSessionId);

  const [responses, setResponses] = useState<Record<string, Message[]>>({
    gemini: [], gpt: [], qwen: [], mistral: [], cohere: [], nemotron: [], auto: [],
  });

  const [isResponding, setIsResponding] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const justCreatedSessionIdRef = useRef<string | null>(null);
  const isLoadedFromDbRef = useRef(false);

  // Persist active models to IndexedDB for sessions
  useEffect(() => {
    if (activeSessionId && isLoadedFromDbRef.current) {
      saveSessionModelsToDB(activeSessionId, activeModels).then(() => {
        window.dispatchEvent(new Event('chat-sessions-updated'));
      });
      localStorage.setItem('nothric_selected_model', JSON.stringify(activeModels));
    } else if (!activeSessionId) {
      localStorage.setItem('nothric_selected_model', JSON.stringify(activeModels));
    }
  }, [activeModels, activeSessionId]);

  // Load chat history when session changes
  useEffect(() => {
    async function loadChats() {
      isLoadedFromDbRef.current = false;
      if (!activeSessionId) {
        setResponses({
          gemini: [], gpt: [], qwen: [], mistral: [], cohere: [], nemotron: [], auto: [],
        });
        setActiveModels(getInitialModels());
        setIsLoadingHistory(false);
        return;
      }
      if (justCreatedSessionIdRef.current === activeSessionId) {
        justCreatedSessionIdRef.current = null;
        // Since it is a newly created session, save initial models selection to DB
        isLoadedFromDbRef.current = true;
        saveSessionModelsToDB(activeSessionId, activeModels).then(() => {
          window.dispatchEvent(new Event('chat-sessions-updated'));
        });
        setIsLoadingHistory(false);
        return;
      }
      try {
        const msgs = await getChatMessages(activeSessionId);
        const grouped: Record<string, Message[]> = {
          gemini: [], gpt: [], qwen: [], mistral: [], cohere: [], nemotron: [], auto: [],
        };
        interface Turn { userMsg: Message; modelMsgs: Record<string, Message>; }
        const turns: Turn[] = [];
        let currentTurn: Turn | null = null;

        msgs.forEach((msg) => {
          const mappedMsg: Message = {
            id: msg.id,
            sender: msg.sender === 'assistant' ? 'model' : 'user',
            text: msg.text,
            attachments: msg.attachments,
            isGenerating: false,
            model: msg.model,
          };
          grouped.auto.push(mappedMsg);
          if (msg.sender === 'user') {
            if (currentTurn) turns.push(currentTurn);
            currentTurn = { userMsg: mappedMsg, modelMsgs: {} };
          } else if (msg.sender === 'assistant' && msg.model) {
            const mKey = msg.model.toLowerCase();
            if (currentTurn) currentTurn.modelMsgs[mKey] = mappedMsg;
          }
        });
        if (currentTurn) turns.push(currentTurn);

        turns.forEach((turn) => {
          const activeKeys = Object.keys(turn.modelMsgs);
          if (activeKeys.length === 0) {
            MODELS_LIST.forEach((m) => { grouped[m].push({ ...turn.userMsg }); });
          } else {
            activeKeys.forEach((m) => {
              if (grouped[m]) {
                grouped[m].push({ ...turn.userMsg });
                grouped[m].push(turn.modelMsgs[m]);
              }
            });
          }
        });

        // If this is an auto session, force 'auto' selection
        if (activeSessionId.startsWith('auto_') || activeSessionId.startsWith('temp_auto_')) {
          isLoadedFromDbRef.current = true;
          setActiveModels(['auto']);
          setResponses(grouped);
          setIsLoadingHistory(false);
          return;
        }

        // Restore model selection from session-specific IndexedDB selection store
        const saved = await getSessionModelsFromDB(activeSessionId);
        if (saved && saved.length > 0) {
          isLoadedFromDbRef.current = true;
          setActiveModels(saved);
          setResponses(grouped);
          setIsLoadingHistory(false);
          return;
        }

        // Detect models from history
        const loadedModels = new Set<string>();
        msgs.forEach((msg) => {
          if (msg.sender === 'assistant' && msg.model) loadedModels.add(msg.model.toLowerCase());
        });
        const loadedModelsList = Array.from(loadedModels).filter((m) => MODELS_LIST.includes(m));
        if (loadedModelsList.length > 0) {
          setActiveModels(loadedModelsList);
        } else {
          setActiveModels(['gemini']);
        }
        isLoadedFromDbRef.current = true;
        setResponses(grouped);
      } catch (err) {
        console.error('Failed to load chat history:', err);
      } finally {
        setIsLoadingHistory(false);
      }
    }
    setIsLoadingHistory(!!activeSessionId);
    loadChats();
  }, [activeSessionId, user]);

  // Auto-save activeModels to Selection IndexedDB whenever selection changes for a session
  useEffect(() => {
    if (activeSessionId && isLoadedFromDbRef.current) {
      saveSessionModelsToDB(activeSessionId, activeModels).then(() => {
        window.dispatchEvent(new Event('chat-sessions-updated'));
      });
    }
  }, [activeSessionId, activeModels]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { if (abortControllerRef.current) abortControllerRef.current.abort(); };
  }, []);

  const toggleModel = (model: string) => {
    if (model === 'auto') {
      setActiveModels(['auto']);
    } else {
      const filtered = activeModels.filter(m => m !== 'auto');
      if (filtered.includes(model)) {
        if (filtered.length > 1) {
          setActiveModels(filtered.filter((m) => m !== model));
        }
      } else {
        setActiveModels([...filtered, model]);
      }
    }
  };

  const handleStop = () => {
    setIsStopped(true);
    setIsResponding(false);
    if (abortControllerRef.current) abortControllerRef.current.abort();

    setResponses((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((model) => {
        updated[model] = (prev[model] || []).map((msg) => {
          if (msg.sender === 'model' && msg.isGenerating) {
            const currentText = msg.text === 'Thinking...' ? '' : msg.text;
            const stoppedText = currentText 
              ? `${currentText}\n\n🪦 RIP to the rest of that response. 🚫📖 The ending remains a mystery. 🕵️` 
              : '🪦 RIP to the rest of that response. 🚫📖 The ending remains a mystery. 🕵️';
            return { ...msg, text: stoppedText, isGenerating: false, isStreamCompleted: true };
          }
          return msg;
        });
      });
      return updated;
    });
  };

  const handleTypewriterComplete = useCallback((msgId: string, model: string) => {
    setResponses((prev) => {
      const updated = { ...prev };
      if (updated[model]) {
        updated[model] = updated[model].map((msg) =>
          msg.id === msgId ? { ...msg, isGenerating: false } : msg
        );
      }
      return updated;
    });
    setIsResponding(false);
  }, []);

  const handleSend = (overridePrompt?: string, currentPrompt?: string) => {
    const textToSubmit = overridePrompt !== undefined ? overridePrompt : (currentPrompt || '');
    if (!textToSubmit.trim() || isResponding) return;

    const userPrompt = textToSubmit;
    setIsResponding(true);
    setIsStopped(false);
    const responsesAtClick = { ...responses };

    let currentSessionId = activeSessionId;
    const isNewSession = !currentSessionId;
    if (isNewSession) {
      const isAuto = activeModels.includes('auto');
      const prefix = isTemporary ? (isAuto ? 'temp_auto_' : 'temp_') : (isAuto ? 'auto_' : 'Main_chat_');
      currentSessionId = prefix + Date.now();
    }

    const userMsgId = Date.now().toString() + '-u';
    const modelMsgId = Date.now().toString() + '-m';
    const targets = expandedModel ? [expandedModel] : activeModels;
    const currentAttachedFiles = attachedFiles;
    setAttachedFiles([]);

    const localPreviews = currentAttachedFiles.map((file) => {
      const isImage = file.type.startsWith('image/');
      const isPdf = file.name.toLowerCase().endsWith('.pdf');
      return {
        name: file.name,
        type: isImage ? 'image' : isPdf ? 'pdf' : 'file',
        url: (isImage || isPdf) ? URL.createObjectURL(file) : undefined,
        size: file.size,
      };
    });

    setResponses((prev) => {
      const updated = { ...prev };
      targets.forEach((model) => {
        updated[model] = [
          ...(prev[model] || []),
          { id: userMsgId, sender: 'user', text: userPrompt, attachments: localPreviews },
          { id: modelMsgId, sender: 'model', text: 'Thinking...', isGenerating: true },
        ];
      });
      return updated;
    });

    const controller = new AbortController();
    abortControllerRef.current = controller;

    (async () => {
      try {
        const attachmentsData = await Promise.all(
          currentAttachedFiles.map(async (file) => {
            const isImage = file.type.startsWith('image/');
            const isPdf = file.name.toLowerCase().endsWith('.pdf');
            let base64 = '';
            let content = '';
            if (isImage || isPdf) {
              base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                  const result = reader.result as string;
                  const commaIdx = result.indexOf(',');
                  resolve(commaIdx !== -1 ? result.substring(commaIdx + 1) : result);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
              });
            } else {
              try {
                content = await new Promise<string>((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => resolve(reader.result as string || '');
                  reader.onerror = reject;
                  reader.readAsText(file);
                });
              } catch (err) {
                console.warn('Could not read file as text:', file.name, err);
              }
            }
            return {
              name: file.name,
              type: isImage ? 'image' : isPdf ? 'pdf' : 'file',
              base64: base64 || undefined,
              content: content || undefined,
              mimeType: file.type || undefined,
            };
          })
        );

        let enrichedAttachments = currentAttachedFiles.map((file, idx) => {
          const isImage = file.type.startsWith('image/');
          const isPdf = file.name.toLowerCase().endsWith('.pdf');
          const data = attachmentsData[idx];
          return {
            name: file.name,
            type: isImage ? 'image' : isPdf ? 'pdf' : 'file',
            url: (isImage || isPdf) ? URL.createObjectURL(file) : undefined,
            size: file.size,
            base64: data?.base64,
            content: data?.content,
          };
        });

        if (isNewSession) {
          const tempTitle = userPrompt.length > 25 ? userPrompt.substring(0, 25) + '...' : userPrompt;
          const projId = localStorage.getItem('project_new_chat_project_id') || undefined;
          localStorage.removeItem('project_new_chat_project_id');
          const newChatSession: ChatSession = {
            id: currentSessionId!,
            title: tempTitle,
            createdAt: Date.now(),
            pinned: false,
            archived: false,
            projectId: projId,
          };
          await saveChatSession(newChatSession);
          justCreatedSessionIdRef.current = currentSessionId;
          setActiveSessionId(currentSessionId);
          window.dispatchEvent(new Event('chat-sessions-updated'));

          // Background title generation (only for normal chats)
          if (currentSessionId && !currentSessionId.startsWith('temp_')) {
            (async () => {
              try {
                const chatsList = await getChats();
                const existingTitles = chatsList.map((c) => c.title).filter(Boolean);
                const systemPrompt = `You are a helper that generates a short, catchy, professional 2-3 word title for an AI chat conversation based on the user's first query.
  CRITICAL RULES:
  1. Do not repeat or use names that are similar to the existing chat titles listed below.
  2. The title MUST be exactly 2-3 words. Do not put quotes, period, or formatting around it.
  3. Keep it extremely professional.

  Existing Chat Titles:
  ${existingTitles.length > 0 ? existingTitles.map((t) => `- ${t}`).join('\n') : '(None)'}`;
                const prompt = `User Query: "${userPrompt}"\nGenerate a 2-3 word title:`;
                const generatedTitle = await queryGroq(prompt, systemPrompt);
                const cleanTitle = generatedTitle.replace(/^[\"'"']+|[\"'"']+$/g, '').trim();
                if (cleanTitle && cleanTitle.split(/\s+/).length <= 5) {
                  const chatSession = chatsList.find((c) => c.id === currentSessionId);
                  if (chatSession) {
                    chatSession.title = cleanTitle;
                    await saveChatSession(chatSession);
                    window.dispatchEvent(new Event('chat-sessions-updated'));
                  }
                }
              } catch (titleErr) {
                console.error('Failed to generate custom title:', titleErr);
              }
            })();
          }
        }

        if (user && currentAttachedFiles.length > 0 && currentSessionId && !currentSessionId.startsWith('temp_')) {
          try {
            const uploadedUrls = await Promise.all(
              currentAttachedFiles.map(async (file) => {
                const storagePath = `${user.id}/${currentSessionId}/${userMsgId}_${file.name}`;
                return uploadFileToBucket('attachments', storagePath, file);
              })
            );
            enrichedAttachments = enrichedAttachments.map((att, idx) => ({
              name: att.name,
              type: att.type,
              url: uploadedUrls[idx],
              size: att.size,
              base64: undefined,
              content: undefined,
            }));
          } catch (uploadErr) {
            console.error('Failed to upload files to Supabase storage:', uploadErr);
          }
        }

        const userChatMessage: ChatMessage = {
          id: userMsgId,
          sessionId: currentSessionId!,
          sender: 'user',
          text: userPrompt,
          attachments: enrichedAttachments,
          timestamp: Date.now(),
        };
        await saveChatMessage(userChatMessage);

        // Fire Mem0 background memory extraction
        addMem0Memory(userPrompt, user?.id);

        setResponses((prev) => {
          const updated = { ...prev };
          targets.forEach((model) => {
            updated[model] = (prev[model] || []).map((msg) =>
              msg.id === userMsgId ? { ...msg, attachments: enrichedAttachments } : msg
            );
          });
          return updated;
        });

        const useOllama = false; // Ollama disabled — using real AI models

        if (useOllama) {
          const ollamaModel = localStorage.getItem('settings-ollama-model') || 'qwen3.5:4b';
          let accumulatedText = '';
          const handleUpdate = (chunkText: string) => {
            accumulatedText = chunkText;
            setResponses((prev) => {
              const updated = { ...prev };
              targets.forEach((model) => {
                updated[model] = (prev[model] || []).map((msg) =>
                  msg.id === modelMsgId ? { ...msg, text: chunkText, isGenerating: true } : msg
                );
              });
              return updated;
            });
          };
          
          try {
            await streamOllama(userPrompt, handleUpdate, ollamaModel, undefined, controller.signal);
            
            setResponses((prev) => {
              const updated = { ...prev };
              targets.forEach((model) => {
                updated[model] = (prev[model] || []).map((msg) =>
                  msg.id === modelMsgId ? { ...msg, isGenerating: false } : msg
                );
              });
              return updated;
            });
            
            for (const model of targets) {
              const assistantChatMessage: ChatMessage = {
                id: modelMsgId + '-' + model,
                sessionId: currentSessionId!,
                sender: 'assistant',
                text: accumulatedText,
                model: model,
                timestamp: Date.now(),
              };
              await saveChatMessage(assistantChatMessage);
            }
            setIsResponding(false);
          } catch (err) {
            console.error('Ollama query failed:', err);
            const isAborted = (err as any)?.name === 'AbortError' || controller.signal.aborted;
            let text = isAborted 
              ? (accumulatedText ? `${accumulatedText}\n\n🪦 RIP to the rest of that response. 🚫📖 The ending remains a mystery. 🕵️` : '🪦 RIP to the rest of that response. 🚫📖 The ending remains a mystery. 🕵️') 
              : `Error: ${(err as Error).message || err}`;
            
            if (!navigator.onLine || (err instanceof TypeError && err.message.toLowerCase().includes('failed to fetch'))) {
              text = "Network Error: Please check your internet connection and refresh.";
            }
            
            setResponses((prev) => {
              const updated = { ...prev };
              targets.forEach((model) => {
                updated[model] = (prev[model] || []).map((msg) =>
                  msg.id === modelMsgId ? { ...msg, text, isGenerating: false } : msg
                );
              });
              return updated;
            });
            
            for (const model of targets) {
              const assistantChatMessage: ChatMessage = {
                id: modelMsgId + '-' + model,
                sessionId: currentSessionId!,
                sender: 'assistant',
                text,
                model: model,
                timestamp: Date.now(),
              };
              await saveChatMessage(assistantChatMessage);
            }
            setIsResponding(false);
          } finally {
            if (abortControllerRef.current === controller) abortControllerRef.current = null;
          }
          return;
        }

        let routedModel: string | null = null;
        if (targets.includes('auto')) {
          const autoHistory = responses['auto'] || [];
          const hasPastImageOrPdf = autoHistory.some(msg =>
            msg.attachments?.some(att => att.type === 'image' || att.type === 'pdf' || att.mimeType?.startsWith('image/') || att.mimeType === 'application/pdf')
          );
          const hasCurrentImageOrPdf = attachmentsData.some(
            att => att.type === 'image' || att.type === 'pdf' || att.mimeType?.startsWith('image/') || att.mimeType === 'application/pdf'
          );

          if (hasPastImageOrPdf || hasCurrentImageOrPdf) {
            routedModel = 'gemini';
            console.log('[Auto Nothric] Image or PDF attachment detected. Routing directly to Gemini.');
          } else {
            try {
              const { classifyPrompt } = await import('../../autonothric/router');
              routedModel = await classifyPrompt(userPrompt);
              console.log(`[Auto Nothric] Routed query to model: "${routedModel}"`);
            } catch (err) {
              console.error('[Auto Nothric] Classification failed:', err);
              routedModel = 'gemini'; // Fallback to Gemini
            }
          }
        }

        // Retrieve long-term memories from Mem0 once for all target models
        const mem0Context = await searchMem0Memories(userPrompt, user?.id);

        const runQueryForModel = async (model: string) => {
          let accumulatedText = '';
          const handleUpdate = (chunkText: string) => {
            accumulatedText = chunkText;
            setResponses((prev) => {
              const updated = { ...prev };
              updated[model] = (prev[model] || []).map((msg) =>
                msg.id === modelMsgId ? { ...msg, text: chunkText, isGenerating: true } : msg
              );
              return updated;
            });
          };

          // Build history for this model
          const pastMessages = (responsesAtClick[model] || []).filter(msg => msg.text !== 'Thinking...' && !msg.isGenerating);
          const historyForModel: HistoryMessage[] = await Promise.all(
            pastMessages.map(async (msg) => {
              const atts: AttachmentData[] = msg.attachments ? await Promise.all(
                msg.attachments.map(async (att: any) => {
                  let base64 = att.base64;
                  const isImg = att.type === 'image' || att.mimeType?.startsWith('image/');
                  const isPdfFile = att.type === 'pdf' || att.mimeType === 'application/pdf' || att.name?.toLowerCase().endsWith('.pdf');
                  if (!base64 && att.url && (isImg || isPdfFile)) {
                    base64 = await fetchBase64FromUrl(att.url);
                  }
                  return {
                    name: att.name,
                    type: isImg ? 'image' : isPdfFile ? 'pdf' : 'file',
                    mimeType: att.mimeType || (isImg ? 'image/png' : isPdfFile ? 'application/pdf' : att.type),
                    base64: base64 || undefined,
                    url: att.url
                  };
                })
              ) : [];
              return {
                role: msg.sender === 'model' ? 'assistant' : 'user',
                text: msg.text,
                attachments: atts
              };
            })
          );
          // Append the latest user query
          historyForModel.push({
            role: 'user',
            text: userPrompt,
            attachments: attachmentsData
          });

          // Inject Mem0 long-term memories if available
          if (mem0Context) {
            historyForModel.unshift({
              role: 'user',
              text: mem0Context
            });
          }

          const streamModel = model === 'auto' ? routedModel! : model;

          try {
            if (!navigator.onLine) {
              throw new TypeError("Failed to fetch");
            }
            const useOllamaForTesting = false; // Set to false to enable real models
            if (useOllamaForTesting) {
              const ollamaModel = localStorage.getItem('settings-ollama-model') || 'llama3.2:1b';
              console.log(`[Main_chat Chat] Routing ${model} query to local Ollama (${ollamaModel})`);
              await streamOllama(historyForModel, handleUpdate, ollamaModel, undefined, controller.signal);
            } else {
              console.log(`[Main_chat Chat] Routing ${model} query to Real AI model (using stream for ${streamModel})`);
              switch (streamModel) {
                case 'gemini': await streamGemini(historyForModel, handleUpdate, undefined, 'gemini-2.5-flash', controller.signal); break;
                case 'gpt': await streamGroq(historyForModel, handleUpdate, undefined, 'openai/gpt-oss-120b', controller.signal); break;
                case 'qwen': await streamGroq(historyForModel, handleUpdate, undefined, 'qwen/qwen3.6-27b', controller.signal); break;
                case 'mistral': await streamMistral(historyForModel, handleUpdate, 'mistral-large-2407', controller.signal); break;
                case 'cohere': await streamCohere(historyForModel, handleUpdate, 'command-r-plus-08-2024', controller.signal); break;
                case 'nemotron': await streamCloudflare(historyForModel, handleUpdate, '@cf/nvidia/nemotron-3-120b-a12b', controller.signal); break;
              }
            }
            setResponses((prev) => {
              const updated = { ...prev };
              updated[model] = (prev[model] || []).map((msg) =>
                msg.id === modelMsgId ? { ...msg, isStreamCompleted: true, model: streamModel } : msg
              );
              return updated;
            });
            const assistantChatMessage: ChatMessage = {
              id: modelMsgId + '-' + model,
              sessionId: currentSessionId!,
              sender: 'assistant',
              text: accumulatedText,
              model: streamModel,
              timestamp: Date.now(),
            };
            await saveChatMessage(assistantChatMessage);
          } catch (err) {
            console.error(`Error querying ${model}:`, err);
            const isAborted = (err as any)?.name === 'AbortError' || controller.signal.aborted;
            let text = isAborted 
              ? (accumulatedText ? `${accumulatedText}\n\n🪦 RIP to the rest of that response. 🚫📖 the ending remains a mystery. 🕵️` : '🪦 RIP to the rest of that response. 🚫📖 the ending remains a mystery. 🕵️') 
              : `Error: ${(err as Error).message || err}`;
            
            if (!navigator.onLine || (err instanceof TypeError && err.message.toLowerCase().includes('failed to fetch'))) {
              text = "Network Error: Please check your internet connection and refresh.";
            }
            
            setResponses((prev) => {
              const updated = { ...prev };
              updated[model] = (prev[model] || []).map((msg) =>
                msg.id === modelMsgId ? { ...msg, text, isGenerating: false, model: streamModel } : msg
              );
              return updated;
            });
            const assistantChatMessage: ChatMessage = {
              id: modelMsgId + '-' + model,
              sessionId: currentSessionId!,
              sender: 'assistant',
              text,
              model: streamModel,
              timestamp: Date.now(),
            };
            await saveChatMessage(assistantChatMessage);
          }
        };

        try {
          await Promise.all(targets.map((m) => runQueryForModel(m)));
          setIsResponding(false);
        } catch (error) {
          console.error('Parallel queries failed:', error);
          setIsResponding(false);
        } finally {
          if (abortControllerRef.current === controller) abortControllerRef.current = null;
        }
      } catch (dbErr) {
        console.error('Database operations failed:', dbErr);
        setIsResponding(false);
      }
    })();
  };

  const handleRetry = (msgId: string, modelName: string) => {
    const model = modelName.toLowerCase();
    const modelMsgs = responses[model] || [];
    const msgIndex = modelMsgs.findIndex(m => m.id === msgId);
    if (msgIndex === -1) return;
    
    let userPrompt = '';
    let userMsgIndex = -1;
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (modelMsgs[i].sender === 'user') {
        userPrompt = modelMsgs[i].text;
        userMsgIndex = i;
        break;
      }
    }
    
    if (userMsgIndex === -1 || !userPrompt.trim()) return;
    
    setIsResponding(true);
    setIsStopped(false);
    
    const modelMsgId = msgId;
    setResponses((prev) => {
      const updated = { ...prev };
      updated[model] = prev[model].map(m => 
        m.id === msgId ? { ...m, text: 'Thinking...', isGenerating: true, searchSources: undefined, searchQuery: undefined, isSearching: false } : m
      );
      return updated;
    });
    
    const controller = new AbortController();
    abortControllerRef.current = controller;

    (async () => {
      // Build history for this model up to the retried message
      const pastMessages = modelMsgs.slice(0, userMsgIndex).filter(m => m.text !== 'Thinking...' && !m.isGenerating);
      const historyForModel: HistoryMessage[] = await Promise.all(
        pastMessages.map(async (msg) => {
          const atts: AttachmentData[] = msg.attachments ? await Promise.all(
            msg.attachments.map(async (att: any) => {
              let base64 = att.base64;
              const isImg = att.type === 'image' || att.mimeType?.startsWith('image/');
              const isPdfFile = att.type === 'pdf' || att.mimeType === 'application/pdf' || att.name?.toLowerCase().endsWith('.pdf');
              if (!base64 && att.url && (isImg || isPdfFile)) {
                base64 = await fetchBase64FromUrl(att.url);
              }
              return {
                name: att.name,
                type: isImg ? 'image' : isPdfFile ? 'pdf' : 'file',
                mimeType: att.mimeType || (isImg ? 'image/png' : isPdfFile ? 'application/pdf' : att.type),
                base64: base64 || undefined,
                url: att.url
              };
            })
          ) : [];
          return {
            role: msg.sender === 'model' ? 'assistant' : 'user',
            text: msg.text,
            attachments: atts
          };
        })
      );

      // Map the user message attachments
      const userMsg = modelMsgs[userMsgIndex];
      const userAtts: AttachmentData[] = userMsg.attachments ? await Promise.all(
        userMsg.attachments.map(async (att: any) => {
          let base64 = att.base64;
          const isImg = att.type === 'image' || att.mimeType?.startsWith('image/');
          const isPdfFile = att.type === 'pdf' || att.mimeType === 'application/pdf' || att.name?.toLowerCase().endsWith('.pdf');
          if (!base64 && att.url && (isImg || isPdfFile)) {
            base64 = await fetchBase64FromUrl(att.url);
          }
          return {
            name: att.name,
            type: isImg ? 'image' : isPdfFile ? 'pdf' : 'file',
            mimeType: att.mimeType || (isImg ? 'image/png' : isPdfFile ? 'application/pdf' : att.type),
            base64: base64 || undefined,
            url: att.url
          };
        })
      ) : [];

      // Append the user query we are retrying
      historyForModel.push({
        role: 'user',
        text: userPrompt,
        attachments: userAtts
      });

      const mem0Context = await searchMem0Memories(userPrompt, user?.id);
      if (mem0Context) {
        historyForModel.unshift({
          role: 'user',
          text: mem0Context
        });
      }

      let retryModel = model;
      if (model === 'auto') {
        const hasImageOrPdf = userAtts.some(
          att => att.type === 'image' || att.type === 'pdf' || att.mimeType?.startsWith('image/') || att.mimeType === 'application/pdf'
        ) || historyForModel.some(msg => 
          msg.attachments?.some(att => att.type === 'image' || att.type === 'pdf' || att.mimeType?.startsWith('image/') || att.mimeType === 'application/pdf')
        );

        if (hasImageOrPdf) {
          retryModel = 'gemini';
          console.log('[Auto Nothric Retry] Image or PDF attachment detected in prompt or history. Routing directly to Gemini.');
        } else {
          try {
            const { classifyPrompt } = await import('../../autonothric/router');
            retryModel = await classifyPrompt(userPrompt);
            console.log(`[Auto Nothric Retry] Routed query to model: "${retryModel}"`);
          } catch (err) {
            console.error('[Auto Nothric Retry] Classification failed:', err);
            retryModel = 'gemini'; // Fallback to Gemini
          }
        }
      }
      
      let accumulatedText = '';
      const handleUpdate = (chunkText: string) => {
        accumulatedText = chunkText;
        setResponses((prev) => {
          const updated = { ...prev };
          updated[model] = (prev[model] || []).map((msg) =>
            msg.id === modelMsgId ? { ...msg, text: chunkText, isGenerating: true } : msg
          );
          return updated;
        });
      };
      
      try {
        const useOllama = false; // Ollama disabled — using real AI models
        if (!navigator.onLine && !useOllama) {
          throw new TypeError("Failed to fetch");
        }
        const useOllamaForTesting = false; // Set to false to enable real models
        if (useOllamaForTesting) {
          const ollamaModel = localStorage.getItem('settings-ollama-model') || 'llama3.2:1b';
          console.log(`[Main_chat Retry] Routing ${model} query to local Ollama (${ollamaModel})`);
          await streamOllama(historyForModel, handleUpdate, ollamaModel, undefined, controller.signal);
        } else {
          console.log(`[Main_chat Retry] Routing ${model} query to Real AI model (using ${retryModel})`);
          switch (retryModel) {
            case 'gemini': await streamGemini(historyForModel, handleUpdate, undefined, 'gemini-2.5-flash', controller.signal); break;
            case 'gpt': await streamGroq(historyForModel, handleUpdate, undefined, 'openai/gpt-oss-120b', controller.signal); break;
            case 'qwen': await streamGroq(historyForModel, handleUpdate, undefined, 'qwen/qwen3.6-27b', controller.signal); break;
            case 'mistral': await streamMistral(historyForModel, handleUpdate, 'mistral-large-2407', controller.signal); break;
            case 'cohere': await streamCohere(historyForModel, handleUpdate, 'command-r-plus-08-2024', controller.signal); break;
            case 'nemotron': await streamCloudflare(historyForModel, handleUpdate, '@cf/nvidia/nemotron-3-120b-a12b', controller.signal); break;
          }
        }
        
        setResponses((prev) => {
          const updated = { ...prev };
          updated[model] = (prev[model] || []).map((msg) =>
            msg.id === modelMsgId ? { ...msg, isStreamCompleted: true, model: retryModel } : msg
          );
          return updated;
        });
        
        const assistantChatMessage: ChatMessage = {
          id: modelMsgId + '-' + model,
          sessionId: activeSessionId!,
          sender: 'assistant',
          text: accumulatedText,
          model: retryModel,
          timestamp: Date.now(),
        };
        await saveChatMessage(assistantChatMessage);
        setIsResponding(false);
      } catch (err) {
        console.error(`Error retrying ${model}:`, err);
        const isAborted = (err as any)?.name === 'AbortError' || controller.signal.aborted;
        let text = isAborted ? (accumulatedText || 'Stopped.') : `Error: ${(err as Error).message || err}`;
        
        if (!navigator.onLine || (err instanceof TypeError && err.message.toLowerCase().includes('failed to fetch'))) {
          text = "Network Error: Please check your internet connection and refresh.";
        }
        
        setResponses((prev) => {
          const updated = { ...prev };
          updated[model] = (prev[model] || []).map((msg) =>
            msg.id === modelMsgId ? { ...msg, text, isGenerating: false, model: retryModel } : msg
          );
          return updated;
        });
        const assistantChatMessage: ChatMessage = {
          id: modelMsgId + '-' + model,
          sessionId: activeSessionId!,
          sender: 'assistant',
          text,
          model: retryModel,
          timestamp: Date.now(),
        };
        await saveChatMessage(assistantChatMessage);
        setIsResponding(false);
      } finally {
        if (abortControllerRef.current === controller) abortControllerRef.current = null;
      }
    })();
  };

  const handleEditMessage = async (msgId: string, newText: string) => {
    if (!newText.trim()) return;
    setResponses((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((model) => {
        updated[model] = (prev[model] || []).map((msg) =>
          msg.id === msgId ? { ...msg, text: newText } : msg
        );
      });
      return updated;
    });

    const chatMessages = await getChatMessages(activeSessionId!);
    const originalMsg = chatMessages.find((m) => m.id === msgId);
    if (originalMsg) {
      const updatedMsg: ChatMessage = {
        ...originalMsg,
        text: newText,
      };
      await saveChatMessage(updatedMsg);
    }
  };

  return {
    activeModels,
    setActiveModels,
    responses,
    isResponding,
    isStopped,
    toggleModel,
    handleSend,
    handleStop,
    handleTypewriterComplete,
    handleRetry,
    handleEditMessage,
    modelsList: MODELS_LIST,
    isLoadingHistory,
  };
}
