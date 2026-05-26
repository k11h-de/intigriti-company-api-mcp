import type { ToolDef, AnyToolDef } from "./types.js";
import { READ_ONLY_ANNOTATIONS } from "./types.js";
import { isoToUnixSeconds } from "./utils.js";
import {
  GroupsListInputSchema,
  GroupsListSubmissionsInputSchema,
  type GroupsListInput,
  type GroupsListSubmissionsInput,
} from "../schemas/groups.js";

const groupsList: ToolDef<GroupsListInput> = {
  name: "intigriti_groups_list",
  description:
    "List all groups configured for the company. Groups are organizational units used to bucket submissions by program/team.",
  inputSchema: GroupsListInputSchema,
  annotations: READ_ONLY_ANNOTATIONS,
  handler: (_input, client) =>
    client.request({ method: "GET", path: "/v2.1/groups" }),
};

const groupsListSubmissions: ToolDef<GroupsListSubmissionsInput> = {
  name: "intigriti_groups_list_submissions",
  description:
    "List submissions belonging to a specific group. Optionally filter by last-updated timestamp to retrieve only recently changed records.",
  inputSchema: GroupsListSubmissionsInputSchema,
  annotations: READ_ONLY_ANNOTATIONS,
  handler: (input, client) => {
    const query: Record<string, number | undefined> = {};
    if (input.updatedSince !== undefined) {
      query["UpdatedSince"] = isoToUnixSeconds(input.updatedSince);
    }
    return client.request({
      method: "GET",
      path: "/v2.1/groups/{groupId}/submissions",
      pathParams: { groupId: input.groupId },
      query,
    });
  },
};

export const groupsTools: AnyToolDef[] = [
  groupsList,
  groupsListSubmissions,
];
