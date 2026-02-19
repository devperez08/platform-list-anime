
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import AnimeCard from '@/components/anime/AnimeCard';
import AnimeDetailsModal from '@/components/anime/AnimeDetailsModal';

export default function Home() {
  const [selectedAnime, setSelectedAnime] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sampleAnimes = [
    {
      id: 1,
      title: "Solo Leveling",
      image: "/assets/images/poster.png",
      score: "9.5",
      episodes: "12",
      status: "Finalizado",
      genres: ["Acción", "Aventura", "Fantasía"],
      synopsis: "En un mundo donde los cazadores, humanos que poseen habilidades mágicas, deben luchar contra monstruos mortales para proteger a la raza humana de una aniquilación segura, un cazador notoriamente débil llamado Sung Jinwoo se encuentra en una lucha interminable por la supervivencia."
    },
    {
      id: 2,
      title: "Jujutsu Kaisen",
      image: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
      score: "9.2",
      episodes: "24",
      status: "Emisión",
      genres: ["Acción", "Sobrenatural"],
      synopsis: "Un estudiante de secundaria con una fuerza física extraordinaria se une a una organización secreta de hechiceros para combatir una maldición que se ha apoderado de su cuerpo."
    },
    {
      id: 3,
      title: "Attack on Titan",
      image: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
      score: "9.8",
      episodes: "75",
      status: "Finalizado",
      genres: ["Acción", "Drama", "Militar"],
      synopsis: "La humanidad vive en ciudades rodeadas de enormes muros debido a los Titanes, gigantescas criaturas humanoides que devoran humanos sin razón aparente."
    }
  ];

  const handleOpenModal = (anime: any) => {
    setSelectedAnime(anime);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full flex items-center overflow-hidden">
        {/* Hero Background with Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ 
            backgroundImage: "url('/assets/images/lanscape.png')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl animate-in fade-in slide-in-from-left-12 duration-1000">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-primary/20 border border-primary/30 text-primary text-xs font-bold rounded-full backdrop-blur-md">
                ESTRENO DESTACADO
              </span>
              <span className="text-zinc-400 text-sm font-medium">Temporada de Invierno 2026</span>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-black text-white mb-6 tracking-tighter italic uppercase">
              EPINEKO
            </h1>
            <p className="text-xl md:text-2xl text-zinc-300 mb-10 max-w-xl leading-relaxed font-light">
              Descubre un universo de historias. Tu próxima aventura anime comienza con un solo clic. 
            </p>
            
            <div className="flex flex-wrap gap-5">
              <button 
                onClick={() => handleOpenModal(sampleAnimes[0])}
                className="btn btn-primary btn-lg rounded-full px-10 shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all font-black text-lg"
              >
                VER DETALLES
              </button>
              <button className="btn btn-ghost btn-lg rounded-full px-10 border-white/10 hover:bg-white/5 text-white backdrop-blur-md font-bold">
                EXPLORAR TODO
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="container mx-auto px-6 -mt-32 relative z-20 pb-32">
        
        {/* Trending Section */}
        <section className="mb-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-primary font-bold text-sm tracking-widest uppercase mb-1">Lo más visto</p>
              <h2 className="text-3xl md:text-4xl font-black text-white italic tracking-tight">
                TENDENCIAS DE LA SEMANA
              </h2>
            </div>
            <Link href="/trending" className="text-sm font-bold text-zinc-500 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">
              VER CATÁLOGO COMPLETO
            </Link>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-10 no-scrollbar snap-x">
            {sampleAnimes.map((anime) => (
              <AnimeCard 
                key={anime.id}
                image={anime.image}
                title={anime.title}
                score={anime.score}
                onClick={() => handleOpenModal(anime)}
              />
            ))}
            {/* Repeat items for visual fullness */}
            {[4, 5, 6, 7].map((i) => (
              <AnimeCard 
                key={i}
                image={`https://placehold.co/400x600/18181b/ffffff?text=Anime+${i}`}
                title={`Próximamente ${i}`}
                score={`9.${i}`}
                onClick={() => handleOpenModal({
                  title: `Próximamente ${i}`,
                  image: `https://placehold.co/400x600/18181b/ffffff?text=Anime+${i}`,
                  score: `9.${i}`,
                  episodes: "??",
                  status: "Próximamente",
                  genres: ["Desconocido"],
                  synopsis: "Información próximamente disponible..."
                })}
              />
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="relative h-64 rounded-3xl overflow-hidden group cursor-pointer">
            <img 
              src="/assets/images/animekey.png" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="Action"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h3 className="text-3xl font-black text-white italic">ACCIÓN Y AVENTURA</h3>
              <p className="text-zinc-300 font-medium">Explosiones, duelos y épica</p>
            </div>
          </div>
          <div className="relative h-64 rounded-3xl overflow-hidden group cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=2000&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="Drama"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h3 className="text-3xl font-black text-white italic">SLICE OF LIFE</h3>
              <p className="text-zinc-300 font-medium">Historias del día a día</p>
            </div>
          </div>
        </section>

      </div>

      {/* Details Modal */}
      <AnimeDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        anime={selectedAnime} 
      />

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}
