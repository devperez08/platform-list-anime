import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAnimeById, searchAnime } from '@/services/jikan';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function POST() {
  try {
    const itemsWithoutImage = db.prepare(
      "SELECT id, title, anime_id_jikan FROM user_library WHERE image_url IS NULL OR image_url = ''"
    ).all() as Array<{ id: number; title: string; anime_id_jikan: number | null }>;

    if (itemsWithoutImage.length === 0) {
      return NextResponse.json({
        success: true,
        total: 0,
        updated: 0,
        skipped: 0,
        errors: [],
        message: 'No hay portadas pendientes por recuperar',
      });
    }

    const updateStmt = db.prepare(
      "UPDATE user_library SET image_url = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?"
    );

    let updated = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const item of itemsWithoutImage) {
      // Jikan rate limit: max 3 requests/second → 400ms minimum spacing
      await sleep(400);

      try {
        let imageUrl: string | null = null;

        if (item.anime_id_jikan) {
          const result = await getAnimeById(item.anime_id_jikan);
          imageUrl = result.data.images.jpg.image_url;
        } else {
          const result = await searchAnime(item.title);
          if (result.data.length > 0) {
            imageUrl = result.data[0].images.jpg.image_url;
          }
        }

        if (imageUrl && imageUrl.trim().length > 0) {
          updateStmt.run(imageUrl, item.id);
          updated++;
        } else {
          skipped++;
        }
      } catch {
        errors.push(item.title);
      }
    }

    return NextResponse.json({
      success: true,
      total: itemsWithoutImage.length,
      updated,
      skipped,
      errors,
    });
  } catch (error) {
    console.error('Sync covers error:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno al sincronizar portadas' },
      { status: 500 },
    );
  }
}
