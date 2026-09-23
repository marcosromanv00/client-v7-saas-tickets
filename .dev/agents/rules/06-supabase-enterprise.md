# Estándar Supabase Enterprise: Seguridad RLS & Arquitectura de Clientes

Este documento establece las directrices de seguridad, base de datos y consumo de APIs de **Supabase** para entornos de producción.

---

## 1. Multi-Tenancy en Capa Gratuita de Supabase: Prefijos Únicos Obligatorios

> **Restricción de Infraestructura**: En la capa gratuita de Supabase (límite de 1 proyecto activo), múltiples aplicaciones comparten una única instancia de base de datos PostgreSQL.  
> **Regla Obligatoria**: Para evitar colisiones y sobrescritura accidental de tablas, **CADA PROYECTO DEBE TENER UN PREFIJO IDENTIFICADOR ÚNICO** (de 2 a 4 caracteres en minúsculas seguido de guion bajo, ej. `yg_`, `cv_`, `pos_`, `nx_`).

### Reglas del Prefijo:
1. **Registro Mandatorio en `agents.md`**: El prefijo oficial asignado al proyecto debe documentarse explícitamente en `<proyecto>/.dev/agents/agents.md`.
2. **Tablas e Índices**: Toda tabla debe crearse como `public.<prefix>_<nombre_tabla>` (ej. `public.yg_decks`, `public.yg_cards`) y sus índices como `idx_<prefix>_<tabla>_<columna>`.
3. **Políticas de RLS**: Toda política debe incluir el prefijo para evitar colisiones globales en la base de datos (ej. `"<prefix>_decks_read_policy"`).
4. **Clientes y Consultas**: Toda consulta en el frontend o backend debe referenciar el nombre prefijado: `supabase.from('<prefix>_decks')`.

---

## 2. Seguridad Mandatoria: Row Level Security (RLS) al 100%

> **Regla Inviolable**: Ninguna tabla en el esquema `public` puede existir sin `ENABLE ROW LEVEL SECURITY`. Crear una tabla sin RLS o con políticas abiertas `true` sin autenticación es una falta de seguridad crítica.

### Ejemplo de Migración SQL Canónica:
```sql
-- 1. Crear tabla con claves foráneas e integridad referencial
CREATE TABLE public.decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) >= 3 AND char_length(title) <= 100),
  is_public BOOLEAN NOT NULL DEFAULT false,
  cards JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Habilitar RLS Obligatorio
ALTER TABLE public.decks ENABLE ROW LEVEL SECURITY;

-- 3. Índices de rendimiento (Claves foráneas y filtros frecuentes)
CREATE INDEX idx_decks_user_id ON public.decks(user_id);
CREATE INDEX idx_decks_is_public ON public.decks(is_public) WHERE is_public = true;

-- 4. Políticas Explícitas y Seguras
-- Lectura: El propietario puede leer sus barajas O cualquiera puede leer barajas públicas
CREATE POLICY "decks_read_policy" ON public.decks
  FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

-- Inserción: Solo usuarios autenticados creando barajas a su propio nombre
CREATE POLICY "decks_insert_policy" ON public.decks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Actualización: Solo el propietario puede modificar su baraja
CREATE POLICY "decks_update_policy" ON public.decks
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Eliminación: Solo el propietario puede eliminar su baraja
CREATE POLICY "decks_delete_policy" ON public.decks
  FOR DELETE
  USING (auth.uid() = user_id);
```

---

## 2. Arquitectura de Clientes con `@supabase/ssr`

Utiliza siempre el paquete oficial `@supabase/ssr` con separación estricta según el entorno de ejecución:

### A. Cliente en Server Components (Solo Lectura de Cookies)
```typescript
// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/types/database.types";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignorado en Server Components (solo lectura)
          }
        },
      },
    }
  );
}
```

### B. Cliente en Client Components (`'use client'`)
```typescript
// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database.types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

---

## 3. Seguridad Crítica de Credenciales

1. **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**: Clave pública segura para usar en el navegador. Está protegida por las políticas de RLS.
2. **`SUPABASE_SERVICE_ROLE_KEY`**:
   - **PROHIBIDO** prefijar con `NEXT_PUBLIC_`.
   - **PROHIBIDO** importar en Client Components.
   - Solo debe utilizarse en scripts de backend administrativo o Supabase Edge Functions con roles verificados.
