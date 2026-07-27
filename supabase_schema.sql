-- Setup Database Schema for Horizon Chat & Imagine

-- 1a. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    owner TEXT DEFAULT 'me',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    pinned BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 1b. Create Chats Table
CREATE TABLE IF NOT EXISTS public.chats (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    summary TEXT,
    pinned BOOLEAN DEFAULT FALSE,
    archived BOOLEAN DEFAULT FALSE,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 2. Create Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id TEXT PRIMARY KEY,
    session_id TEXT REFERENCES public.chats(id) ON DELETE CASCADE,
    sender TEXT NOT NULL,
    text TEXT,
    model TEXT,
    attachments JSONB,
    timestamp BIGINT NOT NULL
);

-- 3. Create Creations Table
CREATE TABLE IF NOT EXISTS public.creations (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    prompt TEXT NOT NULL,
    model TEXT NOT NULL,
    ratio TEXT NOT NULL,
    summary TEXT,
    timestamp BIGINT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creations ENABLE ROW LEVEL SECURITY;

-- 5. Enable Row-Level Security Policies for Users
DROP POLICY IF EXISTS "Users can manage their own projects" ON public.projects;
CREATE POLICY "Users can manage their own projects" ON public.projects FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own chats" ON public.chats;
CREATE POLICY "Users can manage their own chats" ON public.chats FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own messages" ON public.messages;
CREATE POLICY "Users can manage their own messages" ON public.messages FOR ALL USING (
    EXISTS (SELECT 1 FROM public.chats WHERE id = session_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can manage their own creations" ON public.creations;
CREATE POLICY "Users can manage their own creations" ON public.creations FOR ALL USING (auth.uid() = user_id);

-- 6. Setup Supabase Storage Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('creations', 'creations', true),
       ('avatars', 'avatars', true),
       ('attachments', 'attachments', true)
ON CONFLICT (id) DO NOTHING;

-- 7. Enable Storage Policies
-- Enable select for anyone (public buckets)
DROP POLICY IF EXISTS "Public select access to storage" ON storage.objects;
CREATE POLICY "Public select access to storage"
ON storage.objects FOR SELECT
USING (bucket_id IN ('creations', 'avatars', 'attachments'));

-- Enable insert for authenticated users
DROP POLICY IF EXISTS "Authenticated users can upload objects" ON storage.objects;
CREATE POLICY "Authenticated users can upload objects"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id IN ('creations', 'avatars', 'attachments'));

-- Enable update and delete for owners
DROP POLICY IF EXISTS "Users can update their own objects" ON storage.objects;
CREATE POLICY "Users can update their own objects"
ON storage.objects FOR UPDATE
TO authenticated
USING (owner::text = auth.uid()::text OR auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can delete their own objects" ON storage.objects;
CREATE POLICY "Users can delete their own objects"
ON storage.objects FOR DELETE
TO authenticated
USING (owner::text = auth.uid()::text OR auth.uid()::text = (storage.foldername(name))[1]);


-- 9. Setup Public Share Read Policies
DROP POLICY IF EXISTS "Public can view chats" ON public.chats;
CREATE POLICY "Public can view chats" ON public.chats FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view messages" ON public.messages;
CREATE POLICY "Public can view messages" ON public.messages FOR SELECT USING (true);


