import { NextResponse } from 'next/server';
import { parseStringPromise } from 'xml2js';
import * as XLSX from 'xlsx';
import { db } from '@/lib/db';

// --- Excel helpers (unchanged from original) ---
const TITLE_MAPPINGS = ['title', 'nombre', 'name'];
const STATUS_MAPPINGS = ['status', 'estado'];
const SCORE_MAPPINGS = ['score', 'puntuacion', 'rating'];
const EPISODES_MAPPINGS = ['episodes_watched', 'episodios', 'progress'];
const IMAGE_MAPPINGS = ['image_url', 'imagen'];

function extractValue(
  row: Record<string, unknown>,
  mappings: string[],
): unknown {
  for (const key of mappings) {
    if (key in row) {
      const val = row[key];
      if (val !== undefined && val !== null) return val;
    }
  }
  return undefined;
}

function normalizeStatus(status: string): string {
  const s = String(status).trim().toLowerCase();
  if (['watching', 'viendo', 'en progreso'].includes(s)) return 'watching';
  if (['completed', 'completado', 'finalizado'].includes(s)) return 'completed';
  if (['dropped', 'abandonado', 'dropeado'].includes(s)) return 'dropped';
  if (['plan to watch', 'plan_to_watch', 'pendiente', 'planeado'].includes(s))
    return 'plan_to_watch';
  return 'plan_to_watch';
}

function parseScore(value: unknown): number | null {
  if (value === undefined || value === null) return null;
  const num = Number(value);
  if (isNaN(num)) return null;
  const score = Math.round(num);
  if (score < 0 || score > 10) return null;
  return score;
}

function parseEpisodes(value: unknown): number {
  if (value === undefined || value === null) return 0;
  const num = Number(value);
  if (isNaN(num)) return 0;
  const episodes = Math.floor(num);
  if (episodes < 0) return 0;
  return episodes;
}

// --- XML-specific types and helpers ---

// MAL XML anime entry shape as returned by xml2js with explicitArray:false
interface MalXmlAnime {
  series_title?: string;
  series_animedb_id?: string;
  my_watched_episodes?: string;
  my_score?: string;
  my_status?: string;
}

function normalizeMalStatus(status: string | undefined): string {
  if (!status || String(status).trim() === '') return 'plan_to_watch';
  const s = String(status).trim().toLowerCase();
  if (s === 'watching' || s === 'current') return 'watching';
  if (s === 'completed') return 'completed';
  if (s === 'dropped') return 'dropped';
  if (s === 'plan to watch' || s === 'planning' || s === 'on-hold') return 'plan_to_watch';
  return 'plan_to_watch';
}

function parseMalScore(value: string | undefined): number | null {
  if (value === undefined || value === null || String(value).trim() === '') return null;
  const num = Number(value);
  if (isNaN(num)) return null;
  if (num === 0) return null;
  if (num < 1 || num > 10) return null;
  return Math.round(num);
}

function parseMalEpisodes(value: string | undefined): number {
  if (value === undefined || value === null || String(value).trim() === '') return 0;
  const num = Number(value);
  if (isNaN(num)) return 0;
  if (num < 0) return 0;
  return Math.floor(num);
}

