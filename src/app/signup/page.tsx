"use client";

import { signup, loginWithGoogle } from "@/app/login/actions";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (username.length >= 3) {
        setIsChecking(true);
        try {
          const res = await fetch(`/api/check-username?username=${username}`);
          const data = await res.json();
          setUsernameExists(data.exists);
          if (data.exists) {
            setError("Este nombre de usuario ya está en uso");
          } else {
            setError("");
          }
        } catch (err) {
          console.error("Error checking username:", err);
        } finally {
          setIsChecking(false);
        }
      } else if (username.length > 0) {
        setError("El usuario debe tener al menos 3 caracteres");
        setUsernameExists(false);
      } else {
        setError("");
        setUsernameExists(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 p-4 pt-20">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md bg-zinc-900/40 backdrop-blur-2xl border border-white/5 p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-zinc-800 border border-white/10 mb-6 shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <img 
              src="/assets/images/logo.jpeg" 
              alt="Logo" 
              className="w-12 h-12 object-contain rounded-xl relative z-10" 
            />
          </div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter mb-2">ÚNETE AHORA</h1>
          <p className="text-zinc-500 text-sm font-medium">Crea tu cuenta de EpiNeko hoy</p>
        </div>

        <form action={signup} className="flex flex-col gap-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1" htmlFor="username">
              Nombre de Usuario
            </label>
            <div className="relative">
              <input
                className={`w-full bg-zinc-950/50 border ${error ? 'border-red-500/50' : 'border-white/5'} rounded-2xl px-5 py-3.5 text-white placeholder:text-zinc-700 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all`}
                name="username"
                id="username"
                placeholder="ej. anime_fan"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {isChecking && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <span className="loading loading-spinner loading-xs text-primary"></span>
                </div>
              )}
            </div>
            {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">{error}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-5 py-3.5 text-white placeholder:text-zinc-700 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all"
              type="email"
              name="email"
              id="email"
              placeholder="tucorreo@ejemplo.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1" htmlFor="password">
              Contraseña
            </label>
            <input
              className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-5 py-3.5 text-white placeholder:text-zinc-700 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all"
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <button
              type="submit"
              disabled={usernameExists || isChecking || username.length < 3}
              className="w-full py-4 bg-primary hover:bg-primary-hover disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed text-white font-black italic rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-wider"
            >
              REGISTRARSE
            </button>
            <Link
              href="/login"
              className="w-full py-4 bg-transparent border border-white/10 hover:bg-white/5 text-zinc-300 font-black italic rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-wider text-center"
            >
              YA TENGO CUENTA
            </Link>
          </div>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5"></span>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold">
              <span className="bg-zinc-900 px-4 text-zinc-600 tracking-widest">O continúa con</span>
            </div>
          </div>

          <button
            formAction={loginWithGoogle}
            className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-black italic rounded-2xl border border-white/5 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>
          
          <div className="text-center mt-6">
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">
              Nota: Revisa tu bandeja de entrada <br /> para confirmar tu cuenta tras registrarte.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
