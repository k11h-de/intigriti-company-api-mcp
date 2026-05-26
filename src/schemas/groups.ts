import { z } from "zod";

export const GroupsListInputSchema = z.object({}).strict();
export type GroupsListInput = z.infer<typeof GroupsListInputSchema>;

export const GroupsListSubmissionsInputSchema = z.object({
  groupId: z.string().min(1).describe("Group identifier"),
  updatedSince: z
    .string()
    .datetime({ offset: true })
    .optional()
    .describe(
      "ISO 8601 datetime; only return records updated at or after this time",
    ),
}).strict();
export type GroupsListSubmissionsInput = z.infer<
  typeof GroupsListSubmissionsInputSchema
>;
