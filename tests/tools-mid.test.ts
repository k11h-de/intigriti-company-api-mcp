import { describe, it, expect } from "vitest";
import type { IntigritiClient, RequestArgs } from "../src/client.js";

import { programsTools } from "../src/tools/programs.js";
import { programUpdatesTools } from "../src/tools/program-updates.js";
import { rewardSystemTools } from "../src/tools/reward-system.js";

import {
  ProgramsListInputSchema,
  ProgramsImportSubmissionInputSchema,
} from "../src/schemas/programs.js";
import { ProgramUpdatesCreateInputSchema } from "../src/schemas/program-updates.js";
import { RewardSystemListRewardRequestsInputSchema } from "../src/schemas/reward-system.js";

import {
  READ_ONLY_ANNOTATIONS,
  MUTATION_NON_IDEMPOTENT,
  MUTATION_IDEMPOTENT,
  DESTRUCTIVE_IDEMPOTENT,
} from "../src/tools/types.js";

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

describe("programsTools exports", () => {
  it("has 6 tools with correct names", () => {
    expect(programsTools).toHaveLength(6);
    expect(programsTools[0]?.name).toBe("intigriti_programs_list");
    expect(programsTools[1]?.name).toBe("intigriti_programs_get");
    expect(programsTools[2]?.name).toBe("intigriti_programs_list_submissions");
    expect(programsTools[3]?.name).toBe("intigriti_programs_list_researchers");
    expect(programsTools[4]?.name).toBe("intigriti_programs_list_payouts");
    expect(programsTools[5]?.name).toBe("intigriti_programs_import_submission");
  });
});

describe("programUpdatesTools exports", () => {
  it("has 6 tools with correct names", () => {
    expect(programUpdatesTools).toHaveLength(6);
    expect(programUpdatesTools[0]?.name).toBe(
      "intigriti_program_updates_list_all",
    );
    expect(programUpdatesTools[1]?.name).toBe("intigriti_program_updates_list");
    expect(programUpdatesTools[2]?.name).toBe(
      "intigriti_program_updates_create",
    );
    expect(programUpdatesTools[3]?.name).toBe(
      "intigriti_program_updates_update",
    );
    expect(programUpdatesTools[4]?.name).toBe(
      "intigriti_program_updates_delete",
    );
    expect(programUpdatesTools[5]?.name).toBe(
      "intigriti_program_updates_publish",
    );
  });
});

describe("rewardSystemTools exports", () => {
  it("has 5 tools with correct names", () => {
    expect(rewardSystemTools).toHaveLength(5);
    expect(rewardSystemTools[0]?.name).toBe(
      "intigriti_reward_system_list_reward_requests",
    );
    expect(rewardSystemTools[1]?.name).toBe(
      "intigriti_reward_system_get_reward_request_payout",
    );
    expect(rewardSystemTools[2]?.name).toBe(
      "intigriti_reward_system_delete_reward_request",
    );
    expect(rewardSystemTools[3]?.name).toBe(
      "intigriti_reward_system_create_payout_reward_request",
    );
    expect(rewardSystemTools[4]?.name).toBe("intigriti_reward_system_get_budget");
  });
});

// ---------------------------------------------------------------------------
// Annotations
// ---------------------------------------------------------------------------

describe("annotations: programsTools", () => {
  it("read-only GET tools use READ_ONLY_ANNOTATIONS", () => {
    const readOnlyNames = [
      "intigriti_programs_list",
      "intigriti_programs_get",
      "intigriti_programs_list_submissions",
      "intigriti_programs_list_researchers",
      "intigriti_programs_list_payouts",
    ];
    for (const name of readOnlyNames) {
      const tool = programsTools.find((t) => t.name === name)!;
      expect(tool.annotations).toEqual(READ_ONLY_ANNOTATIONS);
    }
  });

  it("import_submission uses MUTATION_NON_IDEMPOTENT", () => {
    const tool = programsTools.find(
      (t) => t.name === "intigriti_programs_import_submission",
    )!;
    expect(tool.annotations).toEqual(MUTATION_NON_IDEMPOTENT);
  });
});

