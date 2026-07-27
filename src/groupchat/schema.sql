-- Cloudflare D1 Database Schema for Nothric Collab (SQLite)

-- 1. Collaboration Rooms Table
CREATE TABLE IF NOT EXISTS collab_rooms (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  pinned INTEGER DEFAULT 0,
  password TEXT DEFAULT NULL,
  rating INTEGER DEFAULT 0
);

-- 2. Participants Table
CREATE TABLE IF NOT EXISTS collab_participants (
  id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  joined_at TEXT NOT NULL,
  left_at TEXT DEFAULT NULL,
  FOREIGN KEY (room_id) REFERENCES collab_rooms (id) ON DELETE CASCADE
);

-- 3. Collaboration Messages Table
CREATE TABLE IF NOT EXISTS collab_messages (
  id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  model TEXT DEFAULT NULL,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (room_id) REFERENCES collab_rooms (id) ON DELETE CASCADE
);
