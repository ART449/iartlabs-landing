# GitHub Ops — Repos, Workflows, Conexiones

> **Versión:** 1.0 · **Última actualización:** 2026-05-15 · **Mantiene:** MEMO  
> **Cuenta GitHub:** `ART449`

Catálogo de repositorios, su estado, propósito y conexiones lógicas.

---

## 1. Autenticación

```bash
gh auth status
# ✓ Logged in to github.com account ART449 (keyring)
# Token scopes: admin:enterprise, repo, workflow, gist, codespace, copilot...
```

**Tipo de token:** `ghp_*` (Personal Access Token classic)  
**Protocolo git:** https (con token en credential manager)

⚠️ **Pendiente:** Renovar token Git-Bee según AKIBEE.

---

## 2. Catálogo de Repositorios

### 2.1 Activos (privados)

| Repo | Propósito | Local | Estado |
|---|---|---|---|
| `ArT-Assistant` | Asistente personal IA | `C:\BYFLOW\ArT-Assistant` | 1 cambio sin commit |
| `INBEEBOX` | Hub de mensajería FastAPI | `C:\BYFLOW\INBEEBOX` | 2 cambios sin commit |
| `Colmena` | Ecosistema multi-agente principal | `C:\BYFLOW\Colmena` | ⚠️ **24 cambios + ahead 29/behind 186** |
| `VibeFlow_Pro` | byflow profesional | `C:\BYFLOW\VibeFlow_Pro` | 3 cambios sin commit |
| `arturo-nexus` | MoE AI Orchestration V4 | `C:\BYFLOW\arturo-nexus` | ahead 1 (push pendiente) |
| `colmena-control` | Live mission state / decision ledger | `C:\BYFLOW\_control` | 2 cambios sin commit |
| `kaizen-backend` | Gobierno de acciones MoE | `C:\BYFLOW\kaizen-backend` | clean ✓ |
| `beecode` | Sovereign AI coding assistant | `C:\BYFLOW\beecode-work` | ⚠️ remote en Gitea privado |
| `mija-sense` | (no clonado local) | — | — |
| `byflow-area-musica` | Música/contenido | `C:\BYFLOW\byflow-area-musica` | clean ✓ |
| `byflow` | Teleprompter IA | — | — |

### 2.2 Activos (públicos)

| Repo | Propósito | Local | Estado |
|---|---|---|---|
| `mija-focus-overlay` | AI-to-Human visual guidance | `C:\BYFLOW\MIJA_FOCUS_OVERLAY` | clean ✓ |
| `GoEcosystem` | Ecosistema Go | `C:\GoEcosystem` | 23 cambios sin commit |
| `Armpix-segurity-suite` | Security URL protection | — | — |
| `gallery-edge-de-gema-4` | On-device ML/GenAI gallery (fork) | — | — |

### 2.3 Archivados (forks, no usados)
- `register`, `Humanizer`, `fastapi`, `simpleParallax.js`, `Awesome-Hacking`, `ReactTailwindEssentials`

---

## 3. Conexiones lógicas

```
                    ┌─────────────────┐
                    │   Colmena       │
                    │  (orquestador)  │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼────┐         ┌─────▼─────┐        ┌────▼────┐
   │ INBEEBOX│         │  beecode  │        │ kaizen- │
   │  (hub)  │         │  (BeeCode │        │ backend │
   │         │         │  assistant)│        │ (gov)   │
   └─────────┘         └───────────┘        └─────────┘
        │                    │                    │
        │              ┌─────▼─────┐              │
        │              │ arturo-   │              │
        │              │ nexus     │              │
        │              │ (MoE V4)  │              │
        │              └───────────┘              │
        │                                         │
   ┌────▼─────────────────────────────────────────▼────┐
   │              colmena-control                       │
   │      (mission state, decision ledger)              │
   └────────────────────────────────────────────────────┘

   ┌──────────────┐    ┌─────────────────┐    ┌──────────┐
   │ MIJA_FOCUS_  │    │  ArT-Assistant  │    │ VibeFlow │
   │   OVERLAY    │    │                 │    │   _Pro   │
   │  (visual)    │    │  (personal IA)  │    │ (byflow) │
   └──────────────┘    └─────────────────┘    └──────────┘
```

---

## 4. Problemas detectados (audit 2026-05-15)

### 🔴 PROBLEMA 1 — Colmena divergencia masiva
```
Branch: main
Status: ahead 29, behind 186, dirty=24
```

**Implicación:** El local está 186 commits atrás del remoto. Hay 29 commits locales que no están subidos + 24 archivos modificados.

**Riesgo:** Si haces `git pull` simple, vas a tener conflictos. Si haces `git push --force`, pierdes 186 commits remotos.

