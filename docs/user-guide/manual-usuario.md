# Manual de Usuario: Sistema Cívico de Tiquetería y Gestión de Aforo
## Teatro Municipal • Dark Luxury Edition

Este manual ilustrado documenta la operación de las tres capas de acceso ciudadano y la consola de la productora del Teatro Municipal, rediseñadas con el estándar estético **Dark Luxury Cinema & Theater** y arquitectura UX Mobile-First y Panorámica de Escritorio.

---

## 1. Experiencia Ciudadana Móvil: Cartelera, Detalle y Horarios

Los ciudadanos acceden desde su smartphone a una interfaz cinematográfica oscura inmersiva (Azul Medianoche `#0a0f1d` y acentos dorados cálidos `#f59e0b`):

![Cartelera y Detalle en Móvil](./assets/01-mobile-cartelera-detail.png)

### Flujo de Selección:
1. **Carrusel de Obras**: Miniaturas en carrusel horizontal para alternar entre obras de la temporada.
2. **Tarjeta Hero con Sinopsis**: Póster teatral de alta definición, género de la obra (*Teatro Clásico*, *Danza Contemporánea*, etc.) y sinopsis cultural.
3. **Selector de Fecha y Hora**: Tarjetas de calendario horizontal (Día de la semana + Fecha) y píldoras de hora de función (ej. `19:00 hrs`).
4. **Botón Principal**: Al presionar *"Continuar a Selección de Butacas"*, el usuario avanza a la pantalla de selección de asientos.

---

## 2. Mapa 3D de Butacas y Arco de Proscenio Iluminado

La pantalla de butacas replica la experiencia visual de las aplicaciones de cine más sofisticadas, adaptada a la arquitectura del Teatro Municipal (190 asientos totales):

![Selección de Butacas en Móvil](./assets/02-mobile-seat-selection.png)

### Elementos del Mapa:
- **Arco de Proscenio**: Arco curvo con resplandor dorado escénico (*ESCENARIO PRINCIPAL • TEATRO MUNICIPAL*).
- **Selector de Nivel**: Pestañas táctiles para alternar entre **Platea (120 butacas)** y **Balcón (70 butacas)**.
- **Modelado 3D de Butacas**: Sillones esculpidos con respaldo, cojín y apoyabrazos:
  - *Gris grafito*: Butaca libre disponible.
  - *Rosa/Magenta*: Butaca ocupada.
  - *Dorado/Turquesa resplandeciente*: Butaca seleccionada por el usuario.
  - *Borde dorado + Icono Corona*: Fila VIP / Protocolo (Filas A y K).
- **Gaveta Inferior de Reserva**: Resumen del asiento seleccionado y formulario de acreditación inmediata (Nombre, Cédula y Teléfono).

---

## 3. Pase Físico Troquelado (Notched Cinema Ticket Pass)

Al confirmar la reserva, se despliega el tiquete digital con morfología de boleto físico tradicional:

![Pase Físico Troquelado](./assets/03-notched-cinema-ticket.png)

### Anatomía del Boleto:
- **Muescas Circulares Laterales**: Ranuras cóncavas simétricas que simulan el corte troquelado de imprenta.
- **Cabecera Artística**: Póster oficial de la obra, monograma del Teatro Municipal e indicador *"Pase Válido"*.
- **Línea Punteada de Desprendimiento**: Separación visual del talón de entrada.
- **Doble Validación Cívica**:
  - **Código QR vectorial de alta densidad**: Para lectura instantánea mediante el escáner de cámara en puerta.
  - **Código de Barras alfanumérico**: Compatible con pistolas láser USB de ventanilla.
- **Acciones Rápidas**: Botón para *"Compartir Tiquete"* vía WhatsApp/Mensajería y *"Guardar PDF"*.

---

## 4. Experiencia Panorámica para Productora y Dirección (Escritorio)

Cuando el equipo de producción o dirección abre el sistema desde su computadora, la interfaz se expande a un diseño panorámico de 3 columnas simultáneas:

![Diseño Panorámico en Escritorio](./assets/04-desktop-panoramic-view.png)

- **Columna Izquierda (4 columnas)**: Póster en gran formato, sinopsis de la obra y selector de fechas/horarios.
- **Columna Central (5 columnas)**: Plano completo de la sala con el proscenio dorado y las butacas en tiempo real.
- **Columna Derecha (3 columnas)**: Panel flotante sticky con el resumen del boleto y formulario de emisión.
- **Barra de Navegación Superior**: Acceso directo con un solo clic a *Cartelera y Butacas*, *Taquilla Express*, *Lector en Puerta* y *Productora & Aforo*.

---

## 5. Consola Administrativa de Producción y Monitor de Aforo

![Consola Productora y Aforo](./assets/05-productora-admin-console.png)

### Control Integral de Sala:
1. **Monitor de Aforo Dinámico**: Visualización en vivo de aforo total (190), cupos pre-reservados, asistentes en sala y entradas walk-in remanentes.
2. **Invitados Especiales y Protocolo**: Gestión de delegaciones (Alcaldía, Concejo, etc.) y emisión de pases VIP para filas A y K.
3. **Parámetros de Evento**: Conmutación entre modo de *Butacas Numeradas* y *Aforo General por Orden de Llegada*, habilitación/pausa de registros.
