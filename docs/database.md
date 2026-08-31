# Base de datos

Referencia completa del esquema SQLite y operaciones comunes.

## Archivo de base de datos

- **Ubicación**: `anime-tracking.db` (raíz del proyecto)
- **Driver**: `better-sqlite3` (síncrono, nativo)
- **Conexión**: Singleton en `src/lib/db.ts`
- **Modo**: WAL habilitado, foreign keys ON

La base de datos se crea automáticamente al primer inicio de la aplicación.

## Tablas

### profiles

Almacena la configuración del usuario único.

| Columna | Tipo | Constraints | Descripción |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY, CHECK (id = 1), DEFAULT 1 | Siempre 1 |
| `username` | TEXT | NOT NULL, UNIQUE | Identificador del usuario |
| `full_name` | TEXT | | Nombre para mostrar |
| `avatar_url` | TEXT | | URL de imagen de perfil |
| `updated_at` | TEXT | NOT NULL, DEFAULT now | Última actualización |

### user_library

Almacena el seguimiento de anime del usuario.

| Columna | Tipo | Constraints | Descripción |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | ID interno |
| `anime_id_jikan` | INTEGER | | ID de Jikan/MAL (nullable) |
| `title` | TEXT | NOT NULL, UNIQUE | Título canónico del anime |
| `image_url` | TEXT | | URL de la portada |
| `status` | TEXT | NOT NULL, DEFAULT 'watching', CHECK IN (... | Estado de visualización |
| `is_favorite` | INTEGER | NOT NULL, DEFAULT 0, CHECK IN (0, 1) | Marcado como favorito |
| `score` | INTEGER | CHECK (NULL OR 0-10) | Puntuación personal |
| `episodes_watched` | INTEGER | NOT NULL, DEFAULT 0, CHECK >= 0 | Episodios vistos |
| `created_at` | TEXT | NOT NULL, DEFAULT now | Fecha de creación |
| `updated_at` | TEXT | NOT NULL, DEFAULT now | Última actualización |

**Valores de `status`**: `watching`, `completed`, `dropped`, `plan_to_watch`

## Índices

| Índice | Columna | Propósito |
|---|---|---|
| `idx_user_library_title` | `title` | Búsquedas rápidas por título |
| `idx_user_library_anime_id` | `anime_id_jikan` | Lookups por ID de Jikan |
| `idx_user_library_status` | `status` | Filtrado por estado |
| `idx_user_library_favorite` | `is_favorite` | Filtrado de favoritos |
| `idx_user_library_updated_at` | `updated_at DESC` | Ordenamiento por actualización |

## Migraciones

Las migraciones se ejecutan automáticamente en `src/lib/db.ts` al iniciar:

### Auto-inicialización
Si la tabla `user_library` no existe, se ejecuta `schema-sqlite.sql` completo.

### Auto-migración de columnas
```sql
-- Verificar si existe la columna is_favorite
PRAGMA table_info(user_library)

-- Si no existe, agregarla
ALTER TABLE user_library ADD COLUMN is_favorite INTEGER NOT NULL DEFAULT 0
```

**Regla**: Las migraciones deben ser idempotentes (seguro ejecutar múltiples veces).

## Queries comunes

### Obtener biblioteca completa
```sql
SELECT * FROM user_library ORDER BY updated_at DESC;
```

### Filtrar por estado
```sql
SELECT * FROM user_library WHERE status = 'watching' ORDER BY updated_at DESC;
```

### Obtener favoritos
```sql
SELECT * FROM user_library WHERE is_favorite = 1 ORDER BY updated_at DESC;
```

### Buscar por título
```sql
SELECT * FROM user_library WHERE title = ?;
```

### Verificar si un anime está en la biblioteca
```sql
SELECT * FROM user_library WHERE anime_id_jikan = ?;
```

### Obtener perfil
```sql
SELECT * FROM profiles WHERE id = 1;
```

### Toggle favorito
```sql
UPDATE user_library
SET is_favorite = CASE WHEN is_favorite = 1 THEN 0 ELSE 1 END,
    updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
WHERE anime_id_jikan = ?
RETURNING is_favorite;
```

## Backup y restore

### Backup
```bash
cp anime-tracking.db anime-tracking-backup-$(date +%Y%m%d).db
```

### Restore
```bash
# Detener el servidor primero
cp anime-tracking-backup.db anime-tracking.db
```

### Reset completo
```bash
rm anime-tracking.db anime-tracking.db-wal anime-tracking.db-shm
# La DB se recrea automáticamente al iniciar el servidor
```
