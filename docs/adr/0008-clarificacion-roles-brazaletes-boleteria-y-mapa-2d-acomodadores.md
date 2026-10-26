# ADR 0008: Clarificación de Roles, Flujo Exclusivo de Brazaletes, Boletería Táctil y Mapa 2D de Acomodadores

## Estado
Aceptado

## Fecha
2026-10-26

## Contexto
Durante las operaciones en vivo del Teatro Municipal de Alajuela, se detectó ambigüedad entre los roles de Puerta, Boletería y Acomodador. Adicionalmente:
1. El personal de puerta física realiza un chequeo visual del brazalete en muñeca sin necesidad de interacción con el software.
2. Todo el aforo opera mediante 225 brazaletes entregados dos horas antes del evento.
3. Los acomodadores gestionaban la disponibilidad de butacas de memoria por falta de un mapa directo en pantalla.
4. En boletería se requería control por lotes de suma y resta, y reversión exacta del último input.
5. El plano de sectores requería reflejar la distribución espacial arquitectónica real en 2D.

## Decisiones
1. **Clarificación y Supresión de "Puerta" en Software**: La navegación se enfoca exclusivamente en **Inicio**, **Boletería (Entrega)**, **Acomodadores (Sala)** y **Cartelera**. El filtro físico de puerta no utiliza terminal.
2. **Boletería por Defecto en Entrega de Brazaletes**: `activeTab === "taquilla"` abre directamente el clicker táctil con suma en lote (+1, +2, +3, +5, +10), resta en lote (-1, -2, -3, -5, -10) y reversión dinámica del último input exacto.
3. **Defaults Oficiales del Sistema**:
   - Aforo: 225 butacas.
   - Estilo de Entradas: Estilo Único (Solo Brazalete).
   - Modalidad: Aforo General (Por orden de llegada).
   - Color Oficial de Brazalete: Blanco Puro Oficial (`#ffffff`).
4. **Mapa 2D Arquitectónico de Sala**:
   - Representación en perspectiva 2D del teatro: Escenario frontal, Platea Baja (A-G, 82 butacas), Nivel Medio Izq/Der (69 butacas) y Balcón Superior Izq (0/49) / Der con muesca técnica (0/36).
   - Zoom directo a butacas al hacer clic en cualquier sector.
5. **Alineación Geométrica de Butacas Anclada al Pasillo**:
   - Contenedores flex con anclaje al pasillo central (`justify-end` a la izquierda y `justify-start` a la derecha) para garantizar que el pasillo central sea una línea vertical recta y las columnas de butacas coincidan exactamente con el croquis oficial.

## Consecuencias
- Cero burocracia para acomodadores: abren la vista y ven inmediatamente el plano interactivo.
- Cero desajustes visuales o desalineaciones en la vista detallada de butacas.
- Registro ágil y libre de fatiga en boletería.
- Coherencia total con los Mandamientos de la Constitución (Zero-Effect, Clean Code < 200 líneas).
