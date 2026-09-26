# ADR 0005: Persistencia de Vista Activa, Menú Bento Móvil para Administradores y Selector Dinámico de Color de Brazaletes

## Estado
Aceptado

## Contexto
Durante las operaciones de gala y funciones masivas de orden de llegada (como la del Sábado 26 con Pato Barraza y Gazel):
1. **Pérdida de Vista Activa en Recarga**: Cuando los operadores o administradores en dispositivos móviles refrescaban la página (pull-to-refresh o recarga accidental), la aplicación se reiniciaba forzosamente a la cartelera pública (`public`), obligándolos a re-navegar hacia el módulo de puerta o taquilla.
2. **Acceso Táctil para Administradores en Móvil**: En pantallas móviles, los administradores necesitaban un menú centralizado y ergonómico tipo Bento en la pantalla principal para saltar en 1 tap a Puerta (contador de aforo), Taquilla Express, Sala (acomodadores) o Configuración de Aforo.
3. **Cambio de Color de Brazalete en Caliente**: Por contingencias físicas en taquilla/puerta (ej. agotamiento de un rollo de brazaletes verde neón o necesidad de cambiar a naranja/azul), el personal debe poder alterar el color oficial autorizado en cualquier momento, replicándose de inmediato en todas las terminales en tiempo real.

## Decisiones

1. **Persistencia de Vista Activa (`tm_active_tab` & URL Hash)**:
   - Se implementó sincronización bidireccional entre `localStorage.getItem("tm_active_tab")`, `window.location.hash` y el estado reactivo en `App.tsx`.
   - Las recargas del navegador mantienen exactamente la vista operativa activa (`puerta`, `taquilla`, `sala`, `admin`).
2. **Menú de Botones tipo Bento para Administradores (`AdminMobileBentoMenu.tsx`)**:
   - Componente modular visible exclusivamente para roles de personal (`isSuperAdmin`, `isProducer`, `isStaff`) en vista móvil (`md:hidden`).
   - Cuadrícula Bento de alta jerarquía visual que muestra métricas en vivo (conteo entregado / aforo total / cupos disponibles) y navegación rápida hacia cada módulo operativo.
3. **Selector y Modificador Dinámico de Color de Brazalete (`BraceletColorPickerModal.tsx`)**:
   - Badge interactivo en la cabecera de puerta (`BraceletHeaderBanner.tsx`) que abre un modal con catálogo Tyvek oficial ampliado (Verde Neón, Azul Rey, Naranja Neón, Amarillo Fluo, Morado Gala, Rojo Carmesí, Plateado, Negro) y soporte para colores personalizados.
   - Actualización mediante `store.setEventBraceletColor(eventId, color)` que notifica vía `BroadcastChannel` y evento `storage`.
4. **Preservación de Personalizaciones en `loadInitialState`**:
   - Se ajustó `initial-state.ts` para fusionar las propiedades personalizadas de los eventos guardados en `localStorage` (color de brazalete, modo, habilitación de registro) en lugar de sobrescribirlos ciegamente.

## Consecuencias
- **Positivas**: Cero pérdida de contexto en recargas móviles; velocidad de conmutación táctil extrema para supervisores; flexibilidad inmediata ante cambios imprevistos de suministros de brazaletes físicos.
- **Riesgos Mitigados**: Se evitó la desincronización de colores entre puertas secundarias y acomodadores gracias a la replicación en tiempo real.
