import { json, nowIso, SERVICE, VERSION } from "./_lib/octohype.ts";

export function GET(): Response {
  return json({
    ok: true,
    service: SERVICE,
    version: VERSION,
    ts: nowIso(),
  });
}
