import { z } from "zod";

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------

export const SubmissionsListInputSchema = z
  .object({
    updatedSince: z
      .string()
      .datetime({ offset: true })
      .optional()
      .describe(
        "ISO 8601 datetime; only return submissions updated at or after this time",
      ),
  })
  .strict();
export type SubmissionsListInput = z.infer<typeof SubmissionsListInputSchema>;

export const SubmissionsGetInputSchema = z
  .object({
    submissionCode: z
      .string()
      .min(1)
      .describe("Unique code identifying the submission"),
  })
  .strict();
export type SubmissionsGetInput = z.infer<typeof SubmissionsGetInputSchema>;

export const SubmissionsGetEventsInputSchema = z
  .object({
    submissionCode: z
      .string()
      .min(1)
      .describe("Unique code identifying the submission"),
    createdSince: z
      .string()
      .datetime({ offset: true })
      .optional()
      .describe(
        "ISO 8601 datetime; only return events created at or after this time",
      ),
  })
  .strict();
export type SubmissionsGetEventsInput = z.infer<
  typeof SubmissionsGetEventsInputSchema
>;

export const SubmissionsGetPayoutsInputSchema = z
  .object({
    submissionCode: z
      .string()
      .min(1)
      .describe("Unique code identifying the submission"),
  })
  .strict();
export type SubmissionsGetPayoutsInput = z.infer<
  typeof SubmissionsGetPayoutsInputSchema
>;

export const SubmissionsGetIntegrationsInputSchema = z
  .object({
    submissionCode: z
      .string()
      .min(1)
      .describe("Unique code identifying the submission"),
  })
  .strict();
export type SubmissionsGetIntegrationsInput = z.infer<
  typeof SubmissionsGetIntegrationsInputSchema
>;

export const SubmissionsGetPossibleGroupsInputSchema = z
  .object({
    submissionCode: z
      .string()
      .min(1)
      .describe("Unique code identifying the submission"),
  })
  .strict();
export type SubmissionsGetPossibleGroupsInput = z.infer<
  typeof SubmissionsGetPossibleGroupsInputSchema
>;

// ---------------------------------------------------------------------------
// Mutations — POSTs
// ---------------------------------------------------------------------------

const MoneyCreateSchema = z
  .object({
    value: z.number().optional().describe("Monetary value as a decimal number"),
    currency: z
      .string()
      .optional()
      .describe("ISO 4217 currency code, e.g. USD or EUR"),
  })
  .strict();

export const SubmissionsAddCompanyBonusInputSchema = z
  .object({
    submissionCode: z
      .string()
      .min(1)
      .describe("Unique code identifying the submission"),
    amount: MoneyCreateSchema.optional().describe(
      "Bonus amount with value and currency",
    ),
    researcherId: z
      .string()
      .min(1)
      .optional()
      .describe("GUID of the researcher to receive the bonus"),
  })
  .strict();
export type SubmissionsAddCompanyBonusInput = z.infer<
  typeof SubmissionsAddCompanyBonusInputSchema
>;

export const SubmissionsExportPdfInputSchema = z
  .object({
    submissionCode: z
      .string()
      .min(1)
      .describe("Unique code identifying the submission"),
    timeZone: z
      .string()
      .optional()
      .describe(
        "IANA timezone name used for date formatting in the exported PDF",
      ),
    outputPath: z
      .string()
      .optional()
      .describe(
        "Absolute file path to save the exported PDF; if omitted the base64 content is returned in-memory",
      ),
  })
  .strict();
export type SubmissionsExportPdfInput = z.infer<
  typeof SubmissionsExportPdfInputSchema
>;

export const SubmissionsExportCsvInputSchema = z
  .object({
    submissionCode: z
      .string()
      .min(1)
      .describe("Unique code identifying the submission"),
    timeZone: z
      .string()
      .optional()
      .describe(
        "IANA timezone name used for date formatting in the exported CSV",
      ),
    outputPath: z
      .string()
      .optional()
      .describe(
        "Absolute file path to save the exported CSV; if omitted the base64 content is returned in-memory",
      ),
  })
  .strict();
