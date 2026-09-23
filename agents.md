# Teatro Municipal - Sistema Integral de Tiquetería y Gestión de Aforo

## 1. Identidad del Proyecto
- **Nombre**: Teatro Municipal - Sistema de Tiquetería Cívica & Gestión de Aforo
- **Taxonomía de Repositorio**: `client-v7-saas-tickets`
- **Prefijo de Datos / Namespace**: `tm_`
- **Arquetipo de Diseño**: High-End Editorial & Civic Craft (Arquetipo 2 / Warm Civic Culture)
- **Paleta de Identidad**: Fachada Azul Navy Pastel del Teatro Municipal (`#1e293b`, `#243c5a`, `#3b597a`, `#f1f5f9`, acentos de latón escénico `#c59b27`)

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
3. **Capa 3: Reserva Previa con Selección Arquitectónica de Butacas**:
   - Vista de sala interactiva estilo cine/teatro con 190 butacas (120 en Planta Baja / Platea y 70 en Balcón Superior).
   - Filas VIP reservadas para protocolo e invitados especiales.
   - Soporte dual: Modo Butacas Numeradas vs Modo Aforo General por orden de llegada con llenado dinámico.

## 4. Capa Administrativa y Monitor en Tiempo Real
- Panel privado para administradores y equipo de protocolo del teatro.
- Habilitación/deshabilitación manual de registros por evento.
- Precarga de lista especial de invitados (nombre vs cédula o cupos reservados sin nombre).
- Monitor de Aforo Dinámico que contrasta en tiempo real:
  - Capacidad máxima (190)
  - Pre-registros / Reservas confirmadas
  - Asistentes efectivamente ingresados en sala (Check-in)
  - Espacio remanente para personas que llegan en el momento (Walk-ins).

## 5. Reglas Inviolables
- Máximo 200 líneas por archivo / componente (`02-clean-code.md`).
- Protocolo Zero-Effect en React 19 (`03-react19-nextjs.md`).
- Zero-any en TypeScript (`04-typescript-standards.md`).
- Sistema Canónico Tailwind CSS v4 (`05-tailwind-v4.md`).
- Cumplimiento de la regla `/anti-slop-ux`: cero badges decorativos, tipografía serena y aireada, footer tradicional de 4 columnas, cero card soup.
