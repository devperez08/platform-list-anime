# EpiNeko

Aplicación local de seguimiento y organización de anime. Usuario único, 100% offline-first con SQLite.

## Tech Stack

| Componente | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS 4 + DaisyUI 5 |
| Base de datos | SQLite (better-sqlite3) |
| Lenguaje | TypeScript 5 |
| Gestor de paquetes | pnpm |
| APIs externas | Jikan API v4 + AniList (fallback) |

## Características

- **Descubrimiento visual**: Explora animes en cuadrícula con categorías de tendencias.
- **Biblioteca local**: Guarda progreso de visto, puntuación y favoritos en `anime-tracking.db`.
- **Sin autenticación**: Usuario único local, perfil hardcoded con `id=1`.
- **Importación**: Soporte para XML (MyAnimeList) y Excel (.xlsx).
- **Fallback automático**: Si Jikan API está caído, usa AniList como respaldo.

## Inicio rápido

```bash
# 1. Instalar dependencias
pnpm install

# 2. Iniciar servidor de desarrollo
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000).

La base de datos se crea automáticamente al primer inicio.

## Comandos disponibles

| Comando | Descripción |
|---|---|
| `pnpm dev` | Servidor de desarrollo con hot-reload |
| `pnpm build` | Build de producción optimizado |
| `pnpm start` | Iniciar en modo producción |
| `pnpm lint` | Verificar código con ESLint |

## Estructura del proyecto

```
alist/
├── src/
│   ├── app/                    # Rutas (Next.js App Router)
│   │   ├── page.tsx            # Inicio (hero + trending)
│   │   ├── anime/[id]/         # Detalle de anime
│   │   ├── library/            # Biblioteca del usuario
│   │   ├── trending/           # Catálogo completo
│   │   ├── profile/            # Perfil y estadísticas
│   │   ├── settings/           # Configuración de cuenta
│   │   ├── terms/              # Términos y privacidad
│   │   └── api/                # API routes (server-side)
│   ├── components/             # Componentes React
│   │   ├── anime/              # AnimeCard, FavoriteButton, LibraryButton, etc.
│   │   ├── layout/             # Navbar, Footer, MainLayout
│   │   ├── library/            # FilterBar
│   │   └── profile/            # ImportButton, SyncCoversButton
│   ├── lib/
│   │   └── db.ts               # Conexión SQLite singleton
│   └── services/               # Server Actions (CRUD)
│       ├── jikan.ts            # Cliente API Jikan + fallback AniList
│       ├── library.ts          # CRUD de biblioteca
│       └── profile.ts          # CRUD de perfil
├── public/                     # Assets estáticos
├── docs/                       # Documentación del proyecto
├── schema-sqlite.sql           # Schema de la base de datos
├── anime-tracking.db           # Base de datos SQLite (local)
└── package.json
```

## Documentación

- [Arquitectura](docs/architecture.md) - Diseño del sistema y decisiones técnicas
- [Base de datos](docs/database.md) - Schema, tablas, migraciones y queries
- [API Routes](docs/api-routes.md) - Endpoints disponibles
- [Guía de desarrollo](docs/development.md) - Setup, debugging y tareas comunes
- [Contribuir](CONTRIBUTING.md) - Convenciones y proceso de desarrollo

## Licencia

Uso personal. Basado en el proyecto original de [devperez08](https://github.com/devperez08/platform-list-anime).
