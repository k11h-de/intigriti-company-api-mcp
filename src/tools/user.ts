import type { ToolDef, AnyToolDef } from "./types.js";
import { READ_ONLY_ANNOTATIONS } from "./types.js";
import {
  UserIpLookupInputSchema,
  UserResearcherAccessInputSchema,
  type UserIpLookupInput,
  type UserResearcherAccessInput,
} from "../schemas/user.js";

const userIpLookup: ToolDef<UserIpLookupInput> = {
  name: "intigriti_user_iplookup",
  description:
    "Look up an IP address in Intigriti's user database to determine if it belongs to a registered Intigriti researcher. Useful for triage when an IP appears in a submission.",
  inputSchema: UserIpLookupInputSchema,
  annotations: READ_ONLY_ANNOTATIONS,
  handler: (input, client) =>
    client.request({
      method: "GET",
      path: "/v2.1/iplookup",
      query: { ipAddress: input.ipAddress },
    }),
};

const userResearcherAccess: ToolDef<UserResearcherAccessInput> = {
  name: "intigriti_user_researcher_access",
  description:
    "Check whether a specific researcher has access to a program. Returns the researcher's access status for the given program.",
  inputSchema: UserResearcherAccessInputSchema,
  annotations: READ_ONLY_ANNOTATIONS,
  handler: (input, client) =>
    client.request({
      method: "GET",
      path: "/v2.1/programs/{programId}/researchers/{researcherUserName}/access",
      pathParams: {
        programId: input.programId,
        researcherUserName: input.researcherUserName,
      },
    }),
};

export const userTools: AnyToolDef[] = [
  userIpLookup,
  userResearcherAccess,
];
