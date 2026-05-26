import { z } from "zod";

export const RewardSystemListRewardRequestsInputSchema = z.object({
  limit: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe("Maximum number of results to return"),
  offset: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe("Number of results to skip for pagination"),
  createdSince: z
    .string()
    .datetime({ offset: true })
    .optional()
    .describe("ISO 8601 datetime; only return requests created at or after this time"),
  updatedSince: z
    .string()
    .datetime({ offset: true })
    .optional()
    .describe("ISO 8601 datetime; only return requests updated at or after this time"),
}).strict();
export type RewardSystemListRewardRequestsInput = z.infer<
  typeof RewardSystemListRewardRequestsInputSchema
>;

export const RewardSystemGetRewardRequestPayoutInputSchema = z.object({
  rewardRequestId: z
    .string()
    .min(1)
    .describe("Unique identifier of the reward request"),
}).strict();
export type RewardSystemGetRewardRequestPayoutInput = z.infer<
  typeof RewardSystemGetRewardRequestPayoutInputSchema
>;

export const RewardSystemDeleteRewardRequestInputSchema = z.object({
  rewardRequestId: z
    .string()
    .min(1)
    .describe("Unique identifier of the reward request to delete"),
}).strict();
export type RewardSystemDeleteRewardRequestInput = z.infer<
  typeof RewardSystemDeleteRewardRequestInputSchema
>;

export const RewardSystemCreatePayoutRewardRequestInputSchema = z.object({
  title: z.string().optional().describe("Title of the payout reward request"),
  internalReference: z
    .string()
    .optional()
    .describe("Internal reference string for the reward request"),
  recipientEmail: z
    .string()
    .email()
    .optional()
    .describe("Email address of the reward recipient"),
  severity: z.number().int().optional().describe("Severity level identifier"),
  amount: z
    .object({
      value: z.number().optional().describe("Monetary value of the payout"),
      currency: z
        .string()
        .min(3)
        .max(3)
        .optional()
        .describe("ISO 4217 3-letter currency code"),
    })
    .strict()
    .optional()
    .describe("Payout amount details"),
}).strict();
export type RewardSystemCreatePayoutRewardRequestInput = z.infer<
  typeof RewardSystemCreatePayoutRewardRequestInputSchema
>;

export const RewardSystemGetBudgetInputSchema = z.object({}).strict();
export type RewardSystemGetBudgetInput = z.infer<
  typeof RewardSystemGetBudgetInputSchema
>;
