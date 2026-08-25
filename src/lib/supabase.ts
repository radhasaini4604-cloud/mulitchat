import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://brexbjzafthtnonhxdia.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyZXhianphZnRodG5vbmh4ZGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMTYyMTUsImV4cCI6MjA5Nzc5MjIxNX0.M7A6va09YUxM1EoUzQi1Wd2JJEy_dqw6orZ_S7XD4TQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export function base64ToBlob(base64: string, defaultType = 'image/png'): Blob {
  const matches = base64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  let mime = defaultType;
  let raw = base64;
  if (matches && matches.length === 3) {
    mime = matches[1];
    raw = matches[2];
  }
  const sliceSize = 1024;
  const byteCharacters = atob(raw);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mime });
}

export async function uploadImageToBucket(
  bucketName: 'creations' | 'avatars',
  path: string,
  imageInput: string | Blob
): Promise<string> {
  let fileBody: Blob;
  if (typeof imageInput === 'string') {
    if (imageInput.startsWith('data:')) {
      fileBody = base64ToBlob(imageInput);
    } else {
      if (imageInput.startsWith('http://') || imageInput.startsWith('https://')) {
        return imageInput;
      }
      throw new Error('Invalid image input format');
    }
  } else {
    fileBody = imageInput;
  }

  const { error } = await supabase.storage
    .from(bucketName)
    .upload(path, fileBody, {
      contentType: fileBody.type || 'image/png',
      upsert: true
    });

  if (error) {
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(path);

  return publicUrl;
}

export async function uploadFileToBucket(
  bucketName: string,
  path: string,
  fileBody: Blob | File
): Promise<string> {
  const { error } = await supabase.storage
    .from(bucketName)
    .upload(path, fileBody, {
      contentType: fileBody.type || 'application/octet-stream',
      upsert: true
    });

  if (error) {
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(path);

  return publicUrl;
}


