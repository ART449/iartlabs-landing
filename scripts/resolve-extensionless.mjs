/**
 * Node's type-stripping loader only resolves explicit extensions.
 * Vercel rejects ".ts" in import specifiers (TS5097), so the API files
 * import extensionless paths. This hook maps those to ".ts" for local runs.
 */
export async function resolve(specifier, context, nextResolve) {
  const relative = specifier.startsWith("./") || specifier.startsWith("../");
  const hasExtension = /\.[cm]?[jt]s$|\.json$|\.mjs$/.test(specifier);
  if (relative && !hasExtension) {
    return nextResolve(`${specifier}.ts`, context);
  }
  return nextResolve(specifier, context);
}
