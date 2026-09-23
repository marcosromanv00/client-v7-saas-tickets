# Estándar de ADRs, Manuales de Usuario & Documentación Continua

Este documento define el estándar para la toma de decisiones arquitectónicas y la sincronización viva de la documentación técnica y de usuario ("Documentation as Code") en el workspace.

---

## 1. Registros de Decisiones Arquitectónicas (ADRs) en `docs/adr/`

Todo proyecto debe contener el directorio `docs/adr/` para registrar decisiones estructurales significativas (cambio de librerías base, estrategias de autenticación, diseño de esquemas, protocolos de caché o estándares de integración).

### Convención de Nomenclatura:
`docs/adr/XXXX-[nombre-descriptivo-kebab-case].md`

### Estructura Canónica de un ADR (Formato MADR):
1. **Título**: `ADR-XXXX: [Decisión en una frase]`
2. **Estado**: `Propuesto` | `Aceptado` | `Superado por ADR-YYYY` | `Rechazado`
3. **Fecha**: `YYYY-MM-DD`
4. **Contexto & Problema**: Cuál es el desafío técnico, restricciones de negocio o cuello de botella.
5. **Opciones Consideradas**: Alternativas evaluadas y razones de descarte.
6. **Decisión Tomada**: Qué opción se elige y justificación técnica.
7. **Consecuencias**: Positivas y negativas / trade-offs.

---

## 2. Portabilidad de Enlaces en Documentación ("Zero-Local-URIs")

- **Prohibición Total**: Queda terminantemente prohibido utilizar enlaces locales absolutos con prefijos `file:///c:/Users/...` o `file:///home/...` en cualquier archivo Markdown del repositorio.
- **Rutas Relativas Obligatorias**: Todos los enlaces internos entre documentos técnicos, ADRs, guías de prueba y archivos de código fuente deben ser **rutas relativas** (ej. `../../backend/src/...`) para garantizar portabilidad en plataformas como GitHub, GitLab o visualizadores web.

---

## 3. Trazabilidad Objetiva sin Autocalificación en Reportes

- **Neutralidad de Matrices**: En entregables académicos o auditorías de clientes, las matrices de trazabilidad deben estructurarse únicamente como:
  *Criterio de la Rúbrica / Requisito $\rightarrow$ Estado $\rightarrow$ Artefacto / Dónde está implementado $\rightarrow$ Descripción y Evidencia técnica*.
- **Cero Autocalificación**: Omitir columnas de puntaje auto-asignado para mantener total neutralidad técnica y evitar sesgos o contradicciones con la evaluación del docente o auditor.

---

## 4. Regla "Zero Documentation Drift" en el Ciclo `/ship`

> **Regla de Oro**: Ninguna funcionalidad o modificación de flujo de usuario puede fusionarse a `main` sin actualizar simultáneamente su manual de usuario y su documento técnico en el mismo Pull Request.
