# Especificación de Requisitos y Contratos del Sistema (SDD)
## Teatro Municipal - Sistema de Tiquetería y Gestión de Aforo
### Módulo: Boletería Presencial, Sugerencia Inteligente de Grupos, Auto-Registro QR, Pantalla de Acomodadores y Corte Web de 20 Minutos

---

## 1. Contexto y Objetivos de Negocio

El Teatro Municipal de Alajuela requiere optimizar la operación presencial para las funciones de la Temporada 2026, estableciendo un protocolo de atención de dos mesas de recepción, personal de sala (acomodadores) y reglas estrictas de corte de aforo:

1. **Corte de Reservaciones Web a 20 Minutos**:
   - A falta de 20 minutos para el inicio de una función, la reserva web pública para usuarios remotos se bloquea automáticamente.
   - La cartelera pública muestra un aviso cívico indicando que las reservas web están cerradas y guía a los interesados a la mesa de registro físico en el teatro.
2. **Mesa 1: Registro Presencial & Walk-in (1 hora antes)**:
   - Atiende a las personas que no reservaron con anticipación.
   - Permite visualizar la **matriz interactiva de butacas** de los 3 niveles del teatro.
   - Incorpora un **Asistente Modal de Distribución Inteligente de Grupos**: el operador coloca la cantidad de asistentes (ej: 4), nombre y cédula del responsable, y el algoritmo sugiere la mejor distribución en sala (priorizando sentarlos juntos en una fila; si no es posible, dividirlos en bloques contiguos balanceados en filas cercanas hacia el frente).
   - El operador puede confirmar la sugerencia directamente o ajustar asientos en la matriz con un clic antes de emitir en lote los boletos con check-in automático.
   - Brinda un botón para proyectar o imprimir el **código QR de Auto-Registro en Mesa** para que los asistentes en fila se registren ellos mismos desde su teléfono si lo prefieren.
3. **Auto-Registro Presencial en Mesa (Vía QR)**:
   - Los ciudadanos escanean el QR físico en la mesa (`?mode=walkin-kiosk` o modal dedicado) y pueden registrarse en el lugar, incluso dentro de los últimos 20 minutos, recibiendo su pase con check-in automático inmediato.
4. **Mesa 2: Verificación Rápida de Reservas Previas**:
   - Opera la vista de **Puerta** (`DoorScannerView`): escaneo óptico de QR y búsqueda por Cédula o Código Rápido de 4 caracteres para acreditar a quienes reservaron con antelación.
5. **Sala: Interfaz de Acomodadores en Tiempo Real**:
   - Nueva vista operativa para los acomodadores dentro de la sala.
   - Muestra un feed en vivo de los espectadores que van ingresando (Nombre, Butacas Asignadas, Nivel/Fila, Hora de Ingreso).
   - Incluye buscador rápido por nombre, cédula o butaca para orientar a asistentes extraviados.
   - Muestra el mapa de sala con estado de ocupación en vivo (Ocupada vs Reservada pendiente vs Libre).
   - Permite marcar opcionalmente al espectador como *"Ubicado / En Asiento"*.
6. **Sincronización en Tiempo Real Multi-Pantalla**:
   - Protocolo de sincronización instantánea entre pestañas y dispositivos mediante `BroadcastChannel("tm_theater_sync")` y listeners de eventos `storage`.

---

## 2. Contratos de Datos y Esquemas Zod

