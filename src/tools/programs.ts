import type { ToolDef, AnyToolDef } from "./types.js";
import {
  READ_ONLY_ANNOTATIONS,
  MUTATION_NON_IDEMPOTENT,
} from "./types.js";
import {
  ProgramsListInputSchema,
  ProgramsGetInputSchema,
  ProgramsListSubmissionsInputSchema,
  ProgramsListResearchersInputSchema,
  ProgramsListPayoutsInputSchema,
  ProgramsImportSubmissionInputSchema,
  type ProgramsListInput,
  type ProgramsGetInput,
  type ProgramsListSubmissionsInput,
  type ProgramsListResearchersInput,
  type ProgramsListPayoutsInput,
  type ProgramsImportSubmissionInput,
} from "../schemas/programs.js";

const programsList: ToolDef<ProgramsListInput> = {
  name: "intigriti_programs_list",
  description: "List all programs configured for the company.",
  inputSchema: ProgramsListInputSchema,
  annotations: READ_ONLY_ANNOTATIONS,
  handler: (_input, client) =>
    client.request({ method: "GET", path: "/v2.1/programs" }),
};

const programsGet: ToolDef<ProgramsGetInput> = {
  name: "intigriti_programs_get",
  description: "Retrieve details of a single program by its identifier.",
  inputSchema: ProgramsGetInputSchema,
  annotations: READ_ONLY_ANNOTATIONS,
  handler: (input, client) =>
    client.request({
      method: "GET",
      path: "/v2.1/programs/{programId}",
      pathParams: { programId: input.programId },
    }),
};

const programsListSubmissions: ToolDef<ProgramsListSubmissionsInput> = {
  name: "intigriti_programs_list_submissions",
  description:
    "List submissions belonging to a specific program. Optionally filter by last-updated timestamp to retrieve only recently changed records.",
  inputSchema: ProgramsListSubmissionsInputSchema,
  annotations: READ_ONLY_ANNOTATIONS,
  handler: (input, client) => {
    const query: Record<string, number | undefined> = {};
    if (input.updatedSince !== undefined) {
      query["UpdatedSince"] = Math.floor(
        new Date(input.updatedSince).getTime() / 1000,
      );
    }
    return client.request({
      method: "GET",
      path: "/v2.1/programs/{programId}/submissions",
      pathParams: { programId: input.programId },
      query,
    });
  },
};

const programsListResearchers: ToolDef<ProgramsListResearchersInput> = {
  name: "intigriti_programs_list_researchers",
  description: "List researchers who have access to a specific program.",
  inputSchema: ProgramsListResearchersInputSchema,
  annotations: READ_ONLY_ANNOTATIONS,
  handler: (input, client) =>
    client.request({
      method: "GET",
      path: "/v2.1/programs/{programId}/researchers",
      pathParams: { programId: input.programId },
    }),
};

const programsListPayouts: ToolDef<ProgramsListPayoutsInput> = {
  name: "intigriti_programs_list_payouts",
  description: "List payouts associated with a specific program.",
  inputSchema: ProgramsListPayoutsInputSchema,
  annotations: READ_ONLY_ANNOTATIONS,
  handler: (input, client) =>
    client.request({
      method: "GET",
      path: "/v2.1/programs/{programId}/payouts",
      pathParams: { programId: input.programId },
    }),
};

const programsImportSubmission: ToolDef<ProgramsImportSubmissionInput> = {
  name: "intigriti_programs_import_submission",
  description:
    "[BETA] Import an external submission into a program. WARNING: this action sends a real submission to the Intigriti platform and cannot be undone.",
  inputSchema: ProgramsImportSubmissionInputSchema,
  annotations: MUTATION_NON_IDEMPOTENT,
  handler: (input, client) => {
    const { programId, ...body } = input;
    return client.request({
      method: "POST",
      path: "/v2.1/programs/{programId}/import-submission",
      pathParams: { programId },
      body,
    });
  },
};

export const programsTools: AnyToolDef[] = [
  programsList,
  programsGet,
  programsListSubmissions,
  programsListResearchers,
  programsListPayouts,
  programsImportSubmission,
];
