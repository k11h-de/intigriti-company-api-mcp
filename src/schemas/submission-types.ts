import { z } from "zod";

export const SubmissionTypesListInputSchema = z.object({}).strict();
export type SubmissionTypesListInput = z.infer<
  typeof SubmissionTypesListInputSchema
>;