function parseMalAnimeId(value: string | undefined): number | null {
  if (value === undefined || value === null || String(value).trim() === '') return null;
  const num = Number(value);
  if (isNaN(num)) return null;
  if (num <= 0) return null;
  return Math.floor(num);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'No se recibió ningún archivo' },
        { status: 400 },
      );
    }

    // === XML import branch ===
    if (file.name.toLowerCase().endsWith('.xml')) {
      let content: string;
      try {
        content = await file.text();
      } catch {
        return NextResponse.json(
          { success: false, error: 'El archivo no es un XML válido' },
          { status: 400 },
        );
      }

      // xml2js returns untyped result; validated immediately below before use
      let result: { myanimelist?: { anime?: unknown; myinfo?: unknown } };
      try {
        result = await parseStringPromise(content, { explicitArray: false, trim: true });
      } catch {
        return NextResponse.json(
          { success: false, error: 'El archivo no es un XML válido' },
          { status: 400 },
        );
      }

      if (!result?.myanimelist?.anime) {
        return NextResponse.json(
          { success: false, error: 'El XML no tiene el formato esperado (se esperaba estructura de MyAnimeList)' },
          { status: 400 },
        );
      }

      // Normalise to array: with explicitArray:false, a single <anime> is an object,
      // multiple <anime> become an array
      const rawAnimeList = result.myanimelist.anime;
      const animeList: MalXmlAnime[] = Array.isArray(rawAnimeList)
        ? rawAnimeList
        : [rawAnimeList];

      if (animeList.length === 0) {
        return NextResponse.json(
          { success: false, error: 'El archivo no contiene animes para importar' },
          { status: 400 },
        );
      }

      const stmt = db.prepare(`
        INSERT OR IGNORE INTO user_library
          (anime_id_jikan, title, image_url, status, score, episodes_watched)
        VALUES (?, ?, NULL, ?, ?, ?)
      `);

      let imported = 0;
      let skipped = 0;
      const errors: string[] = [];

      for (const anime of animeList) {
        const title = anime.series_title?.trim();

        if (!title || title === '') {
          skipped++;
          continue;
        }

        const animeId = parseMalAnimeId(anime.series_animedb_id);
        const status = normalizeMalStatus(anime.my_status);
        const score = parseMalScore(anime.my_score);
        const episodesWatched = parseMalEpisodes(anime.my_watched_episodes);

        const stmtResult = stmt.run(animeId, title, status, score, episodesWatched);

        if (stmtResult.changes === 0) {
          skipped++;
        } else {
          imported++;
        }
      }

      return NextResponse.json({
        success: true,
        imported,
        skipped,
        total: animeList.length,
        errors,
      });
    }

    // === Excel import (existing logic, unchanged) ===
    let workbook: XLSX.WorkBook;
    try {
      const buffer = await file.arrayBuffer();
      workbook = XLSX.read(buffer, { type: 'array' });
    } catch {
      return NextResponse.json(
        { success: false, error: 'El archivo no es un Excel válido' },
        { status: 400 },
      );
    }

    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return NextResponse.json(
        { success: false, error: 'El archivo no contiene datos' },
        { status: 400 },
      );
    }

    const sheet = workbook.Sheets[sheetName];
    // XLSX.utils.sheet_to_json returns any[] — we cast to Record<string, unknown>
    // for predictable key access.
    const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

    if (rawRows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'El archivo no contiene datos' },
        { status: 400 },
      );
    }

    // Normalise keys to lowercase + trimmed for case-insensitive matching
    const rows = rawRows.map((row) => {
      const normalised: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(row)) {
        normalised[key.trim().toLowerCase()] = value;
      }
      return normalised;
    });

    const stmt = db.prepare(`
      INSERT OR IGNORE INTO user_library
        (anime_id_jikan, title, image_url, status, score, episodes_watched)
      VALUES (NULL, ?, ?, ?, ?, ?)
    `);

    let imported = 0;
    let skipped = 0;

    for (const row of rows) {
      const title = extractValue(row, TITLE_MAPPINGS);

      if (!title || String(title).trim() === '') {
        skipped++;
        continue;
      }

      const titleStr = String(title).trim();
      const rawStatus = extractValue(row, STATUS_MAPPINGS);
      const statusStr = rawStatus
        ? normalizeStatus(String(rawStatus))
        : 'plan_to_watch';
      const score = parseScore(extractValue(row, SCORE_MAPPINGS));
      const episodesWatched = parseEpisodes(
        extractValue(row, EPISODES_MAPPINGS),
      );
      const rawImage = extractValue(row, IMAGE_MAPPINGS);
      const imageUrlStr = rawImage ? String(rawImage).trim() || null : null;

      const stmtResult = stmt.run(
        titleStr,
        imageUrlStr,
        statusStr,
        score,
        episodesWatched,
      );

      if (stmtResult.changes === 0) {
        skipped++;
      } else {
        imported++;
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      skipped,
      total: rows.length,
      errors: [],
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno al procesar el archivo' },
      { status: 500 },
    );
  }
}
