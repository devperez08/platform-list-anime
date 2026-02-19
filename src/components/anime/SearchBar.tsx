"use client";

import React, { useState, useEffect, useRef } from 'react';
import { searchAnime, JikanAnime } from '@/services/jikan';
import Link from 'next/link';
import Image from 'next/image';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<JikanAnime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2) {
        setIsLoading(true);
        try {
          const res = await searchAnime(query);
          setResults(res.data.slice(0, 5));
          setIsOpen(true);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative" ref={searchRef}>
      <div className="flex items-center bg-zinc-900/50 border border-zinc-800 rounded-full px-4 py-2 focus-within:border-primary transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Buscar anime..."
          className="bg-transparent border-none focus:outline-none text-sm text-white ml-2 w-48 md:w-64"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 2 && setIsOpen(true)}
        />
        {isLoading && <span className="loading loading-spinner loading-xs text-primary ml-2"></span>}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-2">
            {results.map((anime) => (
              <Link
                key={anime.mal_id}
                href={`/anime/${anime.mal_id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="relative w-10 h-14 flex-shrink-0">
                  <img
                    src={anime.images.webp.small_image_url}
                    alt={anime.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{anime.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-zinc-400">{anime.type}</span>
                    <span className="text-xs text-zinc-500">•</span>
                    <span className="text-xs text-primary font-medium">{anime.score || 'N/A'}</span>
                  </div>
                </div>
              </Link>
            ))}
            <div className="p-2 border-t border-zinc-800">
              <Link 
                href={`/search?q=${encodeURIComponent(query)}`}
                className="block text-center text-xs font-bold text-zinc-500 hover:text-white py-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                VER TODOS LOS RESULTADOS
              </Link>
            </div>
          </div>
        </div>
      )}

      {isOpen && query.length > 2 && results.length === 0 && !isLoading && (
        <div className="absolute top-full mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center z-50">
          <p className="text-xs text-zinc-500 font-medium">No se encontraron resultados</p>
        </div>
      )}
    </div>
  );
}
