# Sync 3-2-1 — Estrategia de Backup

> **Versión:** 1.0 · **Última actualización:** 2026-05-15 · **Mantiene:** MEMO

Regla 3-2-1 aplicada a VICTUSART:
- **3** copias de cada dato
- **2** medios distintos
- **1** off-site

```
┌──────────────┐    ┌───────────────────┐    ┌─────────────────┐
│  VICTUSART   │───▶│ Google Drive (5TB)│    │  necuapahtli    │
│  C:\ (local) │    │  G:\Mi unidad\    │    │  (ThinkCentre)  │
│              │    │  VICTUSART_SYNC   │    │  Ubuntu Linux   │
│  COPIA #1    │    │  COPIA #2 (cloud) │    │  COPIA #3 (LAN) │
└──────────────┘    └───────────────────┘    └─────────────────┘
```

---

## 1. Componentes

### 1.1 Script GDrive: `sync_to_gdrive.ps1`

**Ubicación:** `C:\BYFLOW\scripts\sync_to_gdrive.ps1`

- Engine: **robocopy** (`/MIR /Z /R:2 /W:3 /MT:4`)
- Destino: `G:\Mi unidad\VICTUSART_SYNC\`
- Lee exclusiones de `.syncignore`
- Sincroniza proyectos raíz + perfiles + AppData configs
- Loguea a `C:\BYFLOW\scripts\sync_gdrive.log`
- Después del GDrive sync, ejecuta el rsync a necuapahtli

### 1.2 Script Necuapahtli: `sync_to_necua.py`

**Ubicación:** `C:\BYFLOW\scripts\sync_to_necua.py`

- Engine: **paramiko SFTP** (Python — no requiere rsync)
- Destino: `art@100.119.50.26:~/VICTUSART_SYNC/`
- Mismo `.syncignore` que GDrive
- Sync incremental (compara mtime + size)
- Loguea a `C:\BYFLOW\scripts\sync_necua.log`

### 1.3 Archivo de exclusiones: `.syncignore`

**Ubicación:** `C:\BYFLOW\scripts\.syncignore`

Lo leen AMBOS scripts. Una sola fuente de verdad.

**Excluye:**
```
# Secrets
.env*
*.pem
*.key
*.p12
*.token
credentials.json
firebase*.json
service-account*.json
id_rsa
id_ed25519

# Build / cache
node_modules/
__pycache__/
.git/
venv/
.venv/
dist/
build/
.next/
*.pyc

# Modelos grandes
*.gguf
*.ggml
*.safetensors
*.bin

# Windows system
NTUSER.DAT*
pagefile.sys
hiberfil.sys
```

---

## 2. Cobertura

### Proyectos raíz sincronizados
- `C:\BYFLOW` (código + Colmena)
- `C:\letras` (música/contenido)
- `C:\MIJA_SANDBOX`
- `C:\GoEcosystem`
- `C:\fixtures`
- `C:\edb`
- `C:\inetpub\wwwroot`
- `C:\tmp`

### Perfil art44
- `Documents`, `Desktop`, `Downloads`, `Music`, `Videos`, `Pictures`
- `.claude/` (config Claude Code)
- `.ssh/`, `.gitconfig`, `.config/`
- `AppData\Roaming\Claude`, `colmena-byflow`, `npm`
- `AppData\Local\Programs\cursor`

### Perfil jaart
- `Documents`, `Desktop`, `Downloads`

### Steam
- Solo manifest de **Skate** (los binarios del juego son re-descargables)

---

## 3. Horarios

| Sync | Frecuencia | Cómo |
|---|---|---|
| **GDrive** | Diario 3:00 AM | Task Scheduler |
| **GDrive** | Al login | Startup folder (3 min delay) |
| **Necuapahtli** | Diario 3:00 AM (después de GDrive) | Encadenado |
| **Necuapahtli** | Al login | Startup folder (5 min delay) |

### Archivos Startup
```
C:\Users\art44\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\
├── MEMO_sync_gdrive.bat    (3 min wait then GDrive sync)
└── MEMO_sync_necua.bat     (5 min wait then necua sync)
```

---

## 4. Operación manual

### Forzar sync ahora

```powershell
# GDrive
powershell -File "C:\BYFLOW\scripts\sync_to_gdrive.ps1"

# Necuapahtli
python "C:\BYFLOW\scripts\sync_to_necua.py"
```

### Ver logs

```powershell
Get-Content "C:\BYFLOW\scripts\sync_gdrive.log" -Tail 50
Get-Content "C:\BYFLOW\scripts\sync_necua.log" -Tail 50
```

### Verificar lo que está en GDrive

```powershell
Get-ChildItem "G:\Mi unidad\VICTUSART_SYNC" -Directory
```

### Verificar lo que está en necuapahtli

```bash
ssh necuapahtli "ls -la ~/VICTUSART_SYNC/ && du -sh ~/VICTUSART_SYNC/"
```

---

## 5. Agregar / quitar de la sincronización

### Agregar un directorio

Editar `sync_to_gdrive.ps1` y agregar:
```powershell
SyncDir "C:\NUEVA_RUTA"  "C_root\NUEVA_RUTA"
```

Editar `sync_to_necua.py` y agregar al SYNC_MAP:
```python
SYNC_MAP = [
    ...
    (r"C:\NUEVA_RUTA", "NUEVA_RUTA"),
]
```

### Excluir un patrón

Editar `.syncignore`:
```
mi_archivo_secreto.txt
mi_directorio_grande/
```

Los DOS scripts respetarán la exclusión.

---

## 6. AKIBEE Guardian de Sync

AKIBEE (en necuapahtli) audita los syncs:
- Escanea cada 2h por secrets que se hayan colado
- Backup de canales INBEEBOX cada 6h
- Si detecta `.env` o `*.pem` en `~/VICTUSART_SYNC/` → alerta inmediata en `#ops` con `@ARTURO`

Ver: `MANUALES/04_AKIBEE_GUARDIAN/README.md`

---

## 7. Troubleshooting

| Síntoma | Causa | Fix |
|---|---|---|
| `rsync: command not found` | Win Git Bash sin rsync | Usar `sync_to_necua.py` (paramiko) |
| GDrive sync falla, exit 8+ | Permisos archivo | Cerrar app que lo tiene abierto |
| Necua sync timeout | Tailscale caído | `tailscale up` en ambos lados |
| Secrets en sync | `.syncignore` no aplicó | Verificar patrones, regenerar pase |
| Disco GDrive lleno | Llegó al límite 5 TB | Limpiar `_GRIS_archivo_frio` o comprar más |

---

## 8. Restauración

### Desde GDrive

```powershell
robocopy "G:\Mi unidad\VICTUSART_SYNC\C_root\BYFLOW" "C:\BYFLOW" /MIR
```

### Desde necuapahtli

```bash
ssh necuapahtli
rsync -avz ~/VICTUSART_SYNC/BYFLOW/ /mnt/some_mount/BYFLOW_RESTORED/
# o pull desde Windows:
```

```python
# pull_from_necua.py (no creado todavía — TODO)
```

---

**Última métrica conocida** (2026-05-15):
- GDrive: ~8 GB sincronizado y subiendo
- Necuapahtli: 7.4 GB / 8,207 archivos
- Errores críticos: 0
