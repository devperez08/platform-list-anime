"use client";

import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '@/services/profile';
import Link from 'next/link';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Profile fields (only those stored in schema: username, full_name, avatar_url)
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const data = await getProfile();
        if (data) {
          setFullname(data.full_name || '');
          setUsername(data.username || '');
          setAvatarUrl(data.avatar_url || '');
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSave() {
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      const updates = {
        full_name: fullname,
        username,
        avatar_url: avatarUrl,
      };

      await updateProfile(updates);

      setMessage({ type: 'success', text: '¡Perfil actualizado correctamente!' });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al actualizar el perfil';
      setMessage({ type: 'error', text: msg });
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

  return (
    <main className="min-h-screen bg-zinc-950 pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-10">
          <Link href="/profile" className="bg-zinc-800 hover:bg-zinc-700 text-white transition-all text-xs font-black flex items-center gap-2 mb-6 group px-5 py-2.5 rounded-full w-fit border border-white/10 shadow-lg italic uppercase tracking-wider">
             <span className="group-hover:-translate-x-1 transition-transform text-primary">←</span> Volver al perfil
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">AJUSTES DE CUENTA</h1>
          <p className="text-zinc-500 mt-2">Personaliza tu experiencia local en EpiNeko</p>
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
                  <span className="label-text-alt text-zinc-500 italic">Este es tu identificador local único. Mínimo 3 caracteres.</span>
                </label>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-zinc-400 font-bold uppercase tracking-widest text-xs">Nombre Completo</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Tu Nombre" 
                  className="input input-bordered bg-zinc-950 border-white/10 text-white focus:border-primary focus:ring-1 focus:ring-primary rounded-xl" 
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-zinc-400 font-bold uppercase tracking-widest text-xs">URL del Avatar</span>
                </label>
                <input 
                  type="text" 
                  placeholder="https://ejemplo.com/foto.jpg" 
                  className="input input-bordered bg-zinc-950 border-white/10 text-white focus:border-primary focus:ring-1 focus:ring-primary rounded-xl" 
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                />
                <label className="label">
                  <span className="label-text-alt text-zinc-500 italic">URL pública de tu imagen de perfil.</span>
                </label>
              </div>
            </div>
          </section>

          {/* Local system info — read-only */}
          <section className="bg-zinc-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6">Info del Sistema</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Modo</span>
                <span className="text-green-400 font-bold">🟢 Local / Offline</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Base de datos</span>
                <span className="text-zinc-300 font-mono text-xs">anime-tracking.db (SQLite)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Auth</span>
                <span className="text-zinc-400 italic text-xs">Sin autenticación (usuario único)</span>
              </div>
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
              onClick={handleSave}
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
