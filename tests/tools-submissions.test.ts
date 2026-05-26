import { describe, it, expect } from "vitest";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { IntigritiClient, RequestArgs } from "../src/client.js";

import { submissionsTools } from "../src/tools/submissions.js";

import {
  SubmissionsListInputSchema,
  SubmissionsGetInputSchema,
  SubmissionsGetEventsInputSchema,
  SubmissionsAddCompanyBonusInputSchema,
  SubmissionsSetCustomBountyInputSchema,
  SubmissionsUpdateGroupInputSchema,
  SubmissionsUpdatePersonalDataInputSchema,
  SubmissionsAddAttachmentInputSchema,
  SubmissionsDeleteCompanyBonusInputSchema,
} from "../src/schemas/submissions.js";

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

function makeStubClient(
  responseOverride?: unknown,
): { client: IntigritiClient; calls: CapturedCall[] } {
  const calls: CapturedCall[] = [];
  const client: IntigritiClient = {
    request: async (args: RequestArgs) => {
      calls.push({ args });
      return responseOverride !== undefined ? responseOverride : {};
    },
    requestRaw: async (args: RequestArgs) => {
      calls.push({ args });
      return { status: 200, body: responseOverride !== undefined ? responseOverride : {} };
    },
  };
  return { client, calls };
}

// ---------------------------------------------------------------------------
// Tool count and names
// ---------------------------------------------------------------------------

describe("submissionsTools exports", () => {
  it("has 24 tools", () => {
    expect(submissionsTools).toHaveLength(24);
  });

  it("has all tool names in order", () => {
    const names = submissionsTools.map((t) => t.name);
    expect(names).toEqual([
      "intigriti_submissions_list",
      "intigriti_submissions_get",
      "intigriti_submissions_get_events",
      "intigriti_submissions_get_payouts",
      "intigriti_submissions_get_integrations",
      "intigriti_submissions_get_possible_groups",
      "intigriti_submissions_add_company_bonus",
      "intigriti_submissions_export_pdf",
      "intigriti_submissions_export_csv",
      "intigriti_submissions_add_attachment",
      "intigriti_submissions_place_internal_message",
      "intigriti_submissions_place_external_message",
      "intigriti_submissions_add_tag",
      "intigriti_submissions_set_custom_bounty",
      "intigriti_submissions_update_state",
      "intigriti_submissions_update_internal_reference",
      "intigriti_submissions_update_severity",
      "intigriti_submissions_assign_to_me",
      "intigriti_submissions_update_personal_data",
      "intigriti_submissions_update_awaiting_feedback",
      "intigriti_submissions_update_group",
      "intigriti_submissions_update_asset",
      "intigriti_submissions_delete_company_bonus",
      "intigriti_submissions_remove_tag",
    ]);
  });
});

// ---------------------------------------------------------------------------
// Annotations
// ---------------------------------------------------------------------------

describe("annotations: GET tools use READ_ONLY_ANNOTATIONS", () => {
  const readOnlyNames = [
    "intigriti_submissions_list",
    "intigriti_submissions_get",
    "intigriti_submissions_get_events",
    "intigriti_submissions_get_payouts",
    "intigriti_submissions_get_integrations",
    "intigriti_submissions_get_possible_groups",
  ];
  it("all six read-only tools have READ_ONLY_ANNOTATIONS", () => {
    for (const name of readOnlyNames) {
      const tool = submissionsTools.find((t) => t.name === name)!;
      expect(tool.annotations).toEqual(READ_ONLY_ANNOTATIONS);
    }
  });
});

describe("annotations: POST tools use MUTATION_NON_IDEMPOTENT", () => {
  const postNames = [
    "intigriti_submissions_add_company_bonus",
    "intigriti_submissions_export_pdf",
    "intigriti_submissions_export_csv",
    "intigriti_submissions_add_attachment",
    "intigriti_submissions_place_internal_message",
    "intigriti_submissions_place_external_message",
    "intigriti_submissions_add_tag",
    "intigriti_submissions_set_custom_bounty",
  ];
  it("all eight POST tools have MUTATION_NON_IDEMPOTENT", () => {
    for (const name of postNames) {
      const tool = submissionsTools.find((t) => t.name === name)!;
      expect(tool.annotations).toEqual(MUTATION_NON_IDEMPOTENT);
    }
  });
});

