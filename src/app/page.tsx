"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AnimeCard from "@/components/anime/AnimeCard";
import AnimeDetailsModal from "@/components/anime/AnimeDetailsModal";

import { getTopAnime, JikanAnime } from "@/services/jikan";

export default function Home() {
  const [trendingAnime, setTrendingAnime] = useState<JikanAnime[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await getTopAnime();
        setTrendingAnime(res.data);
      } catch (error) {
        console.error("Error fetching trending anime:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full flex items-center pt-20 overflow-hidden">
        {/* Hero Background with Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: trendingAnime[0]
              ? `url(${trendingAnime[0].images.webp.large_image_url})`
              : "url('/assets/images/lanscape.png')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl animate-in fade-in slide-in-from-left-12 duration-1000">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-5 py-1.5 bg-primary text-white text-[10px] font-black rounded-full shadow-lg shadow-primary/30 uppercase tracking-[0.15em] border border-white/10">
                ESTRENO DESTACADO
              </span>
              <span className="text-zinc-400 text-sm font-medium">
                Temporada de Invierno 2026
              </span>
            </div>

            <h1 className="text-7xl md:text-9xl font-black text-white mb-6 tracking-tighter italic uppercase">
              {trendingAnime[0]?.title || "EPINEKO"}
            </h1>
            <p className="text-xl md:text-2xl text-zinc-300 mb-10 max-w-xl leading-relaxed font-light line-clamp-2">
              {trendingAnime[0]?.synopsis ||
                "Descubre un universo de historias. Tu próxima aventura anime comienza con un solo clic."}
            </p>

            <div className="flex flex-wrap gap-5">
              {trendingAnime[0] && (
                <Link
                  href={`/anime/${trendingAnime[0].mal_id}`}
                  className="btn btn-primary btn-lg rounded-full px-12 shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)] hover:shadow-[0_0_50px_rgba(var(--primary-rgb),0.6)] hover:scale-105 transition-all font-black text-lg text-white border-2 border-white/10 italic flex items-center justify-center"
                >
                  VER DETALLES
                </Link>
              )}
              <Link 
                href="/trending" 
                className="btn btn-lg rounded-full px-12 bg-zinc-800/80 hover:bg-zinc-700 text-white backdrop-blur-xl font-black italic border-2 border-white/10 shadow-xl transition-all hover:scale-105 active:scale-95 uppercase tracking-wider flex items-center justify-center"
              >
                EXPLORAR TODO
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="container mx-auto px-6 relative z-20 pb-32">
        {/* Trending Section */}
        <section className="mb-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-primary font-bold text-sm tracking-widest uppercase mb-1">
                Lo más visto
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white italic tracking-tight">
                TENDENCIAS DE LA SEMANA
              </h2>
            </div>
            <Link
              href="/trending"
              className="text-sm font-bold text-zinc-500 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
            >
              VER CATÁLOGO COMPLETO
            </Link>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-10 no-scrollbar snap-x">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-none w-44 md:w-56 aspect-[2/3] bg-zinc-900 animate-pulse rounded-2xl"
                  />
                ))
              : trendingAnime.slice(0, 15).map((anime) => (
                  <Link key={anime.mal_id} href={`/anime/${anime.mal_id}`}>
                    <AnimeCard
                      mal_id={anime.mal_id}
                      image={anime.images.webp.large_image_url}
                      title={anime.title}
                      score={anime.score?.toString()}
                    />
                  </Link>
                ))}
          </div>
        </section>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}
