# Principios de Código Limpio, Modularidad & Arquitectura de Componentes

Este estándar implementa los principios de **Robert C. Martin (Uncle Bob)** y las mejores prácticas de ingeniería de software para garantizar una base de código escalable, modular y mantenible.

---

## 1. Reglas Fundamentales de Clean Code

### A. Principio de Responsabilidad Única (SRP)
- Cada función, módulo o componente debe tener **una sola razón para cambiar**.
- Si una función o componente hace más de una cosa (ej. fetch de datos + validación + renderizado de UI complejo + tracking analítico), debe descomponerse inmediatamente.

### B. Regla del Boy Scout
> *"Deja siempre el campamento más limpio de lo que lo encontraste."*
Al modificar cualquier archivo:
- Si detectas una función mal nombrada, un tipo `any`, o una función de más de 30 líneas en el bloque adyacente, refactorízala de manera quirúrgica.
- No añadas nuevas funcionalidades sobre código desordenado; limpia primero, implementa después.

### C. Funciones Pequeñas y de Un Solo Nivel de Abstracción
- Las funciones deben ser concisas (idealmente de 2 a 15 líneas).
- Deben tener un único nivel de abstracción: no mezclar llamadas a bajo nivel de DOM/SQL con lógica de negocio de alto nivel.

---

## 2. Límites Estrictos de Tamaño de Archivo & Extracción Proactiva

Para prevenir **God Files** (archivos monstruo) y componentes inmanejables:

| Tipo de Archivo | Límite Recomendado | Límite Crítico (Refactorización Inmediata) |
| :--- | :--- | :--- |
| Componente React / Astro | 120 - 150 líneas | **> 200 líneas** |
| Archivo de Lógica / Helper | 100 - 150 líneas | **> 200 líneas** |
| Hook Personalizado | 80 - 120 líneas | **> 180 líneas** |

### Protocolo de Descomposición en 3 Pasos
Cuando un componente supera los límites o acumula múltiples responsabilidades:
1. **Extraer Lógica de Estado y Efectos a un Custom Hook**:
   - Mover hooks, listeners y handlers a `use[NombreFeature].ts`.
   - El componente UI solo debe consumir las propiedades retornadas por el hook.
2. **Extraer Lógica de Negocio y Transformaciones a Funciones Puras**:
   - Mover formateo de fechas, filtros, cálculos matemáticos o validaciones a `[nombre-feature].utils.ts`.
   - Las funciones puras son 100% testeables de forma aislada sin montar componentes de React.
3. **Extraer Sub-bloques Visuales a Subcomponentes**:
   - Si un JSX contiene secciones visuales distintas (ej. Header de tarjeta, lista de items, footer con acciones), dividirlos en subcomponentes atómicos (`DeckHeader.tsx`, `DeckCardGrid.tsx`, `DeckActions.tsx`).

---

## 3. Arquitectura Orientada a Features (Feature-Driven Architecture)

Para proyectos con múltiples dominios, estructurar el código por capacidades de negocio y no por tipo de archivo técnico:

```text
src/
├── app/                        # Next.js App Router (Solo rutas, layouts y pages delgadas)
├── components/                 # Componentes UI globales agnósticos (Shadcn / Radix)
│   └── ui/                     # Button, Dialog, Input, etc.
├── features/                   # Módulos de dominio aislados
│   └── deck-builder/
│       ├── components/         # Componentes específicos de esta feature
│       │   ├── DeckCanvas.tsx
│       │   ├── DeckHeader.tsx
│       │   └── CardSlot.tsx
│       ├── hooks/              # Custom hooks de la feature
│       │   └── useDeckBuilder.ts
│       ├── utils/              # Funciones puras y parsers
│       │   └── deckCalculations.ts
│       ├── types.ts            # Interfaces TypeScript específicas del dominio
│       └── deck-builder.spec.ts # Pruebas unitarias de lógica
└── lib/                        # Clientes compartidos (Supabase, fetchers, etc.)
```

---

## 4. Componibilidad y Diseño de Componentes

1. **Evitar Prop Drilling Profundo**: Utilizar composición de componentes (`children`, patrón *Slot* o context específico de la feature) en lugar de pasar 8 props a través de 4 capas intermedias.
2. **Interfaces de Props Explícitas**:
   - Cada componente debe exportar o definir su interfaz `interface [NombreComponente]Props`.
   - Documentar props opcionales y valores predeterminados explícitos.
3. **Componentes Presentacionales vs Contenedores**:
   - Los componentes visuales deben ser lo más puros posibles: reciben datos y emiten eventos (`onAction`).
   - Los contenedores o Server Components se encargan de la orquestación y obtención de datos.
