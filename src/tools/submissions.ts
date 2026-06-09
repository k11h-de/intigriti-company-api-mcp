import { writeFile } from "node:fs/promises";
import type { ToolDef, AnyToolDef } from "./types.js";
import {
  READ_ONLY_ANNOTATIONS,
  MUTATION_NON_IDEMPOTENT,
  MUTATION_IDEMPOTENT,
  DESTRUCTIVE_IDEMPOTENT,
} from "./types.js";
import { isoToUnixSeconds } from "./utils.js";
import {
  SubmissionsListInputSchema,
  SubmissionsGetInputSchema,
  SubmissionsGetEventsInputSchema,
  SubmissionsGetPayoutsInputSchema,
  SubmissionsGetIntegrationsInputSchema,
  SubmissionsGetPossibleGroupsInputSchema,
  SubmissionsAddCompanyBonusInputSchema,
  SubmissionsExportPdfInputSchema,
  SubmissionsExportCsvInputSchema,
  SubmissionsAddAttachmentInputSchema,
  SubmissionsPlaceInternalMessageInputSchema,
  SubmissionsPlaceExternalMessageInputSchema,
  SubmissionsAddTagInputSchema,
  SubmissionsSetCustomBountyInputSchema,
  SubmissionsUpdateStateInputSchema,
  SubmissionsUpdateInternalReferenceInputSchema,
  SubmissionsUpdateSeverityInputSchema,
  SubmissionsAssignToMeInputSchema,
  SubmissionsUpdatePersonalDataInputSchema,
  SubmissionsUpdateAwaitingFeedbackInputSchema,
  SubmissionsUpdateGroupInputSchema,
  SubmissionsUpdateAssetInputSchema,
  SubmissionsDeleteCompanyBonusInputSchema,
  SubmissionsRemoveTagInputSchema,
  type SubmissionsListInput,
  type SubmissionsGetInput,
  type SubmissionsGetEventsInput,
  type SubmissionsGetPayoutsInput,
  type SubmissionsGetIntegrationsInput,
  type SubmissionsGetPossibleGroupsInput,
  type SubmissionsAddCompanyBonusInput,
  type SubmissionsExportPdfInput,
  type SubmissionsExportCsvInput,
  type SubmissionsAddAttachmentInput,
  type SubmissionsPlaceInternalMessageInput,
  type SubmissionsPlaceExternalMessageInput,
  type SubmissionsAddTagInput,
  type SubmissionsSetCustomBountyInput,
  type SubmissionsUpdateStateInput,
  type SubmissionsUpdateInternalReferenceInput,
  type SubmissionsUpdateSeverityInput,
  type SubmissionsAssignToMeInput,
  type SubmissionsUpdatePersonalDataInput,
  type SubmissionsUpdateAwaitingFeedbackInput,
  type SubmissionsUpdateGroupInput,
  type SubmissionsUpdateAssetInput,
  type SubmissionsDeleteCompanyBonusInput,
  type SubmissionsRemoveTagInput,
} from "../schemas/submissions.js";

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------

const submissionsList: ToolDef<SubmissionsListInput> = {
  name: "intigriti_submissions_list",
  description:
    "List all submissions for the company. Optionally filter by last-updated timestamp.",
  inputSchema: SubmissionsListInputSchema,
  annotations: READ_ONLY_ANNOTATIONS,
  handler: (input, client) => {
    const query: Record<string, number | undefined> = {};
    if (input.updatedSince !== undefined) {
      query["UpdatedSince"] = isoToUnixSeconds(input.updatedSince);
    }
    return client.request({
      method: "GET",
      path: "/v2.1/submissions",
      query,
    });
  },
};

const submissionsGet: ToolDef<SubmissionsGetInput> = {
  name: "intigriti_submissions_get",
  description: "Retrieve full details of a single submission by its code.",
  inputSchema: SubmissionsGetInputSchema,
  annotations: READ_ONLY_ANNOTATIONS,
  handler: (input, client) =>
    client.request({
      method: "GET",
      path: "/v2.1/submissions/{submissionCode}",
      pathParams: { submissionCode: input.submissionCode },
    }),
};

