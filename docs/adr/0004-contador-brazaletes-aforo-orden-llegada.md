# ADR 0004: Contador Táctil de Brazaletes Físicos y Control de Aforo por Orden de Llegada

* **Estado**: Aceptado
* **Fecha**: 2026-09-26
* **Decisores**: Antigravity AI, Marcos Román Valverde (Superadmin & Producción)
* **Contexto**: Función del Sábado 26 de Septiembre (Pato Barraza y Gazel) y eventos de Aforo General

---

## Contexto y Problemática

Para funciones con modalidad de **Aforo General por Orden de Llegada** (como el concierto de Pato Barraza y Gazel del Sábado 26 de Septiembre), la operativa del Teatro Municipal de Alajuela no requiere asignación de butacas numeradas ni búsqueda de reservaciones o padrón en listas. La dinámica consiste exclusivamente en la colocación de un brazalete físico autorizado en la muñeca del espectador y el control riguroso de la capacidad máxima de la sala (220 butacas).

El personal de acreditación en puerta necesitaba un clicker digital ultra-rápido, ergonómico y táctil, desprovisto de formularios de búsqueda o listas que interfieran con la velocidad de acceso, con sincronización instantánea multi-pantalla y alertas visuales de ocupación.

## Decisiones Adoptadas

1. **Pantalla 100% Dedicada sin Distracciones para Aforo General**:
   - En eventos configurados como `GENERAL_ADMISSION`, el módulo de [**Puerta**](file:///src/features/qr-access/DoorScannerView.tsx) despliega directamente el clicker de brazaletes, suprimiendo buscadores, listas y pestañas innecesarias.
2. **Clicker Táctil Ergonómico con Respuesta Háptica**:
   - Botón central gigante `Entregar +1 Brazalete` con retroalimentación vibratoria en dispositivos móviles (`navigator.vibrate`).
   - Botones rápidos para lotes grupales: `+2 Pareja`, `+3 Trío`, `+4 Familia`, `+5 Grupo`.
   - Botón de corrección inmediata `Deshacer (-1)` y reinicio seguro `Reiniciar a 0` con confirmación de dos pasos.
3. **Semáforo y Alertas de Aforo**:
   - 🟢 Verde: Acceso fluido (0% a 79%).
   - 🟡 Ámbar: Últimos cupos ($\ge$ 80% o $\le$ 25 butacas libres).
   - 🔴 Rojo: Aforo completo (220/220), con bloqueo de botones de suma para prevenir sobrecupo.
4. **Sincronización en Tiempo Real Multi-Pestaña**:
   - Sincronización a través de `BroadcastChannel("tm_theater_sync")` y listeners del evento `storage` en `STORAGE_KEY`. Los ingresos registrados en puerta se reflejan instantáneamente en las consolas de Acomodadores y Taquilla.
5. **Modularidad y Arquitectura Limpia (<200 LOC)**:
   - Toda la lógica reside en submódulos desacoplados en `src/features/bracelet-counter/` con cobertura de pruebas unitarias al 100%.

## Consecuencias y Beneficios

* **Velocidad Extrema de Entrada**: Registro en menos de 1 segundo por persona o grupo en puerta.
* **Cero Confusión para el Operador**: Cero campos de texto o listas irrelevantes en la pantalla de acceso.
* **Seguridad y Trazabilidad**: Bloqueo automático ante aforo lleno e historial con marcas de tiempo auditables.
