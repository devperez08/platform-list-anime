
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getLibraryItem, addToLibrary, removeFromLibrary, LibraryItem } from '@/services/library';

interface LibraryButtonProps {
  animeId: number;
  title: string;
  imageUrl: string;
}

export default function LibraryButton({ animeId, title, imageUrl }: LibraryButtonProps) {
  const router = useRouter();
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkLibraryStatus();
  }, [animeId]);

  const checkLibraryStatus = async () => {
    try {
      const item = await getLibraryItem(animeId);
      setIsInLibrary(!!item);
    } catch (error) {
      console.error('Error checking library status:', error);
    }
  };

  const handleLibraryAction = async () => {
    setIsLoading(true);
    try {
      if (isInLibrary) {
        await removeFromLibrary(animeId);
        setIsInLibrary(false);
      } else {
        const item: LibraryItem = {
          anime_id_jikan: animeId,
          title: title,
          image_url: imageUrl,
          status: 'plan_to_watch',
        };
        await addToLibrary(item);
        setIsInLibrary(true);
      }
      router.refresh();
    } catch (error) {
      console.error('Library action error:', error);
      alert('Debes iniciar sesión para guardar animes en tu lista.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleLibraryAction}
      disabled={isLoading}
      className={`btn ${isInLibrary ? 'btn-outline text-success border-success/50 hover:bg-success/10' : 'btn-primary'} btn-lg rounded-full px-12 font-black italic shadow-xl shadow-primary/20 transition-all`}
    >
      {isLoading ? (
        <span className="loading loading-spinner loading-sm"></span>
      ) : isInLibrary ? (
        '✓ EN MI LISTA'
      ) : (
        '+ AÑADIR A MI LISTA'
      )}
    </button>
  );
}