const submissionsGetEvents: ToolDef<SubmissionsGetEventsInput> = {
  name: "intigriti_submissions_get_events",
  description:
    "List all events for a submission. Optionally filter by creation timestamp.",
  inputSchema: SubmissionsGetEventsInputSchema,
  annotations: READ_ONLY_ANNOTATIONS,
  handler: (input, client) => {
    const query: Record<string, number | undefined> = {};
    if (input.createdSince !== undefined) {
      query["CreatedSince"] = isoToUnixSeconds(input.createdSince);
    }
    return client.request({
      method: "GET",
      path: "/v2.1/submissions/{submissionCode}/events",
      pathParams: { submissionCode: input.submissionCode },
      query,
    });
  },
};

const submissionsGetPayouts: ToolDef<SubmissionsGetPayoutsInput> = {
  name: "intigriti_submissions_get_payouts",
  description: "List all payouts associated with a submission.",
  inputSchema: SubmissionsGetPayoutsInputSchema,
  annotations: READ_ONLY_ANNOTATIONS,
  handler: (input, client) =>
    client.request({
      method: "GET",
      path: "/v2.1/submissions/{submissionCode}/payouts",
      pathParams: { submissionCode: input.submissionCode },
    }),
};

const submissionsGetIntegrations: ToolDef<SubmissionsGetIntegrationsInput> = {
  name: "intigriti_submissions_get_integrations",
  description: "List all integrations linked to a submission.",
  inputSchema: SubmissionsGetIntegrationsInputSchema,
  annotations: READ_ONLY_ANNOTATIONS,
  handler: (input, client) =>
    client.request({
      method: "GET",
      path: "/v2.1/submissions/{submissionCode}/integrations",
      pathParams: { submissionCode: input.submissionCode },
    }),
};

const submissionsGetPossibleGroups: ToolDef<SubmissionsGetPossibleGroupsInput> =
  {
    name: "intigriti_submissions_get_possible_groups",
    description:
      "List all groups that a submission can be assigned to. Returns 403 while the submission is in Triage status — validate it first via update_state with statusTrigger=2.",
    inputSchema: SubmissionsGetPossibleGroupsInputSchema,
    annotations: READ_ONLY_ANNOTATIONS,
    handler: (input, client) =>
      client.request({
        method: "GET",
        path: "/v2.1/submissions/{submissionCode}/possible-groups",
        pathParams: { submissionCode: input.submissionCode },
      }),
  };

// ---------------------------------------------------------------------------
// Mutations — POSTs
// ---------------------------------------------------------------------------

const submissionsAddCompanyBonus: ToolDef<SubmissionsAddCompanyBonusInput> = {
  name: "intigriti_submissions_add_company_bonus",
  description: "Add a company bonus to a submission.",
  inputSchema: SubmissionsAddCompanyBonusInputSchema,
  annotations: MUTATION_NON_IDEMPOTENT,
  handler: (input, client) => {
    const { submissionCode, ...body } = input;
    return client.request({
      method: "POST",
      path: "/v2.1/submissions/{submissionCode}/company-bonuses",
      pathParams: { submissionCode },
      body,
    });
  },
};

const submissionsExportPdf: ToolDef<SubmissionsExportPdfInput> = {
  name: "intigriti_submissions_export_pdf",
  description:
    "Export a submission as a PDF file. Returns base64-encoded content or writes to outputPath when provided.",
  inputSchema: SubmissionsExportPdfInputSchema,
  annotations: MUTATION_NON_IDEMPOTENT,
  // The Intigriti OpenAPI spec advertises this endpoint as `application/json`
  // returning a base64 string, but the server actually responds with raw
  // `application/pdf` bytes (verified 2026-06-09). We therefore request a
  // binary response and write the buffer verbatim.
  handler: async (input, client) => {
    const query: Record<string, string | undefined> = {};
    if (input.timeZone !== undefined) {
      query["timeZone"] = input.timeZone;
    }
    const bytes = await client.request<Buffer>({
      method: "POST",
      path: "/v2.1/submissions/{submissionCode}/pdf-exports",
      pathParams: { submissionCode: input.submissionCode },
      query,
      responseType: "binary",
    });
    const mimeType = "application/pdf";
    if (input.outputPath) {
      await writeFile(input.outputPath, bytes);
      return { path: input.outputPath, bytes: bytes.length, mimeType };
    }
    return { base64: bytes.toString("base64"), bytes: bytes.length, mimeType };
  },
};

