"use server";

import { db } from '@/lib/db';

// ---------------------------------------------------------------------------
// Types — mirror schema-sqlite.sql user_library table
// ---------------------------------------------------------------------------
export type LibraryStatus = 'watching' | 'completed' | 'dropped' | 'plan_to_watch';

export interface LibraryItem {
  id: number;
  anime_id_jikan?: number | null; // Nullable — API-agnostic design; title is the anchor
  title: string;                  // UNIQUE — primary key for business logic lookups
  image_url?: string | null;
  status: LibraryStatus;
  is_favorite?: number;           // 0 or 1 (SQLite boolean; defaults to 0 in schema)
  score?: number | null;
  episodes_watched: number;
  created_at: string;
  updated_at: string;
}

// Fields allowed in dynamic UPDATE to prevent injection via arbitrary key names
const ALLOWED_LIBRARY_UPDATE_FIELDS: Array<keyof LibraryItem> = [
  'status',
  'score',
  'episodes_watched',
  'image_url',
  'title',
];

// ---------------------------------------------------------------------------
// addToLibrary
// Inserts a new anime into the library. Throws a user-friendly error on duplicate title.
// ---------------------------------------------------------------------------
export const addToLibrary = async (item: Omit<LibraryItem, 'id' | 'created_at' | 'updated_at'>): Promise<LibraryItem> => {
  const stmt = db.prepare<unknown[], LibraryItem>(`
    INSERT INTO user_library (anime_id_jikan, title, image_url, status, score, episodes_watched)
    VALUES (?, ?, ?, ?, ?, ?)
    RETURNING *
  `);

  try {
    const result = stmt.get(
      item.anime_id_jikan ?? null,
      item.title,
      item.image_url ?? null,
      item.status,
      item.score ?? null,
      item.episodes_watched ?? 0
    );
    return result!;
  } catch (error: unknown) {
    console.error('[library] Error adding to library:', error);
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      throw new Error(`El anime "${item.title}" ya está en tu biblioteca.`);
    }
    throw error;
  }
};

// ---------------------------------------------------------------------------
// removeFromLibrary
// Deletes by Jikan ID. Falls back to title if jikan ID is absent.
// ---------------------------------------------------------------------------
export const removeFromLibrary = async (animeIdJikan: number): Promise<void> => {
  try {
    db.prepare('DELETE FROM user_library WHERE anime_id_jikan = ?').run(animeIdJikan);
  } catch (error) {
    console.error('[library] Error removing from library:', error);
    throw error;
  }
};

// ---------------------------------------------------------------------------
// removeFromLibraryByTitle
// Deletes by canonical title — useful when anime_id_jikan is not available.
// ---------------------------------------------------------------------------
export const removeFromLibraryByTitle = async (title: string): Promise<void> => {
  try {
    db.prepare('DELETE FROM user_library WHERE title = ?').run(title);
  } catch (error) {
    console.error('[library] Error removing from library by title:', error);
    throw error;
  }
};

// ---------------------------------------------------------------------------
// updateLibraryItem
// Builds a safe parameterized UPDATE using the ALLOWED_LIBRARY_UPDATE_FIELDS whitelist.
// ---------------------------------------------------------------------------
export const updateLibraryItem = async (
  animeIdJikan: number,
  updates: Partial<LibraryItem>
): Promise<LibraryItem | null> => {
  const keys = Object.keys(updates).filter((k) =>
    ALLOWED_LIBRARY_UPDATE_FIELDS.includes(k as keyof LibraryItem)
  ) as Array<keyof LibraryItem>;

  if (keys.length === 0) {
    return getLibraryItem(animeIdJikan);
  }

  const setClause = keys.map((k) => `${k} = ?`).join(', ');
  const values = keys.map((k) => updates[k] ?? null);

  const query = `
    UPDATE user_library
    SET ${setClause}, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE anime_id_jikan = ?
    RETURNING *
  `;

  try {
    const result = db.prepare<unknown[], LibraryItem>(query).get(...values, animeIdJikan);
    return result ?? null;
  } catch (error: unknown) {
    console.error('[library] Error updating library item:', error);
    throw error;
  }
};

// ---------------------------------------------------------------------------
// toggleFavorite
// Flips the is_favorite flag on the item identified by anime_id_jikan.
// Returns the updated item with the new is_favorite value.
// ---------------------------------------------------------------------------
export const toggleFavorite = async (animeId: number): Promise<{ is_favorite: number } | null> => {
  try {
    const result = db
      .prepare<[number], { is_favorite: number }>(
        `UPDATE user_library
         SET is_favorite = CASE WHEN is_favorite = 1 THEN 0 ELSE 1 END,
             updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
         WHERE anime_id_jikan = ?
         RETURNING is_favorite`
      )
      .get(animeId);
    return result ?? null;
  } catch (error) {
    console.error('[library] Error toggling favorite:', error);
    throw error;
  }
};

// ---------------------------------------------------------------------------
// getLibrary
// Returns library items filtered by status or favorites, ordered by most
// recently updated. Passing no filter (or 'all') returns every row.
// ---------------------------------------------------------------------------
export const getLibrary = async (filter?: string): Promise<LibraryItem[]> => {
  try {
    if (filter === 'favorites') {
      return db
        .prepare<[], LibraryItem>('SELECT * FROM user_library WHERE is_favorite = 1 ORDER BY updated_at DESC')
        .all();
    }
    if (filter && filter !== 'all') {
      return db
        .prepare<[string], LibraryItem>('SELECT * FROM user_library WHERE status = ? ORDER BY updated_at DESC')
        .all(filter);
    }
    return db
      .prepare<[], LibraryItem>('SELECT * FROM user_library ORDER BY updated_at DESC')
      .all();
  } catch (error) {
    console.error('[library] Error getting library:', error);
    return [];
  }
};

// ---------------------------------------------------------------------------
// getLibraryItem
// Looks up a single entry by Jikan API ID.
// ---------------------------------------------------------------------------
export const getLibraryItem = async (animeIdJikan: number): Promise<LibraryItem | null> => {
  try {
    const row = db
      .prepare<[number], LibraryItem>('SELECT * FROM user_library WHERE anime_id_jikan = ?')
      .get(animeIdJikan);
    return row ?? null;
  } catch (error) {
    console.error('[library] Error getting library item:', error);
    return null;
  }
};

// ---------------------------------------------------------------------------
// getLibraryItemByTitle
// Looks up a single entry by canonical title (API-agnostic lookup).
// ---------------------------------------------------------------------------
export const getLibraryItemByTitle = async (title: string): Promise<LibraryItem | null> => {
  try {
    const row = db
      .prepare<[string], LibraryItem>('SELECT * FROM user_library WHERE title = ?')
      .get(title);
    return row ?? null;
  } catch (error) {
    console.error('[library] Error getting library item by title:', error);
    return null;
  }
};
