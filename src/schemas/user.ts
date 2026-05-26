import { z } from "zod";

export const UserIpLookupInputSchema = z.object({
  ipAddress: z.string().optional().describe("IP address to look up"),
}).strict();
export type UserIpLookupInput = z.infer<typeof UserIpLookupInputSchema>;

export const UserResearcherAccessInputSchema = z.object({
  programId: z.string().min(1).describe("Program identifier"),
  researcherUserName: z.string().min(1).describe("Researcher username"),
}).strict();
export type UserResearcherAccessInput = z.infer<
  typeof UserResearcherAccessInputSchema
>;
