"use client";

import React, { useEffect, useState } from 'react';
import { getLibrary, LibraryItem } from '@/services/library';
import AnimeCard from '@/components/anime/AnimeCard';
import Link from 'next/link';
import { getAnimeById } from '@/services/jikan';

export default function LibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchLibrary();
  }, []);

  const fetchLibrary = async () => {
    try {
      const data = await getLibrary();
      setItems(data);
    } catch (error) {
      console.error('Error fetching library:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <p className="text-primary font-bold text-sm tracking-widest uppercase mb-1">Tu Colección</p>
          <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tight">
            MI BIBLIOTECA
          </h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-zinc-900 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {items.map((item) => (
              <Link key={item.anime_id_jikan} href={`/anime/${item.anime_id_jikan}`}>
                <AnimeCard 
                  mal_id={item.anime_id_jikan}
                  image={item.image_url || ''}
                  title={item.title}
                  score={item.score?.toString()}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-white/5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Tu biblioteca está vacía</h2>
            <p className="text-zinc-500 max-w-md mb-8">
              Explora nuevos animes y añádalos a tu lista para hacer un seguimiento de lo que estás viendo.
            </p>
            <a href="/" className="btn btn-primary rounded-full px-8 font-bold">
              Explorar Animes
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
