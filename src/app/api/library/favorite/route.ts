import { NextRequest, NextResponse } from 'next/server';
import { toggleFavorite } from '@/services/library';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { animeId } = body;

    if (animeId === undefined || animeId === null || typeof animeId !== 'number') {
      return NextResponse.json(
        { success: false, error: 'animeId is required and must be a number' },
        { status: 400 }
      );
    }

    const result = await toggleFavorite(animeId);

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Anime not found in library' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      is_favorite: result.is_favorite === 1,
    });
  } catch (error) {
    console.error('[api] Error in POST /api/library/favorite:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
