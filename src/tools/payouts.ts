import type { ToolDef, AnyToolDef } from "./types.js";
import { READ_ONLY_ANNOTATIONS } from "./types.js";
import {
  PayoutsListInputSchema,
  type PayoutsListInput,
} from "../schemas/payouts.js";

const payoutsList: ToolDef<PayoutsListInput> = {
  name: "intigriti_payouts_list",
  description:
    "List all payouts for the company. Returns payout records including amounts, statuses, and associated researchers.",
  inputSchema: PayoutsListInputSchema,
  annotations: READ_ONLY_ANNOTATIONS,
  handler: (_input, client) =>
    client.request({ method: "GET", path: "/v2.1/payouts" }),
};

export const payoutsTools: AnyToolDef[] = [payoutsList];
