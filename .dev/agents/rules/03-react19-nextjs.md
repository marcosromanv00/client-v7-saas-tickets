# Estándar React 19 & Next.js App Router: Protocolo "Zero-Effect"

Este documento establece las directrices de arquitectura para **React 19** y **Next.js App Router**, diseñadas específicamente para erradicar errores de linter, bucles infinitos de renderizado y desajustes de hidratación.

---

## 1. El Protocolo "Zero-Effect" (React 19 Mental Model)

> **Regla de Oro**: `useEffect` es una compuerta de escape para sincronizar con **sistemas externos ajenos a React** (APIs del navegador, canvas, WebSockets, observadores del DOM).  
> **NUNCA utilices `useEffect` para calcular estado derivado, sincronizar props con estado o gestionar flujos de datos internos.**

### Tabla de Anti-Patrones Prohibidos vs. Patrones Canónicos React 19

| Anti-Patrón Prohibido ❌ | Consecuencia ⚠️ | Solución Canónica React 19 ✅ |
| :--- | :--- | :--- |
| `useEffect` que llama a `setState` cuando cambian props | Doble render en cascada, violación de linter, parpadeo de UI | **Cálculo Puro en Render**: `const filtered = items.filter(...)` o `useMemo` solo si es pesado. |
| `useEffect` para resetear estado local cuando cambia un ID | Estado inconsistente durante 1 ciclo de render | **Reseteo con `key` prop**: `<ProfileForm key={userId} />` (React desmonta y remonta limpio). |
| `useEffect` para ejecutar fetching de datos en cliente al montar | Race conditions, waterfalls, duplicación de peticiones | **Server Components** con `await fetch()` o React 19 `use(Promise)` / React Query. |
| Actualizar estado A en `useEffect` porque cambió estado B | Bucles infinitos potenciales, código espagueti reactivo | **Calcular en Event Handler**: Actualizar ambos estados juntos en el evento del usuario (`onClick`). |
| Mutaciones asíncronas con `useEffect` | Complejidad innecesaria en formularios | **Server Actions** combinadas con `useActionState` y `useOptimistic`. |

---

## 2. Ejemplos Prácticos de Código

### Ejemplo 1: Cálculo Derivado (Sin Effects)
```tsx
// ❌ INCORRECTO (Viola el linter y genera re-renders innecesarios)
const [items, setItems] = useState<Item[]>([]);
const [filteredItems, setFilteredItems] = useState<Item[]>([]);

useEffect(() => {
  setFilteredItems(items.filter(i => i.active));
}, [items]);

// ✅ CORRECTO (Puro, síncrono, cero efectos, cero advertencias de linter)
const [items, setItems] = useState<Item[]>([]);
const filteredItems = useMemo(() => items.filter(i => i.active), [items]);
// O simplemente sin useMemo si items es una lista pequeña:
// const filteredItems = items.filter(i => i.active);
```

### Ejemplo 2: Reseteo de Estado al Cambiar Props (Patrón `key`)
```tsx
// ❌ INCORRECTO
function CardEditor({ cardId }: { cardId: string }) {
  const [comment, setComment] = useState("");
  useEffect(() => {
    setComment(""); // Flash de contenido antiguo
  }, [cardId]);
  return <textarea value={comment} onChange={e => setComment(e.target.value)} />;
}

// ✅ CORRECTO (En el componente padre)
function DeckManager({ currentCardId }: { currentCardId: string }) {
  // Al cambiar la key, React recrea el árbol interno con su estado inicial limpio
  return <CardEditor key={currentCardId} cardId={currentCardId} />;
}
```

### Ejemplo 3: Mutaciones con React 19 Server Actions & `useActionState`
```tsx
// ✅ Manejo moderno de formularios sin useEffect
"use client";

import { useActionState } from "react";
import { saveDeckAction } from "@/features/deck-builder/actions";

export function SaveDeckButton({ deckId }: { deckId: string }) {
  const [state, formAction, isPending] = useActionState(saveDeckAction, { success: false, error: null });

  return (
    <form action={formAction}>
      <input type="hidden" name="deckId" value={deckId} />
      <button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar Baraja"}
      </button>
      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
    </form>
  );
}
```

---

## 3. Server Components vs Client Components

1. **Server Components por Defecto**:
   - Todas las páginas (`page.tsx`), layouts (`layout.tsx`) y componentes de datos deben ser Server Components.
   - Acceden directamente a la base de datos (Supabase Server Client) de forma segura y sin exponer credenciales.
2. **Client Components (`'use client'`) Estrictamente Confinados**:
   - Usar `'use client'` **únicamente** en las hojas del árbol donde haya interactividad: eventos de usuario (`onClick`, `onChange`), hooks de React (`useState`, `useReducer`, `useRef`), animaciones con Framer Motion o acceso a APIs del DOM.
3. **Prevención de Desajustes de Hidratación (Hydration Mismatch)**:
   - Nunca uses APIs dependientes del navegador (`window.innerWidth`, `localStorage`, `navigator.userAgent`) ni valores de tiempo dinámicos (`new Date().toLocaleTimeString()`) durante el primer renderizado de SSR.
   - Si un componente depende obligatoriamente del estado del navegador, utiliza una bandera montada con `useEffect` o dynamic import con `ssr: false`:
   ```tsx
   const [isMounted, setIsMounted] = useState(false);
   useEffect(() => {
     setIsMounted(true);
   }, []);
   if (!isMounted) return null; // o un skeleton
   ```
