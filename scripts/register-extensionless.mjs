import { register } from "node:module";

await register(new URL("./resolve-extensionless.mjs", import.meta.url).href, import.meta.url);
