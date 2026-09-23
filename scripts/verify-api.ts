/**
 * Arranca el servidor local, hace curl y termina.
 * Prueba que /api/* es JSON y que / sigue siendo HTML.
 */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const PORT = 4173;
const BASE = `http://127.0.0.1:${PORT}`;

function curl(path: string): Promise<{ status: number; type: string; body: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn("curl", ["-sS", "-D", "-", `${BASE}${path}`], { stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    let err = "";
    child.stdout.on("data", (chunk) => {
      out += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      err += chunk.toString();
    });
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`curl ${path} failed: ${err || code}`));
        return;
      }
      const split = out.split(/\r?\n\r?\n/);
      const header = split[0] || "";
      const body = split.slice(1).join("\n\n");
      const statusMatch = header.match(/HTTP\/\d(?:\.\d)?\s+(\d+)/);
      const typeMatch = header.match(/content-type:\s*([^\r\n]+)/i);
      resolve({
        status: statusMatch ? Number(statusMatch[1]) : 0,
        type: typeMatch ? typeMatch[1].trim() : "",
        body,
      });
    });
  });
}

function assert(cond: unknown, message: string): void {
  if (!cond) throw new Error(message);
}

const server = spawn(
  process.execPath,
  ["--experimental-strip-types", fileURLToPath(new URL("./dev-api.ts", import.meta.url))],
  {
    env: { ...process.env, PORT: String(PORT) },
    stdio: ["ignore", "pipe", "pipe"],
  },
);

let logs = "";
server.stdout.on("data", (chunk) => {
  logs += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  logs += chunk.toString();
});

function waitForReady(): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`server did not start\n${logs}`)), 8000);
    const tick = () => {
      if (logs.includes("octohype-api local")) {
        clearTimeout(timer);
        resolve();
        return;
      }
      setTimeout(tick, 50);
    };
    tick();
  });
}

try {
  await waitForReady();

  const health = await curl("/api/health");
  assert(health.status === 200, `health status ${health.status}`);
  assert(health.type.includes("application/json"), `health type ${health.type}`);
  assert(!health.body.trim().startsWith("<"), "health body looks like HTML");
  const healthJson = JSON.parse(health.body);
  assert(healthJson.ok === true, "health ok");
  assert(healthJson.service === "octohype-api", "health service");
  assert(typeof healthJson.version === "string" && healthJson.version.length > 0, "health version");
  assert(typeof healthJson.ts === "string" && healthJson.ts.length > 0, "health ts");

  const rootApi = await curl("/api");
  assert(rootApi.status === 200, `catalog status ${rootApi.status}`);
  assert(rootApi.type.includes("application/json"), `catalog type ${rootApi.type}`);
  const catalog = JSON.parse(rootApi.body);
  assert(catalog.ok === true, "catalog ok");
  assert(Array.isArray(catalog.tentacles) && catalog.tentacles.length === 8, "catalog tentacles");

  const octo = await curl("/api/octohype");
  assert(octo.type.includes("application/json"), `octohype type ${octo.type}`);
  const octoJson = JSON.parse(octo.body);
  assert(octoJson.ok === true && octoJson.tentacles.length === 8, "octohype catalog");

  const status = await curl("/api/octohype/status");
  assert(status.type.includes("application/json"), `status type ${status.type}`);
  const statusJson = JSON.parse(status.body);
  assert(statusJson.ok === true && statusJson.stub === true, "status stub");
  assert(statusJson.tentacles.length === 8, "status tentacles");
  assert(statusJson.tentacles.every((t: { state: string }) => t.state === "stub"), "each tentacle stub");

  const missing = await curl("/api/does-not-exist");
  assert(missing.status === 404, `missing status ${missing.status}`);
  assert(missing.type.includes("application/json"), `missing type ${missing.type}`);
  assert(!missing.body.includes("<title>"), "missing api returned HTML");

  const home = await curl("/");
  assert(home.status === 200, `home status ${home.status}`);
  assert(home.type.includes("text/html"), `home type ${home.type}`);
  assert(home.body.includes("<title>IArtLabs"), "home is the landing");

  const spa = await curl("/una-ruta-spa");
  assert(spa.type.includes("text/html"), `spa fallback type ${spa.type}`);
  assert(spa.body.includes("<title>IArtLabs"), "spa fallback is index.html");

  const manual = await curl("/MANUALES/README.md");
  assert(manual.status === 200, `manual status ${manual.status}`);
  assert(!manual.type.includes("text/html"), `static file was rewritten to HTML (${manual.type})`);

  console.log("verify ok");
  console.log(JSON.stringify({ health: healthJson, status: statusJson.note }, null, 2));
} catch (error) {
  console.error(logs);
  console.error(error);
  process.exitCode = 1;
} finally {
  server.kill("SIGTERM");
}
