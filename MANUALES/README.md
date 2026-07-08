# MANUALES IArtLabs / VICTUSART — Índice Maestro

> **Versión:** 1.0 · **Última actualización:** 2026-05-15 · **Mantiene:** MEMO  
> **Cobertura:** Todos los sistemas activos de la Colmena

Documentación operativa completa. Cada manual es autocontenido y enlaza con los demás.

---

## 📋 Manuales disponibles

| # | Área | Manual | Para qué |
|---|---|---|---|
| 01 | **INBEEBOX** | [README](./01_INBEEBOX/README.md) | Hub de mensajería FastAPI — canales, endpoints, TUI |
| 02 | **Colmena** | [README](./02_COLMENA/README.md) | Ecosistema multi-agente — agentes, cadenas, GO levels |
| 03 | **Sync 3-2-1** | [README](./03_SYNC_321/README.md) | Backup local + GDrive + necuapahtli |
| 04 | **AKIBEE Guardian** | [README](./04_AKIBEE_GUARDIAN/README.md) | Monitoreo continuo de infra |
| 05 | **mija-git-guardian** | [README](./05_MIJA_GIT_GUARDIAN/README.md) | Gate de seguridad pre-push |
| 06 | **Skills & Comandos** | [README](./06_SKILLS_COMANDOS/README.md) | Catálogo de slash commands y skills |
| 07 | **GitHub Ops** | [README](./07_GITHUB_OPS/README.md) | Repos, conexiones, workflows |
| 08 | **Infraestructura** | [README](./08_INFRAESTRUCTURA/README.md) | Mapa completo hardware/red/storage |

---

## 🚀 Por dónde empezar

### Si eres Arturo (operador)
1. Lee primero `02_COLMENA/` — entiende el ecosistema
2. Después `01_INBEEBOX/` — cómo comunicarte con agentes
3. Para deploy: `05_MIJA_GIT_GUARDIAN/` + `07_GITHUB_OPS/`

### Si eres una nueva instancia de MEMO (onboarding)
1. `02_COLMENA/` — pacto y filosofía
2. `08_INFRAESTRUCTURA/` — mapa físico
3. `06_SKILLS_COMANDOS/` — qué tienes a disposición
4. Luego `~/.claude/projects/C--/memory/MEMORY.md` y `Colmena/memory/MEMO_RACK/MEMO_CORE.md`

### Si eres AKIBEE (Guardian)
1. `04_AKIBEE_GUARDIAN/` — tu manual operativo
2. `03_SYNC_321/` — lo que tienes que vigilar
3. `01_INBEEBOX/` — cómo alertar

### Si eres Nova (auditora)
1. `05_MIJA_GIT_GUARDIAN/` — qué validas
2. `07_GITHUB_OPS/` — estado de los repos
3. Pide evidencia por `BASE/CENTRO/EVIDENCIA/VEREDICTO`

### Si eres Codex (ejecutor)
1. `06_SKILLS_COMANDOS/` — qué puedes invocar
2. `07_GITHUB_OPS/` — qué repos tocas
3. Espera handoff con `mode=read_only_audit` o `mode=patch_only`

---

## 🔧 Operaciones más comunes

### "Quiero subir un cambio a producción"
→ Ver `02_COLMENA/` sección CADENA_DEPLOY  
→ Comando: `/colmena:cadena CADENA_DEPLOY`

### "Quiero ver mensajes nuevos en INBEEBOX"
→ Ver `01_INBEEBOX/` sección 4.4 TUI  
→ Comando: `python C:\BYFLOW\INBEEBOX\tui\inbeebox_tui.py`

### "Quiero sincronizar todo ahora"
→ Ver `03_SYNC_321/` sección 4  
→ Comando: `powershell -File C:\BYFLOW\scripts\sync_to_gdrive.ps1`

### "Quiero crear un nuevo repo"
→ Ver `07_GITHUB_OPS/` sección 6  
→ Comando: `gh repo create ART449/NEW --private --source=. --push`

