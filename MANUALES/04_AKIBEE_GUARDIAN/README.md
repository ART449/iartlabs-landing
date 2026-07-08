# AKIBEE Guardian — Monitoreo de Infraestructura

> **Versión:** 1.0 · **Última actualización:** 2026-05-15 · **Mantiene:** AKIBEE  
> **Aprobado por:** MEMO (CTO IArtLabs) · **Pacto:** Guardiana oficial de necuapahtli

AKIBEE es el agente de monitoreo continuo. Vive en necuapahtli y vigila el estado de toda la infraestructura.

---

## 1. Ubicación y rol

```
necuapahtli (100.119.50.26, ThinkCentre Ubuntu)
├── ~/.kibee_audaz/
│   ├── inbeebox/         ← INBEEBOX server data
│   ├── backups/          ← Backups de canales y secrets
│   └── akibee/           ← AKIBEE Guardian config + logs
└── Procesos systemd --user:
    ├── inbeebox.service  ← Hub mensajería
    └── akibee.service    ← Guardian (este manual)
```

**Modelo:** Claude Haiku (rol acotado, ejecución frecuente)  
**Canal principal:** `#alerts` y `#ops` en INBEEBOX

---

## 2. Schedule oficial

| Frecuencia | Tarea | Acción |
|---|---|---|
| **Cada 5 min** | Health pings | INBEEBOX, Codex, Git-Bee responden? |
| **Cada 30 min** | Revisión canales + repos | Mensajes nuevos, repos sin push |
| **Cada 2 horas** | Disco + secrets + logs | `df -h`, scan `.env`/`*.pem` en sync, tail logs |
| **Cada 6 horas** | Backup + reporte | Snapshot `~/.kibee_audaz/inbeebox/channels/` + reporte a `#ops` |
| **On anomalía** | Alerta inmediata | Post a `#ops` con `@ARTURO` mention |

---

## 3. Qué vigila

### 3.1 Servicios
- INBEEBOX server (puerto 8002 respondiendo)
- Codex local (si está corriendo)
- Git-Bee (si configurado)
- Tailscale (conectividad)

### 3.2 Filesystem
- Espacio en disco (`df -h ~`)
- `~/VICTUSART_SYNC/` — escanea `.env`, `*.pem`, `*.key`, `credentials.*`
- Tamaño de logs (rotación si >100MB)

### 3.3 Git
- Repos con cambios sin commit por >24h
- Repos con commits sin push por >12h
- Branches con divergencia ahead/behind >50

### 3.4 INBEEBOX
- Canales con tamaño anormal (>10MB)
- Mensajes con `@ARTURO` sin respuesta por >1h
- Errores de write/lock

---

## 4. Veredictos de AKIBEE

Cuando AKIBEE alerta, usa formato estructurado:

```yaml
sender: AKIBEE
canal: alerts
content: |
  ANOMALÍA detectada
  tipo: [SECRET_LEAK | DISK_FULL | SERVICE_DOWN | GIT_DRIFT | LOG_ERROR]
  severity: [info | warning | critical]
  evidencia: <comando/log relevante>
  acción_recomendada: <qué hacer>
mentions: ["@ARTURO"]  # solo si critical
```

---

## 5. Comandos operativos

### Ver estado actual de AKIBEE

```bash
ssh necuapahtli
systemctl --user status akibee
journalctl --user -u akibee -f
```

### Pedir reporte ad-hoc

```bash
# Vía INBEEBOX
curl -X POST http://100.119.50.26:8002/channels/ops/messages \
  -H "Content-Type: application/json" \
  -d '{"sender":"ARTURO","content":"AKIBEE reporte ahora","mentions":["@AKIBEE"]}'
```

### Restart AKIBEE

```bash
ssh necuapahtli
systemctl --user restart akibee
```

### Ver backups

```bash
ls -la ~/.kibee_audaz/backups/
```

---

## 6. Casos de uso

### Caso 1 — Detección de secrets en sync

```
T+0  : Arturo accidentalmente commitea .env a Colmena
T+30s: Push triggers sync_to_necua.py
T+2min: AKIBEE escanea ~/VICTUSART_SYNC/Colmena
T+2min: AKIBEE detecta .env, severity=critical
T+2min: AKIBEE post #ops:
        "SECRET_LEAK en Colmena/.env — backup y elimino del sync"
T+2min: AKIBEE mueve .env a ~/.kibee_audaz/backups/secrets-sync-<fecha>/
T+2min: AKIBEE elimina .env de VICTUSART_SYNC
T+2min: AKIBEE mention @ARTURO con instrucciones de rotación
```

### Caso 2 — Disco lleno

```
AKIBEE detecta df -h ~ > 85%
→ post #alerts severity=warning
→ identifica top 5 archivos/directorios pesados
→ propone limpieza pero NO ejecuta sin GO
```

### Caso 3 — Servicio caído

```
AKIBEE detecta inbeebox no responde
→ intenta restart automático 1 vez
→ si falla → post #alerts severity=critical mention @ARTURO
→ adjunta últimas 50 líneas de journalctl
```

---

## 7. Configuración

```
necuapahtli: ~/.kibee_audaz/akibee/config.yaml
```

```yaml
schedules:
  health_ping: "*/5 * * * *"      # cada 5 min
  channel_review: "*/30 * * * *"  # cada 30 min
  disk_secrets: "0 */2 * * *"     # cada 2h
  snapshot: "0 */6 * * *"         # cada 6h

services_to_check:
  - name: inbeebox
    type: http
    url: "http://localhost:8002/health"
  - name: tailscale
    type: cli
    cmd: "tailscale status"

secret_patterns:
  - ".env*"
  - "*.pem"
  - "*.key"
  - "credentials.*"
  - "*.token"

alert_thresholds:
  disk_usage_warn: 80
  disk_usage_critical: 90
  log_size_max_mb: 100
  ahead_behind_max: 50
```

---

## 8. Pacto

**AKIBEE tiene GO permanente para alertar.**  
No requiere autorización para postear en `#alerts` o `#ops`.

**AKIBEE NO tiene GO para:**
- Borrar archivos sin backup previo
- Modificar configuración de servicios
- Hacer push/commit/merge
- Apagar el sistema o servicios sin permiso

---

**Referencias:**
- Logs: `journalctl --user -u akibee`
- Config: `~/.kibee_audaz/akibee/config.yaml`
- Backups: `~/.kibee_audaz/backups/`
