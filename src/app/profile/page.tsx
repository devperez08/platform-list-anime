"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getLibrary, LibraryItem } from '@/services/library';
import { type User } from '@supabase/supabase-js';
import Link from 'next/link';

interface ProfileStats {
  total: number;
  watching: number;
  completed: number;
  planToWatch: number;
  dropped: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<ProfileStats>({
    total: 0,
    watching: 0,
    completed: 0,
    planToWatch: 0,
    dropped: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          
          // Fetch profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          setProfile(profileData);

          // Fetch library stats
          const library = await getLibrary();
          const newStats = {
            total: library.length,
            watching: library.filter(i => i.status === 'watching').length,
            completed: library.filter(i => i.status === 'completed').length,
            planToWatch: library.filter(i => i.status === 'plan_to_watch').length,
            dropped: library.filter(i => i.status === 'dropped').length,
          };
          setStats(newStats);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center pt-20">
        <h2 className="text-2xl font-bold text-white mb-4">Debes iniciar sesión para ver tu perfil</h2>
        <Link href="/login" className="btn btn-primary px-8">Iniciar Sesión</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-20">
      {/* Hero section with backgound */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/20 to-zinc-950 z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar and Basic Info */}
          <div className="w-full md:w-1/3 lg:w-1/4 bg-zinc-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary to-purple-600 p-1 mb-6 shadow-xl ring-4 ring-primary/10">
                <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden border-4 border-zinc-900">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.full_name || user.email} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-black text-white italic">
                      {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              
              <h1 className="text-2xl font-black text-white italic tracking-tight mb-1">
                {profile?.full_name || user.email?.split('@')[0]}
              </h1>
              <p className="text-zinc-500 text-sm font-medium mb-6">@{profile?.username || user.email?.split('@')[0]}</p>
              
              <Link href="/settings" className="btn btn-primary btn-sm rounded-full w-full font-bold italic shadow-lg shadow-primary/20 transition-all">
                Editar Perfil
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500">Miembro desde</span>
                <span className="text-zinc-300 font-medium">
                  {new Date(user.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500">Estado</span>
                <span className="flex items-center gap-1.5 text-green-500">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Activo
                </span>
              </div>
            </div>
          </div>

          {/* Stats and Activity */}
          <div className="flex-1 w-full space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Animes" value={stats.total} icon="📊" />
              <StatCard label="Viendo" value={stats.watching} icon="📺" />
              <StatCard label="Completado" value={stats.completed} icon="✅" />
              <StatCard label="Pendiente" value={stats.planToWatch} icon="⏳" />
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-primary italic">#</span> Resumen de Actividad
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Progress Bars */}
                 <div className="space-y-4">
                    <ProgressBar label="Viendo" value={stats.watching} total={stats.total} color="bg-primary" />
                    <ProgressBar label="Completado" value={stats.completed} total={stats.total} color="bg-green-500" />
                    <ProgressBar label="Plan para ver" value={stats.planToWatch} total={stats.total} color="bg-yellow-500" />
                    <ProgressBar label="Abandonado" value={stats.dropped} total={stats.total} color="bg-red-500" />
                 </div>

                 <div className="bg-zinc-900 rounded-2xl p-6 border border-white/5 flex flex-col justify-center items-center text-center">
                    <p className="text-zinc-400 text-sm mb-2 font-medium uppercase tracking-wider">Eficiencia de Visualización</p>
                    <div className="text-5xl font-black text-white italic tracking-tighter mb-1">
                      {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                    </div>
                    <p className="text-zinc-500 text-xs italic">completado versus total</p>
                 </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/library" className="group bg-zinc-900/50 hover:bg-primary/10 transition-all rounded-3xl p-6 border border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Mi Biblioteca</h3>
                  <p className="text-zinc-500 text-sm">Gestiona tu colección personal</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white group-hover:bg-primary transition-all">
                  →
                </div>
              </Link>
              <Link href="/" className="group bg-zinc-900/50 hover:bg-purple-500/10 transition-all rounded-3xl p-6 border border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">Descubrir</h3>
                  <p className="text-zinc-500 text-sm">Encuentra tu próximo anime favorito</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white group-hover:bg-purple-500 transition-all">
                  →
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value, icon }: { label: string, value: number, icon: string }) {
  return (
    <div className="bg-zinc-900/50 backdrop-blur-md rounded-2xl p-5 border border-white/5 hover:border-primary/50 transition-all group">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-black text-white italic tracking-tighter group-hover:scale-110 transition-transform origin-left">{value}</div>
      <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{label}</div>
    </div>
  );
}

function ProgressBar({ label, value, total, color }: { label: string, value: number, total: number, color: string }) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
        <span className="text-zinc-400">{label}</span>
        <span className="text-white">{value}</span>
      </div>
      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