const submissionsExportCsv: ToolDef<SubmissionsExportCsvInput> = {
  name: "intigriti_submissions_export_csv",
  description:
    "Export a submission as a CSV file. Returns base64-encoded content or writes to outputPath when provided.",
  inputSchema: SubmissionsExportCsvInputSchema,
  annotations: MUTATION_NON_IDEMPOTENT,
  // Same caveat as the PDF export: the API returns raw bytes, not a
  // base64-wrapped JSON string. Pull the response as binary.
  handler: async (input, client) => {
    const query: Record<string, string | undefined> = {};
    if (input.timeZone !== undefined) {
      query["timeZone"] = input.timeZone;
    }
    const bytes = await client.request<Buffer>({
      method: "POST",
      path: "/v2.1/submissions/{submissionCode}/csv-exports",
      pathParams: { submissionCode: input.submissionCode },
      query,
      responseType: "binary",
    });
    const mimeType = "text/csv";
    if (input.outputPath) {
      await writeFile(input.outputPath, bytes);
      return { path: input.outputPath, bytes: bytes.length, mimeType };
    }
    return { base64: bytes.toString("base64"), bytes: bytes.length, mimeType };
  },
};

const submissionsAddAttachment: ToolDef<SubmissionsAddAttachmentInput> = {
  name: "intigriti_submissions_add_attachment",
  description:
    "[BETA] Add an additional file attachment to a submission. Uploads the file at filePath as multipart/form-data.",
  inputSchema: SubmissionsAddAttachmentInputSchema,
  annotations: MUTATION_NON_IDEMPOTENT,
  handler: (input, client) => {
    const query: Record<string, number | undefined> = {};
    if (input.attachmentCode !== undefined) {
      query["attachmentCode"] = input.attachmentCode;
    }
    return client.request({
      method: "POST",
      path: "/v2.1/submissions/{submissionCode}/attachment",
      pathParams: { submissionCode: input.submissionCode },
      query,
      multipart: {
        fieldName: "file",
        filePath: input.filePath,
        filename: input.filename,
        contentType: input.contentType,
      },
    });
  },
};

const submissionsPlaceInternalMessage: ToolDef<SubmissionsPlaceInternalMessageInput> =
  {
    name: "intigriti_submissions_place_internal_message",
    description:
      "Post an internal (company-only) message on a submission. Append-only — the API does not expose deletion of messages, so the post will remain in the activity log permanently.",
    inputSchema: SubmissionsPlaceInternalMessageInputSchema,
    annotations: MUTATION_NON_IDEMPOTENT,
    handler: (input, client) => {
      const { submissionCode, ...body } = input;
      return client.request({
        method: "POST",
        path: "/v2.1/submissions/{submissionCode}/comments/internal",
        pathParams: { submissionCode },
        body,
      });
    },
  };

const submissionsPlaceExternalMessage: ToolDef<SubmissionsPlaceExternalMessageInput> =
  {
    name: "intigriti_submissions_place_external_message",
    description:
      "Post an external message on a submission, visible to the researcher. The researcher receives a notification. Append-only — the API does not expose deletion of messages, so the post will remain in the activity log permanently.",
    inputSchema: SubmissionsPlaceExternalMessageInputSchema,
    annotations: MUTATION_NON_IDEMPOTENT,
    handler: (input, client) => {
      const { submissionCode, ...body } = input;
      return client.request({
        method: "POST",
        path: "/v2.1/submissions/{submissionCode}/comments/external",
        pathParams: { submissionCode },
        body,
      });
    },
  };

const submissionsAddTag: ToolDef<SubmissionsAddTagInput> = {
  name: "intigriti_submissions_add_tag",
  description: "Add a tag to a submission.",
  inputSchema: SubmissionsAddTagInputSchema,
  annotations: MUTATION_NON_IDEMPOTENT,
  handler: (input, client) => {
    const { submissionCode, ...body } = input;
    return client.request({
      method: "POST",
      path: "/v2.1/submissions/{submissionCode}/tags",
      pathParams: { submissionCode },
      body,
    });
  },
};

const submissionsSetCustomBounty: ToolDef<SubmissionsSetCustomBountyInput> = {
  name: "intigriti_submissions_set_custom_bounty",
  description: "Set a custom bounty amount on a submission.",
  inputSchema: SubmissionsSetCustomBountyInputSchema,
  annotations: MUTATION_NON_IDEMPOTENT,
  handler: (input, client) => {
    const { submissionCode, message, customBounty } = input;
    return client.request({
      method: "POST",
      path: "/v2.1/submissions/{submissionCode}/custom-bounty",
      pathParams: { submissionCode },
      body: { message, customBounty },
    });
  },
};

