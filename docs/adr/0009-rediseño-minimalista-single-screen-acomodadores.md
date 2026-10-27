# ADR 0009: Rediseño Minimalista Single-Screen de Acomodadores y Erradicación de AI Slop

## Estado
Aceptado

## Fecha
2026-10-26

## Contexto
La interfaz de acomodadores presentaba síntomas de sobrecarga visual y diseño genérico ("AI Slop"):
1. Badge decorativo redundante con pulso artificial (`[● En Sala]`).
2. Sopa de etiquetas/pills en la cabecera que en pantallas móviles se desbordaba en múltiples líneas ocupando más de 120px verticales.
3. Doble anidamiento de tarjetas ("Card Soup"): una cabecera pesada y luego el mapa de butacas contenido en otra tarjeta con bordes y sombras densas.
4. Altura total que superaba los 750px en móvil, forzando un scroll constante que entorpecía el trabajo operativo de los acomodadores en sala.

## Decisiones
1. **Ribbon HUD Operativo de Cabecera (< 40px)**:
   - Se eliminan badges decorativos y etiquetas voluminosas.
   - Se implementa una sola franja horizontal con selector de función truncado, dot de color oficial de brazalete, telemetría sintética (`{libres} libres • {sentados} sentados`) y botón de ajustes.
2. **Compactación Arquitectónica del Macro Plano 2D (~230px)**:
   - Rediseño de las tarjetas de sector (`SectorCard`) a pastillas compactas (~54px) de alta densidad táctil.
   - Preservación exacta de la distribución arquitectónica (Balcón Izq/Der con muesca, Nivel Medio Izq/Der con pasillo, Platea Baja y Escenario).
3. **Erradicación de la Card Soup**:
   - Se eliminan los contenedores duplicados; el mapa se integra fluidamente en el flujo visual del HUD.
4. **Micro-Leyenda de Un Solo Renglón (< 18px)**:
   - Sustitución de la caja fija de 50px por una micro-línea tipográfica sobria de estados de butaca.

## Consecuencias
- Toda la experiencia de acomodadores cabe en una sola pantalla móvil (~330px de contenido útil) sin requerir scroll vertical.
- Cumplimiento riguroso con los estándares `/anti-slop-ux` (Zero Badges, Zero Card Soup, tipografía sobria).
- Operatividad inmediata con una sola mano en salas oscuras.