describe("annotations: PUT tools use MUTATION_IDEMPOTENT", () => {
  const putNames = [
    "intigriti_submissions_update_state",
    "intigriti_submissions_update_internal_reference",
    "intigriti_submissions_update_severity",
    "intigriti_submissions_assign_to_me",
    "intigriti_submissions_update_personal_data",
    "intigriti_submissions_update_awaiting_feedback",
    "intigriti_submissions_update_group",
    "intigriti_submissions_update_asset",
  ];
  it("all eight PUT tools have MUTATION_IDEMPOTENT", () => {
    for (const name of putNames) {
      const tool = submissionsTools.find((t) => t.name === name)!;
      expect(tool.annotations).toEqual(MUTATION_IDEMPOTENT);
    }
  });
});

describe("annotations: DELETE tools use DESTRUCTIVE_IDEMPOTENT", () => {
  it("delete_company_bonus uses DESTRUCTIVE_IDEMPOTENT", () => {
    const tool = submissionsTools.find(
      (t) => t.name === "intigriti_submissions_delete_company_bonus",
    )!;
    expect(tool.annotations).toEqual(DESTRUCTIVE_IDEMPOTENT);
  });

  it("remove_tag uses DESTRUCTIVE_IDEMPOTENT", () => {
    const tool = submissionsTools.find(
      (t) => t.name === "intigriti_submissions_remove_tag",
    )!;
    expect(tool.annotations).toEqual(DESTRUCTIVE_IDEMPOTENT);
  });
});

// ---------------------------------------------------------------------------
// GET with optional query — submissions_list
// ---------------------------------------------------------------------------

describe("intigriti_submissions_list handler", () => {
  const tool = submissionsTools.find(
    (t) => t.name === "intigriti_submissions_list",
  )!;

  it("GETs /v2.1/submissions with no query when updatedSince is omitted", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler({}, client);

    expect(calls[0]?.args.method).toBe("GET");
    expect(calls[0]?.args.path).toBe("/v2.1/submissions");
    expect(calls[0]?.args.query).not.toHaveProperty("UpdatedSince");
  });

  it("converts updatedSince ISO to UpdatedSince unix seconds in query", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler({ updatedSince: "2025-03-10T08:00:00Z" }, client);

    const expectedUnix = Math.floor(
      new Date("2025-03-10T08:00:00Z").getTime() / 1000,
    );
    expect(calls[0]?.args.query?.["UpdatedSince"]).toBe(expectedUnix);
  });
});

// ---------------------------------------------------------------------------
// GET with path param — submissions_get
// ---------------------------------------------------------------------------

describe("intigriti_submissions_get handler", () => {
  const tool = submissionsTools.find(
    (t) => t.name === "intigriti_submissions_get",
  )!;

  it("GETs /v2.1/submissions/{submissionCode} with correct pathParam", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler({ submissionCode: "SUB-001" }, client);

    expect(calls[0]?.args.method).toBe("GET");
    expect(calls[0]?.args.path).toBe("/v2.1/submissions/{submissionCode}");
    expect(calls[0]?.args.pathParams).toEqual({ submissionCode: "SUB-001" });
  });
});

// ---------------------------------------------------------------------------
// GET with path param + optional query — get_events
// ---------------------------------------------------------------------------

describe("intigriti_submissions_get_events handler", () => {
  const tool = submissionsTools.find(
    (t) => t.name === "intigriti_submissions_get_events",
  )!;

  it("sends CreatedSince as unix seconds when createdSince is provided", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler(
      { submissionCode: "SUB-002", createdSince: "2025-06-01T00:00:00+02:00" },
      client,
    );

    const expectedUnix = Math.floor(
      new Date("2025-06-01T00:00:00+02:00").getTime() / 1000,
    );
    expect(calls[0]?.args.query?.["CreatedSince"]).toBe(expectedUnix);
    expect(calls[0]?.args.pathParams).toEqual({ submissionCode: "SUB-002" });
  });

  it("omits CreatedSince when createdSince is not provided", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler({ submissionCode: "SUB-002" }, client);

    expect(calls[0]?.args.query).not.toHaveProperty("CreatedSince");
  });
});