// ---------------------------------------------------------------------------
// Mutations — PUTs
// ---------------------------------------------------------------------------

const submissionsUpdateState: ToolDef<SubmissionsUpdateStateInput> = {
  name: "intigriti_submissions_update_state",
  description:
    "Update the state of a submission via a status transition trigger. Triggers: 1=Reject (closeReason required), 2=Validate (irreversible), 3=Accept (may auto-create bounty payout), 4=Close, 5=Archive, 6=Undo. Close reasons: 1=Resolved, 2=Duplicate, 3=Accepted risk, 4=Informative, 5=Out of scope, 6=Spam, 7=Not applicable. State machine: https://intigriti.readme.io/v2.1/reference/submissions_editstate. Common 403 cause: the trigger is not allowed in the submission's current status.",
  inputSchema: SubmissionsUpdateStateInputSchema,
  annotations: MUTATION_IDEMPOTENT,
  handler: async (input, client) => {
    // Reject (1) requires a closeReason. The API enforces this with a 400; we
    // catch it here for a clearer message and to skip the round-trip.
    if (input.statusTrigger === 1 && (input.closeReason === undefined || input.closeReason === null)) {
      throw new Error(
        "closeReason is required when statusTrigger=1 (Reject). Valid IDs: 1=Resolved, 2=Duplicate, 3=Accepted risk, 4=Informative, 5=Out of scope, 6=Spam, 7=Not applicable.",
      );
    }
    const { submissionCode, ...body } = input;
    return client.request({
      method: "PUT",
      path: "/v2.1/submissions/{submissionCode}/state",
      pathParams: { submissionCode },
      body,
    });
  },
};

const submissionsUpdateInternalReference: ToolDef<SubmissionsUpdateInternalReferenceInput> =
  {
    name: "intigriti_submissions_update_internal_reference",
    description:
      "Update the internal reference and/or URL on a submission. Pass null or empty string to clear a field.",
    inputSchema: SubmissionsUpdateInternalReferenceInputSchema,
    annotations: MUTATION_IDEMPOTENT,
    handler: (input, client) => {
      // The API stores empty strings literally rather than treating them as
      // cleared. Normalize "" → null so callers passing an empty string get the
      // intuitive clear semantics.
      const reference = input.reference === "" ? null : input.reference ?? null;
      const url = input.url === "" ? null : input.url ?? null;
      return client.request({
        method: "PUT",
        path: "/v2.1/submissions/{submissionCode}/internal-reference",
        pathParams: { submissionCode: input.submissionCode },
        body: { reference, url },
      });
    },
  };

const submissionsUpdateSeverity: ToolDef<SubmissionsUpdateSeverityInput> = {
  name: "intigriti_submissions_update_severity",
  description:
    "Update the severity classification of a submission.",
  inputSchema: SubmissionsUpdateSeverityInputSchema,
  annotations: MUTATION_IDEMPOTENT,
  handler: (input, client) => {
    const { submissionCode, ...body } = input;
    return client.request({
      method: "PUT",
      path: "/v2.1/submissions/{submissionCode}/severity",
      pathParams: { submissionCode },
      body,
    });
  },
};

const submissionsAssignToMe: ToolDef<SubmissionsAssignToMeInput> = {
  name: "intigriti_submissions_assign_to_me",
  description:
    "Assign a submission to the currently authenticated user. Returns 403 while the submission is in Triage status (Intigriti is reviewing it) — validate it first via update_state with statusTrigger=2.",
  inputSchema: SubmissionsAssignToMeInputSchema,
  annotations: MUTATION_IDEMPOTENT,
  handler: (input, client) =>
    client.request({
      method: "PUT",
      path: "/v2.1/submissions/{submissionCode}/assign/me",
      pathParams: { submissionCode: input.submissionCode },
    }),
};

const submissionsUpdatePersonalData: ToolDef<SubmissionsUpdatePersonalDataInput> =
  {
    name: "intigriti_submissions_update_personal_data",
    description:
      "Set the personal data flag on a submission.",
    inputSchema: SubmissionsUpdatePersonalDataInputSchema,
    annotations: MUTATION_IDEMPOTENT,
    handler: (input, client) => {
      const { submissionCode, personalData } = input;
      return client.request({
        method: "PUT",
        path: "/v2.1/submissions/{submissionCode}/personal-data",
        pathParams: { submissionCode },
        body: { personalData },
      });
    },
  };

