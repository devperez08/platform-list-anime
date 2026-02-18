import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto min-h-screen">
      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground pt-20">
        <h1 className="text-3xl font-bold mb-6 text-center">Bienvenido a EpiNeko</h1>
        
        <label className="text-md font-medium" htmlFor="full_name">
          Nombre Completo (Solo para Registro)
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-4 input input-bordered"
          name="full_name"
          placeholder="Tu nombre"
        />

        <label className="text-md font-medium" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-4 input input-bordered"
          name="email"
          placeholder="tucorreo@ejemplo.com"
          required
        />

        <label className="text-md font-medium" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6 input input-bordered"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />

        <button
          formAction={login}
          className="btn btn-primary mb-2 shadow-lg"
        >
          Iniciar Sesión
        </button>
        <button
          formAction={signup}
          className="btn btn-outline"
        >
          Registrarse
        </button>
        
        <p className="text-xs text-center mt-4 opacity-60">
          Nota: Si te registras, revisa tu correo para confirmar tu cuenta.
        </p>
      </form>
    </div>
  )
}
