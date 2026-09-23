import { catalog, json } from "./_lib/octohype.ts";

export function GET(): Response {
  return json(catalog("service"));
}