```typescript
import { z } from "zod";
import { ZoneIdSchema, SeatSchema } from "./types";

// Solicitud de Distribución Inteligente de Grupos Walk-in
export const GroupSuggestionRequestSchema = z.object({
  headcount: z.number().int().min(1).max(10),
  citizenName: z.string().min(2, "El nombre debe contener al menos 2 caracteres"),
  citizenId: z.string().min(6, "Cédula o documento debe tener al menos 6 caracteres"),
  zonePreference: ZoneIdSchema.optional(),
});
export type GroupSuggestionRequest = z.infer<typeof GroupSuggestionRequestSchema>;

// Resultado del Algoritmo de Sugerencia
export const GroupSuggestionSubgroupSchema = z.object({
  row: z.string(),
  zone: ZoneIdSchema,
  seats: z.array(SeatSchema),
  description: z.string(),
});
export type GroupSuggestionSubgroup = z.infer<typeof GroupSuggestionSubgroupSchema>;

export const GroupSuggestionResultSchema = z.object({
  requestedCount: z.number(),
  allocatedCount: z.number(),
  isContiguous: z.boolean(),
  subgroups: z.array(GroupSuggestionSubgroupSchema),
  selectedSeatIds: z.array(z.string()),
  explanation: z.string(),
  hasSufficientSeats: z.boolean(),
});
export type GroupSuggestionResult = z.infer<typeof GroupSuggestionResultSchema>;

// Criterio de Corte Temporal
export const CutoffStatusSchema = z.object({
  isWebLocked: z.boolean(),          // true si faltan <= 20 min o ya inició
  isReleaseActive: z.boolean(),      // true si faltan <= 15 min o ya inició
  minutesRemaining: z.number(),      // Minutos hasta la hora del evento
  statusText: z.string(),
});
export type CutoffStatus = z.infer<typeof CutoffStatusSchema>;

// Entrada para el Feed de Acomodadores
export const UsherFeedEntrySchema = z.object({
  ticketId: z.string(),
  citizenName: z.string(),
  citizenId: z.string(),
  seatId: z.string().nullable(),
  seatLabel: z.string().nullable(),
  zone: ZoneIdSchema,
  checkedInAt: z.string(),
  isSeated: z.boolean().default(false),
  seatedAt: z.string().nullable().default(null),
});
export type UsherFeedEntry = z.infer<typeof UsherFeedEntrySchema>;
```

---

## 3. Algoritmos Puros y Reglas de Negocio

### 3.1. Algoritmo de Corte Temporal de 20 Minutos (`isWebBookingLocked`)
```typescript
/**
 * Evalúa si faltan 20 minutos o menos para una función.
 * Si retorna true, la boletería web pública no permite nuevas reservas remotas.
 */
export function evaluateEventCutoff(
  eventDate: string,
  eventTime: string,
  cutoffMinutes: number = 20,
  currentTime: Date = new Date()
): CutoffStatus {
  const [hours, minutes] = eventTime.split(":").map(Number);
  const [year, month, day] = eventDate.split("-").map(Number);
  const eventStart = new Date(year, month - 1, day, hours, minutes, 0);

  const diffMs = eventStart.getTime() - currentTime.getTime();
  const minutesRemaining = Math.floor(diffMs / (60 * 1000));

  const isWebLocked = minutesRemaining <= cutoffMinutes;
  const isReleaseActive = minutesRemaining <= 15;

  let statusText = "Boletería Web Abierta";
  if (minutesRemaining <= 0) {
    statusText = "Función Iniciada";
  } else if (isReleaseActive) {
    statusText = "Butacas Liberadas en Taquilla (A falta de 15 min)";
  } else if (isWebLocked) {
    statusText = "Boletería Web Cerrada (Solicite en Taquilla Física)";
  }

  return {
    isWebLocked,
    isReleaseActive,
    minutesRemaining,
    statusText,
  };
}
```

### 3.2. Algoritmo de Sugerencia Inteligente de Grupos (`suggestGroupSeating`)
1. **Filtrado**: Identificar butacas en estado `AVAILABLE`.
2. **Prioridad de Filas**:
   - Nivel 1 Platea Baja: Filas A $\to$ B $\to$ C $\to$ D.
   - Nivel 2 Nivel Medio: Filas E $\to$ F $\to$ G $\to$ H $\to$ I $\to$ J.
   - Nivel 3 Balcón Alto: Filas K $\to$ L $\to$ M $\to$ N $\to$ O.
3. **Fase A (Bloque Contiguo Total)**:
   - Buscar en cada fila si existen $K$ asientos con números consecutivos contiguos libres (ej. B-05, B-06, B-07, B-08).
   - Si se encuentra, retornar el bloque más cercano al proscenio.
