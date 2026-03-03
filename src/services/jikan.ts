export interface JikanImage {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface JikanAnime {
  mal_id: number;
  url: string;
  images: {
    jpg: JikanImage;
    webp: JikanImage;
  };
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  type: string;
  episodes: number | null;
  status: string;
  score: number | null;
  synopsis: string | null;
  background: string | null;
  season: string | null;
  year: number | null;
}

export interface JikanResponse<T> {
  data: T;
  pagination?: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

const JIKAN_API_BASE = 'https://api.jikan.moe/v4';

async function jikanFetch<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${JIKAN_API_BASE}${endpoint}`);

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Jikan API rate limit exceeded. Please try again later.');
    }
    throw new Error(`Jikan API error: ${response.statusText}`);
  }

  return response.json();
}

export const getTopAnime = async (page = 1): Promise<JikanResponse<JikanAnime[]>> => {
  return jikanFetch<JikanResponse<JikanAnime[]>>(`/top/anime?page=${page}`);
};

export const searchAnime = async (query: string, page = 1): Promise<JikanResponse<JikanAnime[]>> => {
  return jikanFetch<JikanResponse<JikanAnime[]>>(`/anime?q=${encodeURIComponent(query)}&page=${page}`);
};

export const getAnimeById = async (id: number): Promise<JikanResponse<JikanAnime>> => {
  return jikanFetch<JikanResponse<JikanAnime>>(`/anime/${id}`);
};

export const getAnimeCharacters = async (id: number): Promise<JikanResponse<any[]>> => {
  return jikanFetch<JikanResponse<any[]>>(`/anime/${id}/characters`);
};

export interface JikanEpisode {
  mal_id: number;
  url: string;
  title: string;
  title_japanese: string | null;
  title_romanji: string | null;
  duration: number | null;
  aired: string | null;
  filler: boolean;
  recap: boolean;
  forum_url: string | null;
}

export const getAnimeEpisodes = async (id: number, page = 1): Promise<JikanResponse<JikanEpisode[]>> => {
  return jikanFetch<JikanResponse<JikanEpisode[]>>(`/anime/${id}/episodes?page=${page}`);
};
