"use client";

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ImportResult {
  imported: number;
  skipped: number;
  total?: number;
  errors?: string[];
}

export default function ImportButton() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setResult(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error desconocido al importar');
        return;
      }

      setResult(data);
      router.refresh();
    } catch {
      setError('Error de conexión al importar');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <input
        type="file"
        accept=".xml,.xlsx,.xls"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-white font-bold italic rounded-full px-6 py-2.5 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Importando...
          </>
        ) : (
          'Seleccionar archivo (XML o Excel)'
        )}
      </button>
      {result && (
        <span className="text-green-500 font-medium text-sm">
          ✓ {result.imported} animes importados
          {result.skipped > 0 ? `, ${result.skipped} omitidos` : ''}
        </span>
      )}
      {error && (
        <span className="text-red-500 font-medium text-sm">{error}</span>
      )}
    </div>
  );
}
