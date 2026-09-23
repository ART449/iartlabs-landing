import { json, notFoundBody } from "./_lib/octohype.ts";

/**
 * Cualquier /api/* que no tenga función propia.
 * JSON 404, nunca el HTML de la SPA.
 */
export function GET(request: Request): Response {
  const path = new URL(request.url).pathname;
  return json(notFoundBody(path), 404);
}