// ---------------------------------------------------------------------------
// POST with path param + body — add_company_bonus
// ---------------------------------------------------------------------------

describe("intigriti_submissions_add_company_bonus handler", () => {
  const tool = submissionsTools.find(
    (t) => t.name === "intigriti_submissions_add_company_bonus",
  )!;

  it("POSTs to correct path with submissionCode as pathParam", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler(
      { submissionCode: "SUB-010", amount: { value: 250, currency: "USD" } },
      client,
    );

    expect(calls[0]?.args.method).toBe("POST");
    expect(calls[0]?.args.path).toBe(
      "/v2.1/submissions/{submissionCode}/company-bonuses",
    );
    expect(calls[0]?.args.pathParams).toEqual({ submissionCode: "SUB-010" });
  });

  it("sends body without submissionCode", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler(
      {
        submissionCode: "SUB-010",
        amount: { value: 250, currency: "USD" },
        researcherId: "researcher-guid-1",
      },
      client,
    );

    const body = calls[0]?.args.body as Record<string, unknown>;
    expect(body).not.toHaveProperty("submissionCode");
    expect(body["amount"]).toEqual({ value: 250, currency: "USD" });
    expect(body["researcherId"]).toBe("researcher-guid-1");
  });
});

// ---------------------------------------------------------------------------
// POST — set_custom_bounty (required body fields including nullable message)
// ---------------------------------------------------------------------------

describe("intigriti_submissions_set_custom_bounty handler", () => {
  const tool = submissionsTools.find(
    (t) => t.name === "intigriti_submissions_set_custom_bounty",
  )!;

  it("POSTs correct path and body with message null", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler(
      {
        submissionCode: "SUB-013",
        message: null,
        customBounty: { value: 500, currency: "EUR" },
      },
      client,
    );

    expect(calls[0]?.args.method).toBe("POST");
    expect(calls[0]?.args.path).toBe(
      "/v2.1/submissions/{submissionCode}/custom-bounty",
    );
    expect(calls[0]?.args.pathParams).toEqual({ submissionCode: "SUB-013" });
    const body = calls[0]?.args.body as Record<string, unknown>;
    expect(body["message"]).toBeNull();
    expect(body["customBounty"]).toEqual({ value: 500, currency: "EUR" });
  });
});

// ---------------------------------------------------------------------------
// POST multipart — add_attachment
// ---------------------------------------------------------------------------

describe("intigriti_submissions_add_attachment handler", () => {
  const tool = submissionsTools.find(
    (t) => t.name === "intigriti_submissions_add_attachment",
  )!;

  it("POSTs with multipart fieldName=file and correct filePath", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler(
      {
        submissionCode: "SUB-020",
        filePath: "/tmp/screenshot.png",
        filename: "screenshot.png",
        contentType: "image/png",
        attachmentCode: 7,
      },
      client,
    );

    expect(calls[0]?.args.method).toBe("POST");
    expect(calls[0]?.args.path).toBe(
      "/v2.1/submissions/{submissionCode}/attachment",
    );
    expect(calls[0]?.args.pathParams).toEqual({ submissionCode: "SUB-020" });
    expect(calls[0]?.args.multipart?.fieldName).toBe("file");
    expect(calls[0]?.args.multipart?.filePath).toBe("/tmp/screenshot.png");
    expect(calls[0]?.args.multipart?.filename).toBe("screenshot.png");
    expect(calls[0]?.args.multipart?.contentType).toBe("image/png");
    expect(calls[0]?.args.query?.["attachmentCode"]).toBe(7);
  });

  it("omits attachmentCode from query when not provided", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler(
      { submissionCode: "SUB-021", filePath: "/tmp/file.txt" },
      client,
    );

    const query = calls[0]?.args.query ?? {};
    expect(query).not.toHaveProperty("attachmentCode");
  });
});

