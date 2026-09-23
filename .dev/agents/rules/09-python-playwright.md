# Estándar de Automatización con Python & Playwright

Este documento define las directrices técnicas para el desarrollo de scripts de optimización, scraping y pruebas automatizadas utilizando **Python** y **Playwright**.

---

## 1. Calidad de Código en Scripts Python

1. **Tipado Estricto con `typing`**:
   - Todo script de Python debe incluir type hints en parámetros y valores de retorno de funciones.
   - Utilizar `dataclasses` o modelos de Pydantic para estructurar datos parseados en lugar de diccionarios no tipados.
2. **Entornos Virtuales**:
   - Mantener dependencias aisladas mediante `venv` o `poetry`.
3. **Manejo de Recursos Limpio**:
   - Utilizar siempre context managers (`with` o `async with`) para asegurar que los navegadores, contextos y archivos temporales se cierren adecuadamente tras la ejecución.

---

## 2. Mejores Prácticas con Playwright

### A. Selectores Semánticos y Resilientes
> **Regla**: Nunca utilices rutas CSS o XPath frágiles (ej. `div:nth-child(3) > button`). Utiliza selectores orientados al usuario:
- `page.get_by_role("button", name="Guardar")`
- `page.get_by_label("Nombre de usuario")`
- `page.get_by_placeholder("Buscar cartas...")`
- `page.get_by_test_id("deck-canvas")`

### B. Prohibición de `time.sleep()`
- Prohibido el uso de esperas ciegas como `time.sleep(5)`.
- Utiliza las esperas automáticas de Playwright o aserciones con auto-reintento (`expect(locator).to_be_visible()`, `page.wait_for_selector()`, `page.wait_for_load_state("networkidle")`).

---

## 3. Ejemplo Canónico de Script con Python + Playwright

```python
import asyncio
from dataclasses import dataclass
from typing import List, Optional
from playwright.async_api import async_playwright, Page, expect

@dataclass
class ScrapedCard:
    name: str
    card_type: str
    attack: Optional[int] = None
    defense: Optional[int] = None

async def scrape_card_catalog(target_url: str) -> List[ScrapedCard]:
    """Extrae información de cartas de forma asíncrona y tipada."""
    results: List[ScrapedCard] = []
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1280, "height": 720})
        page: Page = await context.new_page()
        
        try:
            await page.goto(target_url, wait_until="domcontentloaded", timeout=30000)
            
            # Esperar a que la lista principal esté presente
            cards_container = page.get_by_test_id("card-list")
            await expect(cards_container).to_be_visible(timeout=10000)
            
            card_elements = await page.get_by_role("article").all()
            for el in card_elements:
                name = await el.get_by_role("heading", level=3).inner_text()
                type_badge = await el.get_by_test_id("type-badge").inner_text()
                results.append(ScrapedCard(name=name.strip(), card_type=type_badge.strip()))
                
        except Exception as e:
            await page.screenshot(path="logs/error_playwright.png")
            raise RuntimeError(f"Fallo durante la automatización de Playwright: {e}") from e
        finally:
            await context.close()
            await browser.close()
            
    return results

if __name__ == "__main__":
    data = asyncio.run(scrape_card_catalog("https://example.com/cards"))
    print(f"Total de cartas extraídas: {len(data)}")
```
