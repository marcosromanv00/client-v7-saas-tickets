# Estándar Canónico Tailwind CSS v4 & Sistema de Tokens

Este estándar define las reglas de maquetación y diseño para proyectos basados en **Tailwind CSS v4+**, enfocado en eliminar clases arbitrarias desordenadas y mantener consistencia visual premium.

---

## 1. Arquitectura Nativa de Tailwind CSS v4

Tailwind v4 elimina por completo el archivo `tailwind.config.js` y adopta una configuración pura en CSS nativo mediante la directiva `@theme`:

```css
/* globals.css */
@import "tailwindcss";

@theme {
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-display: var(--font-outfit), sans-serif;

  /* Colores de marca y tema semántico */
  --color-brand-primary: oklch(0.65 0.24 265);
  --color-brand-secondary: oklch(0.72 0.18 160);
  
  /* Sistema de superficies oscuras sofisticadas */
  --color-surface-base: #09090b;
  --color-surface-card: #121215;
  --color-surface-border: #27272a;
}
```

---

## 2. Prohibición Absoluta de Clases Arbitrarias (`[]`)

> **Regla Inviolable**: Queda estrictamente prohibido utilizar valores arbitrarios entre corchetes para tamaños, espaciados o colores (ej. `w-[342px]`, `p-[13px]`, `text-[15px]`, `bg-[#0f172a]`), salvo que sea un valor dinámico inyectado por cálculo matemático mediante inline style (`style={{ width: `${percent}%` }}`).

### Guía de Reemplazo Canónico:

| Clase Arbitraria Prohibida ❌ | Reemplazo Canónico Oficial ✅ |
| :--- | :--- |
| `w-[250px]` o `w-[260px]` | `w-64` (256px) o `w-72` (288px) |
| `p-[11px]` o `p-[13px]` | `p-3` (12px) o `p-3.5` (14px) |
| `text-[13px]` o `text-[15px]` | `text-xs` (12px), `text-sm` (14px), `text-base` (16px) |
| `bg-[#0f172a]` | `bg-slate-900` o variable semántica `bg-(--color-surface-base)` |
| `rounded-[9px]` | `rounded-lg` (8px) o `rounded-xl` (12px) |
| `max-w-[480px]` | `max-w-md` (448px) o `max-w-lg` (512px) |

---

## 3. Orden Canónico de Clases Oficial (Prettier Tailwind Standard)

Para mantener legibilidad y consistencia en diffs de Git, las clases deben ordenarse de mayor impacto estructural a menor impacto cosmético:

1. **Posicionamiento & Layout**: `relative`, `absolute`, `fixed`, `inset-0`, `z-10`
2. **Display & Flex/Grid**: `flex`, `grid`, `items-center`, `justify-between`, `gap-4`
3. **Espaciado (Spacing)**: `p-4`, `px-6`, `py-2`, `m-auto`, `space-y-4`
4. **Dimensiones (Sizing)**: `w-full`, `max-w-md`, `h-12`, `min-h-screen`
5. **Tipografía**: `font-sans`, `text-sm`, `font-semibold`, `tracking-wide`, `text-slate-100`
6. **Fondos & Bordes**: `bg-zinc-900`, `border`, `border-zinc-800`, `rounded-xl`
7. **Efectos & Sombras**: `shadow-lg`, `opacity-90`, `backdrop-blur-md`
8. **Transiciones & Animaciones**: `transition-all`, `duration-200`, `ease-in-out`
9. **Estados Interactivos**: `hover:bg-zinc-800`, `focus:ring-2`, `active:scale-95`
10. **Modificadores Responsivos / Dark**: `sm:p-6`, `md:grid-cols-2`, `dark:bg-black`

### Ejemplo de Componente con Clases Canónicas:
```tsx
<button
  type="button"
  className="relative flex items-center justify-center gap-2 px-4 py-2.5 w-full sm:w-auto text-sm font-medium text-white bg-indigo-600 border border-indigo-500/30 rounded-lg shadow-sm transition-all duration-150 hover:bg-indigo-500 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-400"
>
  <PlusIcon className="w-4 h-4" />
  <span>Crear Nueva Baraja</span>
</button>
```
