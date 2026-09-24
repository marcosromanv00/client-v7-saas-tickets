# ADR 0003: Padrón Dinámico de Acreditación y Verificación de Entradas (Nombre, Cédula, Puesto)

* **Estado**: Aceptado
* **Fecha**: 2026-09-24
* **Decisores**: Antigravity AI, Marcos Román Valverde (Superadmin & Producción)
* **Contexto**: Gran Reapertura Oficial y galas protocolarias del Teatro Municipal de Alajuela

---

## Contexto y Problemática

Para la Gran Reapertura Oficial y funciones con reservaciones previas o listas protocolares, una proporción significativa de los asistentes llega sin boletos digitales o códigos QR en mano. La interfaz previa de "Puerta" estaba exclusivamente orientada al sensor óptico de cámara y la digitación de códigos alfanuméricos cortos.

El personal de recepción y acreditación en la mesa de entrada necesitaba una herramienta ágil, reactiva y enfocada que permitiese localizar de inmediato a los asistentes por Nombre, Cédula o Puesto/Butaca, orientarlos verbalmente con la puerta o pasillo de acceso correcto, y acreditarlos con un solo clic evitando colas en el vestíbulo.

## Criterios de Decisión y Principios de Diseño

1. **Principio Rector UX: Paneles Informativos Comprimidos y No Saturantes**: Todo panel de control o métricas debe presentar la información esencial en formato de alta densidad pero con armonía visual, líneas delgadas y micro-tipografía legible, evitando tarjetas o bloques gigantescos que desplacen el foco de trabajo.
2. **Unificación de Datos**: Integrar tanto los boletos individuales (`tickets`) como las delegaciones de protocolo (`specialGuests`) en una misma lista clasificada.
3. **Búsqueda Instantánea Multi-Criterio**: Reactividad al teclear, tolerante a mayúsculas/minúsculas y tildes, buscando simultáneamente por nombre, cédula (con o sin guiones), puesto (ej. `A-08`) o código.
4. **Orden Inteligente**: Priorizar en primer lugar los asistentes pendientes de ingresar para acelerar el flujo en ventanilla, agrupando al final a quienes ya ingresaron.
5. **Retroalimentación Operativa y Resiliencia**: Acción con 1 clic ("Ingresar"), confirmación inmediata de orientación de sala y ventana de 5 segundos con botón flotante "Deshacer" para corregir clics erróneos.

## Decisiones Adoptadas

1. **Conmutador de Modos en Módulo Puerta**: Se estructuró un selector superior de vistas en `DoorScannerView`:
   - `[📋 Padrón de Acreditación (Nombre / Cédula / Puesto)]` como vista predeterminada.
   - `[📷 Escáner Óptico / QR]` para escaneo con cámara física o sensor óptico.
2. **Modularidad Estricta (<200 Líneas por archivo)**:
   - `AttendeeMetricsBar.tsx`: Barra superior compacta con métricas clave en tiempo real.
   - `AttendeeFilterBar.tsx`: Buscador con atajos `/` y `Esc`, chips de estado y botón "+ In-situ".
   - `AttendeeCard.tsx`: Fila individual con orientación verbal ("Platea Baja • Puerta Izquierda").
   - `QuickAddAttendeeModal.tsx`: Registro rápido de última hora sin salir del módulo.
   - `AttendeeVerificationView.tsx`: Contenedor principal con gestión del toast de deshacer.
   - `attendee-utils.ts`: Lógica pura de normalización, búsqueda, filtrado y orden inteligente testeada mediante TDD.
3. **Mecanismo de Deshacer en Store**: Se incorporó `undoCheckInTicket` en `ticket-store.ts` para restaurar el estado del boleto y liberar la butaca a estado `RESERVED` en caso de error de digitación.

## Consecuencias y Beneficios

* **Eficiencia Operativa**: Reducción drástica del tiempo de verificación en puerta (estimado <3 segundos por asistente).
* **Orientación Inmediata al Ciudadano**: El recepcionista puede indicar con precisión la puerta de entrada (Pares vs Impares / Gradas Balcón) mientras acredita el ingreso.
* **Cero Errores Irreversibles**: El botón "Deshacer" mitiga cualquier toque accidental en pantallas táctiles o ratón.
* **Convivencia Armónica**: Se preserva íntegramente la capacidad de escaneo óptico tradicional en la misma pestaña mediante el conmutador segmentado.