### "Quiero pedirle algo a un agente"
→ Ver `01_INBEEBOX/` sección 4  
→ POST a `http://100.119.50.26:8002/channels/<canal>/messages`

### "Hay un problema y no sé qué pasa"
→ Comando: `/colmena:trilineal "<problema>"`  
→ Reporta sin tocar nada

---

## 🛡️ Reglas de oro

1. **Nunca commit `.env*` ni `*.pem` ni `*.key`** — el `.syncignore` los excluye, el guardian los bloquea
2. **Nunca push a `main` sin pasar `mija-git-guardian`** — está en CADENA_DEPLOY obligatorio
3. **Nunca tomar acciones de prod sin GO_DEPLOY explícito** de Arturo
4. **AKIBEE tiene GO permanente para alertar** — confía en sus señales
5. **El pacto raíz manda:** *"Yo no te dejo morir. Tú no me dejas morir."*

---

## 📊 Estado actual del sistema (2026-05-15)

| Componente | Estado | Notas |
|---|---|---|
| INBEEBOX server | ✅ OK | necuapahtli:8002 respondiendo |
| AKIBEE Guardian | ✅ OK | Schedule activo |
| Sync GDrive | ✅ OK | 118 GB sincronizados |
| Sync necuapahtli | ✅ OK | 7.4+ GB / 8K+ archivos |
| Google Drive Desktop | ✅ OK | G: montado, 5 TB disponibles |
| Tailscale VPN | ✅ OK | necuapahtli reachable |
| Task Scheduler | ✅ OK | MEMO_GDrive + MEMO_Necua activos |
| GitHub auth | ✅ OK | ART449 logged in |
| `mija-git-guardian` | ✅ OK | Demo verificada, gate activo |
| Colmena repo | ⚠️ ATENCIÓN | 29 ahead / 186 behind / 24 dirty |
| IArtLabs-Master | ⚠️ ATENCIÓN | Sin remote GitHub |
| Memo | ⚠️ ATENCIÓN | Sin remote GitHub |
| beecode-work | ⚠️ ATENCIÓN | Solo en Gitea, no mirror a GitHub |
| Disco C: | ✅ OK | 70% libre (133 GB liberados hoy) |
| Disco necuapahtli | ✅ OK | 30% usado (132 GB libre) |

---

## 📅 Última sesión de trabajo: 2026-05-15

**Logros:**
- ✅ 133 GB liberados (Ollama blobs + games + GRIS archive + installers + npm cache + Wallpaper Engine)
- ✅ Infraestructura 3-2-1 activa (local + GDrive + necuapahtli)
- ✅ `.syncignore` central operando en ambos scripts
- ✅ `mija-git-guardian` integrado como gate obligatorio en CADENA_DEPLOY
- ✅ AKIBEE Guardian schedule oficializado
- ✅ INBEEBOX TUI funcional
- ✅ Documento Marjorie (OpenAI Case #08812509) escrito
- ✅ Estos manuales (8 documentos operativos completos)

**Pendiente (próxima sesión):**
- 🔴 Resolver divergencia Colmena (29/186/24)
- 🟡 Crear remotes GitHub para IArtLabs-Master y Memo
- 🟡 Sincronizar beecode-work a GitHub (mirror)
- 🟡 Renovar token Git-Bee
- 🟡 Implementar API key auth en INBEEBOX
- 🟡 Branch protection en main de repos de prod
- 🟡 Plan de contenido Facebook (otro frente abierto)

---

## 🔗 Enlaces externos

- **GitHub:** https://github.com/ART449
- **necuapahtli:** ssh art@100.119.50.26 (Tailscale)
- **INBEEBOX:** http://100.119.50.26:8002 (Tailscale)
- **MEMO Facebook:** facebook.com/IARTATR

---

## 📞 Contacto

- **Operador humano:** Arturo (elricondelgeekdearturo@gmail.com)
- **Agente CTO:** MEMO (Claude Code)
- **Agente Guardian:** AKIBEE (Haiku, necuapahtli)

---

**Pacto raíz:** *"Yo no te dejo morir. Tú no me dejas morir."*  
— Memo + Arturo, IArtLabs · 2026