describe("annotations: programUpdatesTools", () => {
  it("list tools use READ_ONLY_ANNOTATIONS", () => {
    const readOnlyNames = [
      "intigriti_program_updates_list_all",
      "intigriti_program_updates_list",
    ];
    for (const name of readOnlyNames) {
      const tool = programUpdatesTools.find((t) => t.name === name)!;
      expect(tool.annotations).toEqual(READ_ONLY_ANNOTATIONS);
    }
  });

  it("create uses MUTATION_NON_IDEMPOTENT", () => {
    const tool = programUpdatesTools.find(
      (t) => t.name === "intigriti_program_updates_create",
    )!;
    expect(tool.annotations).toEqual(MUTATION_NON_IDEMPOTENT);
  });

  it("update uses MUTATION_IDEMPOTENT", () => {
    const tool = programUpdatesTools.find(
      (t) => t.name === "intigriti_program_updates_update",
    )!;
    expect(tool.annotations).toEqual(MUTATION_IDEMPOTENT);
  });

  it("delete uses DESTRUCTIVE_IDEMPOTENT", () => {
    const tool = programUpdatesTools.find(
      (t) => t.name === "intigriti_program_updates_delete",
    )!;
    expect(tool.annotations).toEqual(DESTRUCTIVE_IDEMPOTENT);
  });

  it("publish uses MUTATION_NON_IDEMPOTENT", () => {
    const tool = programUpdatesTools.find(
      (t) => t.name === "intigriti_program_updates_publish",
    )!;
    expect(tool.annotations).toEqual(MUTATION_NON_IDEMPOTENT);
  });
});

describe("annotations: rewardSystemTools", () => {
  it("read-only GET tools use READ_ONLY_ANNOTATIONS", () => {
    const readOnlyNames = [
      "intigriti_reward_system_list_reward_requests",
      "intigriti_reward_system_get_reward_request_payout",
      "intigriti_reward_system_get_budget",
    ];
    for (const name of readOnlyNames) {
      const tool = rewardSystemTools.find((t) => t.name === name)!;
      expect(tool.annotations).toEqual(READ_ONLY_ANNOTATIONS);
    }
  });

  it("delete_reward_request uses DESTRUCTIVE_IDEMPOTENT", () => {
    const tool = rewardSystemTools.find(
      (t) => t.name === "intigriti_reward_system_delete_reward_request",
    )!;
    expect(tool.annotations).toEqual(DESTRUCTIVE_IDEMPOTENT);
  });

  it("create_payout_reward_request uses MUTATION_NON_IDEMPOTENT", () => {
    const tool = rewardSystemTools.find(
      (t) => t.name === "intigriti_reward_system_create_payout_reward_request",
    )!;
    expect(tool.annotations).toEqual(MUTATION_NON_IDEMPOTENT);
  });
});

// ---------------------------------------------------------------------------
// intigriti_programs_list_submissions handler
// ---------------------------------------------------------------------------

describe("intigriti_programs_list_submissions handler", () => {
  const tool = programsTools.find(
    (t) => t.name === "intigriti_programs_list_submissions",
  )!;

  it("converts updatedSince ISO to unix seconds in UpdatedSince query", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler(
      { programId: "prog-1", updatedSince: "2025-03-10T08:00:00Z" },
      client,
    );

    const expectedUnix = Math.floor(
      new Date("2025-03-10T08:00:00Z").getTime() / 1000,
    );
    expect(calls[0]?.args.query?.["UpdatedSince"]).toBe(expectedUnix);
  });

  it("omits UpdatedSince when updatedSince is not provided", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler({ programId: "prog-1" }, client);

    const query = calls[0]?.args.query ?? {};
    expect(query).not.toHaveProperty("UpdatedSince");
  });
});

// ---------------------------------------------------------------------------
// intigriti_programs_import_submission handler
// ---------------------------------------------------------------------------

describe("intigriti_programs_import_submission handler", () => {
  const tool = programsTools.find(
    (t) => t.name === "intigriti_programs_import_submission",
  )!;

  it("includes programId in path params", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler({ programId: "prog-42", title: "Test" }, client);

    expect(calls[0]?.args.path).toBe(
      "/v2.1/programs/{programId}/import-submission",
    );
    expect(calls[0]?.args.pathParams).toEqual({ programId: "prog-42" });
  });

  it("sends body without programId", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler(
      { programId: "prog-42", title: "Test", impact: "High" },
      client,
    );

    const body = calls[0]?.args.body as Record<string, unknown>;
    expect(body).not.toHaveProperty("programId");
    expect(body["title"]).toBe("Test");
    expect(body["impact"]).toBe("High");
  });

  it("uses POST method", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler({ programId: "prog-42" }, client);

    expect(calls[0]?.args.method).toBe("POST");
  });
});