4. **Fase B (Partición Balanceada en Filas Cercanas)**:
   - Si no caben juntos en una sola fila, dividir $K$ en particiones óptimas contiguas (ej. para 4 personas: $2 + 2$; para 5: $3 + 2$; para 6: $3 + 3$).
   - Asignar los subgrupos en las filas disponibles más cercanas posibles hacia el frente.
5. **Fase C (Reserva Asistida)**:
   - Si la disponibilidad es muy dispersa, tomar las mejores $K$ butacas individuales ordenadas por jerarquía.

---

## 4. Casos Borde y Manejo de Errores

| Caso Borde | Comportamiento Esperado |
| :--- | :--- |
| **Aforo remanente menor al grupo** | Si el usuario pide 4 butacas y solo quedan 2 libres en toda la sala, el modal alerta de inmediato: *"Aforo insuficiente: solo restan 2 butacas libres"*, sugiriendo asignar las 2 disponibles. |
| **Intento de reserva web a falta de 19 minutos** | El botón de selección de butacas se desactiva en la cartelera web con una insignia ámbar *"Boletería Web Cerrada"* y un banner explicativo hacia la mesa física. |
| **Auto-registro QR en mesa dentro de los 20 minutos** | El parámetro de URL `?mode=walkin-kiosk` desactiva la restricción de 20 minutos, emitiendo boletos walk-in y marcándolos con check-in inmediato. |
| **Asistente cambia de parecer en ventanilla** | Tras generarse la sugerencia en el modal, las butacas se destacan en la matriz; el operador puede deseleccionar una y marcar otra butaca disponible en la matriz antes de pulsar *"Emitir Boletos"*. |
| **Concurrencia entre Mesa 1 y Mesa 2** | La sincronización por `BroadcastChannel` actualiza el estado de butacas y tickets en menos de 50ms entre pantallas abiertas, evitando dobles asignaciones. |

---

## 5. Criterios de Aceptación (Given-When-Then / Gherkin)

### Escenario 1: Bloqueo de 20 Minutos en Cartelera Web
- **Given** una obra programada para las 19:00 horas del día de hoy.
- **When** el reloj del sistema o simulador marca las 18:41 (a 19 minutos del inicio).
- **Then** el selector de horario en la cartelera web muestra la insignia *"Boletería Web Cerrada (a menos de 20 min)"*.
- **And** el botón de continuar a selección de butacas queda bloqueado con un mensaje cívico orientando a la taquilla física del teatro.

### Escenario 2: Sugerencia Inteligente de Asientos Contiguos en la Misma Fila
- **Given** la función activa tiene disponibles las butacas B-05, B-06, B-07, B-08 en Platea Baja.
- **When** el operador de taquilla abre el modal de grupos, ingresa 4 personas, nombre *"Carlos Murillo"* y cédula *"1-0987-0654"*.
- **Then** el modal sugiere un bloque único: *"4 personas juntas en Platea Baja (Fila B: 05, 06, 07, 08)"*.
- **And** al confirmar, se emiten 4 boletos con check-in automático y se actualiza la matriz a estado `OCCUPIED`.

### Escenario 3: Partición Balanceada en Filas Cercanas cuando no caben juntos
- **Given** no existe ninguna fila con 4 asientos libres juntos, pero hay 2 asientos libres en fila C y 2 en fila D.
- **When** el operador solicita sugerencia para 4 personas.
- **Then** el algoritmo sugiere: *"Subgrupo 1: 2 personas en Fila C (C-03, C-04) • Subgrupo 2: 2 personas en Fila D (D-03, D-04)"*.
- **And** el operador puede ajustar visualmente o confirmar la sugerencia.

### Escenario 4: Monitoreo en Vivo para Acomodadores
- **Given** un acomodador con la vista "Acomodadores (Sala)" abierta.
- **When** se registra un nuevo asistente o grupo en la mesa de taquilla o puerta.
- **Then** la lista de acomodadores se actualiza en tiempo real mostrando el nombre del titular y las butacas asignadas con un pulso visual animado.
- **And** el acomodador puede pulsar *"Marcar como Ubicado"* para registrar que los asistentes ya tomaron sus asientos.
