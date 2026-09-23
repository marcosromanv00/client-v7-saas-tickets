# Estándar de Diseño de Clase Mundial, Heurísticas de UX & `design.md`

Este estándar erradica el diseño genérico de IA ("AI slop") y establece las pautas para crear interfaces que compitan al nivel de los productos con mejor UX/UI del mundo (**Linear, Stripe, Apple, Airbnb, Vercel, Supabase, Raycast**).

---

## 1. Los 4 Arquetipos de Diseño de Élite (Benchmarking de Producción)

Todo proyecto o feature debe declarar en su `design.md` a cuál de estos arquetipos se adscribe:

| Arquetipo | Referentes Reales | Características Visuales | Paleta & Materiales |
| :--- | :--- | :--- | :--- |
| **1. Dark Tech Craft** | **Linear, Raycast, Supabase** | Superficies oscuras profundas, bordes de 1px difusos (`border-white/10`), bento grids asimétricos, micro-física táctil en hover/click, números monoespaciados. | Base `#09090b` / `zinc-950`, acentos esmeralda/azul eléctrico/ámbar, sombras teñidas con el color de fondo. |
| **2. High-End Editorial SaaS** | **Stripe, Vercel** | Tipografía protagonista, jerarquía asimétrica (50/50 split), sombras de difusión amplias (`shadow-2xl`), transiciones sedosas, espaciado generoso. | Fondos blancos puros o `#f8fafc` con tipografía de alto contraste `#0f172a`, acentos de marca sutiles (< 80% saturación). |
| **3. Warm Consumer Product** | **Airbnb, Apple** | Tarjetas amplias con bordes redondeados orgánicos (`rounded-2xl` a `rounded-3xl`), micro-animaciones fluidas al interactuar, lenguaje amigable y sin jerga técnica. | Tonos cálidos sutiles (arenas, grises cálidos), acentos corales, contrastes suaves pero accesibles (WCAG AAA). |
| **4. Gaming / Interactive HUD** | **Master Duel, Spotify** | Densidad de información calibrada, tarjetas táctiles coleccionables, contrastes extremos, retroalimentación sonora/visual viva, paneles modulares tipo HUD. | Superficies sólidas oscuras, acentos en rojo combate o verde neón controlado, efectos de foil/brillo en componentes destacados. |

---

## 2. Las 10 Heurísticas de Usabilidad de Nielsen Aplicadas a Código

Toda pantalla o flujo interactivo debe cumplir con las **10 Heurísticas de Jakob Nielsen**:

1. **Visibilidad del Estado del Sistema**:
   - Skeletons animados que coincidan con la forma final del contenido (prohibidos spinners circulares genéricos en medio de la pantalla).
   - Indicadores de carga optimistas en botones (`isPending ? "Guardando..." : "Guardar"`).
   - Badges visuales de filtros activos o cambios sin guardar.
2. **Correspondencia entre el Sistema y el Mundo Real**:
   - Lenguaje humano claro (ej. "Añadir a la baraja" en lugar de "POST /api/deck-cards").
   - Metáforas visuales naturales (tarjetas físicas, carpetas, candados para privado).
3. **Control y Libertad del Usuario**:
   - Acciones destructivas con confirmación o botón de "Deshacer" (*Undo* con Toast temporal).
   - Diálogos y modales cerrables con tecla `Esc` y clic fuera del contenedor.
4. **Consistencia y Estándares**:
   - Misma terminología, tamaño de botones y posición de acciones principales en toda la aplicación.
5. **Prevención de Errores**:
   - Deshabilitar botones de envío si el formulario tiene errores obvios.
   - Restricción de entradas numéricas (máx/mín de cartas).
6. **Reconocimiento antes que Recuerdo**:
   - Opciones visibles y autocompletado en campos de búsqueda.
   - Resumen persistente de selección (ej. contador flotante de cartas 40/60).
7. **Flexibilidad y Eficiencia de Uso**:
   - Atajos de teclado para usuarios avanzados (ej. `Ctrl+K` para buscar).
   - Filtros rápidos por facetas de un solo clic.
8. **Diseño Estético y Minimalista (Regla Anti-Clutter)**:
   - Eliminar elementos decorativos innecesarios. Usar espacio en blanco negativo para agrupar antes que saturar con cajas y bordes.
9. **Ayudar a Reconocer, Diagnosticar y Recuperar de Errores**:
   - Mensajes de error específicos con texto humano (prohibido "Error 500").
   - Proponer una acción de recuperación inmediata (ej. "Reintentar conexión" o "Restablecer filtros").
10. **Ayuda y Documentación**:
    - Tooltips explicativos en iconos técnicos y estados vacíos con llamada a la acción constructiva (*Empty States* atractivos con botón).

---

## 3. Psicología del Color & Armonía Visual (Regla 60-30-10)

