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
    openWorldHint: true;
  };
  handler: (input: I, client: IntigritiClient) => Promise<unknown>;
}
