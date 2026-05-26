import { z } from "zod";

export const ProgramsListInputSchema = z.object({}).strict();
export type ProgramsListInput = z.infer<typeof ProgramsListInputSchema>;

export const ProgramsGetInputSchema = z.object({
  programId: z.string().min(1).describe("Unique identifier of the program"),
}).strict();
export type ProgramsGetInput = z.infer<typeof ProgramsGetInputSchema>;

export const ProgramsListSubmissionsInputSchema = z.object({
  programId: z.string().min(1).describe("Unique identifier of the program"),
  updatedSince: z
    .string()
    .datetime({ offset: true })
    .optional()
    .describe(
      "ISO 8601 datetime; only return submissions updated at or after this time",
    ),
}).strict();
export type ProgramsListSubmissionsInput = z.infer<
  typeof ProgramsListSubmissionsInputSchema
>;

export const ProgramsListResearchersInputSchema = z.object({
  programId: z.string().min(1).describe("Unique identifier of the program"),
}).strict();
export type ProgramsListResearchersInput = z.infer<
  typeof ProgramsListResearchersInputSchema
>;

export const ProgramsListPayoutsInputSchema = z.object({
  programId: z.string().min(1).describe("Unique identifier of the program"),
}).strict();
export type ProgramsListPayoutsInput = z.infer<
  typeof ProgramsListPayoutsInputSchema
>;

const ImportSubmissionMessageSchema = z.object({
  content: z.string().optional().describe("Message content text"),
  external: z.boolean().optional().describe("Whether the message is external"),
  createdAt: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe("Creation timestamp as unix seconds"),
}).strict();

const ImportSubmissionQuestionAnswerSchema = z.object({
  question: z.string().optional().describe("Question text"),
  answer: z.string().optional().describe("Answer text"),
}).strict();

export const ProgramsImportSubmissionInputSchema = z.object({
  programId: z.string().min(1).describe("Unique identifier of the program"),
  createdAt: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe("Submission creation timestamp as unix seconds"),
  title: z.string().optional().describe("Title of the submission"),
  typeId: z.string().min(1).optional().describe("Submission type identifier"),
  internalReference: z
    .string()
    .optional()
    .describe("Internal reference string for the submission"),
  internalReferenceUrl: z
    .string()
    .optional()
    .describe("URL for the internal reference"),
  endpointVulnerableComponent: z
    .string()
    .optional()
    .describe("Vulnerable endpoint or component"),
  pocDescription: z
    .string()
    .optional()
    .describe("Proof-of-concept description"),
  impact: z.string().optional().describe("Impact description of the vulnerability"),
  recommendedSolution: z
    .string()
    .optional()
    .describe("Recommended fix or remediation"),
  ipAddress: z.string().optional().describe("IP address associated with the submission"),
  personalData: z
    .boolean()
    .optional()
    .describe("Whether personal data is involved"),
  severityId: z
    .number()
    .int()
    .optional()
    .describe("Severity level identifier"),
  severityVector: z
    .string()
    .optional()
    .describe("CVSS or other severity vector string"),
  statusId: z.number().int().optional().describe("Status identifier"),
  closeReasonId: z
    .number()
    .int()
    .optional()
    .describe("Close reason identifier"),
  assetId: z.string().min(1).optional().describe("Asset identifier"),
  awaitingFeedback: z
    .boolean()
    .optional()
    .describe("Whether the submission is awaiting feedback"),
  tags: z.array(z.string()).optional().describe("List of tags for the submission"),
  messages: z
    .array(ImportSubmissionMessageSchema)
    .optional()
    .describe("Messages to attach to the submission"),
  groupId: z.string().min(1).optional().describe("Group identifier to assign the submission"),
  questionAnswers: z
    .array(ImportSubmissionQuestionAnswerSchema)
    .optional()
    .describe("Answers to program-specific questions"),
}).strict();
export type ProgramsImportSubmissionInput = z.infer<
  typeof ProgramsImportSubmissionInputSchema
>;
