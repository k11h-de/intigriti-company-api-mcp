import { z } from "zod";

export const ProgramUpdatesListAllInputSchema = z.object({}).strict();
export type ProgramUpdatesListAllInput = z.infer<
  typeof ProgramUpdatesListAllInputSchema
>;

export const ProgramUpdatesListInputSchema = z.object({
  programId: z.string().min(1).describe("Unique identifier of the program"),
}).strict();
export type ProgramUpdatesListInput = z.infer<
  typeof ProgramUpdatesListInputSchema
>;

export const ProgramUpdatesCreateInputSchema = z.object({
  programId: z.string().min(1).describe("Unique identifier of the program"),
  title: z.string().optional().describe("Title of the program update"),
  description: z.string().optional().describe("Description text of the update"),
  publish: z
    .boolean()
    .optional()
    .describe("Whether to publish the update immediately"),
  notifyResearchers: z
    .boolean()
    .optional()
    .describe("Whether to notify researchers about the update"),
}).strict();
export type ProgramUpdatesCreateInput = z.infer<
  typeof ProgramUpdatesCreateInputSchema
>;

export const ProgramUpdatesUpdateInputSchema = z.object({
  programId: z.string().min(1).describe("Unique identifier of the program"),
  programUpdateId: z
    .string()
    .min(1)
    .describe("Unique identifier of the program update"),
  title: z.string().optional().describe("Updated title of the program update"),
  description: z
    .string()
    .optional()
    .describe("Updated description text of the update"),
}).strict();
export type ProgramUpdatesUpdateInput = z.infer<
  typeof ProgramUpdatesUpdateInputSchema
>;

export const ProgramUpdatesDeleteInputSchema = z.object({
  programId: z.string().min(1).describe("Unique identifier of the program"),
  programUpdateId: z
    .string()
    .min(1)
    .describe("Unique identifier of the program update to delete"),
}).strict();
export type ProgramUpdatesDeleteInput = z.infer<
  typeof ProgramUpdatesDeleteInputSchema
>;

export const ProgramUpdatesPublishInputSchema = z.object({
  programId: z.string().min(1).describe("Unique identifier of the program"),
  programUpdateId: z
    .string()
    .min(1)
    .describe("Unique identifier of the program update to publish"),
  notifyResearchers: z
    .boolean()
    .optional()
    .describe("Whether to notify researchers when publishing"),
}).strict();
export type ProgramUpdatesPublishInput = z.infer<
  typeof ProgramUpdatesPublishInputSchema
>;
