# Estándar Git, Commits Atómicos & Flujo CI/CD

Este documento define la disciplina de control de versiones con **Git** y el ciclo de integración continua (**CI/CD**), asegurando un historial limpio, trazable y libre de regresiones.

---

## 1. Taxonomía Canónica de Nomenclatura de Proyectos & Repositorios GitHub

Todos los proyectos y repositorios del Workspace deben seguir una convención estricta según su categoría de negocio:

- `personal-[tipo]-[nombre]`: Proyectos personales y herramientas de autor (ej. `personal-saas-cv-builder`, `personal-yugioh-deckbuilder`, `personal-portfolio-*`).
- `client-[cliente]-[tipo]-[nombre]`: Proyectos desarrollados para clientes comerciales (ej. `client-erika-saas-pos`, `client-landing-lubnan`, `client-rotaract-saas-op`).
- `template-[tipo]-[nombre]`: Plantillas base y *boilerplates* reutilizables (ej. `template-landing-clinic1`, `template-landing-legal-consulting`).
- `portfolio-[tipo]-[nombre]`: Demos públicas y casos de estudio destacados para clientes (ej. `portfolio-demo-saas-red-comunitaria`).
- `class-[tipo]-[nombre]`: Proyectos académicos, certificaciones o cursos (ej. `class-landing-shopzone`, `class-landing-orbit`).

---

## 2. Convenciones de Ramas Semánticas (Branching Strategy)

Nunca trabajes directamente sobre la rama `main`. Toda nueva tarea debe desarrollarse en una rama aislada:

- `feat/<nombre-funcionalidad>`: Nueva característica (ej. `feat/deck-card-counter`).
- `fix/<nombre-bug>`: Corrección de un fallo (ej. `fix/hydration-mismatch-timer`).
- `refactor/<modulo>`: Reestructuración de código sin alterar comportamiento (ej. `refactor/clean-code-deck-canvas`).
- `test/<suite>`: Adición o mejora de pruebas unitarias o E2E (ej. `test/playwright-deck-crud`).
- `chore/<tarea>`: Tareas de mantenimiento, actualización de dependencias o configuración.


---

## 3. Commits Atómicos y Estándar Conventional Commits

> **Regla de Oro**: Un commit debe representar **una sola unidad lógica de cambio**.  
> CADA commit debe compilar y pasar las pruebas limpiamente. Si un commit rompe el build, el historial de Git queda corrupto para herramientas forenses como `git bisect`.

### Formato de Mensaje:
```text
<tipo>(<alcance opcional>): <descripción concisa en imperativo y minúsculas>

[cuerpo opcional explicando el POR QUÉ y decisiones técnicas no obvias]

[referencias a especificaciones o tickets, ej. Spec: spec.md#escenario-1]
```

### Tipos Válidos:
- `feat`: Nueva característica.
- `fix`: Corrección de bug.
- `refactor`: Cambio de código que no añade feature ni corrige bug.
- `perf`: Mejora de rendimiento.
- `test`: Añadir o modificar tests.
- `docs`: Modificación exclusivamente documental.
- `style`: Formateo de código sin alterar lógica.

### Ejemplo Canónico:
```bash
git commit -m "feat(deck-builder): extract pure calculation logic to deckCalculations utility"
```

---

## 4. Estructura Obligatoria de Pull Request (PR)

Al finalizar una funcionalidad y antes de fusionar en `main`:

```markdown
## 🎯 Objetivo y Contexto
Vinculado a: [spec.md](file:///.dev/specs/spec-deck-builder.md)
Resumen breve de la funcionalidad o corrección implementada.

## 🛠️ Cambios Técnicos Realizados
- Extracción de subcomponente `DeckCardGrid.tsx` para cumplir con el límite de 200 líneas.
- Implementación de cálculo derivado con `useMemo` erradicando el uso previo de `useEffect`.
- Tipado estricto con interfaces de Zod y tipos generados de Supabase.

## 🧪 Checklist de Verificación (Linus Torvalds Standard)
- [ ] `npx tsc --noEmit` completado con 0 errores.
- [ ] `npm run lint` completado con 0 advertencias críticas.
- [ ] `npm run build` completado exitosamente.
- [ ] Pruebas unitarias ejecutadas y aprobadas (`npm run test` / `pytest`).
- [ ] Validación visual / E2E completada sin regresiones de UX.
```

---

## 5. Estrategia Obligatoria de Merge: Desglose Total de Commits (`--no-ff`)

Para mantener la visibilidad, granularidad y trazabilidad visual de cada cambio en herramientas de árbol de Git (Git Graph, GitLens, GitHub Network):

1. **Prohibición Total de Squash Merge**: Queda **estrictamente prohibido** usar `squash merge` (`--squash`) al fusionar PRs en `main`. Comprimir commits aplana el historial y anula el valor de los commits atómicos.
2. **Prohibición de Rebase Compress**: No reescribir la historia ni aplanar ramas al fusionar.
3. **Obligatoriedad de Merge Commit (`--no-ff`)**: Todo PR debe fusionarse utilizando **Merge Commit** (`git merge --no-ff` o `merge_method: "merge"` en la API de GitHub). Esto genera un nodo de fusión que preserva la bifurcación de la rama y muestra cada uno de los commits atómicos que componen la entrega de forma desglosada.
4. **Formato Canónico del Commit de Fusión**:
   ```bash
   feat(<scope>): merge PR #<numero> into main
   ```
   O el generado automáticamente por GitHub: `Merge pull request #<numero> from <rama>`.