1. **Prohibición del "AI Purple"**: Queda estrictamente prohibido utilizar fondos con degradados violeta/morado neón con botones lila brillantes, cliché típico de código generado por IA.
2. **Regla de Proporción 60-30-10**:
   - **60% Color Dominante**: Base neutra (ej. `zinc-950` en oscuro o `slate-50` en claro).
   - **30% Color Secundario/Superficie**: Tarjetas y paneles de soporte (ej. `zinc-900` o blanco puro con borde `slate-200`).
   - **10% Color de Acento Único**: El color focal de la marca (ej. Rojo Carmesí `red-600`, Azul Cobalto o Verde Esmeralda).
3. **Cero Negro Puro**: Nunca uses `#000000`. Utiliza negros con carácter como `#09090b`, `#0b0f17` o `#121214`.
4. **Contraste Accesible (WCAG AAA)**: Textos sobre fondos oscuros deben usar tonos como `text-zinc-100` o `text-slate-200` para títulos y `text-zinc-400` para secundarios.

---

## 4. Combinaciones Tipográficas con Personalidad

Queda prohibido utilizar la tipografía por defecto de navegador o abusar de `Inter` sin estilizar en títulos. Utiliza estos pares tipográficos curados:

| Categoría | Fuente de Títulos (Display) | Fuente de Cuerpo & Datos | Personalidad |
| :--- | :--- | :--- | :--- |
| **Tech & Minimal** | **`Geist`** (`tracking-tight`) | **`Geist Sans` / `Geist Mono`** | Ultra limpia, moderna, de precisión técnica (estilo Vercel/Linear). |
| **Editorial & Craft** | **`Cabinet Grotesk`** | **`Satoshi`** | Sofisticada, con carácter geométrico y alta legibilidad. |
| **Warm & Friendly** | **`Outfit`** | **`Plus Jakarta Sans`** | Acogedora, accesible, moderna para productos B2C y SaaS visuales. |
| **Futuristic / Gaming** | **`Syne`** o **`Chakra Petch`** | **`JetBrains Mono` / `Inter`** | Alta energía, gaming, HUD y estadísticas tácticas. |

---

## 5. Plantilla Obligatoria de `design.md`

Antes de maquetar cualquier interfaz nueva o rediseño sustancial, se debe redactar el archivo `.dev/design/design.md` con esta estructura:

```markdown
# Documento de Diseño de UI/UX: [Nombre del Proyecto/Feature]

## 1. Arquetipo de Referencia y Benchmark en Producción
- **Arquetipo Seleccionado**: [Dark Tech Craft / High-End Editorial / Warm Consumer / Gaming HUD]
- **Sitios Web Reales de Referencia**: 
  1. [Nombre del sitio](URL) - Elemento que inspira: [ej. Bento Grid y transiciones]
  2. [Nombre del sitio](URL) - Elemento que inspira: [ej. Sistema de filtros y tipografía]

## 2. Paleta de Colores & Psicología (Regla 60-30-10)
- **Base (60%)**: `#09090b` (Superficie oscura neutra y sofisticada)
- **Soporte (30%)**: `#18181b` (Tarjetas y paneles elevados con bordes `zinc-800`)
- **Acento (10%)**: `#dc2626` (Rojo carmesí de acción y energía competitiva)

## 3. Tipografía & Escala Jerárquica
- **Display**: [ej. Outfit] - Titulares `text-3xl sm:text-5xl font-bold tracking-tight`
- **Body**: [ej. Plus Jakarta Sans] - Lectura `text-sm sm:text-base leading-relaxed`
- **Mono / Datos**: [ej. JetBrains Mono] - Estadísticas y números `font-mono text-xs font-semibold`

## 4. Cumplimiento de Heurísticas de Nielsen
- [ ] **S1 - Estado**: Skeletons adaptados a la cuadrícula de datos.
- [ ] **S3 - Libertad**: Diálogos con botón de escape y confirmación de borrado.
- [ ] **S6 - Reconocimiento**: Filtros con badges activos y contador persistente.
- [ ] **S8 - Minimalismo**: Espacio negativo generoso sin bordes innecesarios.
- [ ] **S9 - Errores**: Mensajes claros con acción de reintento.

## 5. Micro-Interacciones & Física de Movimiento (Framer Motion)
- Feedback táctil en botones: `whileTap={{ scale: 0.98 }}`.
- Aparición de listas: `staggerChildren: 0.05` con física de resorte (`stiffness: 120, damping: 20`).
- Transiciones entre vistas con `AnimatePresence`.
```

## 6. Integración Obligatoria de Skills Globales de Frontend
Para garantizar interfaces de clase mundial sin clichés de IA, el agente debe consultar y activar:
- `design-taste-frontend`: Directivas anti-slop, baseline de varianza, paletas calibradas y los 5 arquetipos Bento.
- `impeccable`: Suite completa de diseño frontend (`craft`, `shape`, `polish`, `audit`, `bolder`, `quieter`, `distill`, `delight`).
- `framer-motion-animator`: Micro-física continua, resortes y transiciones de layout compartidas.
- `high-end-visual-design` & `gpt-taste`: Espaciado editorial, tipografía con personalidad y eliminación de tarjetas anidadas.
- `tailwind-design-system`: Tokens de diseño y jerarquía cromática estricta.