const submissionsUpdateAwaitingFeedback: ToolDef<SubmissionsUpdateAwaitingFeedbackInput> =
  {
    name: "intigriti_submissions_update_awaiting_feedback",
    description:
      "Set the awaiting-feedback flag on a submission.",
    inputSchema: SubmissionsUpdateAwaitingFeedbackInputSchema,
    annotations: MUTATION_IDEMPOTENT,
    handler: (input, client) => {
      const { submissionCode, awaitingFeedback } = input;
      return client.request({
        method: "PUT",
        path: "/v2.1/submissions/{submissionCode}/awaiting-feedback",
        pathParams: { submissionCode },
        body: { awaitingFeedback },
      });
    },
  };

const submissionsUpdateGroup: ToolDef<SubmissionsUpdateGroupInput> = {
  name: "intigriti_submissions_update_group",
  description:
    "Assign a submission to a group, or unassign it by passing null for groupId.",
  inputSchema: SubmissionsUpdateGroupInputSchema,
  annotations: MUTATION_IDEMPOTENT,
  handler: (input, client) => {
    const { submissionCode, groupId } = input;
    return client.request({
      method: "PUT",
      path: "/v2.1/submissions/{submissionCode}/group",
      pathParams: { submissionCode },
      body: { groupId },
    });
  },
};

const submissionsUpdateAsset: ToolDef<SubmissionsUpdateAssetInput> = {
  name: "intigriti_submissions_update_asset",
  description:
    "Update the domain/asset associated with a submission.",
  inputSchema: SubmissionsUpdateAssetInputSchema,
  annotations: MUTATION_IDEMPOTENT,
  handler: (input, client) => {
    const { submissionCode, ...body } = input;
    return client.request({
      method: "PUT",
      path: "/v2.1/submissions/{submissionCode}/domain",
      pathParams: { submissionCode },
      body,
    });
  },
};

// ---------------------------------------------------------------------------
// Mutations — DELETEs
// ---------------------------------------------------------------------------

const submissionsDeleteCompanyBonus: ToolDef<SubmissionsDeleteCompanyBonusInput> =
  {
    name: "intigriti_submissions_delete_company_bonus",
    description: "Delete a company bonus payout from a submission.",
    inputSchema: SubmissionsDeleteCompanyBonusInputSchema,
    annotations: DESTRUCTIVE_IDEMPOTENT,
    handler: (input, client) =>
      client.request({
        method: "DELETE",
        path: "/v2.1/submissions/{submissionCode}/company-bonuses/{payoutId}",
        pathParams: {
          submissionCode: input.submissionCode,
          payoutId: input.payoutId,
        },
      }),
  };

const submissionsRemoveTag: ToolDef<SubmissionsRemoveTagInput> = {
  name: "intigriti_submissions_remove_tag",
  description: "Remove a tag from a submission.",
  inputSchema: SubmissionsRemoveTagInputSchema,
  annotations: DESTRUCTIVE_IDEMPOTENT,
  handler: (input, client) =>
    client.request({
      method: "DELETE",
      path: "/v2.1/submissions/{submissionCode}/tags/{tag}",
      pathParams: {
        submissionCode: input.submissionCode,
        tag: input.tag,
      },
    }),
};

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const submissionsTools: AnyToolDef[] = [
  submissionsList,
  submissionsGet,
  submissionsGetEvents,
  submissionsGetPayouts,
  submissionsGetIntegrations,
  submissionsGetPossibleGroups,
  submissionsAddCompanyBonus,
  submissionsExportPdf,
  submissionsExportCsv,
  submissionsAddAttachment,
  submissionsPlaceInternalMessage,
  submissionsPlaceExternalMessage,
  submissionsAddTag,
  submissionsSetCustomBounty,
  submissionsUpdateState,
  submissionsUpdateInternalReference,
  submissionsUpdateSeverity,
  submissionsAssignToMe,
  submissionsUpdatePersonalData,
  submissionsUpdateAwaitingFeedback,
  submissionsUpdateGroup,
  submissionsUpdateAsset,
  submissionsDeleteCompanyBonus,
  submissionsRemoveTag,
];
