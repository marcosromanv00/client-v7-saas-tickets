# Especificación de Requisitos y Contratos del Sistema (SDD)
## Teatro Municipal - Sistema de Tiquetería y Gestión de Aforo
### Módulo: Entradas, Liberación 15 Min, Código Rápido, Brazaletes y Marco Legal

---

## 1. Contexto y Objetivos de Negocio

El Teatro Municipal de Alajuela requiere optimizar la experiencia ciudadana y el control operativo de puerta para la Temporada 2026. Los nuevos requisitos abordan:
1. **Límite de 2 entradas por usuario**: Evitar el acaparamiento y democratizar el acceso cívico mediante validación estricta por Cédula (`citizenId`).
2. **Liberación automática 15 minutos antes de la función**: Toda entrada con butaca asignada no registrada (sin check-in) a falta de 15 minutos para la hora de inicio se libera a favor de los asistentes en espera (walk-ins).
3. **Acomodo Híbrido Inteligente**: Combinación de reserva previa numerada con relleno asistido de sala por orden de llegada (desde la primera fila hacia atrás) para maximizar el aforo efectivo.
4. **Sistema de Brazaletes de 1 Color por Evento**: Cada función maneja un color oficial único (Azul Rey, Plateado, Rojo, Negro, etc.), administrable desde la consola del teatro, garantizando que el personal de puerta entregue y verifique el color correcto evitando reutilizaciones.
5. **Código Rápido de 4 Caracteres (2 letras + 2 dígitos)**: Acceso ultrarrápido sin depender exclusivamente de lectura óptica de cámara, con auto-procesamiento al ingresar los 4 caracteres.
6. **Botón FAB de Verificación**: Acceso instantáneo con 1 clic desde cualquier pantalla del sistema a la consola de validación de puerta.
7. **Marco Legal y Términos Cívicos**: Modal y cláusulas de aceptación obligatoria alineadas con la Ley N° 8968 de Costa Rica y la normativa patrimonial municipal.

---

## 2. Contratos de Datos y Esquemas Zod

```typescript
import { z } from "zod";

// Colores Oficiales de Brazaletes
export const BraceletColorSchema = z.object({
  id: z.string(),
  name: z.string(), // "Azul Rey", "Plateado", "Rojo", "Negro"
  hex: z.string(), // "#004ea2", "#94a3b8", "#c8102e", "#09090b"
  description: z.string(),
});
export type BraceletColor = z.infer<typeof BraceletColorSchema>;

// Estado del Tiquete
export const TicketStatusSchema = z.enum([
  "ACTIVE",             // Emitido y válido para ingresar
  "CHECKED_IN",          // Ingresado a sala
  "RELEASED_NO_SHOW",    // Liberado por inasistencia (15 min antes)
  "CANCELLED",          // Cancelado administrativamente
]);
export type TicketStatus = z.infer<typeof TicketStatusSchema>;

// Tiquete con Código Rápido de 4 Caracteres
export const TicketSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  citizenName: z.string().min(2, "El nombre debe contener al menos 2 caracteres"),
  citizenId: z.string().min(6, "Cédula o documento debe tener al menos 6 caracteres"),
  citizenPhone: z.string().optional(),
  citizenEmail: z.string().email().optional(),
  seatId: z.string().nullable(),
  seatLabel: z.string().nullable(),
  zone: z.enum(["PLATEA_BAJA", "NIVEL_MEDIO", "BALCON_ALTO", "PLANTA_BAJA", "BALCON"]),
  qrCodeValue: z.string(),
  shortCode: z.string().length(4), // Ej: "AL14", "TM08" (2 letras + 2 dígitos)
  isVipGuest: z.boolean().default(false),
  checkedIn: z.boolean().default(false),
  checkedInAt: z.string().nullable().default(null),
  status: TicketStatusSchema.default("ACTIVE"),
  releasedAt: z.string().nullable().default(null),
  createdAt: z.string(),
  notes: z.string().optional(),
});
export type Ticket = z.infer<typeof TicketSchema>;

// Evento de Teatro con Color de Brazalete
export const TheaterEventSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  tagline: z.string(),
  date: z.string(), // YYYY-MM-DD
  time: z.string(), // HH:MM
  durationMinutes: z.number().int().positive(),
  mode: z.enum(["SEATED_NUMBERED", "GENERAL_ADMISSION"]),
  status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"]),
  braceletColorId: z.string().default("azul-rey"), // Enlace a color de brazalete
  braceletColorName: z.string().default("Azul Rey"),
  totalCapacity: z.number().int().default(220),
  registrationEnabled: z.boolean().default(true),
  description: z.string(),
  location: z.string().default("Sala Principal, Teatro Municipal"),
  posterUrl: z.string().optional(),
  genre: z.string().default("Teatro / Artes Escénicas"),
});
export type TheaterEvent = z.infer<typeof TheaterEventSchema>;
```

