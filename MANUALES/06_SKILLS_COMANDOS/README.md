# Skills & Slash Commands — Catálogo Operativo

> **Versión:** 1.0 · **Última actualización:** 2026-05-15 · **Mantiene:** MEMO

Catálogo completo de skills (capacidades) y slash commands disponibles en Claude Code para operar la Colmena.

---

## 1. Slash Commands de Colmena

Ubicación: `C:\Users\art44\.claude\commands\colmena\`

### `/colmena:mija-chain` — Entry Point
**Función:** Router principal. Clasifica la petición y enruta al chain correcto.

**Cuándo usarlo:** Como primer paso de cualquier tarea no trivial.

**Argumento:** Texto libre con la petición.

```
/colmena:mija-chain "agrega endpoint /users a INBEEBOX"
→ Clasifica como Feature → CADENA_CORE
→ trilineal → blueprint → evidence
```

### `/colmena:trilineal` — Análisis BASE/CENTRO/ACCIÓN
**Función:** Diagnostica antes de actuar.

```
BASE:    qué se sabe con certeza
CENTRO:  qué se infiere / hipotetiza
ACCIÓN:  qué hacer al respecto (con go-levels)
```

### `/colmena:go` — Verificador de Permisos
**Función:** Checa si la acción solicitada tiene autorización.

**Niveles:** `GO_READ`, `GO_APPLY`, `GO_COMMIT`, `GO_COMMIT_SCOPED`, `GO_PUSH_BRANCH_ONLY`, `GO_MERGE`, `GO_DEPLOY_STAGING`, `GO_DEPLOY`

### `/colmena:cadena` — Ejecutor de Cadenas
**Función:** Ejecuta una cadena predefinida.

**Cadenas:** CADENA_CORE, CADENA_DEBUG, CADENA_MERGE, CADENA_DEPLOY, CADENA_COLMENA_OP, CADENA_QUICK

### `/colmena:sync` — Preservar Estado
**Función:** Al final de cada tarea, actualiza memoria.

**Actualiza:** MEMO_RACK/LAST_MINUTE.md, STATE_COMPACT.md, MEMORY.md

### `/colmena:github-op` — Operaciones GitHub
**Función:** Commits, pushes, PRs con formato Colmena.

### `/colmena:drift-check` — Detectar Drift
**Función:** Verifica que la memoria de Memo concuerde con el estado real del repo.

---

## 2. Skills Personales

Ubicación: `C:\Users\art44\.claude\skills\`

### `blueprint` — Construction Plan Generator
**Función:** Convierte un objetivo de una línea en plan de implementación paso a paso.

**Cuándo:** Features que abarcan múltiples PRs, refactors grandes, migraciones.

**Genera:** `plans/<proyecto>-<objetivo>.md` con steps cold-start.

### `agent-harness-construction`
**Función:** Diseñar el harness de un agente (acción/observación/recovery/contexto).

### `mija-git-guardian`
**Función:** Gate de seguridad pre-push. Ver `MANUALES/05_MIJA_GIT_GUARDIAN/`.

### `mija-chain-router`
**Función:** Router del ecosistema Colmena. Versión skill del slash command.

### Skills técnicas adicionales (40+):

| Skill | Uso |
|---|---|
| `agentic-engineering` | Diseño de agentes |
| `ai-first-engineering` | Patterns AI-first |
| `ai-regression-testing` | Tests de regresión IA |
| `api-design` | Diseño REST/GraphQL |
| `autonomous-loops` | Loops autónomos |
| `backend-patterns` | Patterns backend |
| `cli-anything` | Generar CLIs |
| `coding-standards` | Estándares de código |
| `content-engine` | Generación de contenido |
| `continuous-learning` | Memoria entre sesiones |
| `deep-research` | Investigación profunda |
| `deployment-patterns` | Patterns deploy |
| `docker-patterns` | Docker / containers |
| `e2e-testing` | Tests end-to-end |
| `eval-harness` | Eval de modelos |
| `frontend-patterns` | Patterns frontend |
| `iterative-retrieval` | RAG iterativo |
| `make-plan` | Planificación |
| `plankton-code-quality` | QA código |
| `prompt-optimizer` | Optimización de prompts |
| `search-first` | Buscar antes de implementar |
| `security-review` | Review de seguridad |
| `site-mapper` | Mapeo de sitios |
| `strategic-compact` | Compactación de contexto |
| `tdd-workflow` | TDD workflow |
| `ui-ux-pro-max` | UI/UX premium |
| `verification-loop` | Loop de verificación |

---

## 3. Plugins (Plugin Skills)

Ubicación: `C:\Users\art44\AppData\Roaming\Claude\local-agent-mode-sessions\*`

### Operations Plugin
- `capacity-plan` — Planificación de capacidad de equipo
- `forecasting` — Forecast de carga

### Sales Plugin
- `account-research` — Research de cuentas/empresas/personas
- `call-prep` — Preparación de llamadas
- `draft-outreach` — Outreach personalizado
- `prospecting` — Qualification

### Brand Voice Plugin
- `discover-brand` — Discovery de materiales de marca
- `content-generation` — Generación brand-aligned
- `quality-assurance` — QA de contenido

### Agent SDK Dev Plugin
- `agent-sdk-verifier-py` — Verificar SDK Python
- `agent-sdk-verifier-ts` — Verificar SDK TypeScript

---

## 4. Agentes especializados (Task tool)

Estos se invocan con el Agent tool:

| Agent | Para qué |
|---|---|
| `general-purpose` | Búsqueda multi-step abierta |
| `planner` | Planificación de features |
| `architect` | Diseño arquitectónico |
| `tdd-guide` | TDD strict |
| `code-reviewer` | Review de código |
| `security-reviewer` | Review de seguridad |
| `build-error-resolver` | Fix errores de build |
| `python-reviewer` | Review Python |
| `go-reviewer` | Review Go |
| `rust-reviewer` | Review Rust |
| `e2e-runner` | E2E tests |
| `refactor-cleaner` | Cleanup dead code |
| `doc-updater` | Actualizar docs |
| `chief-of-staff` | Triage email/Slack |

---

## 5. Workflow recomendado

### Feature nueva (no trivial)
```
1. /colmena:mija-chain "agrega X feature"  → clasifica
2. /colmena:trilineal                       → analiza
3. Si complejo → blueprint                  → plan paso a paso
4. /colmena:go GO_APPLY                     → autoriza local
5. Implementar
6. tdd-guide agent                          → tests
7. code-reviewer agent                      → review
8. /colmena:cadena CADENA_DEPLOY            → gate + push
9. /colmena:sync                            → preserva
```

### Bug fix
```
1. /colmena:mija-chain "fix bug X"          → CADENA_DEBUG
2. trilineal → deep-research → blueprint → verification-loop
3. /colmena:cadena CADENA_DEPLOY si aplica
4. /colmena:sync
```

### Diagnóstico (sin tocar nada)
```
1. /colmena:trilineal "qué pasa con X"
   → reporta solo, sin ejecutar