export type SubmissionsExportCsvInput = z.infer<
  typeof SubmissionsExportCsvInputSchema
>;

export const SubmissionsAddAttachmentInputSchema = z
  .object({
    submissionCode: z
      .string()
      .min(1)
      .describe("Unique code identifying the submission"),
    filePath: z
      .string()
      .min(1)
      .describe("Absolute path to the local file to upload as attachment"),
    attachmentCode: z
      .number()
      .optional()
      .describe("Optional attachment code to associate with the upload"),
    filename: z
      .string()
      .optional()
      .describe("Override filename sent to the server; defaults to basename of filePath"),
    contentType: z
      .string()
      .optional()
      .describe("MIME type of the file, e.g. image/png"),
  })
  .strict();
export type SubmissionsAddAttachmentInput = z.infer<
  typeof SubmissionsAddAttachmentInputSchema
>;

export const SubmissionsPlaceInternalMessageInputSchema = z
  .object({
    submissionCode: z
      .string()
      .min(1)
      .describe("Unique code identifying the submission"),
    message: z
      .string()
      .optional()
      .describe("Text content of the internal message"),
  })
  .strict();
export type SubmissionsPlaceInternalMessageInput = z.infer<
  typeof SubmissionsPlaceInternalMessageInputSchema
>;

export const SubmissionsPlaceExternalMessageInputSchema = z
  .object({
    submissionCode: z
      .string()
      .min(1)
      .describe("Unique code identifying the submission"),
    message: z
      .string()
      .optional()
      .describe("Text content of the external message"),
  })
  .strict();
export type SubmissionsPlaceExternalMessageInput = z.infer<
  typeof SubmissionsPlaceExternalMessageInputSchema
>;

export const SubmissionsAddTagInputSchema = z
  .object({
    submissionCode: z
      .string()
      .min(1)
      .describe("Unique code identifying the submission"),
    tag: z.string().optional().describe("Tag string to add to the submission"),
  })
  .strict();
export type SubmissionsAddTagInput = z.infer<typeof SubmissionsAddTagInputSchema>;

export const SubmissionsSetCustomBountyInputSchema = z
  .object({
    submissionCode: z
      .string()
      .min(1)
      .describe("Unique code identifying the submission"),
    message: z
      .string()
      .nullable()
      .describe("Message to attach alongside the custom bounty; may be null"),
    customBounty: z
      .object({
        value: z
          .number()
          .optional()
          .describe("Monetary value of the custom bounty"),
        currency: z
          .string()
          .nullable()
          .optional()
          .describe("ISO 4217 currency code; null to clear"),
      })
      .strict()
      .describe("Custom bounty amount details"),
  })
  .strict();
export type SubmissionsSetCustomBountyInput = z.infer<
  typeof SubmissionsSetCustomBountyInputSchema
>;

// ---------------------------------------------------------------------------
// Mutations — PUTs
// ---------------------------------------------------------------------------

export const SubmissionsUpdateStateInputSchema = z
  .object({
    submissionCode: z
      .string()
      .min(1)
      .describe("Unique code identifying the submission"),
    statusTrigger: z
      .number()
      .int()
      .optional()
      .describe("Numeric identifier of the status transition trigger"),
    closeReason: z
      .number()
      .int()
      .nullable()
      .optional()
      .describe("Numeric close-reason identifier; null to clear"),
    duplicateSubmission: z
      .string()
      .nullable()
      .optional()
      .describe("Code of the original submission if this is a duplicate; null to clear"),
  })
  .strict();
export type SubmissionsUpdateStateInput = z.infer<
  typeof SubmissionsUpdateStateInputSchema
>;

export const SubmissionsUpdateInternalReferenceInputSchema = z
  .object({
    submissionCode: z
      .string()
      .min(1)
      .describe("Unique code identifying the submission"),
    reference: z
      .string()
      .optional()
      .describe("Internal reference string to set on the submission"),
    url: z
      .string()
      .optional()
      .describe("URL for the internal reference"),
  })
  .strict();
