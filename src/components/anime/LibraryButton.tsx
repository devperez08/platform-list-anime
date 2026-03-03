"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getLibraryItem, addToLibrary, removeFromLibrary, updateLibraryItem, LibraryItem, LibraryStatus } from '@/services/library';

interface LibraryButtonProps {
  animeId: number;
  title: string;
  imageUrl: string;
}

export default function LibraryButton({ animeId, title, imageUrl }: LibraryButtonProps) {
  const router = useRouter();
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<LibraryStatus>('plan_to_watch');

  useEffect(() => {
    checkLibraryStatus();
  }, [animeId]);

  const checkLibraryStatus = async () => {
    try {
      const item = await getLibraryItem(animeId);
      if (item) {
        setIsInLibrary(true);
        setStatus(item.status);
      } else {
        setIsInLibrary(false);
      }
    } catch (error) {
      console.error('Error checking library status:', error);
    }
  };

  const handleLibraryAction = async (newStatus?: LibraryStatus) => {
    setIsLoading(true);
    try {
      if (isInLibrary && !newStatus) {
        // User clicked the main button while it's in library -> Remove from library
        await removeFromLibrary(animeId);
        setIsInLibrary(false);
      } else if (isInLibrary && newStatus) {
        // User picked a new status from the dropdown
        await updateLibraryItem(animeId, { status: newStatus });
        setStatus(newStatus);
      } else {
        // Add new item (either main button + default status or dropdown selection)
        const item: LibraryItem = {
          anime_id_jikan: animeId,
          title: title,
          image_url: imageUrl,
          status: newStatus || status,
        };
        await addToLibrary(item);
        setIsInLibrary(true);
        if (newStatus) setStatus(newStatus);
      }
      router.refresh();
    } catch (error: any) {
      console.error('Library action error:', error);
      if (error.message?.includes('logged in')) {
        alert('Debes iniciar sesión para guardar animes en tu lista.');
      } else {
        alert('Error al actualizar tu lista: ' + (error.message || 'Ocurrió un problema inesperado.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const statusLabels: Record<LibraryStatus, string> = {
    watching: '📺 VIENDO',
    completed: '✅ COMPLETADO',
    plan_to_watch: '⏳ PENDIENTE',
    dropped: '❌ ABANDONADO'
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <button 
        onClick={() => handleLibraryAction()}
        disabled={isLoading}
        className={`btn ${isInLibrary ? 'btn-outline text-success border-success/50 hover:bg-success/10' : 'btn-primary'} btn-lg rounded-full px-12 font-black italic shadow-xl shadow-primary/20 transition-all flex-1`}
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : isInLibrary ? (
          '✓ EN MI LISTA'
        ) : (
          '+ AÑADIR A MI LISTA'
        )}
      </button>

      {isInLibrary && (
        <div className="dropdown dropdown-top sm:dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-lg btn-ghost bg-zinc-900/50 rounded-full border border-white/5 px-6 italic font-black text-sm">
            {statusLabels[status]}
          </div>
          <ul tabIndex={0} className="dropdown-content z-[20] menu p-2 shadow-2xl bg-zinc-900 rounded-2xl border border-white/10 w-52 mb-2">
            {(Object.keys(statusLabels) as LibraryStatus[]).map((s) => (
              <li key={s}>
                <button 
                  onClick={() => handleLibraryAction(s)}
                  className={`rounded-xl py-3 font-bold text-xs uppercase tracking-widest ${status === s ? 'text-primary bg-primary/10' : 'text-zinc-400'}`}
                >
                  {statusLabels[s]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
