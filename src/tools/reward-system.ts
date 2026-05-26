import type { ToolDef, AnyToolDef } from "./types.js";
import {
  READ_ONLY_ANNOTATIONS,
  MUTATION_NON_IDEMPOTENT,
  DESTRUCTIVE_IDEMPOTENT,
} from "./types.js";
import { isoToUnixSeconds } from "./utils.js";
import {
  RewardSystemListRewardRequestsInputSchema,
  RewardSystemGetRewardRequestPayoutInputSchema,
  RewardSystemDeleteRewardRequestInputSchema,
  RewardSystemCreatePayoutRewardRequestInputSchema,
  RewardSystemGetBudgetInputSchema,
  type RewardSystemListRewardRequestsInput,
  type RewardSystemGetRewardRequestPayoutInput,
  type RewardSystemDeleteRewardRequestInput,
  type RewardSystemCreatePayoutRewardRequestInput,
  type RewardSystemGetBudgetInput,
} from "../schemas/reward-system.js";

const rewardSystemListRewardRequests: ToolDef<RewardSystemListRewardRequestsInput> =
  {
    name: "intigriti_reward_system_list_reward_requests",
    description:
      "List reward requests with optional pagination and date filtering.",
    inputSchema: RewardSystemListRewardRequestsInputSchema,
    annotations: READ_ONLY_ANNOTATIONS,
    handler: (input, client) => {
      const query: Record<string, number | undefined> = {};
      if (input.limit !== undefined) query["Limit"] = input.limit;
      if (input.offset !== undefined) query["Offset"] = input.offset;
      if (input.createdSince !== undefined) {
        query["CreatedSince"] = isoToUnixSeconds(input.createdSince);
      }
      if (input.updatedSince !== undefined) {
        query["UpdatedSince"] = isoToUnixSeconds(input.updatedSince);
      }
      return client.request({
        method: "GET",
        path: "/v2.1/reward-system/reward-requests",
        query,
      });
    },
  };

const rewardSystemGetRewardRequestPayout: ToolDef<RewardSystemGetRewardRequestPayoutInput> =
  {
    name: "intigriti_reward_system_get_reward_request_payout",
    description: "Retrieve payout details for a specific reward request.",
    inputSchema: RewardSystemGetRewardRequestPayoutInputSchema,
    annotations: READ_ONLY_ANNOTATIONS,
    handler: (input, client) =>
      client.request({
        method: "GET",
        path: "/v2.1/reward-system/reward-requests/{rewardRequestId}/payout",
        pathParams: { rewardRequestId: input.rewardRequestId },
      }),
  };

const rewardSystemDeleteRewardRequest: ToolDef<RewardSystemDeleteRewardRequestInput> =
  {
    name: "intigriti_reward_system_delete_reward_request",
    description: "Delete a specific reward request permanently.",
    inputSchema: RewardSystemDeleteRewardRequestInputSchema,
    annotations: DESTRUCTIVE_IDEMPOTENT,
    handler: (input, client) =>
      client.request({
        method: "DELETE",
        path: "/v2.1/reward-system/reward-requests/{rewardRequestId}",
        pathParams: { rewardRequestId: input.rewardRequestId },
      }),
  };

const rewardSystemCreatePayoutRewardRequest: ToolDef<RewardSystemCreatePayoutRewardRequestInput> =
  {
    name: "intigriti_reward_system_create_payout_reward_request",
    description: "Create a new payout reward request in the reward system.",
    inputSchema: RewardSystemCreatePayoutRewardRequestInputSchema,
    annotations: MUTATION_NON_IDEMPOTENT,
    handler: (input, client) =>
      client.request({
        method: "POST",
        path: "/v2.1/reward-system/payout-reward-requests",
        body: input,
      }),
  };

const rewardSystemGetBudget: ToolDef<RewardSystemGetBudgetInput> = {
  name: "intigriti_reward_system_get_budget",
  description: "Retrieve the current budget information for the reward system.",
  inputSchema: RewardSystemGetBudgetInputSchema,
  annotations: READ_ONLY_ANNOTATIONS,
  handler: (_input, client) =>
    client.request({ method: "GET", path: "/v2.1/reward-system/budget" }),
};

export const rewardSystemTools: AnyToolDef[] = [
  rewardSystemListRewardRequests,
  rewardSystemGetRewardRequestPayout,
  rewardSystemDeleteRewardRequest,
  rewardSystemCreatePayoutRewardRequest,
  rewardSystemGetBudget,
];
