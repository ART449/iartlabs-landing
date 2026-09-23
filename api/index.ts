import { catalog, json } from "./_lib/octohype";

export function GET(): Response {
  return json(catalog("service"));
}
