# Guía de desarrollo

Tareas comunes, debugging y flujo de trabajo.

## Comandos

```bash
pnpm install       # Instalar dependencias
pnpm dev           # Servidor de desarrollo (localhost:3000)
pnpm build         # Build de producción
pnpm start         # Iniciar en modo producción
pnpm lint          # Verificar código con ESLint
```

## Agregar una nueva página

1. Crear archivo en `src/app/[ruta]/page.tsx`.
2. Si necesita datos del servidor: hacer fetch directamente (Server Component por defecto).
3. Si necesita interactividad: agregar `"use client"` al inicio del archivo.
4. Agregar link en `Navbar` si es necesario (en `src/components/layout/Navbar.tsx`).

## Agregar un nuevo Server Action

1. Crear o editar archivo en `src/services/`.
2. Agregar `"use server"` al inicio del archivo.
3. Definir la función como `async` y exportarla.
4. Ejemplo:

```typescript
"use server";

import { db } from '@/lib/db';

export const miFuncion = async (param: string) => {
  return db.prepare('SELECT * FROM user_library WHERE title = ?').get(param);
};
```

## Agregar una nueva API route

1. Crear archivo en `src/app/api/[ruta]/route.ts`.
2. Exportar funciones `GET`, `POST`, etc.
3. Ejemplo:

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ data: [] });
}
```

## Agregar un nuevo componente

1. Crear archivo en `src/components/[dominio]/`.
2. Si usa estado o efectos: agregar `"use client"`.
3. Si es solo presentación: dejar como Server Component.

## Modificar la base de datos

### Agregar columna
```typescript
// En src/lib/db.ts, después de la verificación de tablas
const columns = db.prepare("PRAGMA table_info(user_library)").all();
const hasNewColumn = columns.some(col => col.name === 'nueva_columna');

if (!hasNewColumn) {
  db.exec(`ALTER TABLE user_library ADD COLUMN nueva_columna TEXT DEFAULT ''`);
}
```

### Agregar tabla nueva
```typescript
// En src/lib/db.ts
const tableExists = db.prepare(
  "SELECT name FROM sqlite_master WHERE type='table' AND name='nueva_tabla'"
).get();

if (!tableExists) {
  db.exec(`CREATE TABLE nueva_tabla (...)`);
}
```

**Regla**: Siempre verificar existencia antes de crear/alterar.

## Debugging

### Error: "better-sqlite3 was compiled against a different Node.js version"
```bash
pnpm rebuild better-sqlite3
```

### Error: "Cannot find module '@vercel/analytics'"
La dependencia fue eliminada. Verificar que no haya imports de `@vercel/analytics` en el código.

### La app no carga la base de datos
1. Verificar que `anime-tracking.db` existe en la raíz.
2. Verificar permisos de escritura en el directorio.
3. Revisar consola del servidor por errores.

### Las imágenes no cargan
Verificar que `next.config.ts` tenga los patrones de hostname correctos:
- `cdn.myanimelist.net`
- `s4.anilist.co`

## Archivos importantes

| Archivo | Propósito |
|---|---|
| `src/lib/db.ts` | Conexión SQLite y auto-migraciones |
| `schema-sqlite.sql` | Schema completo de la base de datos |
| `src/services/*.ts` | Server Actions para CRUD |
| `src/app/api/*/route.ts` | Endpoints HTTP |
| `next.config.ts` | Configuración de Next.js (imágenes remotas) |
| `tsconfig.json` | Configuración de TypeScript |
| `.npmrc` | Configuración de builds nativos (better-sqlite3, sharp) |
