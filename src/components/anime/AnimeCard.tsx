
"use client";

import React from 'react';

interface AnimeCardProps {
  image: string;
  title: string;
  score?: string;
  onClick?: () => void;
}

export default function AnimeCard({ image, title, score, onClick }: AnimeCardProps) {
  return (
    <div 
      className="flex-none w-44 md:w-56 aspect-[2/3] group cursor-pointer snap-start"
      onClick={onClick}
    >
      <div className="relative h-full w-full rounded-2xl overflow-hidden bg-zinc-800 border border-white/5 transition-all duration-300 group-hover:scale-[1.05] group-hover:border-primary/50 group-hover:shadow-2xl group-hover:shadow-primary/20">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/400x600/18181b/ffffff?text=${encodeURIComponent(title)}`;
          }}
        />
        
        {/* Rating Badge */}
        {score && (
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-yellow-400 text-xs font-bold font-mono">★ {score}</span>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <button className="btn btn-primary btn-sm rounded-full w-full font-bold shadow-lg shadow-primary/20">
            + Mi Lista
          </button>
        </div>
      </div>
      
      <h3 className="mt-3 text-sm font-medium text-zinc-200 line-clamp-1 group-hover:text-primary transition-colors">
        {title}
      </h3>
    </div>
  );
}
