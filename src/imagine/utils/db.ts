import { supabase, uploadImageToBucket } from '../../lib/supabase';

export interface SavedCreation {
  id?: number;
  url: string;
  prompt: string;
  model: string;
  ratio: string;
  summary?: string;
  timestamp: number;
  userId?: string;
}

export async function getCurrentUserId(): Promise<string | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || null;
  } catch (err) {
    console.error("Failed to get auth session in imagine db:", err);
    return null;
  }
}

export async function getCreations(): Promise<SavedCreation[]> {
  const userId = await getCurrentUserId();
  if (!userId) {
    const fallbackData = localStorage.getItem('imagine_fallback:guest');
    return fallbackData ? JSON.parse(fallbackData) : [];
  }
  
  try {
    const { data, error } = await supabase
      .from('creations')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });
      
    if (error) throw error;
    
    return (data || []).map(row => ({
      id: Number(row.id),
      url: row.url,
      prompt: row.prompt,
      model: row.model,
      ratio: row.ratio,
      summary: row.summary,
      timestamp: Number(row.timestamp),
      userId: row.user_id
    }));
  } catch (err) {
    console.warn("Failed to fetch creations from Supabase. Falling back to localStorage.", err);
    const fallbackData = localStorage.getItem(`imagine_fallback:${userId}`);
    return fallbackData ? JSON.parse(fallbackData) : [];
  }
}

export async function saveCreation(creation: Omit<SavedCreation, 'timestamp' | 'id'> & { id?: number }): Promise<SavedCreation> {
  const userId = await getCurrentUserId();
  const id = creation.id || Date.now();
  
  let uploadUrl = creation.url;
  if (userId && creation.url.startsWith('data:')) {
    try {
      uploadUrl = await uploadImageToBucket('creations', `${userId}/${id}.png`, creation.url);
    } catch (uploadErr) {
      console.error("Failed to upload image to Supabase storage bucket:", uploadErr);
    }
  }

  const item: SavedCreation = {
    ...creation,
    url: uploadUrl,
    id,
    timestamp: Date.now(),
    userId: userId || undefined
  };
  
  if (!userId) {
    const creations = await getCreations();
    const idx = creations.findIndex(c => c.id === id);
    if (idx > -1) {
      creations[idx] = item;
    } else {
      creations.unshift(item);
    }
    localStorage.setItem('imagine_fallback:guest', JSON.stringify(creations));
    return item;
  }
  
  try {
    const { error } = await supabase
      .from('creations')
      .upsert({
        id: id.toString(),
        url: uploadUrl,
        prompt: creation.prompt,
        model: creation.model,
        ratio: creation.ratio,
        summary: creation.summary,
        timestamp: item.timestamp,
        user_id: userId
      });
    if (error) throw error;
  } catch (err) {
    console.warn("Failed to save creation to Supabase. Falling back to localStorage.", err);
    const creations = await getCreations();
    const idx = creations.findIndex(c => c.id === id);
    if (idx > -1) {
      creations[idx] = item;
    } else {
      creations.unshift(item);
    }
    localStorage.setItem(`imagine_fallback:${userId}`, JSON.stringify(creations));
  }

  
  return item;
}

export async function deleteCreation(id: number): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) {
    const creations = await getCreations();
    const filtered = creations.filter(c => c.id !== id);
    localStorage.setItem('imagine_fallback:guest', JSON.stringify(filtered));
    return;
  }

  const idStr = id.toString();
  
  try {
    // Delete the database row
    const { error } = await supabase
      .from('creations')
      .delete()
      .eq('id', idStr);

    if (error) throw error;

    // Delete the image file from storage bucket
    const filePath = `${userId}/${idStr}.png`;
    await supabase.storage
      .from('creations')
      .remove([filePath]);


  } catch (err) {

    const creations = await getCreations();
    const filtered = creations.filter(c => c.id !== id);
    localStorage.setItem(`imagine_fallback:${userId}`, JSON.stringify(filtered));
  }
}
