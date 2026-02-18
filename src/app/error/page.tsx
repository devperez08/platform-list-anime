export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold text-error mb-4">¡Ups! Algo salió mal</h1>
      <p className="text-lg opacity-80 mb-8">No pudimos procesar tu solicitud de autenticación.</p>
      <a href="/login" className="btn btn-outline">
        Volver al Login
      </a>
    </div>
  )
}
