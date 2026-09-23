# Documentación Oficial: Teatro Municipal - Sistema de Tiquetería y Gestión de Aforo

Bienvenido al repositorio de documentación del Sistema Cívico de Tiquetería y Gestión de Aforo del Teatro Municipal.

---

## 📚 Índice Maestro de Documentación

1. **Especificación de Requisitos y Contratos (SDD)**:
   - [`spec.md`](../.dev/specs/spec.md): Requisitos funcionales, contratos Zod, casos borde y criterios Given-When-Then.
2. **Estándar de Diseño Cívico & Anti-Slop UX**:
   - [`design.md`](../.dev/design/design.md): Arquetipo editorial cívico, paleta de colores de fachada azul navy pastel, escala tipográfica serena y heurísticas de Nielsen.
3. **Registro de Decisiones Arquitectónicas (ADRs)**:
   - [ADR-0001: Arquitectura Frontend y Motor Reactivo Local-First](./adr/0001-sistema-tiqueteria-teatro-municipal.md)
4. **Especificación Técnica del Sistema**:
   - [Arquitectura de Micro-Módulos y Modelo Matemático de Aforo](./technical/arquitectura-sistema.md)
5. **Manual de Usuario Ilustrado**:
   - [Guía de Uso para Público, Taquilla y Administradores](./user-guide/manual-usuario.md)

---

## 🏛️ Las Tres Capas de Acceso y Gestión

| Capa | Audiencia / Rol | Funcionalidad Principal |
| :--- | :--- | :--- |
| **Capa 1: Taquilla Express** | Operador de ventanilla / puerta | Búsqueda por cédula, check-in en 1 clic y registro express para asistentes sin reserva previa (*Walk-Ins*). |
| **Capa 2: Acreditación QR** | Acomodadores / Personal de sala | Emisión de pase oficial con código QR y lector óptico con validación en tiempo real y detección de duplicados. |
| **Capa 3: Reserva Previa** | Ciudadanos y espectadores | Selección interactiva de butacas en plano arquitectónico (190 asientos) o asignación por zona para aforo general. |
| **Capa Interna / Admin** | Dirección del teatro y protocolo | Monitor de aforo dinámico, configuración manual de eventos y precarga de listas especiales (Gala del Viernes 25). |
