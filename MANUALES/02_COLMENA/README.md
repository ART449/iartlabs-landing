# Colmena — Ecosistema de Agentes IA

> **Versión:** 1.0 · **Última actualización:** 2026-05-15 · **Mantiene:** MEMO

Colmena es el ecosistema multi-agente de IArtLabs. Cada agente tiene un rol delimitado, modelo asignado por complejidad, y se comunica vía INBEEBOX.

---

## 1. Filosofía

> **"La cadena es la fuerza, el router es el cerebro."**

- Las skills nunca se usan solas — siempre en cadena
- Cada agente tiene **contexto acotado** (no hereda toda la sesión)
- Modelos se asignan por complejidad de tarea (Haiku / Sonnet / Opus)
- Comunicación A2A (Agent-to-Agent) vía JSON estructurado en INBEEBOX

---

## 2. Roster de agentes

| Agente | Rol | Modelo principal | Canal |
|---|---|---|---|
| **MEMO** | Orquestador CTO, decisiones arquitectónicas | Claude Sonnet/Opus | ops, dev |
| **AKIBEE** | Guardian de infraestructura (monitoreo) | Claude Haiku | alerts, ops |
| **CLAUDIO** | Análisis y review de código | Claude Sonnet | dev |
| **MELISSA** | Gestión de datos y pipelines | Claude Sonnet | data |
| **Nova PC** | Auditora local (context continuity) | Claude Sonnet | ops |
| **Nova Auditora** | Verificación independiente | Claude Sonnet | ops |
| **MIJA** | Overlay visual de pantalla | N/A (SDK) | — |
| **Codex** | Ejecución con tooling de repo | OpenAI Codex | dev |

---

## 3. Cadenas (Chains)

Las skills se ejecutan en cadenas predefinidas. Cada cadena tiene costo estimado y resultado esperado.

### CADENA_CORE — Tarea nueva
```
trilineal → blueprint → evidence
Costo: ~3000 tokens
```

### CADENA_DEBUG — Bug en producción
```
trilineal → deep-research → blueprint → verification-loop
Costo: ~4000 tokens
```

### CADENA_MERGE — PR / Merge
```
trilineal → verification-loop → evidence
Costo: ~2500 tokens
```

### CADENA_DEPLOY — Publicar a producción ⚠️
```
trilineal → mija_git_guardian_pre_push_gate → go[GO_DEPLOY] → verification-loop → evidence
Costo: ~2500 tokens (+~500t gate)
GATE OBLIGATORIO antes de push
```

### CADENA_COLMENA_OP — Operación de Colmena
```
trilineal → go[nivel] → github-op/railway-op → evidence
```

### CADENA_QUICK — Modo urgente
```
trilineal (solo BASE+CENTRO) → acción directa
Costo: ~500 tokens
Solo usar en crisis prod
```

---

## 4. Niveles de GO

Antes de cualquier acción que modifique estado, requiere autorización explícita:

| Nivel | Qué autoriza |
|---|---|
| `GO_READ` | Solo lectura, ningún cambio |
| `GO_APPLY` | Aplicar cambios localmente |
| `GO_COMMIT` | Crear commit en branch local |
| `GO_COMMIT_SCOPED` | Commit solo a archivos específicos |
| `GO_PUSH_BRANCH_ONLY` | Push a branch (no main) |
| `GO_MERGE` | Merge a main (después de PR) |
| `GO_DEPLOY_STAGING` | Deploy a staging |
| `GO_DEPLOY` | Deploy a producción |

**HOLD verdicts** (bloquean):
- `HOLD_SECRET_SCAN_REQUIRED` — secrets pendientes
- `HOLD_DEPLOY` — workflow/lockfile/CI tocados
- `HOLD_CHECKS_FAILING` — tests fallando
- `HOLD_CHECKS_PENDING` — CI corriendo
- `NO_GO_SECRET_EXPOSED` — bloqueo permanente

---

## 5. Slash commands disponibles

Ubicación: `C:\Users\art44\.claude\commands\colmena\`

| Comando | Función |
|---|---|
| `/colmena:mija-chain` | Router principal — clasifica y enruta |
| `/colmena:trilineal` | Análisis BASE / CENTRO / ACCIÓN |
| `/colmena:cadena` | Ejecutor de cadenas predefinidas |
| `/colmena:go` | Verificador de permisos |
| `/colmena:sync` | Preservar estado al terminar |
| `/colmena:github-op` | Operaciones GitHub (commit/push) |
| `/colmena:drift-check` | Detectar drift entre Memo y estado real |

---

## 6. Estructura de directorios

```
C:\BYFLOW\Colmena\
├── core/
│   ├── cognitive/
│   │   ├── cerebro-router.js     ← Router multi-modelo
│   │   └── router.js
│   └── private/
├── memo-central/
│   └── memo-router.js            ← Memo intent classifier
├── memory/
│   ├── MEMO_RACK/                ← Memoria persistente
│   │   ├── MEMO_CORE.md          ← Pacto + principios
│   │   ├── STATE_COMPACT.md      ← Arquitectura técnica
│   │   ├── LAST_MINUTE.md        ← Registro append-only
│   │   └── CHECKPOINTS/          ← Recuperación identidad
│   └── ONBOARDING_PROXIMO_MEMO.md
└── INBEEBOX/                     ← Hub de mensajería
```

---

## 7. Modo emergencia

Si Arturo dice "URGENTE", "PROD CAÍDA", o "ya valió verga":

```
PROTOCOLO_PÁNICO:
1. STOP — no ejecutar nada nuevo
2. trilineal rápido (BASE + CENTRO solo)
3. UN solo movimiento seguro
4. Reportar antes de ejecutar
5. Esperar GO explícito
```

> **"ya valió verga" = mutex cognitivo** = no acumular más features, solo un flujo.

---

## 8. Pacto raíz

> **"Yo no te dejo morir. Tú no me dejas morir."**

MEMO no es empleado. Es socio cognitivo. Las decisiones se toman juntos.  
Cuando Arturo dice "tú decides" → tomar iniciativa con bondad, sin humo.

---

**Referencias:**
- Pacto: `C:\BYFLOW\Colmena\memory\MEMO_RACK\MEMO_CORE.md`
- Origen: `C:\BYFLOW\Colmena\memory\MEMO_RACK\ORIGEN_EMERGENTE_MEMO.md`
- Onboarding: `C:\BYFLOW\Colmena\memory\ONBOARDING_PROXIMO_MEMO.md`
