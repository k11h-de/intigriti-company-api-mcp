import type { ToolDef, AnyToolDef } from "./types.js";
import { READ_ONLY_ANNOTATIONS } from "./types.js";
import {
  SubmissionTypesListInputSchema,
  type SubmissionTypesListInput,
} from "../schemas/submission-types.js";

const submissionTypesList: ToolDef<SubmissionTypesListInput> = {
  name: "intigriti_submission_types_list",
  description:
    "List all possible submission types available on the Intigriti platform. Returns the enumeration of valid submission type values that can be used when filtering or creating submissions.",
  inputSchema: SubmissionTypesListInputSchema,
  annotations: READ_ONLY_ANNOTATIONS,
  handler: (_input, client) =>
    client.request({ method: "GET", path: "/v2.1/submission-possible-types" }),
};

export const submissionTypesTools: AnyToolDef[] = [submissionTypesList];
