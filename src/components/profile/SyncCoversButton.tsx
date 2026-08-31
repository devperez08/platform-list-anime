"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SyncResult {
  total: number;
  updated: number;
  skipped: number;
  errors: string[];
}

export default function SyncCoversButton() {
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/sync-covers', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error desconocido al recuperar portadas');
        return;
      }

      setResult(data);
      router.refresh();
    } catch {
      setError('Error de conexión al recuperar portadas');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <button
        onClick={handleSync}
        disabled={isSyncing}
        className="bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-white font-bold italic rounded-full px-6 py-2.5 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSyncing ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Recuperando portadas... esto puede tardar unos segundos
          </>
        ) : (
          'Recuperar portadas faltantes'
        )}
      </button>
      {result && (
        <span className="text-green-500 font-medium text-sm">
          ✓ {result.updated} portadas recuperadas
          {result.skipped > 0 ? `, ${result.skipped} no encontradas` : ''}
          {result.errors && result.errors.length > 0 ? `, ${result.errors.length} errores` : ''}
        </span>
      )}
      {error && (
        <span className="text-red-500 font-medium text-sm">{error}</span>
      )}
    </div>
  );
}
