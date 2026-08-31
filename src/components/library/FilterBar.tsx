"use client";

import React from 'react';
import Link from 'next/link';

interface FilterOption {
  label: string;
  href: string;
}

const FILTERS: FilterOption[] = [
  { label: 'Todos', href: '/library' },
  { label: 'Favoritos', href: '/library?filter=favorites' },
  { label: 'Viendo', href: '/library?filter=watching' },
  { label: 'Completado', href: '/library?filter=completed' },
  { label: 'Pendiente', href: '/library?filter=plan_to_watch' },
  { label: 'Abandonado', href: '/library?filter=dropped' },
];

interface FilterBarProps {
  activeFilter: string;
}

export default function FilterBar({ activeFilter }: FilterBarProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none">
      {FILTERS.map((f) => {
        const isActive = activeFilter === 'all'
          ? f.href === '/library'
          : f.href === `/library?filter=${activeFilter}`;

        return (
          <Link
            key={f.label}
            href={f.href}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-colors ${
              isActive
                ? 'bg-amber-400/15 border-2 border-amber-400/50 text-amber-400'
                : 'bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:border-white/30'
            }`}
          >
            {f.label}
          </Link>
        );
      })}
    </div>
  );
}
