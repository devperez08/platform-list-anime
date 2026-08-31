# API Routes

Referencia de los endpoints HTTP disponibles.

Todas las rutas están en `src/app/api/` y se acceden vía `http://localhost:3000/api/...`.

---

## GET /api/trending

Obtiene animes trending/populares.

**Parámetros de query:**

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `page` | number | 1 | Número de página |
| `type` | string | | Filtrar por tipo: `tv`, `movie`, `ova`, `ona`, `special` |
| `filter` | string | `bypopularity` | Orden: `bypopularity`, `airing`, `upcoming`, `favorite` |

**Respuesta:**
```json
{
  "data": [{ "mal_id": 1, "title": "...", "images": {...}, ... }],
  "pagination": { "has_next_page": true, "current_page": 1 },
  "source": "jikan"
}
```

**Fallback**: Si Jikan está caído, usa AniList.

---

## GET /api/search

Busca animes por término.

**Parámetros de query:**

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `q` | string | Sí | Término de búsqueda (mínimo 2 caracteres) |

**Respuesta:**
```json
{
  "data": [{ "mal_id": 1, "title": "...", "images": {...} }],
  "source": "jikan"
}
```

**Errores:**
- `400`: Query menor a 2 caracteres
- `503`: Ambas APIs (Jikan y AniList) no disponibles

---

## GET /api/anime/[id]

Obtiene detalles de un anime por su ID de MAL.

**Parámetros:**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | number | ID de MAL (en la URL) |

**Respuesta:**
```json
{
  "data": {
    "mal_id": 1,
    "title": "...",
    "synopsis": "...",
    "episodes": 26,
    "score": 8.5,
    "images": { "jpg": {...}, "webp": {...} }
  }
}
```

**Errores:**
- `400`: ID inválido (NaN)
- `503`: Anime no encontrado en ninguna API

---

## GET /api/anime/[id]/characters

Obtiene los personajes de un anime.

**Parámetros:**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | number | ID de MAL (en la URL) |

**Respuesta:**
```json
{
  "data": [
    {
      "character": { "mal_id": 1, "name": "...", "images": {...} },
      "role": "Main"
    }
  ]
}
```

**Nota**: Solo disponible vía Jikan (sin fallback AniList). Retorna array vacío si falla.

---

## POST /api/library/favorite

Alterna el estado de favorito de un anime.

**Body:**
```json
{ "animeId": 12345 }
```

**Respuesta:**
```json
{
  "success": true,
  "is_favorite": true
}
```

**Errores:**
- `400`: `animeId` no proporcionado o no es número
- `404`: Anime no encontrado en la biblioteca

---

## POST /api/import

Importa anime desde archivos XML o Excel.

**Body**: `multipart/form-data` con campo `file`.

**Formatos soportados:**
- `.xml` — Exportación de MyAnimeList
- `.xlsx` — Formato Excel personalizado

**Columnas Excel recognized:**
- `title` / `nombre` / `name`
- `status` / `estado`
- `score` / `puntuacion` / `rating`
- `episodes_watched` / `episodios` / `progress`
- `image_url` / `imagen`

**Respuesta:**
```json
{
  "success": true,
  "imported": 15,
  "skipped": 3,
  "total": 18,
  "errors": []
}
```

---

## POST /api/sync-covers

Recupera portadas faltantes de animes en la biblioteca.

**Body**: Ninguno (POST vacío).

**Proceso:**
1. Busca animes sin `image_url` en la biblioteca.
2. Para cada uno, consulta Jikan/AniList para obtener la portada.
3. Actualiza el registro con la URL de la imagen.

**Respuesta:**
```json
{
  "success": true,
  "total": 5,
  "updated": 3,
  "skipped": 1,
  "errors": ["Anime sin portada"]
}
```

**Rate limit**: 400ms entre requests (respetando Jikan).