**Solución recomendada:**
```bash
cd C:\BYFLOW\Colmena
git stash                          # guarda cambios locales
git fetch origin
git log --oneline HEAD..origin/main | head -20   # ve los 186 commits
git log --oneline origin/main..HEAD              # ve tus 29 locales
# Decidir: rebase, merge, o cherry-pick selectivo
```

**Mientras no se resuelva:** Colmena está bloqueado para push (el guardian va a dar HOLD).

### 🟡 PROBLEMA 2 — IArtLabs-Master sin remote
```
Local: C:\BYFLOW\IArtLabs-Master
Remote: <none>
Branch: backup/antigravity-2026-05-07
```

**Implicación:** Solo existe en disco local. Si se borra el disco, se pierde.

**Solución:** Crear repo en GitHub y conectarlo.

### 🟡 PROBLEMA 3 — Memo sin remote
```
Local: C:\BYFLOW\Memo
Remote: <none>
Branch: master
```

**Implicación:** Igual que IArtLabs-Master.

**Solución:** Crear repo en GitHub y conectarlo (privado).

### 🟠 PROBLEMA 4 — beecode hybrid Gitea/GitHub
```
Local: C:\BYFLOW\beecode-work
Remote: http://192.168.99.2:3003/Arturo/beecode.git  (Gitea privado)
GitHub: ART449/beecode  (también existe)
```

**Implicación:** El local push va al Gitea, no al GitHub. GitHub se queda atrás.

**Solución:** Agregar segundo remote para sincronizar ambos:
```bash
cd C:\BYFLOW\beecode-work
git remote add github https://github.com/ART449/beecode.git
git push github main
# Configurar push to both:
git remote set-url --add --push origin http://192.168.99.2:3003/Arturo/beecode.git
git remote set-url --add --push origin https://github.com/ART449/beecode.git
```

---

## 5. Workflows GitHub Actions

> ⚠️ **TODO:** Listar workflows existentes y su estado.

```bash
gh workflow list --repo ART449/Colmena
gh run list --limit 5
```

Para cada repo importante, debe tener:
- [ ] CI básico (build + test)
- [ ] Secret scan (CodeQL o trufflehog)
- [ ] Dependabot
- [ ] Branch protection en `main` (require PR + checks)

---

## 6. Operaciones comunes

### Commit + push con guardian
```
/colmena:cadena CADENA_DEPLOY
```
Ejecuta automáticamente:
1. trilineal (análisis)
2. mija_git_guardian_pre_push_gate (gate)
3. go[GO_DEPLOY]
4. verification-loop
5. evidence

### Crear repo nuevo
```bash
cd C:\BYFLOW\MI_NUEVO_REPO
git init
gh repo create ART449/MI_NUEVO_REPO --private --source=. --remote=origin --push
```

### Clonar un repo existente
```bash
cd C:\BYFLOW
gh repo clone ART449/<repo>
```

### Ver PRs abiertos
```bash
gh pr list --limit 20
gh pr status
```

### Crear PR desde branch actual
```bash
gh pr create --fill
```

---

## 7. Branch protection recomendada

Para `main` en cada repo de producción:

```yaml
required_status_checks:
  - lint
  - test
  - secret-scan
require_pull_request_reviews: true
required_approving_review_count: 1
enforce_admins: false  # CTO puede bypass en emergencia
restrictions:
  push:
    - ART449  # solo Arturo + Memo
```

Setup con gh:
```bash
gh api repos/ART449/Colmena/branches/main/protection -X PUT --input - <<EOF
{ "required_status_checks": {"strict": true, "contexts": ["lint","test","secret-scan"]},
  "enforce_admins": false,
  "required_pull_request_reviews": {"required_approving_review_count": 1},
  "restrictions": null }
EOF
```

---

## 8. Tokens y secrets

### Token actual (PAT classic)
- Almacenado en: Windows Credential Manager via `gh`
- Scopes: full (admin:org, repo, workflow, etc.)
- Rotación recomendada: cada 90 días

### Git-Bee token
- ⚠️ Necesita renovación (según AKIBEE)
- Ubicación: ? (verificar con AKIBEE)

### Repository secrets
Listar:
```bash
gh secret list --repo ART449/Colmena
```

Agregar:
```bash
gh secret set MY_KEY --body "valor" --repo ART449/Colmena
```

---

## 9. Estrategia de namespacing

Convención de nombres:
- `mija-*` → herramientas del overlay MIJA
- `colmena-*` → infraestructura Colmena
- `byflow*` → producto byflow
- `IArtLabs*` → infra empresa
- Sin prefijo → herramientas standalone

---

**Referencias:**
- gh CLI docs: https://cli.github.com/manual/
- Audit completo: este documento
- Próximo paso: resolver los 4 problemas detectados (sección 4)
