# Contribuir a EpiNeko

Guía para desarrolladores que quieran modificar o extender la aplicación.

## Requisitos previos

- Node.js >= 18
- pnpm >= 9

## Setup del entorno de desarrollo

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd alist

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

La base de datos se crea automáticamente en la raíz del proyecto (`anime-tracking.db`).

## Convenciones de código

### TypeScript
- Usar `strict: true` (ya configurado en `tsconfig.json`).
- Evitar `any` — usar tipos específicos o `unknown`.
- Prefijar interfaces con mayúscula: `LibraryItem`, `UserProfile`.

### React
- Componentes funcionales con hooks.
- `"use client"` solo cuando se necesite estado o efectos del lado del cliente.
- Server Components por defecto (sin `"use client"`).

### Estilos
- Tailwind CSS utility-first.
- DaisyUI para componentes UI (botones, cards, modales).
- Seguir la paleta de colores existente (zinc-950 backgrounds, primary accent).

### Archivos
- Services en `src/services/` con `"use server"` para Server Actions.
- Componentes en `src/components/` organizados por dominio.
- API routes en `src/app/api/` solo para endpoints externos.

## Estructura de carpetas

```
src/
├── app/api/          # API routes (fetch externo, no DB directa)
├── app/[route]/      # Páginas (Server Components por defecto)
├── components/       # Componentes React reutilizables
├── lib/db.ts         # Conexión SQLite (NO modificar patrón singleton)
└── services/         # Server Actions para CRUD de SQLite
```

## Reglas para modificar la base de datos

1. **Nunca modificar `schema-sqlite.sql` directamente** — usar migraciones programáticas en `src/lib/db.ts`.
2. Las migraciones deben ser idempotentes (seguro ejecutar múltiples veces).
3. Usar `PRAGMA table_info()` para verificar existencia de columnas antes de `ALTER TABLE`.
4. Mantener backward compatibility — no eliminar columnas existentes.

## Proceso de desarrollo

1. Crear una rama desde `main`.
2. Hacer cambios y verificar que `pnpm build` no tenga errores.
3. Probar manualmente las funcionalidades afectadas.
4. Ejecutar `pnpm lint` antes de commitear.

## Comandos útiles

```bash
pnpm dev          # Servidor de desarrollo
pnpm build        # Verificar build de producción
pnpm lint         # Verificar linting
```

## Qué no hacer

- No instalar dependencias de npm — usar siempre `pnpm`.
- No agregar dependencias de despliegue cloud (Vercel, AWS, etc.).
- No usar variables de entorno para configuración de base de datos (SQLite es local).
- No agregar autenticación — la app es de usuario único.