// ---------------------------------------------------------------------------
// intigriti_program_updates_create handler
// ---------------------------------------------------------------------------

describe("intigriti_program_updates_create handler", () => {
  const tool = programUpdatesTools.find(
    (t) => t.name === "intigriti_program_updates_create",
  )!;

  it("POSTs to the correct path with programId as path param", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler(
      {
        programId: "prog-1",
        title: "New update",
        description: "Details here",
        publish: true,
        notifyResearchers: false,
      },
      client,
    );

    expect(calls[0]?.args.method).toBe("POST");
    expect(calls[0]?.args.path).toBe("/v2.1/programs/{programId}/updates");
    expect(calls[0]?.args.pathParams).toEqual({ programId: "prog-1" });
  });

  it("sends body without programId", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler(
      {
        programId: "prog-1",
        title: "New update",
        description: "Details",
        publish: false,
        notifyResearchers: true,
      },
      client,
    );

    const body = calls[0]?.args.body as Record<string, unknown>;
    expect(body).not.toHaveProperty("programId");
    expect(body["title"]).toBe("New update");
    expect(body["description"]).toBe("Details");
    expect(body["publish"]).toBe(false);
    expect(body["notifyResearchers"]).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// intigriti_program_updates_update handler
// ---------------------------------------------------------------------------

describe("intigriti_program_updates_update handler", () => {
  const tool = programUpdatesTools.find(
    (t) => t.name === "intigriti_program_updates_update",
  )!;

  it("PUTs with both path params and body without path params", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler(
      {
        programId: "prog-1",
        programUpdateId: "upd-99",
        title: "Updated title",
        description: "Updated desc",
      },
      client,
    );

    expect(calls[0]?.args.method).toBe("PUT");
    expect(calls[0]?.args.path).toBe(
      "/v2.1/programs/{programId}/updates/{programUpdateId}",
    );
    expect(calls[0]?.args.pathParams).toEqual({
      programId: "prog-1",
      programUpdateId: "upd-99",
    });

    const body = calls[0]?.args.body as Record<string, unknown>;
    expect(body).not.toHaveProperty("programId");
    expect(body).not.toHaveProperty("programUpdateId");
    expect(body["title"]).toBe("Updated title");
    expect(body["description"]).toBe("Updated desc");
  });
});

// ---------------------------------------------------------------------------
// intigriti_program_updates_delete handler
// ---------------------------------------------------------------------------

describe("intigriti_program_updates_delete handler", () => {
  const tool = programUpdatesTools.find(
    (t) => t.name === "intigriti_program_updates_delete",
  )!;

  it("uses DELETE method with both path params and no body", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler(
      { programId: "prog-1", programUpdateId: "upd-77" },
      client,
    );

    expect(calls[0]?.args.method).toBe("DELETE");
    expect(calls[0]?.args.path).toBe(
      "/v2.1/programs/{programId}/updates/{programUpdateId}",
    );
    expect(calls[0]?.args.pathParams).toEqual({
      programId: "prog-1",
      programUpdateId: "upd-77",
    });
    expect(calls[0]?.args.body).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// intigriti_program_updates_publish handler
// ---------------------------------------------------------------------------

describe("intigriti_program_updates_publish handler", () => {
  const tool = programUpdatesTools.find(
    (t) => t.name === "intigriti_program_updates_publish",
  )!;

  it("POSTs to publish endpoint with both path params", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler(
      {
        programId: "prog-1",
        programUpdateId: "upd-55",
        notifyResearchers: true,
      },
      client,
    );

    expect(calls[0]?.args.method).toBe("POST");
    expect(calls[0]?.args.path).toBe(
      "/v2.1/programs/{programId}/updates/{programUpdateId}/publish",
    );
    expect(calls[0]?.args.pathParams).toEqual({
      programId: "prog-1",
      programUpdateId: "upd-55",
    });
  });

  it("sends notifyResearchers in body without path params", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler(
      {
        programId: "prog-1",
        programUpdateId: "upd-55",
        notifyResearchers: false,
      },
      client,
    );

    const body = calls[0]?.args.body as Record<string, unknown>;
    expect(body).not.toHaveProperty("programId");
    expect(body).not.toHaveProperty("programUpdateId");
    expect(body["notifyResearchers"]).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// intigriti_reward_system_list_reward_requests handler
// ---------------------------------------------------------------------------

describe("intigriti_reward_system_list_reward_requests handler", () => {
  const tool = rewardSystemTools.find(
    (t) => t.name === "intigriti_reward_system_list_reward_requests",
  )!;

  it("sends empty query when no params provided", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler({}, client);

    const query = calls[0]?.args.query ?? {};
    expect(Object.keys(query)).toHaveLength(0);
  });

  it("sends PascalCase keys for all four params with correct values", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler(
      {
        limit: 10,
        offset: 20,
        createdSince: "2025-01-01T00:00:00Z",
        updatedSince: "2025-06-01T12:00:00Z",
      },
      client,
    );

    const query = calls[0]?.args.query as Record<string, unknown>;
    expect(query["Limit"]).toBe(10);
    expect(query["Offset"]).toBe(20);
    expect(query["CreatedSince"]).toBe(
      Math.floor(new Date("2025-01-01T00:00:00Z").getTime() / 1000),
    );
    expect(query["UpdatedSince"]).toBe(
      Math.floor(new Date("2025-06-01T12:00:00Z").getTime() / 1000),
    );
  });

  it("omits undefined params from query", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler({ limit: 5 }, client);

    const query = calls[0]?.args.query as Record<string, unknown>;
    expect(query["Limit"]).toBe(5);
    expect(query).not.toHaveProperty("Offset");
    expect(query).not.toHaveProperty("CreatedSince");
    expect(query).not.toHaveProperty("UpdatedSince");
  });
});

// ---------------------------------------------------------------------------
// intigriti_reward_system_delete_reward_request handler
// ---------------------------------------------------------------------------

describe("intigriti_reward_system_delete_reward_request handler", () => {
  const tool = rewardSystemTools.find(
    (t) => t.name === "intigriti_reward_system_delete_reward_request",
  )!;

  it("uses DELETE method with rewardRequestId as path param", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler({ rewardRequestId: "rr-123" }, client);

    expect(calls[0]?.args.method).toBe("DELETE");
    expect(calls[0]?.args.path).toBe(
      "/v2.1/reward-system/reward-requests/{rewardRequestId}",
    );
    expect(calls[0]?.args.pathParams).toEqual({ rewardRequestId: "rr-123" });
  });
});

// ---------------------------------------------------------------------------
// intigriti_reward_system_create_payout_reward_request handler
// ---------------------------------------------------------------------------

describe("intigriti_reward_system_create_payout_reward_request handler", () => {
  const tool = rewardSystemTools.find(
    (t) => t.name === "intigriti_reward_system_create_payout_reward_request",
  )!;

  it("POSTs to correct path with input as body", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler(
      {
        title: "Bug bounty payout",
        internalReference: "ref-001",
        recipientEmail: "researcher@example.com",
        severity: 3,
        amount: { value: 500, currency: "USD" },
      },
      client,
    );

    expect(calls[0]?.args.method).toBe("POST");
    expect(calls[0]?.args.path).toBe(
      "/v2.1/reward-system/payout-reward-requests",
    );
    expect(calls[0]?.args.body).toMatchObject({
      title: "Bug bounty payout",
      recipientEmail: "researcher@example.com",
      amount: { value: 500, currency: "USD" },
    });
  });
});

// ---------------------------------------------------------------------------
// Schema strictness — unknown keys must be rejected
// ---------------------------------------------------------------------------

describe("schema strictness", () => {
  it("ProgramsListInputSchema rejects unknown keys", () => {
    const result = ProgramsListInputSchema.safeParse({ unexpected: "key" });
    expect(result.success).toBe(false);
  });

  it("ProgramsImportSubmissionInputSchema rejects unknown keys", () => {
    const result = ProgramsImportSubmissionInputSchema.safeParse({
      programId: "p1",
      unknownField: "bad",
    });
    expect(result.success).toBe(false);
  });

  it("ProgramUpdatesCreateInputSchema rejects unknown keys", () => {
    const result = ProgramUpdatesCreateInputSchema.safeParse({
      programId: "p1",
      extra: "not-allowed",
    });
    expect(result.success).toBe(false);
  });

  it("RewardSystemListRewardRequestsInputSchema rejects unknown keys", () => {
    const result = RewardSystemListRewardRequestsInputSchema.safeParse({
      badKey: "value",
    });
    expect(result.success).toBe(false);
  });
});
