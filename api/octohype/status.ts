import { json, stubStatus } from "../_lib/octohype.ts";

export function GET(): Response {
  return json(stubStatus());
}
