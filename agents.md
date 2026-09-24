# Teatro Municipal - Sistema Integral de Tiquetería y Gestión de Aforo

## 1. Identidad del Proyecto
- **Nombre**: Teatro Municipal - Sistema de Tiquetería Cívica & Gestión de Aforo
- **Taxonomía de Repositorio**: `client-v7-saas-tickets`
- **Prefijo de Datos / Namespace**: `tm_`
- **Arquetipo de Diseño**: High-End Civic Craft & Warm Cultural Heritage
- **Tipografía Oficial**: **Plus Jakarta Sans** (tipografía primaria: fresca, legible, de trazo limpio que evita fatiga ocular) + **JetBrains Mono** (códigos de butaca, horas y boletos).
- **Paleta Oficial Municipalidad & Teatro de Alajuela**:
  - **Teatro Municipal**: Azul Fachada Histórica (`#004ea2`), Azul Butacas Noche (`#040b17`), Oro Escénico de Proscenio (`#c59223`).
  - **Municipalidad de Alajuela**: Rojo Carmesí Institucional (`#c8102e`), Blanco Arquitectónico (`#ffffff`), Neutros Slate (`slate-50` a `slate-900`).
  - *Prohibición estricta de tonos vino ajenos (`#6d174f`), morados genéricos o negros puros `#000000`.*
- **Sistema de Modos Dual (Claro por Defecto + Oscuro)**:
  - **Modo Claro (Por Defecto)**: Fondo cívico luminoso `bg-slate-50`, tarjetas en blanco puro `bg-white`, textos de alto contraste `text-slate-900`.
  - **Modo Oscuro (Conmutable)**: Switch interactivo Sol/Luna en cabecera (`ThemeToggle`), fondo nocturno `#040b17`, tarjetas `#0b1a30`, bordes `#1e355b`.
  - Persistencia reactiva inmediata en `localStorage` (`tm_civic_theme`).

## 2. Stack Tecnológico & Guardarraíles
- **Frontend Core**: React 19 + TypeScript (Strict Zero-Any) + Vite
- **Estilos**: Tailwind CSS v4 canónico (cero arbitrarios `[]`, variables de `@theme` nativas en CSS)
- **Validación de Datos**: Zod 3.x (validación estricta en fronteras de entrada y almacenamiento)
- **Tiquetería & QR**: Generación de códigos QR vectoriales + escaneo óptico e interactivo
- **Persistencia**: Local-first reactiva tipada con inicialización de datos cívicos y eventos reales
- **Testing**: Vitest (Unit/Lógica de negocio y aforos) + Playwright (Simulación E2E de flujos de usuario y auditoría UX)

## 3. Las Tres Capas de Acceso y Gestión
1. **Capa 1: Taquilla Rápida / CRUD Minimalista por Cédula**:
   - Registro express en puerta y taquilla física.
   - Búsqueda instantánea por cédula para check-in o emisión inmediata con 1 clic.
2. **Capa 2: Acreditación y Validación con Código QR**:
   - Generación de pase digital de entrada con QR seguro.
   - Scanner de cámara en tiempo real para acomodadores en puerta y validación manual con feedback sensorial.
3. **Capa 3: Reserva Previa con Selección Arquitectónica de 3 Niveles**:
   - Vista de sala interactiva con los **3 niveles reales del Teatro Municipal (220 butacas oficiales)**:
     - **Nivel 1: Platea Baja (62 butacas)**: Filas A-D directamente frente al escenario (Fila A Protocolo VIP de 14 asientos + Filas B, C, D de 16 asientos).
     - **Pasarela de Descanso & Acceso Izquierdo (Lobby)**: Acceso principal al teatro ingresando por la izquierda del edificio desde el pasillo del lobby con vista frontal directa al escenario, conectando con el descanso central y las gradas de ascenso al Nivel Medio.
     - **Nivel 2: Nivel Medio (96 butacas)**: Filas E-J (6 filas de 16 asientos) ubicadas en la gradería media elevada.
     - **Nivel 3: Balcón Superior (62 butacas)**: Filas K-O (4 filas centradas de 12 butacas + 1 fila posterior de 14 butacas).
   - Selector inmediato de niveles en cabecera del mapa (`Todos (220)`, `Nivel 1: Platea (62)`, `Nivel 2: Medio (96)`, `Nivel 3: Balcón (62)`).
   - Orientación ergonómica invertida de butacas (cojín hacia el escenario) con espaciado continuo.
   - Flujo de reserva como App Nativa: stepper superior de 4 fases y supresión del footer durante la compra.

