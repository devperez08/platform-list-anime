"use server";

import { db } from '@/lib/db';

// Mirrors the `profiles` table in schema-sqlite.sql
// Fields removed from original schema: id (UUID), email, website (unused in app logic)
export interface UserProfile {
  id: number;           // Always 1 — single-user constraint
  username: string;
  full_name?: string;
  avatar_url?: string;
  updated_at?: string;
}

// ---------------------------------------------------------------------------
// getProfile
// Returns the single local profile row (id=1). Seeds it if missing.
// ---------------------------------------------------------------------------
export const getProfile = async (): Promise<UserProfile> => {
  try {
    const row = db.prepare('SELECT * FROM profiles WHERE id = 1').get() as UserProfile | undefined;
    if (!row) {
      db.prepare(`
        INSERT OR IGNORE INTO profiles (id, username, full_name)
        VALUES (1, 'perez_owner', 'Sr. Perez')
      `).run();
      return db.prepare('SELECT * FROM profiles WHERE id = 1').get() as UserProfile;
    }
    return row;
  } catch (error) {
    console.error('[profile] Error getting profile:', error);
    return { id: 1, username: 'perez_owner', full_name: 'Sr. Perez' };
  }
};

// ---------------------------------------------------------------------------
// updateProfile
// Accepts a partial profile and builds a safe parameterized UPDATE.
// Only whitelisted fields are allowed to prevent injection via key names.
// ---------------------------------------------------------------------------
const ALLOWED_PROFILE_FIELDS: Array<keyof UserProfile> = ['username', 'full_name', 'avatar_url'];

export const updateProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
  const keys = Object.keys(updates).filter((k) =>
    ALLOWED_PROFILE_FIELDS.includes(k as keyof UserProfile)
  ) as Array<keyof UserProfile>;

  if (keys.length === 0) {
    return getProfile();
  }

  const setClause = keys.map((k) => `${k} = ?`).join(', ');
  const values = keys.map((k) => updates[k] ?? null);

  const query = `
    UPDATE profiles
    SET ${setClause}, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE id = 1
    RETURNING *
  `;

  try {
    const result = db.prepare(query).get(...values) as UserProfile;
    return result;
  } catch (error: unknown) {
    console.error('[profile] Error updating profile:', error);
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      throw new Error('Este nombre de usuario ya está en uso.');
    }
    throw error;
  }
};
