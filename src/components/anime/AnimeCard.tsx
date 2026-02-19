
"use client";

import React from 'react';

interface AnimeCardProps {
  mal_id: number;
  image: string;
  title: string;
  score?: string;
  onClick?: () => void;
}

export default function AnimeCard({ mal_id, image, title, score, onClick }: AnimeCardProps) {
  return (
    <div 
      className="flex-none w-44 md:w-56 aspect-[2/3] group cursor-pointer snap-start"
      onClick={onClick}
    >
      <div className="relative h-full w-full rounded-2xl overflow-hidden bg-zinc-800 border border-white/5 transition-all duration-300 group-hover:scale-[1.02] group-hover:border-primary/50 group-hover:shadow-2xl group-hover:shadow-primary/20">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/400x600/18181b/ffffff?text=${encodeURIComponent(title)}`;
          }}
        />
        
        {/* Rating Badge */}
        {score && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-yellow-400 text-xs font-bold font-mono">★ {score}</span>
          </div>
        )}

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <h3 className="mt-4 text-sm font-bold text-zinc-400 line-clamp-1 group-hover:text-white transition-colors uppercase italic tracking-tight">
        {title}
      </h3>
    </div>
  );
}
