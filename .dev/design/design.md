# Documento de Diseño de UI/UX: Teatro Municipal (Rediseño Dark Luxury Cinema)

---

## 1. Arquetipo de Referencia y Benchmarking Visual

- **Arquetipo Seleccionado**: **Dark Luxury Theater & High-End Cinema App** (inspirado en las interfaces móviles de cine premium de referencia internacional: *Cinema Plus+, Apple TV, Linear, Opéra Garnier*).
- **Características Clave**:
  1. **Fondo Midnight Profundo**: `#0a0f1d` y `#111827` con degradados sutiles y scrims fotográficos de alto impacto.
  2. **Arco de Escenario Iluminado**: Proscenio curvo superior con resplandor cálido de latón/oro (`#e5a93c`, `box-shadow: 0 0 25px rgba(229, 169, 60, 0.4)`).
  3. **Butacas Esculpidas (Iconografía 3D de Cine)**: Representación de cojín, reposabrazos y respaldo para cada butaca individual.
  4. **Selector de Fechas por Tarjetas**: Días en tarjetas elevadas (ej. "VIE 25", "SÁB 26") con cápsulas de horario de función (`19:00`).
  5. **Tiquete Físico Troquelado (Notched Ticket Pass)**: Silueta clásica de billete con hendiduras semicirculares laterales, línea punteada de desgarro, portada artística, código QR nítido y código de barras inferior.
  6. **Barra de Navegación Inferior Flotante**: Estilo iOS/Android con acceso rápido a Cartelera, Plano de Butacas, Mis Tiquetes y Conmutador a Consola de Productora/Puerta.

---

## 2. Paleta de Colores & Psicología (Regla 60-30-10)

- **Base Dominante (60%) - Dark Luxury Midnight**:
  - Lienzo: `#0a0f1d` (Azul medianoche abisal)
  - Superficies de Tarjetas / Bottom Sheet: `#11192b` y `#162238` con bordes difusos `border-slate-800/80`
- **Soporte y Contrastes (30%) - Azul Patrimonial & Pizarra Escénica**:
  - Butacas Disponibles: `#1e2b45` con ribete `#334566`
  - Butacas Reservadas: `#2e1b30` / `#4a2238` (Ciruela oscuro teatral)
  - Textos Principales: `#f8fafc` (Blanco tiza de alta legibilidad WCAG AAA)
  - Textos Secundarios: `#94a3b8` (Pizarra suave)
- **Acento Focal (10%) - Latón Escénico / Oro Teatral & Esmeralda**:
  - Acento Principal: `#e5a93c` / `#f59e0b` (Dorado de marquesina teatral y butacas seleccionadas)
  - Resplandor de Proscenio: `rgba(229, 169, 60, 0.5)`
  - Confirmación / Éxito: `#10b981` (Esmeralda para check-in y entradas válidas)

---

## 3. Arquitectura Responsive Híbrida

- **En Dispositivos Móviles**: Experiencia de App Nativa a pantalla completa:
  - Navegación táctil fluida con bottom-sheet deslizable.
  - Conmutador de niveles por pestañas táctiles: **Platea (120 butacas)** y **Balcón Superior (70 butacas)**.
  - Barra de navegación inferior flotante con blur de fondo (`backdrop-blur-md`).
- **En Pantallas de Escritorio (Productora / Computadora)**:
  - Layout panorámico cinematográfico:
    - Columna izquierda: Póster y sinopsis del evento.
    - Columna central: Plano arquitectónico amplio de la sala con escenario iluminado.
    - Columna derecha: Panel de confirmación, cupos y tiquete emitido.
  - Acceso instantáneo a la Consola de la Productora (Monitor de aforo en vivo, taquilla express y precarga de lista especial).
