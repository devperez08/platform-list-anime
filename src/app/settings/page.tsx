"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';
import Link from 'next/link';

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Profile fields
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const supabase = createClient();

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          setUser(user);
          const { data, error, status } = await supabase
            .from('profiles')
            .select(`full_name, username, website, avatar_url`)
            .eq('id', user.id)
            .single();

          if (error && status !== 406) {
            throw error;
          }

          if (data) {
            setFullname(data.full_name || '');
            setUsername(data.username || '');
            setWebsite(data.website || '');
            setAvatarUrl(data.avatar_url || '');
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, []);

  async function updateProfile() {
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      const { data: { user } } = await supabase.auth.getUser();

      const updates = {
        id: user?.id,
        full_name: fullname,
        username,
        website,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) throw error;
      setMessage({ type: 'success', text: '¡Perfil actualizado correctamente!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al actualizar el perfil' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-white mb-4">Debes iniciar sesión para acceder a ajustes</h2>
        <Link href="/login" className="btn btn-primary px-8">Iniciar Sesión</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-10">
          <Link href="/profile" className="bg-zinc-800 hover:bg-zinc-700 text-white transition-all text-xs font-black flex items-center gap-2 mb-6 group px-5 py-2.5 rounded-full w-fit border border-white/10 shadow-lg italic uppercase tracking-wider">
             <span className="group-hover:-translate-x-1 transition-transform text-primary">←</span> Volver al perfil
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">AJUSTES DE CUENTA</h1>
          <p className="text-zinc-500 mt-2">Personaliza tu experiencia en EpiNeko</p>
        </div>

        <div className="space-y-6">
          <section className="bg-zinc-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6">Información del Perfil</h2>
            
            <div className="space-y-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-zinc-400 font-bold uppercase tracking-widest text-xs">Nombre de Usuario</span>
                </label>
                <input 
                  type="text" 
                  placeholder="usuario_ninja" 
                  className="input input-bordered bg-zinc-950 border-white/10 text-white focus:border-primary focus:ring-1 focus:ring-primary rounded-xl" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <label className="label">
                  <span className="label-text-alt text-zinc-500 italic">Este es tu identificador público único.</span>
                </label>
              </div>
            </div>
          </section>

          <section className="bg-zinc-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6">Seguridad</h2>
            <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-zinc-400 font-bold uppercase tracking-widest text-xs">Correo Electrónico</span>
                </label>
                <input 
                  type="email" 
                  disabled
                  className="input input-bordered bg-zinc-950/50 border-white/5 text-zinc-500 rounded-xl cursor-not-allowed" 
                  value={user.email}
                />
                <label className="label">
                  <span className="label-text-alt text-zinc-600 italic">El correo no puede ser modificado actualmente.</span>
                </label>
              </div>
          </section>

          {message.text && (
            <div className={`alert ${message.type === 'success' ? 'alert-success bg-green-500/10 border-green-500/50 text-green-500' : 'alert-error bg-red-500/10 border-red-500/50 text-red-500'} rounded-2xl`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{message.text}</span>
            </div>
          )}

          <div className="flex justify-end gap-4 mt-10">
             <button 
              onClick={updateProfile}
              disabled={saving}
              className="btn btn-primary btn-lg px-16 rounded-full font-black italic shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-white uppercase tracking-widest border-2 border-white/10"
             >
                {saving ? 'Guardando...' : 'GUARDAR CAMBIOS'}
             </button>
          </div>
        </div>
      </div>
    </main>
  );
}
