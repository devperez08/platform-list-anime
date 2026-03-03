
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 py-12 pb-20 md:pb-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo and About */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="text-3xl font-black tracking-tighter italic flex items-center group">
              <span className="text-primary group-hover:text-primary/80 transition-colors">EPI</span>
              <span className="text-white group-hover:text-zinc-300 transition-colors">NEKO</span>
            </Link>
            <p className="text-zinc-500 max-w-sm leading-relaxed font-medium">
              Tu portal definitivo para descubrir, seguir y organizar tu pasión por el anime. 
              Únete a la comunidad más grande de fans.
            </p>

          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-black italic tracking-wider mb-6 uppercase text-sm">Explorar</h4>
            <ul className="space-y-4 text-zinc-500 text-sm font-medium">
              <li><Link href="/" className="hover:text-primary transition-colors">Inicio</Link></li>
              <li><Link href="/popular" className="hover:text-primary transition-colors">Tendencias</Link></li>
              <li><Link href="/library" className="hover:text-primary transition-colors">Mi Lista</Link></li>
              <li><Link href="/seasonal" className="hover:text-primary transition-colors">Temporada</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-black italic tracking-wider mb-6 uppercase text-sm">Legal</h4>
            <ul className="space-y-4 text-zinc-500 text-sm font-medium">
              <li><a href="#" className="hover:text-primary transition-colors">Términos de Uso</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacidad</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-xs font-medium">
             &copy; 2026 <span className="text-zinc-400 font-bold">EPINEKO</span>. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
             <p className="text-zinc-600 text-xs italic">
               Hecho con <span className="text-red-500">❤️</span> para fans del anime.
             </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