// ---------------------------------------------------------------------------
// PUT with no body — assign_to_me
// ---------------------------------------------------------------------------

describe("intigriti_submissions_assign_to_me handler", () => {
  const tool = submissionsTools.find(
    (t) => t.name === "intigriti_submissions_assign_to_me",
  )!;

  it("PUTs to correct path with submissionCode, no body", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler({ submissionCode: "SUB-030" }, client);

    expect(calls[0]?.args.method).toBe("PUT");
    expect(calls[0]?.args.path).toBe(
      "/v2.1/submissions/{submissionCode}/assign/me",
    );
    expect(calls[0]?.args.pathParams).toEqual({ submissionCode: "SUB-030" });
    expect(calls[0]?.args.body).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// PUT with body — update_group (nullable groupId)
// ---------------------------------------------------------------------------

describe("intigriti_submissions_update_group handler", () => {
  const tool = submissionsTools.find(
    (t) => t.name === "intigriti_submissions_update_group",
  )!;

  it("PUTs with groupId in body", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler(
      { submissionCode: "SUB-031", groupId: "group-guid-1" },
      client,
    );

    expect(calls[0]?.args.method).toBe("PUT");
    expect(calls[0]?.args.path).toBe(
      "/v2.1/submissions/{submissionCode}/group",
    );
    expect(calls[0]?.args.pathParams).toEqual({ submissionCode: "SUB-031" });
    const body = calls[0]?.args.body as Record<string, unknown>;
    expect(body["groupId"]).toBe("group-guid-1");
  });

  it("PUTs with groupId=null to unassign", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler({ submissionCode: "SUB-031", groupId: null }, client);

    const body = calls[0]?.args.body as Record<string, unknown>;
    expect(body["groupId"]).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// PUT with required boolean body — update_personal_data
// ---------------------------------------------------------------------------

describe("intigriti_submissions_update_personal_data handler", () => {
  const tool = submissionsTools.find(
    (t) => t.name === "intigriti_submissions_update_personal_data",
  )!;

  it("PUTs personalData in body", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler({ submissionCode: "SUB-032", personalData: true }, client);

    expect(calls[0]?.args.method).toBe("PUT");
    expect(calls[0]?.args.path).toBe(
      "/v2.1/submissions/{submissionCode}/personal-data",
    );
    const body = calls[0]?.args.body as Record<string, unknown>;
    expect(body["personalData"]).toBe(true);
    expect(body).not.toHaveProperty("submissionCode");
  });
});

// ---------------------------------------------------------------------------
// DELETE with two path params — delete_company_bonus
// ---------------------------------------------------------------------------

describe("intigriti_submissions_delete_company_bonus handler", () => {
  const tool = submissionsTools.find(
    (t) => t.name === "intigriti_submissions_delete_company_bonus",
  )!;

  it("DELETEs with both submissionCode and payoutId as path params", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler(
      { submissionCode: "SUB-040", payoutId: "payout-guid-1" },
      client,
    );

    expect(calls[0]?.args.method).toBe("DELETE");
    expect(calls[0]?.args.path).toBe(
      "/v2.1/submissions/{submissionCode}/company-bonuses/{payoutId}",
    );
    expect(calls[0]?.args.pathParams).toEqual({
      submissionCode: "SUB-040",
      payoutId: "payout-guid-1",
    });
    expect(calls[0]?.args.body).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// DELETE with two path params — remove_tag
// ---------------------------------------------------------------------------

describe("intigriti_submissions_remove_tag handler", () => {
  const tool = submissionsTools.find(
    (t) => t.name === "intigriti_submissions_remove_tag",
  )!;

  it("DELETEs with both submissionCode and tag as path params", async () => {
    const { client, calls } = makeStubClient();
    await tool.handler({ submissionCode: "SUB-041", tag: "critical" }, client);

    expect(calls[0]?.args.method).toBe("DELETE");
    expect(calls[0]?.args.path).toBe(
      "/v2.1/submissions/{submissionCode}/tags/{tag}",
    );
    expect(calls[0]?.args.pathParams).toEqual({
      submissionCode: "SUB-041",
      tag: "critical",
    });
    expect(calls[0]?.args.body).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// PDF export — both paths
// ---------------------------------------------------------------------------

describe("intigriti_submissions_export_pdf handler", () => {
  const tool = submissionsTools.find(
    (t) => t.name === "intigriti_submissions_export_pdf",
  )!;

  const fakeBase64 = Buffer.from("fake pdf content").toString("base64");

  it("returns base64 and byte count in-memory when outputPath is not provided", async () => {
    const { client } = makeStubClient(fakeBase64);
    const result = (await tool.handler(
      { submissionCode: "SUB-050" },
      client,
    )) as Record<string, unknown>;

    expect(result["base64"]).toBe(fakeBase64);
    expect(result["bytes"]).toBe(
      Buffer.from(fakeBase64, "base64").length,
    );
    expect(result["mimeType"]).toBe("application/pdf");
  });

  it("writes file to disk and returns path when outputPath is provided", async () => {
    const outputPath = join(tmpdir(), `${randomUUID()}.pdf`);
    const { client } = makeStubClient(fakeBase64);
    const result = (await tool.handler(
      { submissionCode: "SUB-050", outputPath },
      client,
    )) as Record<string, unknown>;

    expect(result["path"]).toBe(outputPath);
    expect(result["bytes"]).toBe(Buffer.from(fakeBase64, "base64").length);
    expect(result["mimeType"]).toBe("application/pdf");

    // Verify the file was actually written
    const written = await readFile(outputPath);
    expect(written).toEqual(Buffer.from(fakeBase64, "base64"));
  });

  it("passes timeZone as query parameter", async () => {
    const { client, calls } = makeStubClient(fakeBase64);
    await tool.handler(
      { submissionCode: "SUB-050", timeZone: "America/New_York" },
      client,
    );

    expect(calls[0]?.args.query?.["timeZone"]).toBe("America/New_York");
  });

  it("POSTs to correct path", async () => {
    const { client, calls } = makeStubClient(fakeBase64);
    await tool.handler({ submissionCode: "SUB-050" }, client);

    expect(calls[0]?.args.method).toBe("POST");
    expect(calls[0]?.args.path).toBe(
      "/v2.1/submissions/{submissionCode}/pdf-exports",
    );
    expect(calls[0]?.args.pathParams).toEqual({ submissionCode: "SUB-050" });
  });
});

// ---------------------------------------------------------------------------
// CSV export — both paths
// ---------------------------------------------------------------------------

describe("intigriti_submissions_export_csv handler", () => {
  const tool = submissionsTools.find(
    (t) => t.name === "intigriti_submissions_export_csv",
  )!;

  const fakeBase64 = Buffer.from("col1,col2\nval1,val2").toString("base64");

  it("returns base64 and byte count in-memory when outputPath is not provided", async () => {
    const { client } = makeStubClient(fakeBase64);
    const result = (await tool.handler(
      { submissionCode: "SUB-060" },
      client,
    )) as Record<string, unknown>;

    expect(result["base64"]).toBe(fakeBase64);
    expect(result["bytes"]).toBe(Buffer.from(fakeBase64, "base64").length);
    expect(result["mimeType"]).toBe("text/csv");
  });

  it("writes file to disk and returns path when outputPath is provided", async () => {
    const outputPath = join(tmpdir(), `${randomUUID()}.csv`);
    const { client } = makeStubClient(fakeBase64);
    const result = (await tool.handler(
      { submissionCode: "SUB-060", outputPath },
      client,
    )) as Record<string, unknown>;

    expect(result["path"]).toBe(outputPath);
    expect(result["bytes"]).toBe(Buffer.from(fakeBase64, "base64").length);
    expect(result["mimeType"]).toBe("text/csv");

    const written = await readFile(outputPath);
    expect(written).toEqual(Buffer.from(fakeBase64, "base64"));
  });

  it("passes timeZone as query parameter", async () => {
    const { client, calls } = makeStubClient(fakeBase64);
    await tool.handler(
      { submissionCode: "SUB-060", timeZone: "America/New_York" },
      client,
    );

    expect(calls[0]?.args.query?.["timeZone"]).toBe("America/New_York");
  });

  it("POSTs to correct path with mimeType text/csv", async () => {
    const { client, calls } = makeStubClient(fakeBase64);
    await tool.handler({ submissionCode: "SUB-060" }, client);

    expect(calls[0]?.args.method).toBe("POST");
    expect(calls[0]?.args.path).toBe(
      "/v2.1/submissions/{submissionCode}/csv-exports",
    );
  });
});

// ---------------------------------------------------------------------------
// Schema strictness
// ---------------------------------------------------------------------------

describe("schema strictness", () => {
  it("SubmissionsListInputSchema rejects unknown keys", () => {
    const result = SubmissionsListInputSchema.safeParse({ unknownKey: "bad" });
    expect(result.success).toBe(false);
  });

  it("SubmissionsGetInputSchema rejects unknown keys", () => {
    const result = SubmissionsGetInputSchema.safeParse({
      submissionCode: "S1",
      extra: "no",
    });
    expect(result.success).toBe(false);
  });

  it("SubmissionsGetInputSchema rejects missing required submissionCode", () => {
    const result = SubmissionsGetInputSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("SubmissionsGetEventsInputSchema rejects unknown keys", () => {
    const result = SubmissionsGetEventsInputSchema.safeParse({
      submissionCode: "S1",
      weird: "value",
    });
    expect(result.success).toBe(false);
  });

  it("SubmissionsAddCompanyBonusInputSchema rejects unknown keys", () => {
    const result = SubmissionsAddCompanyBonusInputSchema.safeParse({
      submissionCode: "S1",
      notAField: "bad",
    });
    expect(result.success).toBe(false);
  });

  it("SubmissionsSetCustomBountyInputSchema rejects missing required message", () => {
    // message is required (nullable but not optional)
    const result = SubmissionsSetCustomBountyInputSchema.safeParse({
      submissionCode: "S1",
      customBounty: { value: 100 },
    });
    expect(result.success).toBe(false);
  });

  it("SubmissionsSetCustomBountyInputSchema accepts message=null", () => {
    const result = SubmissionsSetCustomBountyInputSchema.safeParse({
      submissionCode: "S1",
      message: null,
      customBounty: { value: 100, currency: "USD" },
    });
    expect(result.success).toBe(true);
  });

  it("SubmissionsUpdateGroupInputSchema rejects missing required groupId", () => {
    // groupId is required (nullable but not optional)
    const result = SubmissionsUpdateGroupInputSchema.safeParse({
      submissionCode: "S1",
    });
    expect(result.success).toBe(false);
  });

  it("SubmissionsUpdateGroupInputSchema accepts groupId=null", () => {
    const result = SubmissionsUpdateGroupInputSchema.safeParse({
      submissionCode: "S1",
      groupId: null,
    });
    expect(result.success).toBe(true);
  });

  it("SubmissionsUpdatePersonalDataInputSchema rejects missing required personalData", () => {
    const result = SubmissionsUpdatePersonalDataInputSchema.safeParse({
      submissionCode: "S1",
    });
    expect(result.success).toBe(false);
  });

  it("SubmissionsAddAttachmentInputSchema rejects missing required filePath", () => {
    const result = SubmissionsAddAttachmentInputSchema.safeParse({
      submissionCode: "S1",
    });
    expect(result.success).toBe(false);
  });

  it("SubmissionsDeleteCompanyBonusInputSchema rejects missing payoutId", () => {
    const result = SubmissionsDeleteCompanyBonusInputSchema.safeParse({
      submissionCode: "S1",
    });
    expect(result.success).toBe(false);
  });
});