---

## 3. Casos Borde y Reglas de Negocio

1. **Límite de 2 Entradas por Cédula**:
   - En `Step2SeatSelection`, el arreglo `selectedSeatIds` tiene longitud máxima de 2.
   - En `theaterStore.bookTicket`, se contabilizan los tiquetes existentes (`status !== "RELEASED_NO_SHOW" && status !== "CANCELLED"`). Si `existentes + solicitados > 2`, la transacción falla con error: *"La cédula [X] ya alcanzó el límite máximo de 2 entradas para este evento."*

2. **Corte y Liberación de 15 Minutos**:
   - Regla: Si `(eventStartDateTime - now) <= 15 minutos` y el boleto no tiene `checkedIn === true`, se actualiza su estado a `RELEASED_NO_SHOW` y su butaca pasa inmediatamente a `AVAILABLE`.
   - Si el espectador presenta un boleto liberado en puerta, el lector de acceso muestra el resultado `OUTCOME_RELEASED_NO_SHOW`: *"Entrada liberada por inasistencia (corte a 15 min antes de función). Su butaca fue reasignada."*

3. **Acomodo Híbrido (Relleno desde el Frente)**:
   - Algoritmo de selección: Recorre filas ordenadas prioritariamente:
     1. Nivel 1 (Platea Baja): Fila A -> Fila B -> Fila C -> Fila D.
     2. Nivel 2 (Nivel Medio): Fila E -> F -> G -> H -> I -> J.
     3. Nivel 3 (Balcón): Fila K -> L -> M -> N -> O.
   - Retorna la primera butaca en estado `AVAILABLE` para asignación inmediata de walk-in en taquilla/puerta.

4. **Código Rápido de 4 Caracteres**:
   - Formato: 2 letras mayúsculas [A-Z] + 2 dígitos [0-9] (ej: `AL14`, `TM25`, `CR89`).
   - El verificador de puerta escucha el input manual y, al detectar exactamente 4 caracteres válidos, dispara la validación instantánea sin necesidad de tecla Enter.

5. **FAB de Verificación**:
   - Botón flotante accesible en todas las vistas (`App.tsx`), fija en la esquina inferior derecha (`z-40`), con feedback sensorial y tooltip que redirige de inmediato a la pestaña `puerta`.

6. **Términos y Privacidad (Ley N° 8968)**:
   - Checkbox obligatorio en el checkout: *"He leído y acepto los Términos y Condiciones y la Política de Privacidad de la Municipalidad de Alajuela (Liberación de entradas 15 min antes por inasistencia)."*
   - Modal interactivo cívico consultable en cualquier momento desde el pie de página o desde el enlace del formulario.

---

## 4. Criterios de Aceptación (Given-When-Then)

### Escenario 1: Límite de 2 Entradas por Usuario
- **Given** que un ciudadano reserva en la web pública,
- **When** intenta seleccionar una 3ra butaca en el mapa,
- **Then** el sistema bloquea la selección e indica que el límite cívico es de 2 entradas por persona.

### Escenario 2: Liberación a 15 Minutos y Reasignación Híbrida
- **Given** un tiquete con butaca reservada sin check-in cuando faltan 15 minutos o menos para la función,
- **When** se evalúa el reloj del sistema,
- **Then** el tiquete pasa a "RELEASED_NO_SHOW", la butaca se libera a "AVAILABLE" y el taquillero puede asignarla a un walk-in con la acción "Asignar siguiente mejor butaca".

### Escenario 3: Verificación con Código Rápido de 4 Caracteres
- **Given** que el acomodador en puerta tiene el lector de acceso,
- **When** digita los 4 caracteres ("AL14") sin presionar Enter,
- **Then** el sistema valida el boleto, muestra el color de brazalete correspondiente al evento y confirma el check-in.

### Escenario 4: Botón FAB Persistente
- **Given** que el usuario u operador está en cualquier módulo (Inicio, Taquilla, etc.),
- **When** hace clic en el botón flotante FAB,
- **Then** navega instantáneamente al visor de Control de Acceso y Lector QR.
