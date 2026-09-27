# ADR 0007: Bloqueo Temporal del Sistema y Formularios Públicos Standalone para Jornadas e Incidencias

## Estado
Aceptado

## Contexto
Durante jornadas de mantenimiento o eventos especiales, el acceso a la boletería pública y paneles operativos requiere ser restringido temporalmente. No obstante, el personal operativo y colaboradores en sala necesitan registrar sus horarios de entrada/salida y notificar incidencias (goteras, butacas o mobiliario roto, faltantes de equipo, fallas eléctricas, etc.) sin barreras de autenticación complejas desde sus dispositivos móviles.

## Decisión
1. **Bloqueo General Temporal (`SystemLockdownView`)**:
   - Si el usuario no ha iniciado sesión con rol `SUPERADMIN`, todas las vistas generales quedan bloqueadas con una pantalla institucional sobria y elegante acorde a `/anti-slop-ux`.
   - Se provee acceso directo al `LoginModal` exclusivo para Superadministrador.
2. **Rutas Directas Standalone Públicas**:
   - `#registro-horas` / `#horas`: Formulario optimizado para móviles donde cualquier colaborador registra nombre, cédula, puesto, evento/fecha precargada, horas de entrada y salida posterior.
   - `#reporte-incidencias` / `#incidencias`: Formulario directo para reporte de contingencias de sala (goteras, roturas, faltantes, iluminación, limpieza) con ubicación y contacto.
   - Botones rápidos de copiado de enlace al portapapeles para distribución ágil por WhatsApp o canales del teatro.
3. **Persistencia & Reactividad**:
   - Los datos se integran a `staffTimeStore` e `incidentStore`, estando disponibles en tiempo real en la consola del Superadmin.

## Consecuencias
- **Positivas**: Cero fricción para los colaboradores en sitio; control total de acceso para el Superadmin; arquitectura desacoplada y trazable.
- **Negativas**: El público general no ve la cartelera mientras dure el bloqueo activo.
