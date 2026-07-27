import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { api } from './api';
import type { CollabRoom, CollabMessage, CollabAnnouncement } from './api';
import { saveChat, saveMessage } from '../Main_chat/utils/db';
import {
  streamGemini,
  streamGroq,
  streamCloudflare,
  streamMistral,
  streamCohere,
} from '../Main_chat/utils/aiHandler';
import { getSystemPrompt } from './prompt';
import { classifyMessageIntent } from './utils/autoAiPicker';
import { generateUUID } from '../utils/uuid';

export interface PresenceUser {
  presenceKey: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

function getRoomCache(roomCode: string | null) {
  if (!roomCode || typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(`collab_room_cache_${roomCode}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse collab room cache:', e);
  }
  return null;
}

function saveRoomCache(roomCode: string | null, data: Partial<{
  room: CollabRoom;
  messages: CollabMessage[];
  announcements: CollabAnnouncement[];
  creatorName: string;
  isRoomLocked: boolean;
  coAdmins: string[];
}>) {
  if (!roomCode || typeof window === 'undefined') return;
  try {
    const existing = getRoomCache(roomCode) || {};
    const updated = { ...existing, ...data, timestamp: Date.now() };
    sessionStorage.setItem(`collab_room_cache_${roomCode}`, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save collab room cache:', e);
  }
}

export function useRoom(roomCode: string | null) {
  const { user } = useAuth();

  const initialCache = getRoomCache(roomCode);

  const [room, setRoom] = useState<CollabRoom | null>(() => initialCache?.room || null);
  const [messages, setMessages] = useState<CollabMessage[]>(() => initialCache?.messages || []);
  const messagesRef = useRef<CollabMessage[]>(messages);
  const roomRef = useRef<CollabRoom | null>(room);

  useEffect(() => {
    messagesRef.current = messages;
    if (roomCode && messages.length > 0) {
      saveRoomCache(roomCode, { messages });
    }
  }, [messages, roomCode]);

  useEffect(() => {
    roomRef.current = room;
    if (roomCode && room) {
      saveRoomCache(roomCode, { room });
    }
  }, [room, roomCode]);

  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);
  // If cache exists, do not show full-screen connecting overlay on refresh!
  const [isConnecting, setIsConnecting] = useState(!initialCache?.room);
  const [error, setError] = useState<string | null>(null);
  const [creatorName, setCreatorName] = useState<string>(() => initialCache?.creatorName || 'Creator');
  const [isRoomLocked, setIsRoomLocked] = useState<boolean>(() => initialCache?.isRoomLocked || false);
  const [coAdmins, setCoAdmins] = useState<string[]>(() => initialCache?.coAdmins || []);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<CollabAnnouncement[]>(() => initialCache?.announcements || []);
  const [unreadAnnouncementsCount, setUnreadAnnouncementsCount] = useState<number>(0);

  // Streaming AI response state
  const [streamingModels, setStreamingModels] = useState<string[]>([]);
  const [streamingTexts, setStreamingTexts] = useState<Record<string, string>>({});

  const channelRef = useRef<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const tabIdRef = useRef<string>('');
  if (!tabIdRef.current) {
    let tid = sessionStorage.getItem('collab-tab-id');
    if (!tid) {
      tid = generateUUID();
      sessionStorage.setItem('collab-tab-id', tid);
    }
    tabIdRef.current = tid;
  }

  const userId = user?.id || 'guest-user';
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest';

  // 1. Fetch Room details and initial messages from Cloudflare
  const loadRoom = useCallback(async () => {
    if (!roomCode) return;
    // Only show full connecting screen if we don't have a cached room loaded yet
    if (!roomRef.current) {
      setIsConnecting(true);
    }
    setError(null);
    try {
      // Get Room Details
      const roomDetails = await api.getRoom(roomCode);
      setRoom(roomDetails);
      let locked = false;
      if (roomDetails.is_locked !== undefined) {
        locked = roomDetails.is_locked === 1;
        setIsRoomLocked(locked);
      }
      let admins: string[] = [];
      if (roomDetails.co_admins) {
        try {
          admins = JSON.parse(roomDetails.co_admins);
          setCoAdmins(admins);
        } catch {}
      }
      if (roomDetails.announcement !== undefined) {
        setAnnouncement(roomDetails.announcement);
      }

      // Join Room
      await api.joinRoom(roomCode, userId, userName);

      // Fetch creator name from participants
      let cName = 'Creator';
      try {
        cName = await api.getCreatorName(roomDetails.id, roomDetails.created_by);
        setCreatorName(cName);
      } catch (e) {
        console.error('Failed to get creator name:', e);
      }

      // Load Room Message History
      const roomMessages = await api.getMessages(roomCode);
      setMessages(roomMessages);

      // Load Room Announcements History
      let loadedAnnouncements: CollabAnnouncement[] = [];
      try {
        loadedAnnouncements = await api.getAnnouncements(roomCode);
        setAnnouncements(loadedAnnouncements);
      } catch (e) {
        console.error('Failed to load announcements:', e);
      }

      // Save to session cache for instant load on refresh
      saveRoomCache(roomCode, {
        room: roomDetails,
        messages: roomMessages,
        creatorName: cName,
        isRoomLocked: locked,
        coAdmins: admins,
        announcements: loadedAnnouncements,
      });
    } catch (err: any) {
      console.error('Error loading collab room:', err);
      setError(err.message || 'Failed to connect to the room');
    } finally {
      setIsConnecting(false);
    }
  }, [roomCode, userId, userName]);


  useEffect(() => {
    loadRoom();
  }, [loadRoom]);

  // 2. Setup Supabase Realtime Channels (Broadcast + Presence)
  useEffect(() => {
    if (!room) return;

    // Create channel
    const channelId = `collab_room_${room.id}`;
    const channel = supabase.channel(channelId, {
      config: {
        presence: {
          key: tabIdRef.current,
        },
      },
    });

    channelRef.current = channel;

    // Listen to real-time events
    channel
      // Listen to Presence updates (who is online and typing states)
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const users: PresenceUser[] = [];

        Object.keys(presenceState).forEach((key) => {
          const info = presenceState[key] as any;
          if (info && info.length > 0) {
            users.push({
              presenceKey: key,
              userId: info[0].userId || 'guest-user',
              userName: info[0].userName || 'Guest',
              isTyping: info[info.length - 1]?.isTyping === true,
            });
          }
        });

        setOnlineUsers(users);
      })
      // Listen to new messages broadcast
      .on('broadcast', { event: 'new_message' }, ({ payload }) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === payload.id)) return prev;
          return [...prev, payload];
        });
      })
      // Listen to message reactions
      .on('broadcast', { event: 'message_reaction' }, ({ payload }) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === payload.msgId
              ? { ...msg, reactions: payload.reactions }
              : msg
          )
        );
      })
      // Listen to message deletions
      .on('broadcast', { event: 'message_deleted' }, ({ payload }) => {
        setMessages((prev) => prev.filter((msg) => msg.id !== payload.msgId));
      })
      // Listen to message pinned state
      .on('broadcast', { event: 'message_pinned' }, ({ payload }) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === payload.msgId
              ? { ...msg, pinned: payload.pinned }
              : msg
          )
        );
      })
      // Listen to live AI response streaming chunks
      .on('broadcast', { event: 'stream_chunk' }, ({ payload }) => {
        setStreamingModels((prev) => {
          if (prev.includes(payload.model)) return prev;
          return [...prev, payload.model];
        });
        setStreamingTexts((prev) => ({
          ...prev,
          [payload.model]: payload.text
        }));
      })
      // Listen to stream completion
      .on('broadcast', { event: 'stream_done' }, ({ payload }) => {
        const finishedModel = payload.model;
        setStreamingModels((prev) => prev.filter((m) => m !== finishedModel));
        setStreamingTexts((prev) => {
          const next = { ...prev };
          delete next[finishedModel];
          return next;
        });
        if (payload.message) {
          setMessages((prev) => {
            const index = prev.findIndex((m) => m.id === payload.message.id);
            if (index !== -1) {
              return prev.map((m) => m.id === payload.message.id ? payload.message : m);
            }
            return [...prev, payload.message];
          });
        }
      })
      .on('broadcast', { event: 'kick_member' }, ({ payload }) => {
        if (payload?.userId === userId) {
          alert('You have been removed from this group by the admin.');
          window.location.href = '/groupchat';
        }
      })
      .on('broadcast', { event: 'delete_room' }, () => {
        alert('This group chat has been deleted by the admin.');
        window.location.href = '/groupchat';
      })
      .on('broadcast', { event: 'delete_message' }, ({ payload }) => {
        if (payload?.msgId) {
          setMessages((prev) => prev.filter((m) => m.id !== payload.msgId));
        }
      })
      .on('broadcast', { event: 'room_lock_updated' }, ({ payload }) => {
        if (payload?.isLocked !== undefined) {
          setIsRoomLocked(payload.isLocked);
        }
      })
      .on('broadcast', { event: 'co_admins_updated' }, ({ payload }) => {
        if (Array.isArray(payload?.coAdmins)) {
          setCoAdmins(payload.coAdmins);
        }
      })
      .on('broadcast', { event: 'announcement_updated' }, ({ payload }) => {
        setAnnouncement(payload?.announcement || null);
      })
      .on('broadcast', { event: 'announcement_added' }, ({ payload }) => {
        if (payload?.announcement) {
          setAnnouncements((prev) => [payload.announcement, ...prev]);
          setUnreadAnnouncementsCount((prev) => prev + 1);
        }
      })
      .on('broadcast', { event: 'announcement_deleted' }, ({ payload }) => {
        if (payload?.id) {
          setAnnouncements((prev) => prev.filter((a) => a.id !== payload.id));
        }
      });

    // Subscribe to channel
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          userId,
          userName,
          isTyping: false,
        });
      }
    });

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [room, userId, userName]);

  // 3. Broadcast typing state
  const setTypingState = useCallback(async (isTyping: boolean) => {
    if (channelRef.current) {
      await channelRef.current.track({
        userId,
        userName,
        isTyping,
      });
    }
  }, [userId, userName]);

  // 4. Send Message (User prompt triggers local AI streaming and broadcasts updates)
  const sendMessage = useCallback(async (promptText: string, modelCodes: string[], replyTo?: { sender: string; text: string } | null) => {
    if (!room || !promptText.trim()) return;

    // Stop any active AI stream first
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Filter active model codes to only include those that are enabled in this room
    let enabledModels: Record<string, boolean> = { gemini: true, gpt: true, qwen: true, mistral: true, cohere: true, nemotron: true };
    try {
      const saved = localStorage.getItem(`room-models-${room.id}`);
      if (saved) {
        enabledModels = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse enabled models:', e);
    }

    let activeModelCodes = modelCodes.filter((code) => enabledModels[code.toLowerCase()] !== false);
    if (activeModelCodes.length === 0 && modelCodes.length === 0) {
      const recentHistory = messages.slice(-5).map((m) => ({
        sender: m.sender_name,
        text: m.response ? `${m.prompt} → ${m.response}` : m.prompt,
        model: m.model || undefined,
      }));
      const autoPicked = await classifyMessageIntent(promptText, recentHistory);
      if (autoPicked.length > 0) {
        activeModelCodes = autoPicked.filter((code) => enabledModels[code.toLowerCase()] !== false);
      }
    }

    const tempUserId = userId;
    const tempUserName = userName;

    // Optimistic: show message instantly in chat
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const optimisticMsg: CollabMessage = {
      id: tempId,
      room_id: room.id,
      sender_id: tempUserId,
      sender_name: tempUserName,
      model: activeModelCodes.length > 0 ? activeModelCodes.join(',') : null,
      prompt: promptText,
      response: '',
      created_at: new Date().toISOString(),
      reply_to: replyTo || undefined,
    };

    // Add to chat immediately — no delay
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      // Save to backend in background
      const userMsg = await api.saveMessage(
        room.code,
        tempUserId,
        tempUserName,
        promptText,
        '', // Response is empty since it's the prompt
        activeModelCodes.length > 0 ? activeModelCodes.join(',') : undefined,
        replyTo
      );

      // Replace optimistic message with real one from server
      setMessages((prev) => prev.map((m) => m.id === tempId ? userMsg : m));

      // Broadcast the real message to everyone else in the room
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'new_message',
          payload: userMsg,
        });
      }

      // 3. Trigger AI generation in parallel for all selected/auto-picked models
      if (activeModelCodes && activeModelCodes.length > 0) {
        // Set up AbortController for AI streams
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setStreamingModels(activeModelCodes);
        setStreamingTexts({});

        const streamPromises = activeModelCodes.map(async (modelCode) => {
          let accumulatedResponse = '';

          const handleChunk = (chunk: string) => {
            accumulatedResponse = chunk;
            setStreamingTexts((prev) => ({
              ...prev,
              [modelCode]: accumulatedResponse,
            }));

            // Broadcast streaming chunk to other users in the room
            if (channelRef.current) {
              channelRef.current.send({
                type: 'broadcast',
                event: 'stream_chunk',
                payload: {
                  model: modelCode,
                  text: accumulatedResponse,
                },
              });
            }
          };

          // Call correct AI provider with collaborative instructions and chat context
          const oldInstructions = localStorage.getItem('personalization-custom-instructions');
          const collabPromptBase = getSystemPrompt(modelCode);
          const collabInstructions = room.system_prompt
            ? `${collabPromptBase}\n\nAdditional Room Instructions:\n${room.system_prompt}`
            : collabPromptBase;
          localStorage.setItem('personalization-custom-instructions', collabInstructions);

          // Compile recent messages context so the model acts as a chat participant
          const recentMessages = messagesRef.current.slice(-10); // get last 10 messages
          let collabPrompt = '';
          if (recentMessages.length > 0) {
            const modelFriendlyNames: Record<string, string> = {
              gemini: 'Gemini',
              gpt: 'Llama',
              qwen: 'Qwen',
              mistral: 'Mistral',
              cohere: 'Cohere',
              nemotron: 'Nvidia',
            };
            collabPrompt += "MULTIPLE PARTICIPANTS CONVERSATION HISTORY CONTEXT:\n";
            recentMessages.forEach((msg) => {
              if (msg.sender_id === 'ai') {
                const modelKey = (msg.model || 'model').toLowerCase();
                const name = modelFriendlyNames[modelKey] || msg.model || 'Assistant';
                collabPrompt += `[AI Assistant (${name})]: ${msg.response}\n`;
              } else {
                if (msg.reply_to) {
                  collabPrompt += `[User (${msg.sender_name}) (replying to ${msg.reply_to.sender}: "${msg.reply_to.text}")]: ${msg.prompt}\n`;
                } else {
                  collabPrompt += `[User (${msg.sender_name})]: ${msg.prompt}\n`;
                }
              }
            });
            collabPrompt += "\nNEW USER MESSAGE TO REPLY TO:\n";
          }

          if (replyTo) {
            collabPrompt += `[User (${userName}) (replying to ${replyTo.sender}: "${replyTo.text}")]: ${promptText}`;
          } else {
            collabPrompt += `[User (${userName})]: ${promptText}`;
          }

          try {
            if (modelCode === 'gemini') {
              await streamGemini(collabPrompt, handleChunk, [], 'gemini-2.5-flash', controller.signal);
            } else if (modelCode === 'gpt') {
              await streamGroq(collabPrompt, handleChunk, [], 'openai/gpt-oss-120b', controller.signal);
            } else if (modelCode === 'qwen') {
              await streamGroq(collabPrompt, handleChunk, [], 'qwen/qwen3-32b', controller.signal);
            } else if (modelCode === 'mistral') {
              await streamMistral(collabPrompt, handleChunk, 'mistral-large-2407', controller.signal);
            } else if (modelCode === 'cohere') {
              await streamCohere(collabPrompt, handleChunk, 'command-r-plus-08-2024', controller.signal);
            } else if (modelCode === 'nemotron') {
              await streamCloudflare(collabPrompt, handleChunk, '@cf/nvidia/nemotron-3-120b-a12b', controller.signal);
            }
          } catch (err: any) {
            if (err.name === 'AbortError') {
              console.log(`Stream aborted for model ${modelCode}`);
            } else {
              console.error(`AI streaming error for ${modelCode}:`, err);
            }
          } finally {
            if (oldInstructions !== null) {
              localStorage.setItem('personalization-custom-instructions', oldInstructions);
            } else {
              localStorage.removeItem('personalization-custom-instructions');
            }
          }

          // 5. Save the finalized AI message to Cloudflare D1
          let aiMsg;
          try {
            aiMsg = await api.saveMessage(
              room.code,
              'ai',
              'Assistant',
              promptText,
              accumulatedResponse,
              modelCode
            );
          } catch (dbErr) {
            console.error(`Failed to save AI message to database for model ${modelCode}:`, dbErr);
            // Fallback to local message so it doesn't disappear from UI
            aiMsg = {
              id: `local-ai-${Date.now()}-${Math.random().toString(36).substring(2)}`,
              room_id: room.id,
              sender_id: 'ai',
              sender_name: 'Assistant',
              model: modelCode,
              prompt: promptText,
              response: accumulatedResponse,
              created_at: new Date().toISOString(),
              reactions: {},
              pinned: false,
              reply_to: undefined
            };
          }

          // 6. Broadcast that the stream is done and send the D1 persisted message
          if (channelRef.current) {
            channelRef.current.send({
              type: 'broadcast',
              event: 'stream_done',
              payload: {
                model: modelCode,
                message: aiMsg,
              },
            });
          }

          // Clean up local streaming state for this model code
          setStreamingModels((prev) => prev.filter((m) => m !== modelCode));
          setStreamingTexts((prev) => {
            const next = { ...prev };
            delete next[modelCode];
            return next;
          });
          setMessages((prev) => [...prev, aiMsg!]);
        });

        // Run all selected models in parallel
        await Promise.all(streamPromises);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('AI stream aborted');
      } else {
        console.error('Error generating AI response:', err);
      }
      setStreamingModels([]);
      setStreamingTexts({});
    }
  }, [room, userId, userName]);

  // 5. Export Collab history to the user's personal Supabase chats list
  const exportToSupabase = useCallback(async (): Promise<string | null> => {
    if (!room || messages.length === 0) return null;

    try {
      const sessionId = 'Main_chat_' + generateUUID();

      // Save chat session header to Supabase
      await saveChat({
        id: sessionId,
        title: `Collab Room: ${room.title}`,
        createdAt: Date.now(),
        userId,
      });

      // Save each message in the thread to Supabase
      for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];

        // 1. User prompt message
        const userMsgId = generateUUID();
        await saveMessage({
          id: userMsgId,
          sessionId,
          sender: 'user',
          text: msg.prompt,
          model: msg.model || undefined,
          timestamp: new Date(msg.created_at).getTime() + (i * 1000), // separate timestamps slightly
        });

        // 2. Assistant reply message (if response exists)
        if (msg.response) {
          const assistantMsgId = generateUUID();
          await saveMessage({
            id: assistantMsgId,
            sessionId,
            sender: 'assistant',
            text: msg.response,
            model: msg.model || undefined,
            timestamp: new Date(msg.created_at).getTime() + (i * 1000) + 500,
          });
        }
      }

      return sessionId;
    } catch (err) {
      console.error('Failed to export room history to Supabase:', err);
      throw err;
    }
  }, [room, messages, userId]);

  const renameRoom = useCallback(async (newTitle: string) => {
    if (!room) return;
    await api.renameRoom(room.id, newTitle);
    setRoom((prev) => prev ? { ...prev, title: newTitle } : null);
  }, [room]);

  const updateSystemPrompt = useCallback(async (newPrompt: string | null) => {
    if (!room) return;
    await api.setSystemPrompt(room.id, newPrompt);
    setRoom((prev) => prev ? { ...prev, system_prompt: newPrompt } : null);
  }, [room]);

  const addReaction = useCallback(async (msgId: string, emoji: string) => {
    if (!room) return;
    
    let updatedReactions: Record<string, string[]> = {};
    
    setMessages((prev) => {
      return prev.map((msg) => {
        if (msg.id === msgId) {
          const reactions = { ...(msg.reactions || {}) };
          const userList = reactions[emoji] || [];
          const hasUser = userList.includes(userName);
          const updatedUsers = hasUser
            ? userList.filter((u) => u !== userName)
            : [...userList, userName];
          
          if (updatedUsers.length === 0) {
            delete reactions[emoji];
          } else {
            reactions[emoji] = updatedUsers;
          }
          updatedReactions = reactions;
          return { ...msg, reactions };
        }
        return msg;
      });
    });

    try {
      await api.updateMessageReactions(msgId, updatedReactions);
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'message_reaction',
          payload: { msgId, reactions: updatedReactions }
        });
      }
    } catch (e) {
      console.error("Failed to update message reaction:", e);
    }
  }, [room, userName]);

  const deleteCollabMessage = useCallback(async (msgId: string) => {
    if (!room) return;

    setMessages((prev) => prev.filter((m) => m.id !== msgId));

    try {
      await api.deleteMessage(msgId);
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'message_deleted',
          payload: { msgId }
        });
      }
    } catch (e) {
      console.error("Failed to delete collaborative message:", e);
    }
  }, [room]);

  const togglePinCollabMessage = useCallback(async (msgId: string, isPinned: boolean) => {
    if (!room) return;

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === msgId ? { ...msg, pinned: isPinned } : msg
      )
    );

    try {
      await api.togglePinMessage(msgId, isPinned);
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'message_pinned',
          payload: { msgId, pinned: isPinned }
        });
      }
    } catch (e) {
      console.error("Failed to pin collaborative message:", e);
    }
  }, [room]);

  const kickUser = useCallback(async (targetUserId: string) => {
    if (!room) return;
    try {
      await api.kickParticipant(room.id, targetUserId);
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'kick_member',
          payload: { userId: targetUserId },
        });
      }
    } catch (err) {
      console.error('Failed to kick user:', err);
    }
  }, [room]);

  const deleteRoom = useCallback(async () => {
    if (!room) return;
    try {
      if (channelRef.current) {
        await channelRef.current.send({
          type: 'broadcast',
          event: 'delete_room',
          payload: { roomId: room.id },
        });
      }
      await api.deleteRoom(room.id);
    } catch (err) {
      console.error('Failed to delete room:', err);
    }
  }, [room]);

  const isCreator = room?.created_by === userId;
  const isCoAdmin = isCreator || coAdmins.includes(userId);

  const toggleRoomLock = useCallback(async () => {
    if (!room) return;
    const nextLocked = !isRoomLocked;
    setIsRoomLocked(nextLocked);
    try {
      await api.setRoomLock(room.id, nextLocked);
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'room_lock_updated',
          payload: { isLocked: nextLocked },
        });
      }
    } catch (err) {
      console.error('Failed to toggle room lock:', err);
    }
  }, [room, isRoomLocked]);

  const toggleCoAdmin = useCallback(async (targetUserId: string) => {
    if (!room) return;
    const nextCoAdmins = coAdmins.includes(targetUserId)
      ? coAdmins.filter((id) => id !== targetUserId)
      : [...coAdmins, targetUserId];
    setCoAdmins(nextCoAdmins);
    try {
      await api.setCoAdmins(room.id, nextCoAdmins);
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'co_admins_updated',
          payload: { coAdmins: nextCoAdmins },
        });
      }
    } catch (err) {
      console.error('Failed to update co-admins:', err);
    }
  }, [room, coAdmins]);

  const updateAnnouncement = useCallback(async (text: string | null) => {
    if (!room) return;
    setAnnouncement(text);
    try {
      await api.setAnnouncement(room.id, text);
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'announcement_updated',
          payload: { announcement: text },
        });
      }
    } catch (err) {
      console.error('Failed to update announcement:', err);
    }
  }, [room]);

  const addAnnouncement = useCallback(async (text: string) => {
    if (!room) return;
    try {
      const newAnn = await api.addAnnouncement(room.code, userName, text);
      setAnnouncements((prev) => [newAnn, ...prev]);
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'announcement_added',
          payload: { announcement: newAnn },
        });
      }
    } catch (err) {
      console.error('Failed to add announcement:', err);
    }
  }, [room, userName]);

  const deleteAnnouncement = useCallback(async (announcementId: string) => {
    if (!room) return;
    setAnnouncements((prev) => prev.filter((a) => a.id !== announcementId));
    try {
      await api.deleteAnnouncement(announcementId);
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'announcement_deleted',
          payload: { id: announcementId },
        });
      }
    } catch (err) {
      console.error('Failed to delete announcement:', err);
    }
  }, [room]);

  const markAnnouncementsAsRead = useCallback(() => {
    setUnreadAnnouncementsCount(0);
  }, []);

  return {
    room,
    messages,
    onlineUsers,
    isConnecting,
    error,
    streamingModels,
    streamingTexts,
    sendMessage,
    setTypingState,
    exportToSupabase,
    creatorName,
    renameRoom,
    updateSystemPrompt,
    addReaction,
    deleteCollabMessage,
    togglePinCollabMessage,
    kickUser,
    deleteRoom,
    isRoomLocked,
    coAdmins,
    toggleRoomLock,
    toggleCoAdmin,
    isCoAdmin,
    announcement,
    updateAnnouncement,
    announcements,
    unreadAnnouncementsCount,
    addAnnouncement,
    deleteAnnouncement,
    markAnnouncementsAsRead,
    currentUserName: userName,
    currentUserId: userId,
    tabId: tabIdRef.current,
    channel: channelRef.current,
  };
}
