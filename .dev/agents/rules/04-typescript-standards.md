# Estándar TypeScript Estricto y Validación de Datos

Este documento define las reglas de tipado estricto para erradicar el uso de `any`, asegurar contratos en tiempo de ejecución con **Zod** y sincronizar tipos nativos con **Supabase**.

---

## 1. Tolerancia Cero con `any` y Type Assertions Ciegos

> **Prohibición Absoluta**: El uso de `any`, `(foo as any)` o `// @ts-ignore` está estrictamente prohibido en todo el código de producción.

### Guía de Sustitución Canónica:

| Código Peligroso / Prohibido ❌ | Código Seguro / Canónico ✅ |
| :--- | :--- |
| `data: any` en argumentos de función | `data: unknown` combinado con Zod o Type Guards |
| `const res = response as any;` | `const res = MySchema.parse(response);` |
| `catch (error: any) { alert(error.message); }` | `catch (error) { if (error instanceof Error) ... }` |
| Objeto genérico `{ [key: string]: any }` | `Record<string, unknown>` |
| Props sin tipar en componentes React | `interface [Component]Props { ... }` explícita |

---

## 2. Validación en Tiempo de Ejecución con Zod

TypeScript solo garantiza tipado en tiempo de compilación. Toda frontera externa (peticiones HTTP, webhooks, Server Actions, localStorage, parsing de JSON) debe validarse en runtime con **Zod**:

```typescript
import { z } from "zod";

// 1. Definición del Esquema
export const CardSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "El nombre de la carta es obligatorio"),
  atk: z.number().int().nonnegative().nullable(),
  def: z.number().int().nonnegative().nullable(),
  attribute: z.enum(["DARK", "LIGHT", "EARTH", "WATER", "FIRE", "WIND", "DIVINE"]),
  tags: z.array(z.string()).default([]),
});

// 2. Inferencia del Tipo TypeScript
export type Card = z.infer<typeof CardSchema>;

// 3. Manejo Seguro en Funciones / Server Actions
export function parseCardPayload(input: unknown): Card {
  const result = CardSchema.safeParse(input);
  if (!result.success) {
    const errorMessages = result.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join(", ");
    throw new Error(`Datos de carta inválidos: ${errorMessages}`);
  }
  return result.data;
}
```

---

## 3. Tipado de Base de Datos con Supabase

Nunca crees interfaces manuales desincronizadas para las tablas de Supabase. Genera o deriva los tipos directamente desde el esquema de base de datos:

```typescript
// types/database.types.ts (Generado mediante `supabase gen types typescript`)
export interface Database {
  public: {
    Tables: {
      decks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Consumo en Modelos de la Aplicación
export type DeckRow = Database["public"]["Tables"]["decks"]["Row"];
export type DeckInsert = Database["public"]["Tables"]["decks"]["Insert"];
```

---

## 4. Tipado de Errores en Bloques `try / catch`

En TypeScript moderno, la variable del `catch` es de tipo `unknown`. Nunca le hagas cast a `any`:

```typescript
try {
  await performCriticalOperation();
} catch (error: unknown) {
  if (error instanceof z.ZodError) {
    console.error("Error de validación:", error.flatten());
  } else if (error instanceof Error) {
    console.error("Error de operación:", error.message);
  } else {
    console.error("Error desconocido no tipado:", String(error));
  }
  throw error;
}
```
