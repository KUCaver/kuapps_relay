import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadImage(file: File | Blob, folder: string = 'plants'): Promise<string> {
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;

  const { error } = await supabase.storage
    .from('images')
    .upload(fileName, file, {
      contentType: 'image/jpeg',
      upsert: false,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from('images').getPublicUrl(fileName);
  return data.publicUrl;
}

export async function dataUrlToFile(dataUrl: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
}
