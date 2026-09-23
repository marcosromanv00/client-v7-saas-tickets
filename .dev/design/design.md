# Documento de Diseño de UI/UX: Teatro Municipal (Sistema de Tiquetería)

---

## 1. Arquetipo de Referencia y Benchmark en Producción
- **Arquetipo Seleccionado**: Arquetipo 2 (**High-End Editorial & Civic Craft**) fusionado con **Warm Cultural Heritage**.
- **Inspiración y Benchmarking**:
  1. *Théâtre du Châtelet / Opéra National de Paris / Philharmonie*: Composición editorial limpia, tipografía serena y respeto por el patrimonio público.
  2. *Linear / Stripe*: Máxima densidad de información sin saturación visual, micro-interacciones táctiles y transiciones instantáneas.
  3. *Fachada del Teatro Municipal*: Tono azul navy pastel sobrio, molduras neoclásicas, contrastes con latón cálido y marfil arquitectónico.

---

## 2. Paleta de Colores & Psicología Cívica (Regla 60-30-10)

- **Color Dominante (60%) - Lienzo Cívico**:
  - Claro: `#f8fafc` (Slate 50) y blanco puro `#ffffff` en áreas de lectura.
  - Oscuro / Fachada Patrimonial: `#141e2e` (Navy institucional nocturno profundo) y `#1e293b`.
- **Color Secundario / Superficie (30%) - Azul Navy Pastel de Fachada**:
  - `#233858` / `#2d466e` (Azul navy pastel empolvado, representativo de la fachada del teatro).
  - `#e2e8f0` / `#cbd5e1` para bordes sutiles de 1px.
- **Color de Acento Focal (10%) - Latón Escénico / Oro Teatral**:
  - `#c59b27` / `#d4af37` (Latón cepillado de barandas y luces de escenario) para llamados a la acción, butacas seleccionadas e insignias institucionales sobrias.
  - `#10b981` (Esmeralda discreto para estado de tiquetes validados).
  - `#e11d48` (Carmesí teatral para alertas de aforo o butacas ocupadas).

> **Cumplimiento Anti-Slop**:
> - 100% Cero "AI purple" o degradados neón estridentes.
> - Cero `#000000` puro; uso de negros con textura mineral como `#0f172a`.
> - Cumplimiento estricto WCAG AAA en ratios de contraste.

---

## 3. Tipografía & Escala Jerárquica Serena

Para cumplir con la directiva de **Tipografía Serena, Liviana y Aireada** de `anti-slop-ux`:
- **Display & Encabezados**: Familia sans-serif de precisión (`Outfit` o `Geist`) con pesos moderados `400` y `500` (Medium). Límite estricto de peso `600` (Semibold) para titulares. **Prohibido `font-extrabold` (800)**.
- **Acentos Editoriales / Monograma**: Fuente Serif clásica refinada (`Playfair Display` o `Newsreader`) en peso ligero `400` para sellos patrimoniales y citas.
- **Cuerpo y Datos de Taquilla**: Sans-serif neutral con altura de línea amplia (`leading-relaxed`) y números monoespaciados legibles para butacas y cédulas (`font-mono`).

---

## 4. Auditoría y Cumplimiento Anti-Slop UI/UX

- [x] **Zero-Badges**: Ninguna píldora o badge decorativo flotando sin función sobre los encabezados H1/H2.
- [x] **Header Único**: Un solo encabezado consolidado con el escudo municipal, nombre del teatro y navegación limpia; prohibidas las barras superiores accesorias (top-bars).
- [x] **Footer Tradicional a 4 Columnas**:
  1. Identidad Institucional y Acreditación de Cultura Municipal.
  2. Cartelera y Programación de Temporada.
  3. Logística de Sala, Aforo y Protocolos de Acceso.
  4. Sede Física Verificable, Teléfono, Parqueo y Enlace a Waze/Maps.
- [x] **Zero Card-Soup**: En lugar de cuadrículas interminables de tarjetas idénticas, se priorizan layouts asimétricos, listas horizontales escaneables y planos arquitectónicos interactivos.
- [x] **Formularios Ágiles (Máx 3 campos)**: Nombre completo, Número de Cédula y Teléfono/Correo para confirmación de tiquete.

---

## 5. Implementación de las 10 Heurísticas de Nielsen

1. **Visibilidad del Estado**: Monitor de aforo dinámico con barras de capacidad en tiempo real (Disponible vs Reservado vs Ingresado).
2. **Correspondencia con el Mundo Real**: Plano de butacas que reproduce fielmente el escenario al frente, el pasillo central, las filas A-J de Planta Baja y el Balcón Superior.
3. **Control y Libertad**: Botón para cambiar o deseleccionar butacas antes de confirmar; opción de anular o reasignar tiquete en panel administrativo.
4. **Consistencia**: Mismos códigos de color para butacas: Gris (Disponible), Dorado/Latón (Seleccionada), Azul Navy (VIP Protocolo), Pizarra (Ocupada).
5. **Prevención de Errores**: Bloqueo de butacas ya seleccionadas en tiempo real y validación de formato de cédula antes de emitir.
6. **Reconocimiento antes que Recuerdo**: Panel lateral que resume en todo momento: Evento, Hora, Butaca elegida y Zona.
7. **Flexibilidad y Eficiencia**: Modos diferenciados para el ciudadano (reserva pausada con plano) y el acomodador en puerta (escaneo instantáneo o búsqueda por cédula en 2 segundos).
8. **Minimalismo**: Espaciado generoso (`py-16`, `gap-6`), sin ruido visual ni adornos vacíos.
9. **Recuperación de Errores**: Mensajes explicativos con sugerencias inmediatas si el tiquete ya fue usado o si el aforo se llenó.
10. **Ayuda y Estado**: Instrucciones claras de llegada (15 minutos antes de función) impresas directamente en el tiquete digital y en pantalla.
