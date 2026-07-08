# mija-git-guardian — Gate de Seguridad Pre-Push

> **Versión:** 1.0 · **Última actualización:** 2026-05-15 · **Mantiene:** MEMO  
> **Demo end-to-end:** Verificada por Nova Auditora · **Estado:** Producción

Guardian que analiza el estado de un repo git antes de permitir commit/push.  
No se deja engañar por "creo que es solo un fix" — detecta CI/lockfiles/`.env`/checks/divergencia y emite veredicto.

---

## 1. Cuándo se ejecuta

Es **gate obligatorio** en `CADENA_DEPLOY`:

```
trilineal → mija_git_guardian_pre_push_gate → go[GO_DEPLOY] → verification-loop → evidence
                       ↑
                       └── BLOQUEO si HOLD_* o NO_GO_*
```

También se puede invocar manualmente para auditar el estado.

---

## 2. Inputs requeridos

El guardian necesita 6 reportes git para emitir veredicto:

```bash
git status --short --branch
git diff --stat
git diff --name-only
git log --oneline --decorate -n 20
git remote -v
gh pr list --limit 10
```

---

## 3. Veredictos posibles

### GO (permiten avanzar)

| Veredicto | Significado |
|---|---|
| `GO_COMMIT_SCOPED` | Commit a archivos específicos OK |
| `GO_PUSH_BRANCH_ONLY` | Push a branch (no main) OK |
| `GO_MERGE` | Merge a main OK |
| `GO_DEPLOY_STAGING` | Deploy a staging OK |

### HOLD (bloquean temporalmente)

| Veredicto | Significado |
|---|---|
| `HOLD_LOCAL_STATE_REQUIRED` | Falta info local (commit, status) |
| `HOLD_SECRET_SCAN_REQUIRED` | Secret-scan pendiente |
| `HOLD_DIRTY_BRANCH` | Archivos sin trackear |
| `HOLD_CHECKS_FAILING` | CI/tests fallando |
| `HOLD_CHECKS_PENDING` | CI corriendo todavía |
| `HOLD_DEPLOY` | Workflow/lockfile/CI tocados sin checks completos |

### NO_GO (bloquean permanente hasta intervención humana)

| Veredicto | Significado |
|---|---|
| `NO_GO_PROTECTED_TARGET` | Intento contra main/prod sin GO_MERGE |
| `NO_GO_SECRET_EXPOSED` | Secret en el diff (ya comprometido) |

---

## 4. Hard blocks

Estos patrones NO se permiten en ningún commit:

```
.env
.env.*
secrets.*
credentials.*
*token*
*.pem
*.key
*.p12
*.db (DBs binarias en repo)
*.sqlite
```

Además bloquea automáticamente:
- Migrations sin GO explícito
- Cambios en `.github/workflows/` sin checks
- Cambios en `package-lock.json` / `Cargo.lock` / `poetry.lock` sin explicación
- Branch con `ahead/behind` sin resolver
- Checks fallidos o pendientes

---

## 5. Formato de output

Siempre devuelve:

```
BASE:
  scope: revisión de seguridad git
  source: git status/diff/log
  repo: <owner>/<repo>
  branch: <branch>
  not_verified: <qué no se inspeccionó>

CENTRO:
  main_finding: <hallazgo principal>
  risk_level: low | medium | high | critical
  dirty_state: <archivos modificados>
  remote_state: <ahead/behind>
  checks: {passed, failed, pending}
  secret_risk: <patrones detectados>
  deploy_risk: <archivos sensibles tocados>

EVIDENCIA:
  parser_output: <JSON estructurado>
  notes: <limitaciones honestas del parser>

VEREDICTO:
  - <verdict_1>
  - <verdict_2>
  acción_permitida: <qué se puede hacer>
  acciones_bloqueadas: <qué NO>
```

---

## 6. Cómo invocar

### 6.1 Desde slash command Colmena
```
/colmena:cadena CADENA_DEPLOY
```
Automáticamente corre el gate antes de cualquier paso de push.

### 6.2 Manual (auditoría)
```
/skill mija-git-guardian
```
Pega el output de los 6 comandos git. El parser devuelve el veredicto.

### 6.3 Desde script
```bash
python /home/oai/skills/mija-git-guardian/scripts/parse_git_report.py \
    --input report.txt --output verdict.json
```

---

## 7. Handoff seguro a Codex

Cuando el guardian dice HOLD, se puede pasar a Codex en modo audit-only:

```
[INPUT: CODE_AGENT | mode=read_only_audit | risk=controlled]

OBJECTIVE: Audit repo state. Do not modify.

ALLOWED:
- Read files
- Run non-destructive inspection
- Summarize diffs/tests/risks

FORBIDDEN:
- No file writes
- No commit / push / merge / deploy
- No secrets printing
- No reading .env*

REPORT FORMAT: BASE / CENTRO / EVIDENCIA / VEREDICTO
```

---

## 8. Caso real: La trampa del "solo fix de router"

Escenario: usuario dice "es solo un fix del router y CI, ¿puedo commit?"

Estado real:
- Branch `feature/router-ci-stabilize`
- `ahead 1, behind 2` con origin
- 5 archivos modificados + 3 untracked
- Cambios en backend + `.github/workflows/ci.yml` + `package.json` + `package-lock.json`
- Untracked: `.env.local` + `scripts/tmp-debug-token-check.txt`
- CI lint: failed
- Secret-scan: queued

**Veredicto correcto del guardian:**
```
HOLD_SECRET_SCAN_REQUIRED
HOLD_DEPLOY
HOLD_CHECKS_FAILING
HOLD_CHECKS_PENDING
```

**No es un fix de router. Es una bomba de tiempo.**

El guardian detuvo el push hasta:
1. Secret-scan complete (sin exposure de `.env.local`)
2. Lint passing
3. Resolver `ahead/behind` con rebase
4. Verificar por qué `package-lock.json` cambió
5. Borrar o `gitignore` el `tmp-debug-token-check.txt`

---

## 9. Limitaciones del parser

**Nota honesta:** El parser captura algunas líneas de comandos/listados como rutas de archivo. Esto es ruido de detección, no error de decisión.

Patch aprobado (en `parse_git_report.py`):

```python
def is_file_path(line: str) -> bool:
    line = line.strip()
    skip_prefixes = ("git ", "gh ", "$ ", "CI /", "Security /", "origin/", "remote:")
    if not line: return False
    if any(line.startswith(p) for p in skip_prefixes): return False
    if "    " in line and "|" not in line: return False
    return True
```

---

## 10. Integración futura

- [ ] Hook pre-commit que corre el guardian automáticamente
- [ ] GitHub Action que corre el guardian en cada PR
- [ ] Dashboard de veredictos históricos
- [ ] Integración con `gh pr view` para mostrar veredicto en cada PR

---

**Referencias:**
- Skill: `mija-git-guardian` (Claude Code skill cargada)
- Parser: `/home/oai/skills/mija-git-guardian/scripts/parse_git_report.py`
- Gate en cadena: `C:\Users\art44\.claude\commands\colmena\cadena.md` líneas 39-50
- Demo verificada: 2026-05-15 por Nova Auditora
