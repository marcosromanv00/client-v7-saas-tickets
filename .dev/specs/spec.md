# Especificación de Requisitos y Contratos del Sistema (SDD)
## Teatro Municipal - Sistema de Tiquetería y Gestión de Aforo

---

## 1. Contexto y Objetivo de Negocio

El Teatro Municipal es un espacio cívico patrimonial con capacidad aproximada para **190 espectadores**:
- **Planta Baja (Platea)**: 120 butacas distribuidas en 10 filas (A a J) con pasillo central.
- **Segunda Planta (Balcón / Anfiteatro)**: 70 butacas distribuidas en 5 filas (K a O) con vista panorámica.

Los eventos del teatro son gratuitos y de interés cultural, pero requieren un estricto control de aforo para garantizar la seguridad humana, el cumplimiento de protocolos institucionales y la satisfacción del público. 

### Necesidad Operativa
El sistema debe resolver simultáneamente tres modalidades de acceso y una capa administrativa de control:
1. **Capa 1 (Ventanilla / Taquilla Rápida)**: Registro e ingreso inmediato por número de cédula en un flujo minimalista y sin fricción para adultos mayores o taquilla presencial de último minuto.
2. **Capa 2 (Acreditación con QR)**: Registro ciudadano con generación de tiquete digital que porta un código QR único verificable por la cámara o lector de los acomodadores en puerta.
3. **Capa 3 (Reserva con Selección de Butacas)**: Experiencia digital inmersiva tipo sala de cine que renderiza el plano arquitectónico del teatro, permitiendo reservar asientos específicos o gestionar aforo general según la configuración del evento.
4. **Capa Administrativa & Protocolo**: Habilitación manual de registros, reserva de filas VIP (filas A y K para autoridades e invitados especiales), precarga de listas cerradas (como la gala inaugural privada del viernes 25 a las 7:00 PM) y monitor de aforo dinámico en tiempo real que contrasta pre-reservas con personas que llegan en taquilla.

---

## 2. Modelo de Datos y Contratos de Tipado (Zod & TypeScript)

```typescript
import { z } from "zod";

// Tipos de Evento y Modalidades
export const EventModeSchema = z.enum(["SEATED_NUMBERED", "GENERAL_ADMISSION"]);
export type EventMode = z.infer<typeof EventModeSchema>;

export const EventStatusSchema = z.enum(["DRAFT", "ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"]);
export type EventStatus = z.infer<typeof EventStatusSchema>;

export const ZoneIdSchema = z.enum(["PLANTA_BAJA", "BALCON"]);
export type ZoneId = z.infer<typeof ZoneIdSchema>;

// Butaca Individual
export const SeatSchema = z.object({
  id: z.string(), // Ej: "PB-A-01"
  zone: ZoneIdSchema,
  row: z.string(), // "A", "B", ...
  number: z.number().int().positive(),
  isVip: z.boolean().default(false),
  status: z.enum(["AVAILABLE", "RESERVED", "OCCUPIED", "BLOCKED"]).default("AVAILABLE"),
});
export type Seat = z.infer<typeof SeatSchema>;

// Tiquete emitido
export const TicketSchema = z.object({
  id: z.string().uuid(),
  eventId: z.string(),
  citizenName: z.string().min(2, "El nombre debe contener al menos 2 caracteres"),
  citizenId: z.string().regex(/^[0-9A-Za-z-]{6,15}$/, "Cédula o documento de identidad no válido"),
  seatId: z.string().nullable(), // Null si es aforo general
  seatLabel: z.string().nullable(), // "Platea A-04" o null
  zone: ZoneIdSchema,
  qrCodeValue: z.string(),
  isVipGuest: z.boolean().default(false),
  checkedIn: z.boolean().default(false),
  checkedInAt: z.string().nullable(),
  createdAt: z.string(),
});
export type Ticket = z.infer<typeof TicketSchema>;

// Entrada en Lista de Invitados Especiales
export const SpecialGuestEntrySchema = z.object({
  id: z.string().uuid(),
  eventId: z.string(),
  name: z.string().nullable(), // Puede ser con nombre o cupo anónimo reservado
  citizenId: z.string().nullable(),
  seatId: z.string().nullable(),
  ticketsCount: z.number().int().min(1).default(1),
  notes: z.string().optional(),
  redeemedCount: z.number().int().min(0).default(0),
});
export type SpecialGuestEntry = z.infer<typeof SpecialGuestEntrySchema>;

// Evento Principal
export const TheaterEventSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3),
  tagline: z.string(),
  date: z.string(), // YYYY-MM-DD
  time: z.string(), // HH:MM
  durationMinutes: z.number().int().positive(),
  mode: EventModeSchema,
  status: EventStatusSchema,
  isPrivate: z.boolean().default(false), // Para eventos como la gala del viernes 25
  totalCapacity: z.number().int().default(190),
  plantaBajaCapacity: z.number().int().default(120),
  balconCapacity: z.number().int().default(70),
  vipRowsPlantaBaja: z.array(z.string()).default(["A"]),
  vipRowsBalcon: z.array(z.string()).default(["K"]),
  registrationEnabled: z.boolean().default(true),
  description: z.string(),
});
export type TheaterEvent = z.infer<typeof TheaterEventSchema>;
```

