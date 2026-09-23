import { json, stubStatus } from "../_lib/octohype";

export function GET(): Response {
  return json(stubStatus());
}
