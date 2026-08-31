-- =============================================================================
-- schema-sqlite.sql
-- SQLite Schema for Anime Tracking App (Single-User, Offline-First)
-- Migrated from: Supabase (PostgreSQL) → SQLite (local)
-- Author: Sr. Perez  |  Generated: Phase (b) of Supabase→SQLite migration
-- =============================================================================

-- Enable foreign key enforcement at runtime (must be set per connection)
-- This is also set programmatically in src/lib/db.ts via db.pragma('foreign_keys = ON')
PRAGMA foreign_keys = ON;

-- =============================================================================
-- TABLE: profiles
-- -----------------------------------------------------------------------------
-- CHANGES FROM SUPABASE:
--   ✗ REMOVED  id UUID              → replaced with INTEGER (single row, id=1)
--   ✗ REMOVED  auth.users FK        → no auth system
--   ✗ REMOVED  email                → irrelevant in local single-user context
--   ✗ REMOVED  website              → not used by any app logic (confirmed in Phase a)
--   ✓ KEPT     username             → displayed in Navbar and Profile page
--   ✓ KEPT     full_name            → display name for "Sr. Perez"
--   ✓ KEPT     avatar_url           → used in Profile/Settings pages
--   ✓ KEPT     updated_at           → useful for knowing when profile was last changed
--
-- DESIGN DECISION:
--   Single enforced row (id = 1) via CHECK constraint.
--   The profile table acts as a local config store rather than a user system.
--   No auth trigger needed; profile is seeded on first run.
-- =============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id          INTEGER PRIMARY KEY CHECK (id = 1) DEFAULT 1,
  username    TEXT    NOT NULL UNIQUE,
  full_name   TEXT,
  avatar_url  TEXT,
  updated_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  CONSTRAINT username_length CHECK (length(username) >= 3)
);

-- =============================================================================
-- TABLE: user_library
-- -----------------------------------------------------------------------------
-- CHANGES FROM SUPABASE:
--   ✗ REMOVED  id UUID              → replaced with INTEGER AUTOINCREMENT (simpler, performant)
--   ✗ REMOVED  user_id UUID FK      → single-user, no partitioning needed
--   ✓ KEPT     anime_id_jikan       → retained as NULLABLE for Jikan API lookups,
--                                     but NOT used as PK (API fallback safety)
--   ✓ KEPT     title TEXT UNIQUE    → primary uniqueness anchor; API-agnostic.
--                                     Ensures one entry per anime regardless of which
--                                     API provided the data (Jikan, MAL, AniList, etc.)
--   ✓ KEPT     image_url            → cover image for library cards
--   ✓ KEPT     status               → watch state machine
--   ✓ KEPT     score                → personal rating 0–10
--   ✓ KEPT     episodes_watched     → progress tracking
--   ✓ KEPT     created_at, updated_at → timestamps for sorting/history
--
-- TYPE MAPPINGS (PostgreSQL → SQLite):
--   uuid                     → INTEGER (autoincrement)
--   integer                  → INTEGER  (native)
--   text                     → TEXT     (native)
--   library_status (enum)    → TEXT     with CHECK constraint
--   timestamp with time zone → TEXT     ISO-8601 format (e.g. '2024-01-15T10:30:00.000Z')
--
-- UNIQUENESS DESIGN (per owner decision):
--   title is UNIQUE — the anime is tracked by its canonical title,
--   independent of which external API was used to add it.
--   anime_id_jikan is a NULLABLE secondary lookup key (not the source of truth).
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_library (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  anime_id_jikan    INTEGER,                          -- Nullable: Jikan/MAL API ID. May differ across fallback APIs
  title             TEXT    NOT NULL UNIQUE,           -- Canonical anchor: one entry per anime title (API-agnostic)
  image_url         TEXT,
  status            TEXT    NOT NULL DEFAULT 'watching'
                    CHECK (status IN ('watching', 'completed', 'dropped', 'plan_to_watch')),
  is_favorite       INTEGER NOT NULL DEFAULT 0 CHECK (is_favorite IN (0, 1)),
  score             INTEGER CHECK (score IS NULL OR (score >= 0 AND score <= 10)),
  episodes_watched  INTEGER NOT NULL DEFAULT 0
                    CHECK (episodes_watched >= 0),
  created_at        TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at        TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- =============================================================================
-- INDEXES
-- -----------------------------------------------------------------------------
-- Justification: SQLite's query planner uses indexes for WHERE, ORDER BY, and JOIN.
--   idx_user_library_title       → Fast lookups by title (primary uniqueness key)
--   idx_user_library_anime_id    → Fast lookups by Jikan ID (API sync, detail page)
--   idx_user_library_status      → Fast filtering by watch status (library views)
--   idx_user_library_updated_at  → Fast sorting by most recently updated (default list order)
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_user_library_title      ON user_library (title);
CREATE INDEX IF NOT EXISTS idx_user_library_anime_id   ON user_library (anime_id_jikan);
CREATE INDEX IF NOT EXISTS idx_user_library_status     ON user_library (status);
CREATE INDEX IF NOT EXISTS idx_user_library_favorite   ON user_library (is_favorite);
CREATE INDEX IF NOT EXISTS idx_user_library_updated_at ON user_library (updated_at DESC);

-- =============================================================================
-- SEED DATA
-- -----------------------------------------------------------------------------
-- Inserts the default single-user profile on first run.
-- INSERT OR IGNORE ensures this is safe to re-run (idempotent).
-- =============================================================================
INSERT OR IGNORE INTO profiles (id, username, full_name, avatar_url)
VALUES (1, 'perez_owner', 'Sr. Perez', NULL);
