# ADR 0006: Pantalla Home Bento Editorial, Filtrado de Eventos Próximos y Optimizaciones Móviles Anti-Slop

## Estado
Aceptado

## Contexto
1. **Separación de la Pantalla Principal**: El menú Bento de accesos rápidos requería independizarse de la cartelera de compra pública en una pantalla dedicada (`home`) con dirección de arte editorial y fotografía auténtica del Teatro Municipal.
2. **Ergonomía Móvil y Dock Inferior**: En teléfonos inteligentes, la barra inferior mostraba etiquetas de texto que desbordaban la pantalla horizontalmente. Además, en la vista administrativa no se mantenía accesible el dock de navegación rápida.
3. **Desbordamiento en Selectores de Eventos**: Nombres de obras largos en elementos `<select>` en Puerta, Taquilla y Acomodadores causaban desajustes de layout y scroll horizontal en dispositivos móviles.
4. **Menú Desplegable Móvil en Columnas**: El menú hamburguesa abría los módulos de personal en una cuadrícula de 2 columnas comprimidas que dificultaba la lectura táctil.
5. **Eventos Pasados en Cartelera**: Eventos ya concluidos (ej. Gala del Viernes 25) aparecían en cartelera, generando confusión operativa.

## Decisiones

1. **Pantalla Única de Menú Home Editorial (`AdminHomeMenuView.tsx`)**:
   - Se diseñó una vista centralizada de bienvenida y operaciones con tarjetas Bento inmersivas respaldadas por imágenes arquitectónicas del teatro (`theater-entrance.jpg`, `theater-box-office.jpg`, `gala-inaugural.jpg`, `sinfonica.jpg`, `titeres.jpg`) con scrim degradado WCAG AAA.
   - Cumplimiento de directrices `/anti-slop-ux`: cero insignias artificiales, tipografía serena y espaciado respirable.
2. **Filtrado Dinámico de Funciones Activas (`getUpcomingActiveEvents`)**:
   - Función pura en `event-date-utils.ts` que descarta eventos anteriores a la fecha actual (`date >= today`) y restringe la vista a los próximos 4 eventos oficiales.
3. **Dock Inferior Móvil de Solo Iconos (`BottomNavBar.tsx`)**:
   - Rediseño con touch-targets de 44px centrados en un dock flotante compacto que cabe holgadamente en cualquier pantalla móvil ($< 320\text{px}$).
   - Visible en la vista administrativa y en todos los módulos de personal.
4. **Apertura 100% Vertical del Menú Móvil (`CivicMobileMenu.tsx`)**:
   - Reemplazo de la cuadrícula de 2 columnas por una lista vertical fluida con iconos y badges informativos.
5. **Contención y Truncado de Selectores**:
   - Clases `w-full sm:w-auto min-w-0 max-w-full sm:max-w-xs truncate text-ellipsis overflow-hidden` y formateo de etiquetas en `<option>` a un máximo de 32 caracteres para evitar cualquier scroll horizontal no deseado.

## Consecuencias
- **Positivas**: Interfaz móvil 100% libre de scroll horizontal, navegación táctil instantánea, carteleras limpias y experiencia editorial premium.
