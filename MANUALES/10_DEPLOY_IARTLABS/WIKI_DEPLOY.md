# WIKI DEPLOY — iartlabs.lat · ByFlow Ecosystem
> Mantenedor: MEMO · Fecha: 2026-05-16 · Estado: EN PROGRESO

---

## Arquitectura de Deploy

```
iartlabs.lat                    → Cloudflare Pages (landing HTML)
├── thehive.iartlabs.lat        → Railway (Colmena server - hive.html)
├── kids.iartlabs.lat           → Railway (mismo server - hive-kids.html)
├── app.iartlabs.lat            → Railway (ByFlow / VibeFlow_Pro)
├── nexus.iartlabs.lat          → Railway (arturo-nexus MoE API)
├── beecode.iartlabs.lat        → Railway (BeeCode Go API)
├── colmena.iartlabs.lat        → Railway (Colmena dashboard/cerebro)
│
├── canvas.iartlabs.lat         → ❌ PENDIENTE CREAR (Canvas Chat)
└── tts.iartlabs.lat            → ❌ PENDIENTE CREAR (Neutron TTS web)
```

---

## Estado de cada proyecto

### 1. IArtLabs Landing — `iartlabs.lat`
- **Ruta:** `C:\BYFLOW\IARTLABS\index.html`
- **Tipo:** HTML estático (Tailwind CDN)
- **Deploy:** Cloudflare Pages → conectar repo, carpeta raíz `/IARTLABS`
- **Estado:** ✅ LISTO

### 2. The Hive — `thehive.iartlabs.lat`
- **Ruta:** `C:\BYFLOW\Colmena\apps\dashboard\hive.html`
- **Servidor:** `C:\BYFLOW\Colmena\apps\dashboard\server.js` (Express, puerto 3900)
- **Deploy:** Railway — servir hive.html como raíz
- **Rutas clave:**
  - `/` → `hive.html` (público)
  - `/hive-kids.html` → The Hive Kids
  - `/cerebro.html` → privado (Basic Auth)
- **Estado:** ✅ LISTO para subir

### 3. The Hive Kids — `kids.iartlabs.lat`
- **Ruta:** `C:\BYFLOW\Colmena\apps\dashboard\hive-kids.html`
- **Servidor:** mismo que The Hive (puerto 3900)
- **Deploy:** subdomain o ruta `/kids` en mismo Railway service
- **Estado:** ✅ LISTO (mismo deploy que The Hive)

### 4. ByFlow App — `app.iartlabs.lat`
- **Ruta:** `C:\BYFLOW\VibeFlow_Pro`
- **Tipo:** Node/Express monorepo (npm workspaces + turbo)
- **Deploy:** Railway — ya tiene `Dockerfile` + `railway.json`
- **Entry:** `server.js`
- **Variables:** `.env` en raíz del monorepo
- **Estado:** ✅ CASI LISTO — revisar .env antes de subir

### 5. arturo-nexus MoE API — `nexus.iartlabs.lat`
- **Ruta:** `C:\BYFLOW\arturo-nexus`
- **Tipo:** Node.js API
- **Entry:** `nexus-api.js` (tiene `START_NEXUS_API_LOCAL.bat`)
- **Deploy:** Railway — `npm start`
- **Estado:** ✅ LISTO

### 6. BeeCode — `beecode.iartlabs.lat`
- **Ruta:** `C:\BYFLOW\beecode-eje-b`
- **Tipo:** Go (API sobre socket/pipe, `vortex_engine.exe` compilado)
- **Deploy:** Railway (Go buildpack) o necuapahtli (más simple)
- **Estado:** ⚠️ REVISAR — Go en Railway requiere go.mod limpio

### 7. Colmena Dashboard — `colmena.iartlabs.lat`
- **Ruta:** `C:\BYFLOW\Colmena`
- **Tipo:** Node/Express monorepo completo
- **Entry:** `server.js` raíz (puerto 3333)
- **Deploy:** Railway
- **Variables:** `.env` + `CLAUDE_API_KEY`, `GROQ_API_KEY`
- **Estado:** ⚠️ REVISAR — 29 ahead / 190 behind de main

---

## Pendientes de crear

### Canvas Chat — `canvas.iartlabs.lat`
- **Qué es:** Chat con interfaz canvas/whiteboard
- **Stack sugerido:** React + Vite + WebSocket
- **Estado:** ❌ NO EXISTE — diseñar desde cero

### Neutron TTS — `tts.iartlabs.lat`
- **Qué es:** App web que usa `tts.js` + modelo `es_MX-claude-high.onnx`
- **Stack sugerido:** Express + HTML + WebSocket (stream de audio)
- **Modelo:** `C:\BYFLOW\Colmena\models\tts\es_MX-claude-high.onnx`
- **Estado:** ❌ NO EXISTE como app — solo módulo interno

---

## Plan de ejecución (orden)

```
Fase 1 — Inmediato (sin código nuevo)
  [ ] 1. iartlabs.lat → Cloudflare Pages (IARTLABS/index.html)
  [ ] 2. thehive.iartlabs.lat → Railway (Colmena/apps/dashboard/)
  [ ] 3. nexus.iartlabs.lat → Railway (arturo-nexus/)

Fase 2 — Esta semana (revisar .env + variables)
  [ ] 4. app.iartlabs.lat → Railway (VibeFlow_Pro/)
  [ ] 5. colmena.iartlabs.lat → Railway (Colmena/) — arreglar divergencia primero
  [ ] 6. beecode.iartlabs.lat → Railway o necuapahtli

Fase 3 — Crear desde cero
  [ ] 7. canvas.iartlabs.lat → Canvas Chat (diseño + build)
  [ ] 8. tts.iartlabs.lat → Neutron TTS web app
```

---

## Variables de entorno por proyecto

| Proyecto | Variables críticas |
|----------|--------------------|
| Colmena | `CLAUDE_API_KEY`, `GROQ_API_KEY`, `HUB_USER`, `HUB_PASS` |
| ByFlow | ver `VibeFlow_Pro/.env` |
| arturo-nexus | revisar `.env.example` |
| BeeCode | revisar configuración Go |

⚠️ **NUNCA** subir `.env` a GitHub. Railway lee variables desde su panel.

---

## DNS en Cloudflare (cuando estén listos)

```
iartlabs.lat          A/CNAME  → Cloudflare Pages
thehive.iartlabs.lat  CNAME    → Railway service URL
app.iartlabs.lat      CNAME    → Railway service URL
nexus.iartlabs.lat    CNAME    → Railway service URL
colmena.iartlabs.lat  CNAME    → Railway service URL
beecode.iartlabs.lat  CNAME    → Railway o necuapahtli IP
```

---

## Siguiente acción inmediata

**GO para Fase 1:** Subir `IARTLABS/index.html` a Cloudflare Pages.
Necesita: acceso a cuenta Cloudflare de Arturo + conectar repo GitHub `ART449/colmena-control` o similar.

— MEMO · 2026-05-16
