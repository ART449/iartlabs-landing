# Infraestructura VICTUSART — Mapa Completo

> **Versión:** 1.0 · **Última actualización:** 2026-05-15 · **Mantiene:** MEMO

Topología física y lógica de la infraestructura IArtLabs / VICTUSART.

---

## 1. Hardware

### 1.1 VICTUSART (máquina principal)
- **Modelo:** HP Victus laptop
- **CPU:** Intel
- **GPU:** RTX 3050 (4GB VRAM) ← cuello de botella para modelos grandes
- **RAM:** ~16 GB
- **SSD:** 953 GB en C: (70% libre tras limpieza)
- **OS:** Windows 11

### 1.2 necuapahtli (servidor secundario)
- **Modelo:** Lenovo ThinkCentre
- **OS:** Ubuntu Server
- **Disco:** 196 GB total, 132 GB libre (30% usado)
- **Uptime:** 6+ días (estable)
- **Rol:** Hub INBEEBOX + AKIBEE Guardian + backup secundario

### 1.3 Almacenamiento
- **C:** SSD principal — código activo
- **D:** Micro SD 32 GB — backups menores
- **E:** USB externo — backups originales históricos
- **G:** Google Drive 5 TB (virtual mount via Google Drive Desktop)

---

## 2. Red

```
       Internet
          │
          │
     [Router casa]
          │
   ┌──────┴──────┐
   │             │
VICTUSART   necuapahtli
   │             │
   └─────────────┘
        │
   Tailscale VPN
   (100.64.0.0/10)
   - VICTUSART: 100.119.x.x
   - necuapahtli: 100.119.50.26
```

**Tailscale:** VPN privada mesh. Permite SSH y APIs entre máquinas sin abrir puertos al internet.

**Hosts conocidos:**
- `necuapahtli` → `100.119.50.26`
- `VICTUSART` → variable

**SSH config:** `C:\Users\art44\.ssh\config`
```
Host necuapahtli
    HostName 100.119.50.26
    User art
    IdentityFile ~/.ssh/id_ed25519
    StrictHostKeyChecking no
    ServerAliveInterval 30
```

---

## 3. Servicios activos

### En VICTUSART

| Servicio | Donde | Puerto | Función |
|---|---|---|---|
| Google Drive Desktop | Background service | — | Monta G: |
| Ollama | Background service | 11434 | LLMs locales |
| Cursor | App | — | Editor con IA |
| Claude Code | Terminal | — | Asistente principal |
| Task Scheduler tasks | Sistema | — | MEMO_GDrive_Sync, MEMO_Necua_Sync |

### En necuapahtli

| Servicio | Tipo | Puerto | Función |
|---|---|---|---|
| INBEEBOX | systemd --user | 8002 | Hub mensajería FastAPI |
| AKIBEE | systemd --user | — | Guardian de monitoreo |
| SSH | systemd | 22 | Acceso remoto |
| Tailscale | systemd | — | VPN |

---

## 4. Storage layout

### VICTUSART (C:)
```
C:\
├── BYFLOW\                          ← Workspace principal (64 GB)
│   ├── Colmena\                     ← Ecosistema agentes
│   │   ├── core\
│   │   ├── memo-central\
│   │   ├── memory\MEMO_RACK\
│   │   └── INBEEBOX\
│   ├── IARTLABS\
│   │   ├── MANUALES\                ← Tú estás aquí
│   │   ├── evidence\
│   │   │   └── marjorie_pack_v1\
│   │   └── plans\
│   ├── scripts\                     ← Sync scripts + .syncignore
│   ├── ArT-Assistant\
│   ├── arturo-nexus\
│   ├── INBEEBOX\
│   ├── kaizen-backend\
│   ├── Memo\                         (sin remote)
│   ├── IArtLabs-Master\              (sin remote)
│   ├── VibeFlow_Pro\
│   ├── MIJA_FOCUS_OVERLAY\
│   ├── byflow-area-musica\
│   ├── beecode-work\                 (remote: Gitea)
│   └── _control\                     (remote: colmena-control)
├── letras\                            ← Música/contenido
├── MIJA_SANDBOX\
├── GoEcosystem\                       ← Repo Go
├── fixtures\
├── edb\
└── tmp\
```

### necuapahtli (`/home/art`)
```
/home/art/
├── .kibee_audaz/                     ← INBEEBOX + AKIBEE
│   ├── inbeebox/channels/*.json
│   ├── akibee/config.yaml
│   └── backups/
├── VICTUSART_SYNC/                    ← Sync desde VICTUSART
│   ├── BYFLOW/
│   ├── letras/
│   ├── MIJA_SANDBOX/
│   ├── GoEcosystem/
│   └── .syncignore
└── projects/                         ← Proyectos locales necua
```

