import { generateUUID } from '../utils/uuid';

const accountId = localStorage.getItem('api-key-cloudflare-account') || import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID || "a3fc173c2b06b226e3b3be38fe1c126b";
const apiToken = localStorage.getItem('api-key-cloudflare-token') || import.meta.env.VITE_CLOUDFLARE_API_TOKEN || "cfat_YhefWQbjhjrbi1F0outvPLvyWgOtkeXVN0Ml1wMZ3fdcf2b1";
const databaseId = "1d060dc4-ad4a-4b64-9e69-0504a998708b";

const getEndpoint = () => {
  return `/cloudflare-api/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;
};

let migrationChecked = false;
let isMigrating = false;

async function checkMigration() {
  if (migrationChecked || isMigrating) return;
  isMigrating = true;
  try {
    const endpoint = getEndpoint();
    const headers = {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    };
    const migrationSqls = [
      "ALTER TABLE collab_messages ADD COLUMN reactions TEXT DEFAULT '{}'",
      "ALTER TABLE collab_messages ADD COLUMN pinned INTEGER DEFAULT 0",
      "ALTER TABLE collab_messages ADD COLUMN reply_to TEXT DEFAULT NULL",
      "ALTER TABLE collab_rooms ADD COLUMN is_locked INTEGER DEFAULT 0",
      "ALTER TABLE collab_rooms ADD COLUMN co_admins TEXT DEFAULT '[]'",
      "ALTER TABLE collab_rooms ADD COLUMN announcement TEXT DEFAULT NULL",
      "CREATE TABLE IF NOT EXISTS collab_announcements (id TEXT PRIMARY KEY, room_id TEXT, sender_name TEXT, text TEXT, created_at TEXT)"
    ];
    await Promise.allSettled(
      migrationSqls.map((sql) =>
        fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({ sql }),
        })
      )
    );
  } catch (err) {
    // Handled (columns likely already exist)
  } finally {
    isMigrating = false;
    migrationChecked = true;
  }
}

async function executeQuery(sql: string, params: any[] = []): Promise<any> {
  await checkMigration();
  const endpoint = getEndpoint();
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`Database gateway error (HTTP ${res.status}): ${errorText.substring(0, 100)}`);
  }

  let data;
  try {
    data = await res.json();
  } catch (err: any) {
    throw new Error(`Failed to parse database response: ${err?.message || 'Invalid JSON'}`);
  }

  if (!data || !data.success) {
    const errMsg = data?.errors?.[0]?.message || 'Query failed';
    throw new Error(errMsg);
  }

  return data.result?.[0];
}

// Generate random room code like 'room-abc-xyz'
function generateRoomCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const segment = (len: number) => {
    let s = '';
    for (let i = 0; i < len; i++) {
      s += chars[Math.floor(Math.random() * chars.length)];
    }
    return s;
  };
  return `room-${segment(3)}-${segment(3)}`;
}

export interface CollabRoom {
  id: string;
  code: string;
  title: string;
  created_by: string;
  created_at: string;
  is_active: number;
  pinned?: number;
  password?: string | null;
  rating?: number;
  system_prompt?: string | null;
  is_locked?: number;
  co_admins?: string;
  announcement?: string | null;
}

export interface CollabAnnouncement {
  id: string;
  room_id: string;
  sender_name: string;
  text: string;
  created_at: string;
}

export interface CollabMessage {
  id: string;
  room_id: string;
  sender_id: string;
  sender_name: string;
  model: string | null;
  prompt: string;
  response: string;
  created_at: string;
  reactions?: Record<string, string[]>;
  pinned?: boolean;
  reply_to?: { sender: string; text: string };
}

export const api = {
  async createRoom(userId: string, title?: string): Promise<CollabRoom> {
    const id = generateUUID();
    const code = generateRoomCode();
    const createdAt = new Date().toISOString();
    const finalTitle = title || 'Untitled Collaboration';

    await executeQuery(
      'INSERT INTO collab_rooms (id, code, title, created_by, created_at, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [id, code, finalTitle, userId, createdAt, 1]
    );

    return {
      id,
      code,
      title: finalTitle,
      created_by: userId,
      created_at: createdAt,
      is_active: 1,
    };
  },

  async getRoom(code: string): Promise<CollabRoom> {
    const dbRes = await executeQuery('SELECT * FROM collab_rooms WHERE code = ?', [code]);
    const room = dbRes?.results?.[0];
    if (!room) throw new Error('Room not found');
    return room;
  },

  async joinRoom(code: string, userId: string, userName: string): Promise<CollabRoom> {
    const room = await this.getRoom(code);

    const existingRes = await executeQuery(
      'SELECT id FROM collab_participants WHERE room_id = ? AND user_id = ?',
      [room.id, userId]
    );
    const existing = existingRes?.results?.[0];

    if (!existing) {
      const participantId = generateUUID();
      const joinedAt = new Date().toISOString();
      await executeQuery(
        'INSERT INTO collab_participants (id, room_id, user_id, user_name, joined_at) VALUES (?, ?, ?, ?, ?)',
        [participantId, room.id, userId, userName, joinedAt]
      );
    }

    return room;
  },

  async getMessages(code: string): Promise<CollabMessage[]> {
    const room = await this.getRoom(code);
    const dbRes = await executeQuery(
      'SELECT * FROM collab_messages WHERE room_id = ? ORDER BY created_at ASC',
      [room.id]
    );
    const results = dbRes?.results || [];
    return results.map((m: any) => {
      let parsedReactions = {};
      try {
        parsedReactions = m.reactions ? JSON.parse(m.reactions) : {};
      } catch (e) {
        parsedReactions = {};
      }
      let parsedReplyTo = undefined;
      try {
        parsedReplyTo = m.reply_to ? JSON.parse(m.reply_to) : undefined;
      } catch (e) {
        parsedReplyTo = undefined;
      }
      return {
        ...m,
        pinned: m.pinned === 1,
        reactions: parsedReactions,
        reply_to: parsedReplyTo
      };
    });
  },

  async saveMessage(
    code: string,
    senderId: string,
    senderName: string,
    prompt: string,
    response: string,
    model?: string,
    replyTo?: { sender: string; text: string } | null
  ): Promise<CollabMessage> {
    const room = await this.getRoom(code);
    const messageId = generateUUID();
    const createdAt = new Date().toISOString();
    const replyToJson = replyTo ? JSON.stringify(replyTo) : null;

    await executeQuery(
      'INSERT INTO collab_messages (id, room_id, sender_id, sender_name, model, prompt, response, created_at, reactions, pinned, reply_to) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [messageId, room.id, senderId, senderName, model || null, prompt, response, createdAt, '{}', 0, replyToJson]
    );

    return {
      id: messageId,
      room_id: room.id,
      sender_id: senderId,
      sender_name: senderName,
      model: model || null,
      prompt,
      response,
      created_at: createdAt,
      reactions: {},
      pinned: false,
      reply_to: replyTo || undefined
    };
  },

  async deleteMessage(msgId: string): Promise<void> {
    await executeQuery('DELETE FROM collab_messages WHERE id = ?', [msgId]);
  },

  async togglePinMessage(msgId: string, isPinned: boolean): Promise<void> {
    await executeQuery('UPDATE collab_messages SET pinned = ? WHERE id = ?', [isPinned ? 1 : 0, msgId]);
  },

  async updateMessageReactions(msgId: string, reactions: Record<string, string[]>) {
    await executeQuery('UPDATE collab_messages SET reactions = ? WHERE id = ?', [JSON.stringify(reactions), msgId]);
  },

  async getUserRooms(userId: string): Promise<CollabRoom[]> {
    const dbRes = await executeQuery(
      `SELECT DISTINCT r.* FROM collab_rooms r
       LEFT JOIN collab_participants p ON r.id = p.room_id
       WHERE (r.created_by = ? OR p.user_id = ?) AND r.is_active = 1
       ORDER BY r.pinned DESC, r.created_at DESC`,
      [userId, userId]
    );
    return dbRes?.results || [];
  },

  async renameRoom(roomId: string, title: string): Promise<void> {
    await executeQuery('UPDATE collab_rooms SET title = ? WHERE id = ?', [title, roomId]);
  },

  async pinRoom(roomId: string, pinned: number): Promise<void> {
    await executeQuery('UPDATE collab_rooms SET pinned = ? WHERE id = ?', [pinned, roomId]);
  },

  async deleteRoom(roomId: string): Promise<void> {
    await executeQuery('UPDATE collab_rooms SET is_active = 0 WHERE id = ?', [roomId]);
  },

  async setPassword(roomId: string, password: string | null): Promise<void> {
    await executeQuery('UPDATE collab_rooms SET password = ? WHERE id = ?', [password, roomId]);
  },

  async setRating(roomId: string, rating: number): Promise<void> {
    await executeQuery('UPDATE collab_rooms SET rating = ? WHERE id = ?', [rating, roomId]);
  },

  async setSystemPrompt(roomId: string, systemPrompt: string | null): Promise<void> {
    await executeQuery('UPDATE collab_rooms SET system_prompt = ? WHERE id = ?', [systemPrompt, roomId]);
  },

  async getCreatorName(roomId: string, creatorId: string): Promise<string> {
    const dbRes = await executeQuery(
      'SELECT user_name FROM collab_participants WHERE room_id = ? AND user_id = ?',
      [roomId, creatorId]
    );
    return dbRes?.results?.[0]?.user_name || 'Creator';
  },

  async getParticipants(roomId: string): Promise<{ user_id: string; user_name: string }[]> {
    const dbRes = await executeQuery(
      'SELECT user_id, user_name FROM collab_participants WHERE room_id = ? AND left_at IS NULL',
      [roomId]
    );
    return dbRes?.results || [];
  },

  async kickParticipant(roomId: string, userId: string): Promise<void> {
    await executeQuery(
      'UPDATE collab_participants SET left_at = ? WHERE room_id = ? AND user_id = ?',
      [new Date().toISOString(), roomId, userId]
    );
  },

  async setRoomLock(roomId: string, isLocked: boolean): Promise<void> {
    await executeQuery('UPDATE collab_rooms SET is_locked = ? WHERE id = ?', [isLocked ? 1 : 0, roomId]);
  },

  async setCoAdmins(roomId: string, coAdmins: string[]): Promise<void> {
    await executeQuery('UPDATE collab_rooms SET co_admins = ? WHERE id = ?', [JSON.stringify(coAdmins), roomId]);
  },

  async setAnnouncement(roomId: string, announcement: string | null): Promise<void> {
    await executeQuery('UPDATE collab_rooms SET announcement = ? WHERE id = ?', [announcement, roomId]);
  },

  async getAnnouncements(code: string): Promise<CollabAnnouncement[]> {
    const room = await this.getRoom(code);
    const dbRes = await executeQuery(
      'SELECT * FROM collab_announcements WHERE room_id = ? ORDER BY created_at DESC',
      [room.id]
    );
    return dbRes?.results || [];
  },

  async addAnnouncement(code: string, senderName: string, text: string): Promise<CollabAnnouncement> {
    const room = await this.getRoom(code);
    const id = generateUUID();
    const createdAt = new Date().toISOString();
    await executeQuery(
      'INSERT INTO collab_announcements (id, room_id, sender_name, text, created_at) VALUES (?, ?, ?, ?, ?)',
      [id, room.id, senderName, text, createdAt]
    );
    return {
      id,
      room_id: room.id,
      sender_name: senderName,
      text,
      created_at: createdAt,
    };
  },

  async deleteAnnouncement(announcementId: string): Promise<void> {
    await executeQuery('DELETE FROM collab_announcements WHERE id = ?', [announcementId]);
  },
};
