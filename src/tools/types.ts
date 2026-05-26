import { z } from "zod";
import type { IntigritiClient } from "../client.js";

export interface ToolDef<I = unknown> {
  name: string;
  description: string;
  inputSchema: z.ZodType<I>;
  annotations: {
    readOnlyHint: boolean;
    destructiveHint: boolean;
    idempotentHint: boolean;
    openWorldHint: boolean;
  };
  handler: (input: I, client: IntigritiClient) => Promise<unknown>;
}

export type AnyToolDef = ToolDef<any>;

export const READ_ONLY_ANNOTATIONS = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: true,
} as const satisfies ToolDef<never>["annotations"];

export const MUTATION_NON_IDEMPOTENT = {
  readOnlyHint: false,
  destructiveHint: false,
  idempotentHint: false,
  openWorldHint: true,
} as const satisfies ToolDef<never>["annotations"];

export const MUTATION_IDEMPOTENT = {
  readOnlyHint: false,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: true,
} as const satisfies ToolDef<never>["annotations"];

export const DESTRUCTIVE_IDEMPOTENT = {
  readOnlyHint: false,
  destructiveHint: true,
  idempotentHint: true,
  openWorldHint: true,
} as const satisfies ToolDef<never>["annotations"];
