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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        scrolled
          ? "bg-zinc-950/80 backdrop-blur-lg shadow-2xl py-3 border-b border-white/5"
          : "bg-gradient-to-b from-black/80 to-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tight group">
          <span className="text-primary group-hover:text-primary/80 transition-colors">Epi</span>
          <span className="text-white group-hover:text-zinc-200 transition-colors">Neko</span>
        </Link>

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-xs font-black text-zinc-100 hover:text-primary transition-colors uppercase italic tracking-widest px-2 py-1"
          >
            Inicio
          </Link>
          <Link
            href="/popular"
            className="text-xs font-black text-zinc-100 hover:text-primary transition-colors uppercase italic tracking-widest px-2 py-1"
          >
            Tendencias
          </Link>
          {user && (
            <Link
              href="/library"
              className="text-xs font-black text-zinc-100 hover:text-primary transition-colors uppercase italic tracking-widest px-2 py-1"
            >
              Mi Lista
            </Link>
          )}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <SearchBar />

          {user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar placeholder"
              >
                <div className="bg-neutral text-neutral-content rounded-full w-8">
                  <span className="text-xs">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow-2xl menu menu-sm dropdown-content bg-zinc-900 border border-white/10 rounded-2xl w-52 text-white"
              >
                <li>
                  <Link href="/profile" className="hover:text-primary transition-colors">Perfil</Link>
                </li>
                <li>
                  <Link href="/settings" className="hover:text-primary transition-colors">Ajustes</Link>
                </li>
                <li>
                  <form action={signOut}>
                    <button type="submit" className="w-full text-left hover:text-red-500 transition-colors">
                      Cerrar Sesión
                    </button>
                  </form>
                </li>
              </ul>
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
