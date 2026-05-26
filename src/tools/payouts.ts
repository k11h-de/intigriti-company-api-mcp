import type { ToolDef } from "./types.js";
import {
  PayoutsListInputSchema,
  type PayoutsListInput,
} from "../schemas/payouts.js";

const READ_ONLY = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: true,
} as const;

const payoutsList: ToolDef<PayoutsListInput> = {
  name: "intigriti_payouts_list",
  description:
    "List all payouts for the company. Returns payout records including amounts, statuses, and associated researchers.",
  inputSchema: PayoutsListInputSchema,
  annotations: READ_ONLY,
  handler: (_input, client) =>
    client.request({ method: "GET", path: "/v2.1/payouts" }),
};

export const payoutsTools: ToolDef[] = [payoutsList as ToolDef];