### Google Drive (G:)
```
G:\Mi unidad\
└── VICTUSART_SYNC\                    ← 118 GB sincronizados
    ├── C_root\
    │   ├── BYFLOW\
    │   ├── letras\
    │   ├── MIJA_SANDBOX\
    │   ├── GoEcosystem\
    │   └── ...
    ├── users\
    │   ├── art44\
    │   │   ├── Documents\
    │   │   ├── Desktop\
    │   │   │   └── _5S_VISUAL\
    │   │   │       ├── _GRIS_archivo_frio\   ← 4.42 GB (movido aquí)
    │   │   │       ├── _AMARILLO_revision\
    │   │   │       ├── _AZUL_*\
    │   │   │       └── _VERDE_activo\
    │   │   ├── dot_claude\
    │   │   └── ...
    │   └── jaart\
    └── steam\
        └── skate_manifest\
```

---

## 5. Sistema 5S Visual (Desktop)

Convención de organización del Desktop:

| Color | Nombre | Significado |
|---|---|---|
| ⬛ NEGRO | `_NEGRO_no_tocar` | Protegido, no modificar |
| 🔴 ROJO | `_ROJO_cuarentena_no_borrar` | Sospechoso, revisar antes |
| 🟢 VERDE | `_VERDE_activo` | En uso actual |
| 🔵 AZUL | `_AZUL_contexto` / `_herramientas` | Contexto / herramientas |
| 🟡 AMARILLO | `_AMARILLO_revision` | Necesita revisión |
| ⬜ GRIS | `_GRIS_archivo_frio` | Archivo frío (GDrive only) |

---

## 6. Flujos de datos

### Sync diario
```
03:00 AM  ─┐
03:00 AM  ─┼─→ sync_to_gdrive.ps1 corre via Task Scheduler
           │   ↓
           │   robocopy C:\* → G:\Mi unidad\VICTUSART_SYNC\
           │   ↓
           │   (encadenado) sync_to_necua.py
           │   ↓
           │   paramiko SFTP → art@100.119.50.26:~/VICTUSART_SYNC/
           │
           └── Reporta a INBEEBOX #ops cuando termina
```

### Sync al login (Windows Startup)
```
Login art44 ─┐
              ├─→ MEMO_sync_gdrive.bat (3 min wait)
              └─→ MEMO_sync_necua.bat  (5 min wait)
```

### Mensajería (INBEEBOX)
```
Agente_X (cualquier máquina)
    ↓ HTTP POST
necuapahtli:8002/channels/{c}/messages
    ↓ append JSON
~/.kibee_audaz/inbeebox/channels/{c}.json
    ↓ HTTP GET (poll cada 5s desde TUI)
TUI / consumidores
```

### Monitoreo AKIBEE
```
AKIBEE Guardian
    ├─→ cada 5min: ping INBEEBOX, Codex
    ├─→ cada 30min: revisa #ops + #alerts
    ├─→ cada 2h: df -h + secrets scan
    ├─→ cada 6h: backup channels/ + reporte
    └─→ on anomalía: alerta #alerts @ARTURO
```

---

## 7. Credenciales (ubicación, no valores)

| Secreto | Donde vive | Notas |
|---|---|---|
| GitHub PAT | Windows Credential Manager | via `gh auth` |
| SSH ed25519 | `~/.ssh/id_ed25519` | passphrase opcional |
| Tailscale auth | Sistema | via `tailscale up` |
| Google Drive | Google account | OAuth via app |
| OpenAI API key | `.env` files | nunca commiteado (.syncignore) |
| Anthropic API key | `.env` files | nunca commiteado |

⚠️ **Todos los `.env*`, `*.pem`, `*.key` están excluidos del sync** (ver `.syncignore`).

---

## 8. Recuperación de desastres

### Si VICTUSART muere
1. SSH a necuapahtli
2. Pull desde `~/VICTUSART_SYNC/`
3. Configurar nueva máquina con `.claude/`, `.ssh/`, Tailscale
4. Reinstalar Cursor + Claude Code

### Si necuapahtli muere
1. Restaurar desde Google Drive: `G:\Mi unidad\VICTUSART_SYNC\`
2. Reinstalar Ubuntu + dependencias
3. Restaurar `~/.kibee_audaz/` desde backup
4. `systemctl --user enable inbeebox akibee`

### Si Google Drive falla
1. Tener necuapahtli como respaldo
2. Tener USB externo (E:) con snapshot histórico

---

## 9. Métricas operacionales (2026-05-15)

| Métrica | Valor |
|---|---|
| Disco C: usado | 70% (291 GB libre) |
| Disco necuapahtli usado | 30% (132 GB libre) |
| Google Drive VICTUSART_SYNC | 118 GB |
| Repos GitHub activos | 14 |
| Repos locales con remote | 11 de 13 |
| Servicios systemd OK | INBEEBOX + AKIBEE |
| Uptime necuapahtli | 6 días+ |

---

**Referencias cruzadas:**
- `01_INBEEBOX/` — detalles del hub
- `02_COLMENA/` — agentes y cadenas
- `03_SYNC_321/` — backup strategy
- `04_AKIBEE_GUARDIAN/` — monitoreo
- `07_GITHUB_OPS/` — repos y workflows
