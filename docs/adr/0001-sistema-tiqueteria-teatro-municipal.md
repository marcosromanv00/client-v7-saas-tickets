# ADR-0001: Arquitectura Frontend, Gestión de Estado Reactivo y Tiquetería del Teatro Municipal

- **Estado**: Aceptado
- **Fecha**: 2026-09-23
- **Decisores**: Equipo de Ingeniería y Diseño Cívico

---

## 1. Contexto & Problema

El Teatro Municipal requiere una plataforma unificada para la gestión de aforos y tiquetes de sus eventos culturales. El sistema debe operar con alta fluidez tanto en conexiones públicas de ciudadanos reservando desde móviles como en dispositivos de acomodadores y personal de puerta que requieren escaneo de códigos QR y búsqueda ultra-rápida por cédula sin latencias ni caídas de servidor.

Además, el teatro cuenta con ~190 butacas divididas entre Planta Baja (120) y Balcón (70), requiriendo un comportamiento dinámico:
- Eventos numerados con selección de butacas tipo cine.
- Eventos de aforo general donde los asientos se asignan por orden de llegada y se visualiza la ocupación de zonas.
- Gestión de filas VIP para protocolo municipal.
- Gala privada inaugural (Viernes 25 a las 7:00 PM) con lista precargada.

---

## 2. Opciones Consideradas

1. **Opción A (Arquitectura SSR Pesada con Base de Datos Remota Única)**:
   - *Descarte*: Riesgo de latencia o fallos de red en el momento crítico de apertura de puertas si la conexión en el vestíbulo del teatro es inestable.
2. **Opción B (SPA React 19 + TypeScript + Tailwind CSS v4 + Motor Reactivo Local-First con Sincronización)**:
   - *Seleccionada*: Renderizado instantáneo, zero hydration mismatch en mapas SVG/Canvas de butacas, lectura de QR por cámara nativa (`MediaStream` / canvas) en el navegador del acomodador, persistencia reactiva y capacidades de validación en milisegundos.

---

## 3. Decisión Tomada

Se adopta **React 19** con **TypeScript estricto (Zero-Any)**, **Tailwind CSS v4** mediante configuración `@theme` nativa, y un **Motor de Estado Reactivo por Dominio** respaldado por validación con **Zod 3.x**.

El sistema se divide en tres capas funcionales complementarias:
1. **Capa 1**: Taquilla rápida / CRUD minimalista por cédula.
2. **Capa 2**: Acreditación con código QR digital y lector de puerta.
3. **Capa 3**: Reserva visual interactiva con plano arquitectónico del teatro.
4. **Capa Admin**: Control de aforo en vivo que contrasta pre-reservas con ingresos efectivos.

---

## 4. Consecuencias

### Positivas
- Tiempos de respuesta inferiores a 10ms en validación de entradas en puerta.
- Experiencia de usuario de nivel internacional, sin dependencias pesadas ni plantillas genéricas.
- Código 100% testeable con pruebas unitarias (Vitest) y pruebas automatizadas E2E de UX (Playwright).
- Escalabilidad lista para conectar con Supabase Postgres mediante los contratos definidos en `spec.md`.

### Negativas / Mitigaciones
- La generación de códigos QR y el plano de 190 butacas requiere optimización del árbol DOM: se resuelve con componentes SVG/Canvas modularizados y límites estrictos de menos de 200 líneas por archivo.
