/**
 * Fetches the Intigriti Company API v2.1 OpenAPI spec, caches it as JSON,
 * then generates TypeScript declarations via openapi-typescript.
 *
 * Run with: npm run generate-types
 */

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import openapiTS, { astToString } from "openapi-typescript";

const SPEC_URL =
  "https://api.intigriti.com/external/company/swagger/v2.1/swagger.json";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_PATH = resolve(__dirname, "swagger.cached.json");
const OUTPUT_PATH = resolve(__dirname, "../src/generated/api.d.ts");

const HEADER = `\
// This file is auto-generated from the Intigriti Company API v2.1 OpenAPI spec.
// Source: ${SPEC_URL}
// Do not edit by hand. Regenerate with \`npm run generate-types\`.

`;

console.log(`Fetching spec from ${SPEC_URL} …`);
const response = await fetch(SPEC_URL);
if (!response.ok) {
  throw new Error(`Failed to fetch spec: ${response.status} ${response.statusText}`);
}
const spec = (await response.json()) as object;

writeFileSync(CACHE_PATH, JSON.stringify(spec, null, 2) + "\n", "utf8");
console.log(`Cached spec → ${CACHE_PATH}`);

console.log("Generating TypeScript types …");
const ast = await openapiTS(new URL(`file://${CACHE_PATH}`));
const dts = astToString(ast);

writeFileSync(OUTPUT_PATH, HEADER + dts, "utf8");
console.log(`Generated types → ${OUTPUT_PATH}`);
