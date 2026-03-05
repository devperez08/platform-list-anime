"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { type User } from "@supabase/supabase-js";
import { signOut } from "@/app/login/actions";
import SearchBar from "@/components/anime/SearchBar";

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out ${
        scrolled
          ? "bg-black/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] py-3 border-b border-white/5"
          : "bg-gradient-to-b from-black/95 via-black/80 to-black/20 py-5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">

        {/* Logo */}
        <Link href="/" className="group flex items-center flex-shrink-0">
          <div className="bg-white/5 border border-white/10 p-1.5 rounded-2xl shadow-xl backdrop-blur-sm transition-all group-hover:border-primary/40 group-hover:bg-white/10">
            <img
              src="/assets/images/logo.jpeg"
              alt="EPINEKO Logo"
              className="h-10 w-auto rounded-xl object-contain transition-transform group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Navigation Links — desktop only */}
        <div className="hidden lg:flex items-center gap-8 flex-shrink-0">
          <Link
            href="/"
            className="text-[10px] font-black text-zinc-300 hover:text-white transition-all uppercase tracking-[0.2em] relative group"
          >
            Inicio
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
          <Link
            href="/trending"
            className="text-[10px] font-black text-zinc-300 hover:text-white transition-all uppercase tracking-[0.2em] relative group"
          >
            Tendencias
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
          {user && (
            <Link
              href="/library"
              className="text-[10px] font-black text-zinc-300 hover:text-white transition-all uppercase tracking-[0.2em] relative group"
            >
              Mi Lista
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
          )}
        </div>

        {/* SearchBar — visible on all devices, grows to fill space */}
        <div className="flex-1 max-w-[180px] sm:max-w-xs md:max-w-sm lg:max-w-md">
          <SearchBar />
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar border border-white/5 hover:border-primary/50 transition-all p-0.5"
              >
                <div className="bg-zinc-800 text-white rounded-full w-full h-full flex items-center justify-center overflow-hidden border border-white/5">
                  <span className="text-xs font-black italic">
                    {(user.user_metadata?.username || user.user_metadata?.full_name || user.email)?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-4 z-[110] p-2 shadow-[0_10px_40px_rgba(0,0,0,0.8)] menu menu-sm dropdown-content bg-zinc-900 border border-white/10 rounded-2xl w-60 text-white animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <li className="menu-title px-4 py-2 text-zinc-500 text-[10px] uppercase tracking-widest font-black">Cuenta</li>
                <li>
                  <Link href="/profile" className="flex items-center gap-3 py-3 hover:bg-white/5 rounded-xl transition-colors group">
                    <span className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">👤</span>
                    <span className="font-bold">Perfil</span>
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="flex items-center gap-3 py-3 hover:bg-white/5 rounded-xl transition-colors group">
                    <span className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">⚙️</span>
                    <span className="font-bold">Ajustes</span>
                  </Link>
                </li>
                <div className="h-px bg-white/5 my-2 mx-2"></div>
                <li>
                  <form action={signOut} className="w-full">
                    <button type="submit" className="w-full flex items-center gap-3 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors font-bold">
                      <span className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">🚪</span>
                      Cerrar Sesión
                    </button>
                  </form>
                </li>
              </ul>
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary btn-sm rounded-full px-6 font-black italic tracking-tighter shadow-lg shadow-primary/20 text-white">
              LOGIN
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
