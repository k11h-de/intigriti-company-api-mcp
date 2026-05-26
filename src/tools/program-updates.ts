import type { ToolDef, AnyToolDef } from "./types.js";
import {
  READ_ONLY_ANNOTATIONS,
  MUTATION_NON_IDEMPOTENT,
  MUTATION_IDEMPOTENT,
  DESTRUCTIVE_IDEMPOTENT,
} from "./types.js";
import {
  ProgramUpdatesListAllInputSchema,
  ProgramUpdatesListInputSchema,
  ProgramUpdatesCreateInputSchema,
  ProgramUpdatesUpdateInputSchema,
  ProgramUpdatesDeleteInputSchema,
  ProgramUpdatesPublishInputSchema,
  type ProgramUpdatesListAllInput,
  type ProgramUpdatesListInput,
  type ProgramUpdatesCreateInput,
  type ProgramUpdatesUpdateInput,
  type ProgramUpdatesDeleteInput,
  type ProgramUpdatesPublishInput,
} from "../schemas/program-updates.js";

const programUpdatesListAll: ToolDef<ProgramUpdatesListAllInput> = {
  name: "intigriti_program_updates_list_all",
  description: "List program updates across all programs in the company.",
  inputSchema: ProgramUpdatesListAllInputSchema,
  annotations: READ_ONLY_ANNOTATIONS,
  handler: (_input, client) =>
    client.request({ method: "GET", path: "/v2.1/programs/updates" }),
};

const programUpdatesList: ToolDef<ProgramUpdatesListInput> = {
  name: "intigriti_program_updates_list",
  description: "List all updates for a specific program.",
  inputSchema: ProgramUpdatesListInputSchema,
  annotations: READ_ONLY_ANNOTATIONS,
  handler: (input, client) =>
    client.request({
      method: "GET",
      path: "/v2.1/programs/{programId}/updates",
      pathParams: { programId: input.programId },
    }),
};

const programUpdatesCreate: ToolDef<ProgramUpdatesCreateInput> = {
  name: "intigriti_program_updates_create",
  description: "Create a new update for a specific program.",
  inputSchema: ProgramUpdatesCreateInputSchema,
  annotations: MUTATION_NON_IDEMPOTENT,
  handler: (input, client) => {
    const { programId, ...body } = input;
    return client.request({
      method: "POST",
      path: "/v2.1/programs/{programId}/updates",
      pathParams: { programId },
      body,
    });
  },
};

const programUpdatesUpdate: ToolDef<ProgramUpdatesUpdateInput> = {
  name: "intigriti_program_updates_update",
  description: "Update the title or description of an existing program update.",
  inputSchema: ProgramUpdatesUpdateInputSchema,
  annotations: MUTATION_IDEMPOTENT,
  handler: (input, client) => {
    const { programId, programUpdateId, ...body } = input;
    return client.request({
      method: "PUT",
      path: "/v2.1/programs/{programId}/updates/{programUpdateId}",
      pathParams: { programId, programUpdateId },
      body,
    });
  },
};

const programUpdatesDelete: ToolDef<ProgramUpdatesDeleteInput> = {
  name: "intigriti_program_updates_delete",
  description: "Delete a specific program update permanently.",
  inputSchema: ProgramUpdatesDeleteInputSchema,
  annotations: DESTRUCTIVE_IDEMPOTENT,
  handler: (input, client) =>
    client.request({
      method: "DELETE",
      path: "/v2.1/programs/{programId}/updates/{programUpdateId}",
      pathParams: {
        programId: input.programId,
        programUpdateId: input.programUpdateId,
      },
    }),
};

const programUpdatesPublish: ToolDef<ProgramUpdatesPublishInput> = {
  name: "intigriti_program_updates_publish",
  description: "Publish a draft program update, making it visible to researchers.",
  inputSchema: ProgramUpdatesPublishInputSchema,
  annotations: MUTATION_NON_IDEMPOTENT,
  handler: (input, client) => {
    const { programId, programUpdateId, ...body } = input;
    return client.request({
      method: "POST",
      path: "/v2.1/programs/{programId}/updates/{programUpdateId}/publish",
      pathParams: { programId, programUpdateId },
      body,
    });
  },
};

export const programUpdatesTools: AnyToolDef[] = [
  programUpdatesListAll,
  programUpdatesList,
  programUpdatesCreate,
  programUpdatesUpdate,
  programUpdatesDelete,
  programUpdatesPublish,
];
