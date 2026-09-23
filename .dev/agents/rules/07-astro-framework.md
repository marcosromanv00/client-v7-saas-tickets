# Estándar Astro Framework: Arquitectura de Islas & Rendimiento Extremo

Este documento establece las mejores prácticas para proyectos desarrollados con **Astro**, enfocado en rendimiento ultrarrápido, contenido tipado e integración con componentes de React y Supabase.

---

## 1. Filosofía: Cero JavaScript por Defecto (Islands Architecture)

En Astro, todo el HTML se genera estáticamente en el servidor sin enviar un solo byte de JavaScript al navegador, salvo que se active explícitamente una isla interactiva.

### Directivas de Hidratación Canónicas:
- **Sin directiva (`<Component />`)**: 0 KB de JS en el cliente. Solo HTML y CSS renderizados.
- **`client:visible` (Recomendado para la mayoría de UI interactiva)**: El JS se descarga e hidrata únicamente cuando el componente entra en el viewport del usuario (Intersection Observer).
- **`client:idle`**: Se hidrata una vez que la página principal ha terminado de cargar.
- **`client:load`**: Reservado exclusivamente para elementos interactivos críticos *above-the-fold* (ej. menú de navegación móvil o barra de búsqueda principal).
- **`client:only="react"`**: Omite el renderizado de servidor y solo se ejecuta en el navegador (útil para componentes con dependencias de APIs exclusivas de ventana).

```astro
---
// src/pages/index.astro
import HeroSection from '@/components/HeroSection.astro'; // 0 KB JS
import CardSearch from '@/features/cards/CardSearch'; // Componente React
---

<Layout title="Deck Builder">
  <HeroSection />
  <!-- Hidrata solo cuando el usuario se desplaza hacia la barra de búsqueda -->
  <CardSearch client:visible />
</Layout>
```

---

## 2. Content Collections con Validación Estricta de Zod

Para blogs, documentación o catálogos de contenido, utiliza siempre **Content Collections** con esquemas de Zod:

```typescript
// src/content/config.ts
import { defineCollection, z } from "astro:content";

const articles = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().min(5),
    description: z.string().max(160),
    publishDate: z.date(),
    author: z.string(),
    tags: z.array(z.string()).default([]),
    isDraft: z.boolean().default(false),
  }),
});

export const collections = { articles };
```

---

## 3. Modo Híbrido / SSR e Integración con Supabase

Cuando el proyecto requiera autenticación o rutas dinámicas por demanda:
1. Configurar el adaptador oficial (ej. `@astrojs/vercel`):
   ```javascript
   // astro.config.mjs
   import { defineConfig } from "astro/config";
   import vercel from "@astrojs/vercel/serverless";
   import tailwindcss from "@tailwindcss/vite";

   export default defineConfig({
     output: "hybrid", // o "server" para SSR completo
     adapter: vercel(),
   });
   ```
2. Mantener la lógica de base de datos en endpoints de API (`src/pages/api/...ts`) o en el frontmatter de páginas de servidor (`export const prerender = false;`).