```

---

## 6. Atajos críticos

| Atajo | Para qué |
|---|---|
| "URGENTE" / "PROD CAÍDA" | Activa PROTOCOLO_PÁNICO |
| "ya valió verga" | Mutex cognitivo (un solo flujo) |
| "tú decides" | Memo toma iniciativa con bondad |
| "somos socios" | Pacto activo |

---

## 7. Modelos disponibles

Según `cerebro-router.js`:

| Modelo | Especialidad | Costo |
|---|---|---|
| `groq llama-3.3-70b` | Speed, chat | gratis |
| `gemini-2.0-flash` | Multimodal, long context | gratis |
| `deepseek-chat` | Math, code, logic | gratis |
| `claude-sonnet-4` | Code, architecture, complex | $$ |
| `moonshot-v1-128k` | Long context, research | $ |
| `grok-4-1-fast` | Realtime, news | $$$ |
| `glm-5` | Multilingual, visuals | gratis |
| `gemma3:4b` (Ollama) | Privacy, offline | gratis |

Memo escoge automáticamente vía router.

---

**Referencias:**
- Skills dir: `C:\Users\art44\.claude\skills\`
- Commands dir: `C:\Users\art44\.claude\commands\colmena\`
- Rules dir: `C:\Users\art44\.claude\rules\`
- Plugins: `C:\Users\art44\AppData\Roaming\Claude\local-agent-mode-sessions\`
