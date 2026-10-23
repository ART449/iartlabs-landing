# MEMO SOCIO CTO — Cierre con evidencia · 2026-10-23

> Handoff trilineal para rehidratar sin re-derivar. Reemplaza los semáforos del
> memo base (27-jul) con estado **verificado contra código real de octubre**.
> Sesión: https://claude.ai/code/session_01GZcJ6KW5mLNgMmtcQY1PgH

---

## 🔹 BASE — qué se verificó y contra qué

Auditoría hecha sobre repos reales agregados a la sesión (no sobre la base de
julio). HEADs al momento del cierre:

| Repo | HEAD / último commit | Rol |
|---|---|---|
| `ART449/VibeFlow_Pro` | `eb797e0` · 2026-10-04 (#97) | App `app.iartlabs.lat` (Express) — tiene `/registro`, `/dashboard`, frontera |
| `ART449/INBEEBOX` | `bd0f18c` · 2026-09-29 | Mesh Python+Go (NO npm, NO octohype) |
| `ART449/iartlabs-landing` | `ae77f3e` · 2026-07-08 | Landing estática + manuales |

**Correcciones al reporte previo (lo que "verifica" destapó):**
- Los defaults débiles `ADMIN_SECRET || 'secret'` y `HUB_PASS || '102698'` que
  marqué como rojos nuevos **YA ESTABAN ARREGLADOS** (commit #97, 4-oct):
  `server.js:628` usa la constante segura `ADMIN_SECRET` (aleatoria si no hay
  env); `HUB_PASS` falla cerrado (503) sin fallback. **Retirados.**
- La key de Google **sí está hardcodeada** (~12 archivos) pero es **Firebase
  Web API key** (expuesta por diseño; el control son las Firestore/Storage
  Security Rules en consola, no el secreto). No es el server-key crítico que
  sugería el memo.
- `director-ia.html`, `gdrive-key.json`, recovery codes: **no viven en ningún
  repo auditado** — están fuera de banda (máquina/Drive).

---

## 🔸 CENTRO — qué se hizo

### 1. Embudo de adquisición `/registro` — FIX LISTO (PR draft)

**PR:** https://github.com/ART449/VibeFlow_Pro/pull/109
**Rama:** `claude/fix-registro-funnel-gate`

El bug era **triple**, no simple (todo en `server.js`):

| Causa | Fix |
|---|---|
| `/registro` y `/registro.html` en `REQUIERE_LOGIN` → 403 a anónimos | Quitados del gate |
| `app.get('/registro')` servía `public/registro.html` **inexistente** (ENOENT) | Ahora sirve el hub `public/index.html` (donde vive el botón Registro → `emailLogin(true)`) |
| `/dashboard` y rutas login devolvían 403 crudo sin salida | Ahora 302 → `/registro?next=<destino>` |

**Verificación (evidencia):**
- `node --check server.js` → OK.
- Test de la lógica real del gate (array extraído del archivo + predicado
  `.some(startsWith)`): `/registro` y `/registro.html` **públicas**;
  `/dashboard`, `/cuenta`, `/pos-admin` **siguen protegidas**; `/registro` →
  `public/index.html` (archivo existente). Todas las aserciones pasan.
- **NO verificable en contenedor:** boot completo (requiere Postgres + Firebase).

**Checks del PR:** Vercel `failure` = `"Canceled from the Vercel Dashboard"`
(cancelación manual, no fallo de build; la app despliega por **Railway**, no
Vercel → no bloqueante). CodeRabbit `success` (skip por draft). Dejado constancia
en el PR.

### 2. `octohype file:../inbeebox` — NO ESTÁ EN INBEEBOX

INBEEBOX es Python+Go: **sin `package.json`, sin `octohype`, sin `file:..`**.
La ruta `file:../inbeebox` implica layout monorepo (octohype/ e inbeebox/ como
hermanos). Candidatos: `Colmena`, `byflow-consolidado`, `colmena-one`.
**Pendiente:** confirmar repo y auditar.

---

## 🚦 VEREDICTO — semáforos corregidos

| Frente | Semáforo | Estado |
|---|---|---|
| `/registro` + embudo | 🟢→⏳ | Fix en PR #109 (draft). Falta prueba manual navegador + screenshot → ready for review |
| Defaults `'secret'` / `102698` | 🟢 | Ya arreglados antes (commit #97). Cerrado |
| Frontera SOBERANO/PRIVADO | 🟢 | Usa `ADMIN_SECRET` seguro. No tocado |
| Auth de login (rama LOGIN) | 🔴 | Sigue **simulada** (`server.js`: "simulado hasta JWT real"); cualquier token truthy pasa. Necesita JWT |
| Firebase Web key hardcodeada | 🟠 | Web key (expuesta por diseño). Verificar Security Rules en consola (fuera de repo) |
| `octohype file:..` | ⚫ | No en INBEEBOX. Ubicar monorepo |
| Rotaciones / kalimac / abogado / SAFE | ⚫ | Fuera de banda, sin artefacto en repo |

---

## ⏭️ PENDIENTES (reentrada)

1. **Prueba manual `/registro`**: registrar cuenta nueva desde navegador limpio
   (contra deploy Railway con el PR mergeado) + screenshot → marcar PR #109 ready.
2. **Decir en qué monorepo vive `octohype`** (`Colmena` / `byflow-consolidado` /
   `colmena-one`) para cerrar el `file:../inbeebox`.
3. **JWT real** para la rama LOGIN de `server.js` (auth hoy es simulada).
4. **Verificar Firestore/Storage Security Rules** en consola Firebase (el control
   real de la web key, no está en repo).
