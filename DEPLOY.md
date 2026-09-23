# Desplegar OctoHype API en `api.iartlabs.lat`

Guía corta para quien usa Vercel por primera vez. No hace falta Firebase ni secretos.

## Decisión

La API va en un **proyecto Vercel nuevo**, separado del que ya tiene la home.

- **No muevas `iartlabs.lat`.**
- **No linkees este repo al proyecto que ya tiene `iartlabs.lat`.**
- **No agregues `iartlabs.lat` en Domains de este proyecto nuevo.**
- La home Vite (el sitio que hoy responde en `https://iartlabs.lat/`, título `frontend`) se queda donde está.

Este repo se despliega solo como API, en el subdominio `api.iartlabs.lat`.

## Qué vas a tener

| URL | Qué pasa |
| --- | --- |
| `https://api.iartlabs.lat/` | Redirect **307** a `/api` (el catálogo JSON). Vercel no puede reescribir `/` encima de `index.html`; el redirect sí corre antes. |
| `https://api.iartlabs.lat/health` | Rewrite interno a `/api/health`. La URL no cambia. JSON. |
| `https://api.iartlabs.lat/octohype` | Rewrite a `/api/octohype`. Catálogo. |
| `https://api.iartlabs.lat/octohype/status` | Rewrite a `/api/octohype/status`. Estado **stub**. |
| `https://api.iartlabs.lat/api/health` (y el resto de `/api/*`) | Las funciones, igual que siempre. |

Esos atajos (`/`, `/health`, `/octohype`, `/octohype/status`) solo aplican cuando el host es `api.iartlabs.lat`. En la URL `*.vercel.app` del proyecto nuevo usa `/api/...`.

Los 8 tentáculos son los de [octohype.iartlabs.lat](https://octohype.iartlabs.lat/): Sentry, Nexus, Vortex, Lazarillo, BeeCode, Stripe-Gate, ThinkCentre, Victus-Gamma.

## 1. Instalar la CLI e iniciar sesión

Hace falta Node.js 18 o más nuevo (https://nodejs.org).

```bash
npm install -g vercel
vercel login
```

`vercel login` abre el navegador (o te da un código). Entra con la cuenta dueña del DNS de `iartlabs.lat`.

## 2. Crear un proyecto nuevo (no el de la home)

En la carpeta de este repo:

```bash
vercel link
```

- Elige el equipo (team) correcto.
- Cuando pregunte el proyecto, **créalo nuevo**. Nombre sugerido: `octohype-api` o `iartlabs-api`.
- Si ves el proyecto que ya sirve `iartlabs.lat`, **no lo elijas**.

`vercel link` solo guarda la relación en tu máquina (carpeta `.vercel/`, no se sube a git). No mueve dominios.

## 3. Producción del proyecto nuevo

```bash
vercel --prod
```

La CLI imprime una URL `https://octohype-api-….vercel.app` (el nombre varía). Esa URL **no** es `iartlabs.lat`.

```bash
curl -i https://TU-URL.vercel.app/api/health
```

Tiene que decir `content-type: application/json` y un cuerpo `{"ok":true,"service":"octohype-api",...}`.

`https://iartlabs.lat/` no cambia con este comando, porque el dominio sigue en el otro proyecto.

## 4. Agregar solo el subdominio

En el navegador: Vercel → el proyecto **nuevo** → Settings → Domains → Add:

```text
api.iartlabs.lat
```

No escribas `iartlabs.lat` ni `www.iartlabs.lat` ahí.

Vercel te muestra el DNS que falta. Casi siempre es:

| Tipo | Nombre | Destino |
| --- | --- | --- |
| CNAME | `api` | `cname.vercel-dns.com` |

Usa el destino **exacto** que muestre la pantalla de Vercel si es distinto.

Dónde crearlo: el DNS de `iartlabs.lat` (Cloudflare u otro). Solo ese registro. No toques el registro del apex (`@` / `iartlabs.lat`) ni el de `www`.

Si Cloudflare tiene el proxy naranja, para la primera verificación deja `api` en «DNS only» (nube gris) hasta que Vercel marque el dominio como válido. Después puedes volver a activar el proxy.

## 5. Comprobar el subdominio

Cuando el dominio quede en verde:

```bash
curl -i https://api.iartlabs.lat/api/health
curl -i https://api.iartlabs.lat/health
curl -i https://api.iartlabs.lat/octohype
curl -i https://api.iartlabs.lat/octohype/status
curl -i https://api.iartlabs.lat/
curl -i https://iartlabs.lat/
```

- Los cuatro primeros de la API son JSON (`/api/health` y `/health` dicen lo mismo).
- `https://api.iartlabs.lat/` responde `307` con `Location: /api`. `curl -L` sigue el redirect y muestra el catálogo.
- `https://iartlabs.lat/` sigue siendo la home Vite de siempre (HTML, título `frontend`).

## Probar en tu máquina (opcional, antes del dominio)

```bash
vercel dev --local
```

Sin la CLI:

```bash
npm run dev:api
```

```bash
curl -i http://127.0.0.1:3000/api/health
curl -i http://127.0.0.1:3000/
curl -i -H "Host: api.iartlabs.lat" http://127.0.0.1:3000/health
curl -i -H "Host: api.iartlabs.lat" http://127.0.0.1:3000/
```

`/api/health` es JSON. `/` sin ese `Host` sigue siendo el HTML de este repo. Con `Host: api.iartlabs.lat`, `/health` es JSON y `/` es el 307 hacia `/api`.

`npm run verify:api` repite esas comprobaciones.

Nota: `vercel dev` a veces no aplica las reglas `has` (el filtro por host) en local. En ese caso los atajos se comprueban con `npm run dev:api` y, de verdad, al tener `api.iartlabs.lat` apuntando al proyecto nuevo. `/api/*` sí responde en `vercel dev`.

## Qué no incluye v1

- Sin Firebase y sin variables secretas.
- `/octohype/status` y `/api/octohype/status` marcan `"stub": true`. No hay backend de tentáculos.
- No hay `POST /api/octohype/execute`. Una ruta `/api` desconocida es JSON 404.