---

## 3. Casos Borde y Manejo de Errores

1. **Intento de Registro Duplicado por Cédula**:
   - Una misma cédula no puede registrar más de un tiquete para el mismo evento a menos que sea una reserva de protocolo autorizada.
   - Mensaje amigable: *"La cédula [X] ya cuenta con un tiquete asignado para este evento. Puede consultar su tiquete existente."*
2. **Aforo Completo (Sold Out)**:
   - Bloqueo instantáneo del formulario público cuando la suma de reservas y asistentes alcanza la capacidad máxima disponible.
   - Activación de aviso visual: *"Aforo de reservas agotado. Asientos remanentes disponibles en taquilla 15 minutos antes de la función por orden de llegada."*
3. **Escaneo de QR Ya Utilizado**:
   - Si un tiquete ya fue validado en puerta, el lector emite alerta visual roja y sonora de advertencia: *"Alerta: Tiquete ya ingresado a las [Hora]. No se permite reingreso."*
4. **Reserva en Filas VIP**:
   - Las filas VIP sólo son accesibles para invitados de la lista especial o asignaciones de protocolo municipal; el público general ve dichas butacas con distintivo de protocolo no seleccionable.
5. **Modo Aforo General vs Modo Numerado**:
   - Si el evento es Aforo General, la reserva asigna zona (Planta Baja o Balcón) sin forzar número de butaca, y muestra el mapa con llenado dinámico por orden de llegada.

---

## 4. Criterios de Aceptación (Given-When-Then)

### Escenario 1: Registro Rápido por Cédula (Capa 1)
- **Given** que el taquillero está en la pantalla de taquilla express,
- **When** ingresa la cédula de un ciudadano y pulsa "Validar / Registrar",
- **Then** el sistema busca si ya existe reserva para marcar check-in en 1 clic, o si no existe, emite un tiquete express al instante e incrementa el contador de ingresados.

### Escenario 2: Ingreso con Escaneo QR en Puerta (Capa 2)
- **Given** que el acomodador enfoca la cámara o simula el escáner del código QR de un tiquete,
- **When** el código es procesado,
- **Then** el sistema valida la firma del tiquete, muestra el nombre, la butaca y la zona, actualiza el estado a "Ingresado" y emite retroalimentación visual inmediata.

### Escenario 3: Selección de Butaca Interactiva (Capa 3)
- **Given** que el ciudadano ingresa a un evento con modalidad numerada,
- **When** navega por el plano interactivo de Planta Baja o Balcón y pulsa sobre una butaca disponible,
- **Then** la butaca se ilumina como seleccionada, se calcula el resumen y al completar sus datos se le genera el tiquete con QR correspondiente a esa ubicación exacta.

### Escenario 4: Auditoría y Control Dinámico de Aforo en Panel Admin
- **Given** que el administrador abre el panel de control de un evento,
- **When** personas van ingresando o registrándose en taquilla,
- **Then** el tablero de aforo actualiza en vivo la proporción entre reservas previas, ingresos en puerta y butacas remanentes disponibles para el público en espera.
