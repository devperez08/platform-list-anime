"use client";

import React, { useState } from 'react';

interface FavoriteButtonProps {
  animeId: number;
  initialIsFavorite: boolean;
  size?: 'sm' | 'lg';
  className?: string;
}

export default function FavoriteButton({
  animeId,
  initialIsFavorite,
  size = 'sm',
  className = '',
}: FavoriteButtonProps) {
  const [fav, setFav] = useState(initialIsFavorite);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const previous = fav;
    setFav(!fav);

    try {
      const res = await fetch('/api/library/favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ animeId }),
      });
      const data = await res.json();
      if (data.success) {
        setFav(data.is_favorite);
      } else {
        setFav(previous);
      }
    } catch {
      setFav(previous);
    }
  };

  const btnSize = size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';
  const iconSize = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';

  return (
    <button
      onClick={handleToggle}
      className={`${btnSize} flex items-center justify-center rounded-full transition-all duration-200 ${
        fav
          ? 'bg-red-500/20 text-red-500'
          : 'bg-black/40 text-zinc-400 hover:text-white'
      } ${className}`}
      aria-label={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={iconSize}
        fill={fav ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
