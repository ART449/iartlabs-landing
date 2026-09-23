/**
 * Servidor local equivalente a `vercel dev` para esta landing + /api.
 * - /api y /api/* → funciones JSON (nunca index.html), en cualquier host
 * - host api.iartlabs.lat:
 *     /            → 307 a /api (redirect; en Vercel un rewrite no tapa index.html)
 *     /health      → rewrite interno a /api/health
 *     /octohype    → rewrite interno a /api/octohype
 *     /octohype/status → rewrite interno a /api/octohype/status
 * - otro host: archivo estático si existe, si no index.html
 *
 * Uso: npm run dev:api
 */
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url)).replace(/[/\\]+$/, "");
const PORT = Number(process.env.PORT || 3000);

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".canvas": "application/json; charset=utf-8",
};

type Handler = (request: Request) => Response | Promise<Response>;

const API_HOST = "api.iartlabs.lat";

const routes: Record<string, string> = {
  "/api": "api/index.ts",
  "/api/health": "api/health.ts",
  "/api/octohype": "api/octohype/index.ts",
  "/api/octohype/status": "api/octohype/status.ts",
};

const friendlyRewrites: Record<string, string> = {
  "/health": "/api/health",
  "/octohype": "/api/octohype",
  "/octohype/status": "/api/octohype/status",
};

function isApiHost(req: IncomingMessage): boolean {
  const host = String(req.headers.host || "").split(":")[0].toLowerCase();
  return host === API_HOST;
}

function pathnameOf(req: IncomingMessage): string {
  const raw = req.url || "/";
  const path = raw.split("?")[0] || "/";
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

function isApi(pathname: string): boolean {
  return pathname === "/api" || pathname.startsWith("/api/");
}

function safeFile(pathname: string): string | null {
  const decoded = decodeURIComponent(pathname);
  if (decoded.includes("\0")) return null;
  const relative = decoded.replace(/^\/+/, "");
  const abs = normalize(join(ROOT, relative));
  if (abs !== ROOT && !abs.startsWith(ROOT + sep)) return null;
  if (relative.split("/").some((part) => part.startsWith("."))) return null;
  return abs;
}

async function loadGet(file: string): Promise<Handler> {
  const mod = await import(pathToFileURL(join(ROOT, file)).href);
  if (typeof mod.GET !== "function") {
    throw new Error(`La función ${file} no exporta GET`);
  }
  return mod.GET as Handler;
}

async function dispatchApi(req: IncomingMessage, pathname: string): Promise<Response> {
  const file = routes[pathname] ?? "api/[...slug].ts";
  const GET = await loadGet(file);
  const host = req.headers.host || `localhost:${PORT}`;
  const request = new Request(`http://${host}${req.url || pathname}`, {
    method: req.method || "GET",
  });
  if ((req.method || "GET").toUpperCase() !== "GET") {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "method_not_allowed",
        service: "octohype-api",
        path: pathname,
      }),
      {
        status: 405,
        headers: {
          "content-type": "application/json; charset=utf-8",
          allow: "GET",
        },
      },
    );
  }
  return GET(request);
}

async function readStatic(pathname: string): Promise<{ body: Buffer; type: string } | null> {
  const candidates = pathname === "/" ? [join(ROOT, "index.html")] : [];
  const file = pathname === "/" ? null : safeFile(pathname);
  if (file) candidates.push(file, join(file, "index.html"));
  for (const candidate of candidates) {
    try {
      const body = await readFile(candidate);
      const type = MIME[extname(candidate).toLowerCase()] || "application/octet-stream";
      return { body, type };
    } catch {
      // siguiente candidato
    }
  }
  return null;
}

async function send(res: ServerResponse, response: Response): Promise<void> {
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });
  const buf = Buffer.from(await response.arrayBuffer());
  res.writeHead(response.status, headers);
  res.end(buf);
}

const server = createServer(async (req, res) => {
  const pathname = pathnameOf(req);
  try {
    if (isApiHost(req) && pathname === "/") {
      res.writeHead(307, {
        location: "/api",
        "cache-control": "no-store",
      });
      res.end();
      return;
    }
    const friendly = isApiHost(req) ? friendlyRewrites[pathname] : undefined;
    if (friendly) {
      await send(res, await dispatchApi(req, friendly));
      return;
    }
    if (isApi(pathname)) {
      await send(res, await dispatchApi(req, pathname));
      return;
    }
    if ((req.method || "GET").toUpperCase() !== "GET" && (req.method || "GET").toUpperCase() !== "HEAD") {
      res.writeHead(405, { "content-type": "text/plain; charset=utf-8" });
      res.end("Method Not Allowed");
      return;
    }
    const file = await readStatic(pathname);
    if (file) {
      res.writeHead(200, { "content-type": file.type });
      res.end((req.method || "GET").toUpperCase() === "HEAD" ? undefined : file.body);
      return;
    }
    const spa = await readFile(join(ROOT, "index.html"));
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end((req.method || "GET").toUpperCase() === "HEAD" ? undefined : spa);
  } catch (error) {
    const message = error instanceof Error ? error.message : "error";
    res.writeHead(500, { "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ ok: false, error: message }));
  }
});

server.listen(PORT, () => {
  console.log(`octohype-api local http://localhost:${PORT}`);
  console.log(`  GET /api/health`);
  console.log(`  GET /`);
});
