# Desplegar la API OctoHype en Vercel

Guía corta para quien usa Vercel por primera vez. El dominio `iartlabs.lat` ya puede estar en un proyecto de Vercel. Esta guía no crea secretos ni pide Firebase.

## Qué queda publicado

| URL | Qué responde |
| --- | --- |
| `https://iartlabs.lat/` | La landing (HTML). Las rutas que no son archivos siguen cayendo en `index.html`. |
| `https://iartlabs.lat/api/health` | JSON: `{ "ok": true, "service": "octohype-api", ... }` |
| `https://iartlabs.lat/api` y `/api/octohype` | Catálogo de OctoHype y sus 8 tentáculos |
| `https://iartlabs.lat/api/octohype/status` | Estado **stub** (marcador). No hay backend de tentáculos en v1. |

OctoHype es el orquestador de 8 tentáculos (Sentry, Nexus, Vortex, Lazarillo, BeeCode, Stripe-Gate, ThinkCentre, Victus-Gamma), igual que en [octohype.iartlabs.lat](https://octohype.iartlabs.lat/).

## Por qué `/api` devolvía HTML

Hoy `https://iartlabs.lat/api` responde el shell de la SPA (`<title>frontend</title>`), con `content-type: text/html`. Eso pasa porque el proyecto de Vercel reescribe **todas** las rutas a `index.html` y no había funciones en `/api`.

`vercel.json` de este repo hace el fallback de la SPA **excepto** `/api` y `/api/*`:

```json
{ "source": "/((?!api(?:/|$)).*)", "destination": "/index.html" }
```

Las funciones viven en `api/*.ts`. Vercel las publica solas (no hace falta un servidor aparte). Un archivo dentro de `api/` que empieza con `_` (`api/_lib/`) es código compartido, no una ruta.

## 1. Instalar la CLI e iniciar sesión

Hace falta Node.js 18 o más nuevo (https://nodejs.org).

```bash
npm install -g vercel
vercel login
```

`vercel login` abre el navegador (o te da un código) para entrar con la cuenta dueña de `iartlabs.lat`.

## 2. Enlazar este repositorio al proyecto que ya tiene el dominio

En la carpeta del repo:

```bash
vercel link
```

- Elige el equipo (team) correcto.
- Elige el proyecto **existente** donde ya está `iartlabs.lat`. No hace falta crear uno nuevo si ese proyecto ya tiene el dominio.

Si Vercel crea un proyecto nuevo, el dominio no se mueve solo. Un dominio solo puede estar en un proyecto. Para pasarlo: Vercel → el proyecto viejo → Settings → Domains → quitar `iartlabs.lat`, y en el proyecto nuevo → Settings → Domains → agregarlo.

**Ojo con la página de inicio.** El sitio que hoy responde en `iartlabs.lat` es un build de Vite cuyo `<title>` es `frontend`. Este repositorio (`ART449/iartlabs-landing`) en `/` sirve `index.html` («IArtLabs — La Colmena»), más `MANUALES/` y `demos/`. Al hacer `--prod` desde aquí, `/` pasa a ser **esta** landing. La API JSON queda en `/api`. Si el app Vite vive en otro proyecto y quieres conservarlo en el dominio, no muevas `iartlabs.lat` hasta decidir cuál de los dos es la home.

## 3. Probar en tu máquina

Con la CLI (el mismo runtime que producción):

```bash
vercel dev
```

Si todavía no corriste `vercel link`, esta variante no pide proyecto ni baja variables:

```bash
vercel dev --local
```

Sin cuenta de Vercel, este repo trae un servidor equivalente:

```bash
npm run dev:api
```

En otra terminal:

```bash
curl -i http://localhost:3000/api/health
curl -i http://localhost:3000/
curl -i http://localhost:3000/api/octohype/status
```

`/api/health` debe traer `content-type: application/json` y un cuerpo que empieza con `{`. No debe traer `<html>` ni `<title>frontend</title>`.

`/` debe ser HTML de la landing.

Para repetir esas comprobaciones de un jalón:

```bash
npm run verify:api
```

## 4. Preview (antes de tocar el dominio)

```bash
vercel
```

La CLI imprime una URL `https://….vercel.app`. Esa URL no reemplaza `iartlabs.lat`.

```bash
curl -i https://TU-PREVIEW.vercel.app/api/health
curl -i https://TU-PREVIEW.vercel.app/
```

## 5. Producción

```bash
vercel --prod
```

Si el proyecto de GitHub ya está conectado en Vercel, un push a `main` también despliega. El archivo `vercel.json` del commit es el que manda en ese deploy.

Después:

```bash
curl -i https://iartlabs.lat/api/health
curl -i https://iartlabs.lat/
```

## 6. El dominio que ya está en Vercel

Si `iartlabs.lat` ya figura en Settings → Domains de **este** proyecto, no cambies DNS para que `/api` funcione. El path `/api` sale del mismo deploy que la landing.

En el dashboard, borra un Rewrite manual que sea «todo → `/index.html`» (`/(.*)` o `/:path*`). Si esa regla sigue en el proyecto, puede volver a servir el HTML en `/api`. La regla buena ya está en `vercel.json` y deja `/api` fuera.

Los archivos que sí existen (`/MANUALES/...`, `/demos/...`) se sirven tal cual. Vercel mira el disco antes de aplicar el rewrite.

## 7. Más adelante: `api.iartlabs.lat` (opcional)

No hace falta para v1. La forma preferida es `https://iartlabs.lat/api/...`.

Cuando quieras el subdominio:

1. Vercel → Project → Settings → Domains → Add → `api.iartlabs.lat`.
2. En el DNS de `iartlabs.lat` (Cloudflare u otro), un registro **CNAME**:
   - Nombre: `api`
   - Destino: el que muestre Vercel (casi siempre `cname.vercel-dns.com`)
3. Si Cloudflare tiene el proxy naranja, para la primera verificación conviene dejar el registro en «DNS only» (nube gris) hasta que el certificado quede activo. Luego puedes volver a activar el proxy.
4. La ruta no cambia. Queda `https://api.iartlabs.lat/api/health`, no `https://api.iartlabs.lat/health`.

Las respuestas ya traen `access-control-allow-origin: *`, así un GET desde otra página puede leer el JSON.

## Qué no incluye esta v1

- Sin Firebase y sin variables secretas.
- `/api/octohype/status` marca cada tentáculo con `"state": "stub"` y `"stub": true`. No afirma que estén en línea.
- No hay `POST /api/octohype/execute`. Una ruta `/api` desconocida responde JSON 404, no el HTML de la landing.
