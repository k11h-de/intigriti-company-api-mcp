import { describe, it, expect } from "vitest";
import type { IntigritiClient, RequestArgs } from "../src/client.js";

import { groupsTools } from "../src/tools/groups.js";
import { companyAssetsTools } from "../src/tools/company-assets.js";
import { userTools } from "../src/tools/user.js";
import { payoutsTools } from "../src/tools/payouts.js";
import { submissionTypesTools } from "../src/tools/submission-types.js";

import {
  GroupsListInputSchema,
  GroupsListSubmissionsInputSchema,
} from "../src/schemas/groups.js";
import { CompanyAssetsListInputSchema } from "../src/schemas/company-assets.js";
import { UserIpLookupInputSchema } from "../src/schemas/user.js";
import { PayoutsListInputSchema } from "../src/schemas/payouts.js";
import { SubmissionTypesListInputSchema } from "../src/schemas/submission-types.js";

// ---------------------------------------------------------------------------
// Stub client
// ---------------------------------------------------------------------------

interface CapturedCall {
  args: RequestArgs;
}

function makeStubClient(): { client: IntigritiClient; calls: CapturedCall[] } {
  const calls: CapturedCall[] = [];
  const client: IntigritiClient = {
    request: async (args: RequestArgs) => {
      calls.push({ args });
      return {};
    },
    requestRaw: async (args: RequestArgs) => {
      calls.push({ args });
      return { status: 200, body: {} };
    },
  };
  return { client, calls };
}

// ---------------------------------------------------------------------------
// Tool counts and names
// ---------------------------------------------------------------------------

describe("tool exports: counts and names", () => {
  it("groupsTools exports 2 tools with correct names", () => {
    expect(groupsTools).toHaveLength(2);
    expect(groupsTools[0]?.name).toBe("intigriti_groups_list");
    expect(groupsTools[1]?.name).toBe("intigriti_groups_list_submissions");
  });

  it("companyAssetsTools exports 3 tools with correct names", () => {
    expect(companyAssetsTools).toHaveLength(3);
    expect(companyAssetsTools[0]?.name).toBe("intigriti_company_assets_list");
    expect(companyAssetsTools[1]?.name).toBe(
      "intigriti_company_assets_get_custom_fields",
    );
    expect(companyAssetsTools[2]?.name).toBe(
      "intigriti_company_assets_get_required_skills",
    );
  });

  it("userTools exports 2 tools with correct names", () => {
    expect(userTools).toHaveLength(2);
    expect(userTools[0]?.name).toBe("intigriti_user_iplookup");
    expect(userTools[1]?.name).toBe("intigriti_user_researcher_access");
  });

  it("payoutsTools exports 1 tool with correct name", () => {
    expect(payoutsTools).toHaveLength(1);
    expect(payoutsTools[0]?.name).toBe("intigriti_payouts_list");
  });

  it("submissionTypesTools exports 1 tool with correct name", () => {
    expect(submissionTypesTools).toHaveLength(1);
    expect(submissionTypesTools[0]?.name).toBe(
      "intigriti_submission_types_list",
    );
  });
});

// ---------------------------------------------------------------------------
// Annotations
// ---------------------------------------------------------------------------

