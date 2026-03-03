import { login, signup } from "./actions";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 p-4 pt-20">
      {/* Dynamic background element */}
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
          <h1 className="text-4xl font-black text-white italic tracking-tighter mb-2">BIENVENIDO</h1>
          <p className="text-zinc-500 text-sm font-medium">Inicia sesión en tu cuenta de EpiNeko</p>
        </div>

        <form className="flex flex-col gap-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1" htmlFor="identifier">
              Usuario o Correo Electrónico
            </label>
            <input
              className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-5 py-3.5 text-white placeholder:text-zinc-700 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all"
              name="identifier"
              id="identifier"
              placeholder="ej. anime_fan o tu@correo.com"
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
              formAction={login}
              className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-black italic rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-wider"
            >
              Iniciar Sesión
            </button>
            <Link
              href="/signup"
              className="w-full py-4 bg-transparent border border-white/10 hover:bg-white/5 text-zinc-300 font-black italic rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-wider text-center"
            >
              CREAR CUENTA
            </Link>
          </div>

          <div className="text-center mt-6">
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">
              Nota: Al registrarte, revisa tu bandeja de entrada <br /> para
              confirmar tu cuenta.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
