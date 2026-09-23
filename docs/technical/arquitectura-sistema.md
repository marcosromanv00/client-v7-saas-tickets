# Especificación Técnica de Arquitectura: Sistema de Tiquetería Teatro Municipal

---

## 1. Arquitectura General del Sistema

El sistema implementa una arquitectura desacoplada por dominios de negocio orientada a micro-módulos limpios, con renderizado fluido mediante React 19 y estado local-first reactivo.

```
client-v7-saas-tickets/
├── src/
│   ├── components/layout/       # Componentes cívicos compartidos (CivicHeader, CivicFooter)
│   ├── features/
│   │   ├── admin/               # Capa Administrativa y Monitor de Aforo
│   │   ├── qr-access/           # Capa 2: Acreditación QR, Pase Digital y Lector de Puerta
│   │   ├── seat-reservation/    # Capa 3: Plano Arquitectónico y Selector de Butacas
│   │   ├── taquilla-express/    # Capa 1: Taquilla Rápida por Cédula y Walk-Ins
│   │   └── tickets/             # Dominio Core, Tipos Zod, Layout y Motor Reactivo
│   ├── index.css                # Sistema de Tokens Tailwind CSS v4 (@theme nativo)
│   ├── App.tsx                  # Enrutador de capas de acceso
│   └── main.tsx                 # Bootstrap del cliente
```

---

## 2. Motor Reactivo de Estado Local-First (`ticket-store.ts`)

Para evitar dependencias de servidor en momentos críticos de acceso en sala, el sistema utiliza un motor de almacenamiento local-first reactivo con `useSyncExternalStore` (React 19 Protocolo Zero-Effect):
- **Suscripción Externa Pura**: Los componentes consumen instantáneamente cambios sin provocar cascadas de re-renderizado (`useSyncExternalStore(store.subscribe, store.getSnapshot)`).
- **Persistencia Transaccional**: El estado completo se preserva bajo la clave `tm_theater_state_v1` en `localStorage` con tolerancia a entornos sin DOM (Node / SSR).

---

## 3. Modelo Matemático de Aforo Dinámico (`capacity-calculator.ts`)

El cálculo de aforo en tiempo real contrasta de manera matemática:
$$\text{Capacidad Total} = 190 \quad (\text{Planta Baja: } 120, \text{ Balcón: } 70)$$
$$\text{Pre-Reservas} = N_{\text{tickets\_emitidos}} + \sum \max(0, \text{Cupos\_Protocolo} - \text{Redimidos})$$
$$\text{Ingresados en Sala} = \sum [\text{ticket.checkedIn} = \text{true}]$$
$$\text{Remanente Walk-In} = \max(0, \text{Capacidad Total} - \text{Pre-Reservas})$$

---

## 4. Distribución Espacial de Butacas (`theater-layout.ts`)

- **Planta Baja (120 Butacas)**: 10 Filas (A a J) de 12 asientos cada una, subdivididas por un pasillo central (Asientos 1-6 bloque izquierdo, 7-12 bloque derecho).
- **Segunda Planta / Balcón (70 Butacas)**: 5 Filas (K a O) de 14 asientos cada una, subdivididas por pasillo central (Asientos 1-7 bloque izquierdo, 8-14 bloque derecho).
- **Filas VIP de Protocolo Municipal**: Fila A en Planta Baja y Fila K en Balcón (total 26 butacas reservadas).

---

## 5. Control de Calidad y Pruebas

- **Pruebas Estáticas**: TypeScript estricto con tolerancia cero a `any` (`npm run typecheck`).
- **Pruebas Unitarias**: Vitest (`npm run test`) validando cálculos de aforo, generación de butacas y prevención de duplicados por cédula.
- **Auditoría UX / E2E**: Grabación de sesión interactiva y capturas reales en `docs/user-guide/assets/`.