describe("annotations", () => {
  const allTools = [
    ...groupsTools,
    ...companyAssetsTools,
    ...userTools,
    ...payoutsTools,
    ...submissionTypesTools,
  ];

  it("every tool has readOnlyHint: true", () => {
    for (const tool of allTools) {
      expect(tool.annotations.readOnlyHint).toBe(true);
    }
  });

  it("every tool has destructiveHint: false", () => {
    for (const tool of allTools) {
      expect(tool.annotations.destructiveHint).toBe(false);
    }
  });

  it("every tool has idempotentHint: true", () => {
    for (const tool of allTools) {
      expect(tool.annotations.idempotentHint).toBe(true);
    }
  });

  it("every tool has openWorldHint: true", () => {
    for (const tool of allTools) {
      expect(tool.annotations.openWorldHint).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// Schema strictness — unknown keys must be rejected
// ---------------------------------------------------------------------------

describe("schema strictness", () => {
  it("GroupsListInputSchema rejects unknown keys", () => {
    const result = GroupsListInputSchema.safeParse({ unexpected: "key" });
    expect(result.success).toBe(false);
  });

  it("GroupsListSubmissionsInputSchema rejects unknown keys", () => {
    const result = GroupsListSubmissionsInputSchema.safeParse({
      groupId: "g1",
      extra: "bad",
    });
    expect(result.success).toBe(false);
  });

  it("CompanyAssetsListInputSchema rejects unknown keys", () => {
    const result = CompanyAssetsListInputSchema.safeParse({ x: 1 });
    expect(result.success).toBe(false);
  });

  it("UserIpLookupInputSchema rejects unknown keys", () => {
    const result = UserIpLookupInputSchema.safeParse({ foo: "bar" });
    expect(result.success).toBe(false);
  });

  it("PayoutsListInputSchema rejects unknown keys", () => {
    const result = PayoutsListInputSchema.safeParse({ x: 1 });
    expect(result.success).toBe(false);
  });

  it("SubmissionTypesListInputSchema rejects unknown keys", () => {
    const result = SubmissionTypesListInputSchema.safeParse({ x: 1 });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// intigriti_groups_list_submissions handler
// ---------------------------------------------------------------------------

describe("intigriti_groups_list_submissions handler", () => {
  const tool = groupsTools.find(
    (t) => t.name === "intigriti_groups_list_submissions",
  )!;

  it("calls client.request with method GET and correct path", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler({ groupId: "grp-42" }, client);

    expect(calls).toHaveLength(1);
    expect(calls[0]?.args.method).toBe("GET");
    expect(calls[0]?.args.path).toBe(
      "/v2.1/groups/{groupId}/submissions",
    );
  });

  it("passes groupId as path param", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler({ groupId: "grp-42" }, client);

    expect(calls[0]?.args.pathParams).toEqual({ groupId: "grp-42" });
  });

  it("omits UpdatedSince from query when updatedSince is not provided", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler({ groupId: "grp-42" }, client);

    const query = calls[0]?.args.query ?? {};
    expect(query).not.toHaveProperty("UpdatedSince");
  });

  it("converts updatedSince ISO string to unix seconds as UpdatedSince", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler(
      { groupId: "grp-42", updatedSince: "2025-01-15T10:00:00Z" },
      client,
    );

    const expectedUnix = Math.floor(
      new Date("2025-01-15T10:00:00Z").getTime() / 1000,
    );
    expect(calls[0]?.args.query?.["UpdatedSince"]).toBe(expectedUnix);
  });
});

// ---------------------------------------------------------------------------
// intigriti_company_assets_get_custom_fields handler
// ---------------------------------------------------------------------------

describe("intigriti_company_assets_get_custom_fields handler", () => {
  const tool = companyAssetsTools.find(
    (t) => t.name === "intigriti_company_assets_get_custom_fields",
  )!;

  it("passes assetId as a path param", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler({ assetId: "asset-99" }, client);

    expect(calls[0]?.args.method).toBe("GET");
    expect(calls[0]?.args.path).toBe(
      "/v2.1/company-assets/{assetId}/custom-fields",
    );
    expect(calls[0]?.args.pathParams).toEqual({ assetId: "asset-99" });
  });
});

// ---------------------------------------------------------------------------
// intigriti_company_assets_get_required_skills handler
// ---------------------------------------------------------------------------

describe("intigriti_company_assets_get_required_skills handler", () => {
  const tool = companyAssetsTools.find(
    (t) => t.name === "intigriti_company_assets_get_required_skills",
  )!;

  it("passes assetId as a path param", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler({ assetId: "asset-77" }, client);

    expect(calls[0]?.args.method).toBe("GET");
    expect(calls[0]?.args.path).toBe(
      "/v2.1/company-assets/{assetId}/required-skills",
    );
    expect(calls[0]?.args.pathParams).toEqual({ assetId: "asset-77" });
  });
});

// ---------------------------------------------------------------------------
// intigriti_user_iplookup handler
// ---------------------------------------------------------------------------

describe("intigriti_user_iplookup handler", () => {
  const tool = userTools.find(
    (t) => t.name === "intigriti_user_iplookup",
  )!;

  it("passes ipAddress as a query param when provided", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler({ ipAddress: "1.2.3.4" }, client);

    expect(calls[0]?.args.query).toEqual({ ipAddress: "1.2.3.4" });
  });

  it("omits ipAddress from query when not provided", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler({}, client);

    // ipAddress should be undefined (or absent) in the query
    const q = calls[0]?.args.query ?? {};
    expect(q["ipAddress"]).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// intigriti_user_researcher_access handler
// ---------------------------------------------------------------------------

describe("intigriti_user_researcher_access handler", () => {
  const tool = userTools.find(
    (t) => t.name === "intigriti_user_researcher_access",
  )!;

  it("passes both programId and researcherUserName as path params", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler(
      { programId: "prog-1", researcherUserName: "h4ck3r" },
      client,
    );

    expect(calls[0]?.args.method).toBe("GET");
    expect(calls[0]?.args.path).toBe(
      "/v2.1/programs/{programId}/researchers/{researcherUserName}/access",
    );
    expect(calls[0]?.args.pathParams).toEqual({
      programId: "prog-1",
      researcherUserName: "h4ck3r",
    });
  });
});
