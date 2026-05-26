#!/usr/bin/env node
import { createRequire } from "node:module";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { ToolAnnotations } from "@modelcontextprotocol/sdk/types.js";

import { loadConfig } from "./config.js";
import { resolveTokenSource } from "./auth/resolver.js";
import { createClient, type IntigritiClient } from "./client.js";
import { IntigritiApiError } from "./errors.js";
import type { AnyToolDef } from "./tools/types.js";

import { submissionsTools } from "./tools/submissions.js";
import { programsTools } from "./tools/programs.js";
import { programUpdatesTools } from "./tools/program-updates.js";
import { rewardSystemTools } from "./tools/reward-system.js";
import { companyAssetsTools } from "./tools/company-assets.js";
import { groupsTools } from "./tools/groups.js";
import { userTools } from "./tools/user.js";
import { payoutsTools } from "./tools/payouts.js";
import { submissionTypesTools } from "./tools/submission-types.js";

// ---------------------------------------------------------------------------
// Package metadata — read once at module scope.
// ---------------------------------------------------------------------------

const _require = createRequire(import.meta.url);
const pkg = _require("../package.json") as { name: string; version: string };
const SERVER_NAME = pkg.name;
const SERVER_VERSION = pkg.version;

// ---------------------------------------------------------------------------
// All tool descriptors, in one flat array.
// ---------------------------------------------------------------------------

export const ALL_TOOLS: AnyToolDef[] = [
  ...submissionsTools,
  ...programsTools,
  ...programUpdatesTools,
  ...rewardSystemTools,
  ...companyAssetsTools,
  ...groupsTools,
  ...userTools,
  ...payoutsTools,
  ...submissionTypesTools,
];

// ---------------------------------------------------------------------------
// Uniform output envelope for every tool.
// ---------------------------------------------------------------------------

// v1: uniform envelope; per-tool narrow output schemas are a future enhancement.
const RESULT_OUTPUT_SHAPE = { data: z.unknown() };

// ---------------------------------------------------------------------------
// wrapHandler — pure helper; exported for unit-testing.
//
// Returns the registerTool callback for a given tool descriptor + client.
// On success: { structuredContent: { data }, content: [{ type:"text", text }] }
// On error:   { isError: true, content: [{ type:"text", text: safeMessage }] }
// ---------------------------------------------------------------------------

export function wrapHandler(toolDef: AnyToolDef, client: IntigritiClient) {
  return async (args: unknown) => {
    try {
      const result = await toolDef.handler(args, client);
      return {
        structuredContent: { data: result },
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    } catch (err) {
      let text: string;
      if (err instanceof IntigritiApiError) {
        // Intentionally omit err.body — it may contain secrets.
        text = `Intigriti API error ${err.status} on ${err.method} ${err.url}`;
      } else {
        text = err instanceof Error ? err.message : String(err);
      }
      return {
        isError: true as const,
        content: [{ type: "text" as const, text }],
      };
    }
  };
}

// ---------------------------------------------------------------------------
// buildServer — constructs and wires up the McpServer.
// Separated from main() so tests can call it without spawning a transport.
// ---------------------------------------------------------------------------

export function buildServer(client: IntigritiClient): McpServer {
  const server = new McpServer(
    { name: SERVER_NAME, version: SERVER_VERSION },
  );

  for (const toolDef of ALL_TOOLS) {
    server.registerTool(
      toolDef.name,
      {
        description: toolDef.description,
        // SDK registerTool expects a raw Zod shape, not a full ZodObject.
        // All our schemas are z.object({}).strict() so .shape is always safe.
        inputSchema: (toolDef.inputSchema as z.ZodObject<z.ZodRawShape>).shape,
        outputSchema: RESULT_OUTPUT_SHAPE,
        annotations: toolDef.annotations as ToolAnnotations,
      },
      wrapHandler(toolDef, client),
    );
  }

  return server;
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const config = loadConfig();
  const tokenSource = await resolveTokenSource(config);
  const client = createClient({ baseUrl: config.baseUrl, tokenSource });

  const server = buildServer(client);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write(`[${SERVER_NAME}] fatal: ${message}\n`);
  process.exitCode = 1;
});
