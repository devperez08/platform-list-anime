import { createClient } from '@/utils/supabase/client';

export type LibraryStatus = 'watching' | 'completed' | 'dropped' | 'plan_to_watch';

export interface LibraryItem {
  id?: string;
  user_id?: string;
  anime_id_jikan: number;
  title: string;
  image_url?: string;
  status: LibraryStatus;
  score?: number;
  episodes_watched?: number;
}

export const addToLibrary = async (item: LibraryItem) => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('User must be logged in to add to library');

  const { data, error } = await supabase
    .from('user_library')
    .insert([{ ...item, user_id: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const removeFromLibrary = async (animeIdJikan: number) => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('User must be logged in to remove from library');

  const { error } = await supabase
    .from('user_library')
    .delete()
    .match({ user_id: user.id, anime_id_jikan: animeIdJikan });

  if (error) throw error;
};

export const updateLibraryItem = async (animeIdJikan: number, updates: Partial<LibraryItem>) => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('User must be logged in to update library');

  const { data, error } = await supabase
    .from('user_library')
    .update(updates)
    .match({ user_id: user.id, anime_id_jikan: animeIdJikan })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getLibrary = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('user_library')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getLibraryItem = async (animeIdJikan: number) => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('user_library')
    .select('*')
    .match({ user_id: user.id, anime_id_jikan: animeIdJikan })
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is code for "no rows found"
  return data;
};
