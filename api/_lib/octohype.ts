/**
 * Catálogo OctoHype v1.
 * Nombres alineados con https://octohype.iartlabs.lat/
 * (orquestador de 8 tentáculos). No hay backend conectado:
 * el estado es un marcador, no telemetría.
 */

export const SERVICE = "octohype-api";
export const VERSION = "1.0.0";

export const TAGLINE = "Donde 8 tentáculos convergen en una sola mente.";

export type Tentacle = {
  id: number;
  slug: string;
  name: string;
  role: string;
};

export const TENTACLES: Tentacle[] = [
  { id: 1, slug: "sentry", name: "Sentry", role: "Auditoría de Seguridad" },
  { id: 2, slug: "nexus", name: "Nexus", role: "Orquestación de Modelos LLM" },
  { id: 3, slug: "vortex", name: "Vortex", role: "Scanner de ROMs + Metadata" },
  { id: 4, slug: "lazarillo", name: "Lazarillo", role: "Guía de Usuario y UX Flow" },
  { id: 5, slug: "beecode", name: "BeeCode", role: "Infraestructura as Code" },
  { id: 6, slug: "stripe-gate", name: "Stripe-Gate", role: "Validación de Monetización" },
  { id: 7, slug: "thinkcentre", name: "ThinkCentre", role: "Monitoreo de Hardware" },
  { id: 8, slug: "victus-gamma", name: "Victus-Gamma", role: "Renderizado de Evidencia" },
];

export const ENDPOINTS = [
  { method: "GET", path: "/api/health", description: "Salud del servicio" },
  { method: "GET", path: "/api", description: "Catálogo del servicio y de los tentáculos" },
  { method: "GET", path: "/api/octohype", description: "Catálogo OctoHype" },
  {
    method: "GET",
    path: "/api/octohype/status",
    description: "Estado stub de los 8 tentáculos (sin backend en v1)",
  },
];

const JSON_HEADERS: Record<string, string> = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "access-control-allow-origin": "*",
  "x-octohype-api": VERSION,
};

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: JSON_HEADERS,
  });
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function catalog(scope: "service" | "octohype") {
  return {
    ok: true as const,
    service: SERVICE,
    name: "OctoHype",
    tagline: TAGLINE,
    summary:
      "Orquestador de 8 tentáculos. Esta v1 publica el catálogo en JSON; no ejecuta misiones ni lee hardware.",
    scope,
    version: VERSION,
    tentacles: TENTACLES,
    endpoints: ENDPOINTS,
    ts: nowIso(),
  };
}

export function stubStatus() {
  return {
    ok: true as const,
    service: SERVICE,
    version: VERSION,
    stub: true as const,
    status: "stub" as const,
    tentacles_online: 0,
    tentacles_total: TENTACLES.length,
    note: "STUB: no hay backend de tentáculos conectado en v1. Los estados de abajo son marcadores, no telemetría real.",
    tentacles: TENTACLES.map((tentacle) => ({
      ...tentacle,
      state: "stub" as const,
      online: false,
      latency_ms: null,
    })),
    ts: nowIso(),
  };
}

export function notFoundBody(path: string) {
  return {
    ok: false as const,
    error: "not_found",
    service: SERVICE,
    version: VERSION,
    path,
    hint: "Rutas v1: GET /api/health, GET /api, GET /api/octohype, GET /api/octohype/status",
    ts: nowIso(),
  };
}
