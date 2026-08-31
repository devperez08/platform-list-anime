# Arquitectura del sistema

Descripción del diseño técnico de EpiNeko.

## Visión general

EpiNeko es una aplicación **single-user, offline-first** construida con Next.js App Router. La base de datos SQLite local almacena toda la información del usuario, mientras que los metadatos de anime se obtienen de APIs externas (Jikan/AniList).

```
┌─────────────────────────────────────────────────┐
│                    Browser                       │
│  ┌───────────────────────────────────────────┐  │
│  │         Client Components (React)         │  │
│  │   useState, useEffect, event handlers     │  │
│  └──────────────────┬────────────────────────┘  │
│                     │ Server Actions / API Routes │
├─────────────────────┼───────────────────────────┤
│                    Server                        │
│  ┌──────────────────┴────────────────────────┐  │
│  │         Server Components (Next.js)       │  │
│  │   Páginas, Server Actions, API Routes     │  │
│  └──────┬───────────────────┬────────────────┘  │
│         │                   │                    │
│  ┌──────┴──────┐    ┌──────┴──────┐             │
│  │  SQLite DB  │    │  Jikan API  │             │
│  │  (local)    │    │  AniList    │             │
│  └─────────────┘    └─────────────┘             │
└─────────────────────────────────────────────────┘
```

## Patrón Server / Client

### Server Components (por defecto)
- Las páginas (`src/app/*/page.tsx`) son Server Components async.
- Hacen fetch de datos directamente en el servidor (llamadas a APIs externas y SQLite).
- No necesitan `"use client"` ni estado local.

### Server Actions (`"use server"`)
- Definidos en `src/services/library.ts` y `src/services/profile.ts`.
- CRUD directo a SQLite desde el cliente sin necesidad de API routes.
- Patrón: el componente client importa y llama la función del server action directamente.

### Client Components (`"use client"`)
- Componentes con interactividad: formularios, modales, estado local.
- Ejemplos: `LibraryButton`, `FavoriteButton`, `SearchBar`, `FilterBar`.

## Flujo de datos

### Consulta de anime (lectura externa)
```
Browser → Server Component → Jikan API / AniList → Render HTML → Browser
```

### Operación de biblioteca (escritura local)
```
Browser → Client Component → Server Action → SQLite → Respuesta → Browser
```

### Búsqueda
```
Browser → SearchBar (client) → /api/search → Jikan API → JSON → Browser
```

## Decisiones de diseño

### SQLite como base de datos
- **Por qué**: Sin servidor, cero configuración, un solo archivo, rendimiento excepcional para uso local.
- **Driver**: `better-sqlite3` — síncrono, nativo, altamente performante.
- **Modo WAL**: Habilitado para mejores lecturas concurrentes.

### Título como clave de unicidad
- `title TEXT UNIQUE` es la clave de negocio.
- `anime_id_jikan` es nullable y secundario.
- **Por qué**: Resiliente a cambios de API provider. Si Jikan cambia IDs, el registro persiste por título.

### Fallback AniList
- Cuando Jikan está caído o con rate limit, la app usa AniList GraphQL como respaldo.
- Los datos se normalizan al formato de Jikan para que el cliente no necesite cambios.

### Usuario único
- `profiles` tiene constraint `CHECK (id = 1)` — solo existe una fila.
- Sin autenticación, sin sesiones, sin JWT.
- **Por qué**: Simplifica la arquitectura eliminando capas de seguridad innecesarias para uso personal.

## Dependencias principales

| Paquete | Versión | Propósito |
|---|---|---|
| `next` | 16.1.6 | Framework React (App Router) |
| `react` / `react-dom` | 19.2.3 | UI library |
| `better-sqlite3` | ^12.11.1 | Driver SQLite nativo |
| `xlsx` | ^0.18.5 | Parseo de Excel (importación) |
| `xml2js` | ^0.6.2 | Parseo de XML (importación MAL) |
| `tailwindcss` | ^4 | Utility-first CSS |
| `daisyui` | ^5.5.18 | Componentes UI |
| `typescript` | ^5 | Tipado estático |
