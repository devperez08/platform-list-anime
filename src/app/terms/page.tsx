
import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  const sections = [
    { id: 'identidad', title: 'Identidad' },
    { id: 'terminos', title: 'Términos de Uso' },
    { id: 'privacidad', title: 'Privacidad' },
    { id: 'derechos', title: 'Tus Derechos' },
    { id: 'terceros', title: 'Terceros' },
    { id: 'jurisdiccion', title: 'Jurisdicción' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 py-24 px-6 md:py-32">
      <div className="container mx-auto max-w-4xl">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors mb-12 group text-sm font-bold uppercase tracking-widest"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al Inicio
        </Link>

        <header className="mb-20">
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white uppercase mb-6 leading-none">
            Aspectos <span className="text-primary border-b-4 border-primary/20">Legales</span>
          </h1>
          <p className="text-zinc-500 text-xl leading-relaxed italic max-w-2xl">
            Transparencia total sobre cómo protegemos tu pasión por el anime y tus datos personales.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
          {/* Sidebar / Index */}
          <aside className="lg:col-span-1">
            <nav className="sticky top-32 space-y-4">
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-600 mb-6">Contenido</p>
              {sections.map((section) => (
                <a 
                  key={section.id} 
                  href={`#${section.id}`}
                  className="block text-sm font-bold text-zinc-500 hover:text-white transition-colors py-1 border-l-2 border-transparent hover:border-primary pl-4"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-20">
            
            {/* 1. Identidad */}
            <section id="identidad" className="scroll-mt-32 space-y-6">
              <h2 className="text-3xl font-black italic text-white uppercase tracking-tight">
                1. Identidad del <span className="text-primary">Responsable</span>
              </h2>
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
                <p className="leading-relaxed">
                  <strong className="text-white">EpiNeko</strong> es un proyecto independiente desarrollado por <span className="text-zinc-400 font-bold">devperez08</span>. 
                  Operamos como una plataforma de código abierto dedicada a la comunidad de fans del anime. Para cualquier consulta legal o técnica, puedes contactarnos a través de nuestro repositorio oficial en GitHub.
                </p>
              </div>
            </section>

            {/* 2. Términos de Uso */}
            <section id="terminos" className="scroll-mt-32 space-y-8">
              <h2 className="text-3xl font-black italic text-white uppercase tracking-tight">
                2. Términos de <span className="text-primary">Uso</span>
              </h2>
              <div className="space-y-6 text-zinc-400 leading-relaxed">
                <p>
                  Al acceder a EpiNeko, te comprometes a utilizar la plataforma de manera responsable. Queda estrictamente prohibido:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Actividades ilegales o fraudulentas.",
                    "Distribución de spam o malware.",
                    "Intentos de vulnerar la seguridad del sitio.",
                    "Uso comercial no autorizado de los datos."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                      <span className="text-primary font-bold">#</span>
                      <span className="text-xs font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="space-y-4 pt-4 border-t border-white/5 text-sm">
                  <p><strong className="text-zinc-200 uppercase text-[10px] tracking-widest">Propiedad Intelectual:</strong> Todos los logos y marcas de animes pertenecen a sus respectivos dueños. EpiNeko no reclama derechos sobre el contenido obtenido de terceros.</p>
                  <p><strong className="text-zinc-200 uppercase text-[10px] tracking-widest">Limitación de responsabilidad:</strong> No garantizamos la disponibilidad ininterrumpida del sitio ni nos hacemos responsables por errores técnicos ajenos a nuestra infraestructura directa.</p>
                </div>
              </div>
            </section>

            {/* 3. Privacidad */}
            <section id="privacidad" className="scroll-mt-32 space-y-8">
              <h2 className="text-3xl font-black italic text-white uppercase tracking-tight">
                3. Política de <span className="text-primary">Privacidad</span>
              </h2>
              <div className="space-y-6 leading-relaxed">
                <p>
                  Recolectamos los datos mínimos necesarios para ofrecerte una experiencia personalizada:
                </p>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold">1</div>
                    <div>
                      <h4 className="text-white font-bold">Datos de Registro</h4>
                      <p className="text-sm text-zinc-500">Email e ID de usuario gestionados de forma segura a través de Supabase Auth.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold">2</div>
                    <div>
                      <h4 className="text-white font-bold">Datos Técnicos</h4>
                      <p className="text-sm text-zinc-500">Dirección IP y cookies técnicas para seguridad y analítica básica (Vercel Analytics).</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm bg-primary/5 p-6 rounded-2xl border border-primary/10 leading-relaxed italic">
                  <strong className="text-primary font-bold">Base Legal:</strong> El tratamiento de tus datos se basa en el <span className="text-white">consentimiento explícito</span> que otorgas al registrarte y utilizar nuestra plataforma.
                </p>
              </div>
            </section>

            {/* 4. Derechos */}
            <section id="derechos" className="scroll-mt-32 space-y-6">
              <h2 className="text-3xl font-black italic text-white uppercase tracking-tight">
                4. Tus <span className="text-primary">Derechos</span>
              </h2>
              <p className="leading-relaxed text-zinc-400">
                Bajo regulaciones como el RGPD, tienes derecho a:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["Acceso", "Rectificación", "Eliminación", "Oposición"].map((derecho) => (
                  <div key={derecho} className="p-4 rounded-2xl border border-white/10 text-center group hover:bg-white/5 transition-colors">
                    <p className="text-[10px] font-black uppercase text-zinc-500 group-hover:text-primary transition-colors">{derecho}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-500 italic mt-4">
                Puedes ejercer estos derechos eliminando tu cuenta desde los ajustes o contactándonos directamente. Tus datos se conservarán mientras mantengas tu cuenta activa.
              </p>
            </section>

            {/* 5. Terceros */}
            <section id="terceros" className="scroll-mt-32 space-y-6">
              <h2 className="text-3xl font-black italic text-white uppercase tracking-tight">
                5. Servicios de <span className="text-primary">Terceros</span>
              </h2>
              <p className="leading-relaxed text-zinc-400">
                Compartimos datos estrictamente con proveedores esenciales:
              </p>
              <ul className="space-y-3 font-medium text-sm">
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Infraestructura y Base de Datos (Supabase)</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Hosting y Analíticas (Vercel)</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Datos de Anime (API Jikan - MyAnimeList)</li>
              </ul>
            </section>

            {/* 6. Jurisdicción */}
            <section id="jurisdiccion" className="scroll-mt-32 space-y-6">
              <h2 className="text-3xl font-black italic text-white uppercase tracking-tight">
                6. Ley y <span className="text-primary">Jurisdicción</span>
              </h2>
              <p className="leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/5 text-sm">
                Estos términos se rigen por las leyes de la República de Colombia. Cualquier disputa se resolverá ante los tribunales competentes de dicha jurisdicción. Nos reservamos el derecho de modificar estos términos, notificando cambios relevantes en esta página.
              </p>
            </section>

          </main>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-600 text-xs italic">
            Última actualización: Marzo 2026.
          </p>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-4">
             <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider italic">Proyecto de Código Abierto</span>
             <a 
              href="https://github.com/devperez08/platform-list-anime" 
              target="_blank" 
              className="text-xs font-bold text-white hover:text-primary transition-colors"
            >
              GitHub &rarr;
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