export type SubmissionsUpdateInternalReferenceInput = z.infer<
  typeof SubmissionsUpdateInternalReferenceInputSchema
>;

export const SubmissionsUpdateSeverityInputSchema = z
  .object({
    submissionCode: z
      .string()
      .min(1)
      .describe("Unique code identifying the submission"),
    id: z
      .number()
      .int()
      .nullable()
      .optional()
      .describe("Numeric severity level identifier; null to clear"),
    vector: z
      .string()
      .nullable()
      .optional()
      .describe("CVSS or other severity vector string; null to clear"),
  })
  .strict();
export type SubmissionsUpdateSeverityInput = z.infer<
  typeof SubmissionsUpdateSeverityInputSchema
>;

export const SubmissionsAssignToMeInputSchema = z
  .object({
    submissionCode: z
      .string()
      .min(1)
      .describe("Unique code identifying the submission"),
  })
  .strict();
export type SubmissionsAssignToMeInput = z.infer<
  typeof SubmissionsAssignToMeInputSchema
>;

export const SubmissionsUpdatePersonalDataInputSchema = z
  .object({
    submissionCode: z
      .string()
      .min(1)
      .describe("Unique code identifying the submission"),
    personalData: z
      .boolean()
      .describe("Whether the submission contains personal data"),
  })
  .strict();
export type SubmissionsUpdatePersonalDataInput = z.infer<
  typeof SubmissionsUpdatePersonalDataInputSchema
>;

export const SubmissionsUpdateAwaitingFeedbackInputSchema = z
  .object({
    submissionCode: z
      .string()
      .min(1)
      .describe("Unique code identifying the submission"),
    awaitingFeedback: z
      .boolean()
      .describe("Whether the submission is awaiting feedback from the researcher"),
  })
  .strict();
export type SubmissionsUpdateAwaitingFeedbackInput = z.infer<
  typeof SubmissionsUpdateAwaitingFeedbackInputSchema
>;

export const SubmissionsUpdateGroupInputSchema = z
  .object({
    submissionCode: z
      .string()
      .min(1)
      .describe("Unique code identifying the submission"),
    groupId: z
      .string()
      .nullable()
      .describe("GUID of the group to assign the submission to; null to unassign"),
  })
  .strict();
export type SubmissionsUpdateGroupInput = z.infer<
  typeof SubmissionsUpdateGroupInputSchema
>;

export const SubmissionsUpdateAssetInputSchema = z
  .object({
    submissionCode: z
      .string()
      .min(1)
      .describe("Unique code identifying the submission"),
    domainId: z
      .string()
      .min(1)
      .nullable()
      .optional()
      .describe("GUID of the domain/asset to associate; null to clear"),
    motivation: z
      .string()
      .nullable()
      .optional()
      .describe("Motivation or justification for the asset change; null to clear"),
  })
  .strict();
export type SubmissionsUpdateAssetInput = z.infer<
  typeof SubmissionsUpdateAssetInputSchema
>;

// ---------------------------------------------------------------------------
// Mutations — DELETEs
// ---------------------------------------------------------------------------

export const SubmissionsDeleteCompanyBonusInputSchema = z
  .object({
    submissionCode: z
      .string()
      .min(1)
      .describe("Unique code identifying the submission"),
    payoutId: z
      .string()
      .min(1)
      .describe("Unique identifier of the company bonus payout to delete"),
  })
  .strict();
export type SubmissionsDeleteCompanyBonusInput = z.infer<
  typeof SubmissionsDeleteCompanyBonusInputSchema
>;

export const SubmissionsRemoveTagInputSchema = z
  .object({
    submissionCode: z
      .string()
      .min(1)
      .describe("Unique code identifying the submission"),
    tag: z
      .string()
      .min(1)
      .describe("Tag string to remove from the submission"),
  })
  .strict();
export type SubmissionsRemoveTagInput = z.infer<
  typeof SubmissionsRemoveTagInputSchema
>;