## 4. Base de Datos Oficial de Eventos (Fuente de Verdad Excel `.dev/teatro/`)
- Base de datos extraída y normalizada a partir de `AGENDA TEATRO  MUNICIPAL.xlsx`:
  - **Gran Reapertura Oficial (Viernes 25 Septiembre 2026 - 19:15)**: *Único evento completamente privado*. Función de honor con el Coro del Conservatorio, Manuel Obregón, Tapao Vargas y Sonia Bruno. Acceso exclusivo por invitación directa y lista de protocolo institucional.
  - **Temporada Teatral y Cartelera Pública 2026 (15 producciones abiertas)**:
    - Pato Barraza y Gazel (Sáb 26 Sept)
    - Escats en Concierto (Dom 27 Sept)
    - El Ropero de Elvirilla (Sáb 3 Oct)
    - Bernardo Quesada - El Eco de las Maderas (Dom 4 Oct)
    - Tótem - Una Sola Voz (Sáb 10 Oct)
    - Marta Fonseca & Suite Doble (Dom 11 Oct)
    - Gran Final Festival de la Canción (Sáb 17 Oct)
    - Humberto Vargas - Dilo de Una Vez (Dom 18 Oct)
    - Las del Abaniko - El Calor Es Lo De Menos (24-25 Oct)
    - Festival de Danzas de las Culturas (31 Oct - 1 Nov)
    - Ecos Escénicos - Etiquetas Para Romper Mandatos (7-8 Nov)
    - Éditus en Concierto (Dom 15 Nov)
    - Terruño Espressivo - Un Cuento de Navidad (Dom 29 Nov)
    - Cascabeles y Bellotas (12-13 Dic)
    - Agentes Secretos de Santa (19-20 Dic)
  - Cada evento cuenta con su aforo de 220 butacas, selector de fechas y horarios derivados del calendario oficial.

## 5. Capa Administrativa y Monitor en Tiempo Real
- Panel privado para administradores y equipo de protocolo del teatro.
- **Diseñador Interactivo de Matriz de Butacas**:
  - Editor visual para pintar y reconfigurar la sala por nivel (Platea Baja, Nivel Medio y Balcón Superior).
  - Pinceles activos: Butaca numerada, Protocolo VIP, y Pasillo / Espacio vacío.
  - Numeración automática secuencial por fila respetando pasillos.
  - Botón de carga rápida de la distribución oficial del Teatro Municipal (220 butacas: 62 + 96 + 62).
- Habilitación/deshabilitación manual de registros por evento.
- Precarga de lista especial de invitados (nombre vs cédula o cupos reservados sin nombre).
- Monitor de Aforo Dinámico que contrasta en tiempo real:
  - Capacidad máxima oficial (220)
  - Pre-registros / Reservas confirmadas
  - Asistentes efectivamente ingresados en sala (Check-in)
  - Espacio remanente para personas que llegan en el momento (Walk-ins).

## 6. Reglas Inviolables
- Máximo 200 líneas por archivo / componente (`02-clean-code.md`).
- Protocolo Zero-Effect en React 19 (`03-react19-nextjs.md`).
- Zero-any en TypeScript (`04-typescript-standards.md`).
- Sistema Canónico Tailwind CSS v4 (`05-tailwind-v4.md`).
- Cumplimiento de la regla `/anti-slop-ux`: cero badges decorativos, tipografía serena y aireada, footer tradicional de 4 columnas, cero card soup.
