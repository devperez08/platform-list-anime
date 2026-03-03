"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAnimeEpisodes, JikanEpisode } from '@/services/jikan';
import { getLibraryItem, updateLibraryItem, addToLibrary, LibraryItem } from '@/services/library';

interface EpisodeListProps {
  animeId: number;
  totalEpisodes: number | null;
  title: string;
  imageUrl: string;
}

export default function EpisodeList({ animeId, totalEpisodes, title, imageUrl }: EpisodeListProps) {
  const router = useRouter();
  const [episodes, setEpisodes] = useState<JikanEpisode[]>([]);
  const [watchedCount, setWatchedCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isInLibrary, setIsInLibrary] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [epRes, libItem] = await Promise.all([
          getAnimeEpisodes(animeId),
          getLibraryItem(animeId)
        ]);
        
        setEpisodes(epRes.data || []);
        if (libItem) {
          setIsInLibrary(true);
          setWatchedCount(libItem.episodes_watched || 0);
        }
      } catch (error) {
        console.error('Error fetching episodes or library:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [animeId]);

  const handleToggleEpisode = async (episodeNum: number) => {
    const isAdding = !isInLibrary;
    const newCount = watchedCount === episodeNum ? episodeNum - 1 : episodeNum;
    
    // Optimistic update
    setWatchedCount(newCount);
    if (isAdding) setIsInLibrary(true);

    try {
      if (isAdding) {
        const item: LibraryItem = {
          anime_id_jikan: animeId,
          title: title,
          image_url: imageUrl,
          status: 'watching',
          episodes_watched: newCount,
        };
        await addToLibrary(item);
      } else {
        await updateLibraryItem(animeId, { 
          episodes_watched: newCount,
          status: newCount > 0 ? 'watching' : 'plan_to_watch'
        });
      }
      router.refresh();
    } catch (error) {
      console.error('Error updating progress:', error);
      // Revert if error
      setWatchedCount(watchedCount);
      if (isAdding) setIsInLibrary(false);
      alert('Debes iniciar sesión para marcar episodios como vistos.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // If Jikan has no episodes but we know the total count, we render a default list
  const displayEpisodes = episodes.length > 0 
    ? episodes 
    : Array.from({ length: totalEpisodes || 0 }, (_, i) => ({
        mal_id: i + 1,
        title: `Episodio ${i + 1}`,
      } as JikanEpisode));

  if (displayEpisodes.length === 0) {
    return (
      <div className="bg-zinc-900/30 rounded-2xl p-8 border border-white/5 text-center">
        <p className="text-zinc-500 italic">No hay información de episodios disponible.</p>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black italic border-l-4 border-primary pl-4">EPISODIOS</h2>
        <span className="text-zinc-500 text-sm font-bold bg-zinc-900 px-4 py-1 rounded-full border border-white/5">
          {watchedCount} / {totalEpisodes || displayEpisodes.length} VISTOS
        </span>
      </div>

      <div className="space-y-3">
        {displayEpisodes.map((ep, idx) => {
          const epNum = ep.mal_id || (idx + 1);
          const isWatched = watchedCount >= epNum;
          
          return (
            <div 
              key={idx}
              className={`group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border backdrop-blur-md
                ${isWatched 
                  ? 'bg-emerald-500/10 border-emerald-500/30 ring-1 ring-emerald-500/20' 
                  : 'bg-zinc-900/40 border-white/5 hover:border-white/10'}`}
            >
              <div className="flex items-center gap-6 overflow-hidden">
                {/* Oval/Pill Identifier */}
                <div className={`shrink-0 px-4 py-1.5 rounded-full font-black italic text-xs tracking-tighter shadow-lg transition-colors
                  ${isWatched ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-white'}`}>
                  T1 E{epNum}
                </div>
                
                <div className="overflow-hidden">
                  <h3 className={`font-bold truncate transition-colors ${isWatched ? 'text-emerald-100' : 'text-zinc-200'}`}>
                    {ep.title}
                  </h3>
                  {ep.title_japanese && (
                    <p className="text-[10px] text-zinc-500 font-medium truncate uppercase tracking-widest mt-0.5">
                      {ep.title_japanese}
                    </p>
                  )}
                </div>
              </div>

              {/* Checkbox button */}
              <button 
                onClick={() => handleToggleEpisode(epNum)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-xl
                  ${isWatched 
                    ? 'bg-emerald-500 text-black shadow-emerald-500/20 hover:scale-110 active:scale-95' 
                    : 'bg-zinc-800 text-zinc-500 border border-white/5 hover:bg-zinc-700 hover:text-white hover:border-white/20'}`}
              >
                <svg 
                  className={`w-5 h-5 ${isWatched ? 'stroke-[4px]' : 'stroke-[2px]'}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
