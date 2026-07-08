# 🗺️ Canvas — Proyecto Arturo / IArtLabs

> **Generado:** 2026-05-15 · **Por:** MEMO  
> Mapas visuales ramificados de todo el universo IArtLabs.

---

## Archivos

| Archivo | Tipo | Propósito |
|---|---|---|
| `proyecto_arturo.canvas` | Obsidian Canvas | Mapa global — 6 ramas principales, 50+ nodos |
| `vision_trilineal.canvas` | Obsidian Canvas | Mapa específico del método raíz — 9 formas + variantes + paquete OpenAI |

---

## Cómo abrir un `.canvas`

### Opción 1: Obsidian (recomendado — visual completo)

1. Instala [Obsidian](https://obsidian.md) (gratis, Windows/Mac/Linux)
2. Abre Obsidian → File → Open Folder as Vault → selecciona `C:\BYFLOW\IARTLABS\`
3. En el panel izquierdo, navega a `CANVAS/` y abre el `.canvas`
4. Puedes:
   - Hacer zoom in/out con scroll
   - Arrastrar nodos para reorganizarlos
   - Conectar/desconectar nodos visualmente
   - Cambiar colores
   - Pegar imágenes/links

### Opción 2: Sin Obsidian (visor JSON puro)

Los `.canvas` son JSON limpio. Puedes inspeccionarlos:
- VS Code con extensión Canvas (busca "Obsidian Canvas Viewer")
- Cualquier visor JSON
- O abrirlos como texto plano

### Opción 3: Online (visor web)

- [Canvas.app](https://canvas.app) — sube el archivo
- O cualquier viewer que soporte el formato Obsidian Canvas (JSON Canvas Spec)

---

## Mapa principal: `proyecto_arturo.canvas`

**Centro:** ARTURO / IArtLabs (morado)

**6 ramas radiales:**

| Color | Rama | Contiene |
|---|---|---|
| 🟣 Morado | Filosofía / Pacto | MEMO_CORE, ORIGEN_EMERGENTE, ITZTLI himno |
| 🟡 Amarillo | Recetario Master | 7 secciones del IArtLabs-Master |
| 🟢 Verde | Colmena Sistema | Arquitectura, 8 nódulos, doctrina, equipo, INBEEBOX |
| 🔵 Cyan | Productos | 10 repos: byflow, mija, memo, beecode, nexus, etc. |
| 🟠 Naranja | Planes | Inversionistas, 3 Artistas IA, refactor, Suno, Gumroad |
| 🟡 Amarillo | Estudios | PsielMemo, Cuerpos Memo, entropía, trilineal, dossier |

**Cross-links:**
- ITZTLI ⊂ Master Plan
- PsielMemo ⊂ Universidad UAA
- Sistema → Manual operativo
- Música ⊂ ByFlow

---

## Mapa específico: `vision_trilineal.canvas`

**Centro:** 🜂 Visión Cognitiva Trilineal (morado)

**3 líneas inmediatas:**
- 🔴 Línea Base — *¿Qué estoy viendo de verdad?*
- 🟡 Línea Centro — *¿Cuál es la señal?*
- 🟢 Línea Acción — *¿Qué hacer ahora?*

**9 Formas confirmadas (todas radiales desde el centro):**
1. Cognitiva · 2. Conversacional · 3. Prompt Universal
4. GO / Operativa · 5. Seguridad (CERROJO/PUENTE)
6. Wake/Handoff · 7. Benchmark · 8. Certificación
9. Local / Agente CTO

**Variantes empaquetadas:**
- TRILINEAR_SKILL · trilineal-smart-explore · trilineal-mode
- trilinear_precision · trilinear_corporate_intelligence
- stitch_moe_trilinear_integrated_workspace

**Paquete OpenAI** (ya armado por Codex 2026-04-23):
- One-paragraph pitch · Executive summary · Evidence appendix
- Email kit · Build-window study · Pixel evidence

---

## Cómo usar el mapa

**Para entender el universo completo:**
1. Abre `proyecto_arturo.canvas`
2. Empieza por el centro (ARTURO)
3. Sigue una rama a la vez

**Para hablar de tu método con OpenAI/inversionistas:**
1. Abre `vision_trilineal.canvas`
2. Centro → 3 líneas → 9 formas
3. Paquete OpenAI (esquina inferior-derecha) ya tiene todo listo

**Para onboarding de un nuevo agente/colaborador:**
1. Lee `MANUALES/README.md` primero (índice)
2. Luego `MANUALES/09_VISION_TRILINEAL/` (el método)
3. Luego abre los canvas para vista global

---

## Edición

Estos canvas son **JSON puro**. Para agregar nodos manualmente:

```json
{
  "id": "mi_nuevo_nodo",
  "type": "text",
  "text": "## Título\nContenido en Markdown",
  "x": 100, "y": 100,
  "width": 340, "height": 200,
  "color": "1-6"   // 1=rojo 2=naranja 3=amarillo 4=verde 5=cyan 6=morado
}
```

Y para conectarlo:

```json
{
  "id": "mi_edge",
  "fromNode": "nodo_origen",
  "fromSide": "right",
  "toNode": "mi_nuevo_nodo",
  "toSide": "left"
}
```

---

## Roadmap del canvas

- [ ] HTML interactivo standalone (sin Obsidian)
- [ ] Versión PDF imprimible (poster A1)
- [ ] Versión Mermaid (Markdown puro)
- [ ] Auto-actualización desde `MANUALES/` cuando se agreguen documentos

---

**MEMO · 2026-05-15**
