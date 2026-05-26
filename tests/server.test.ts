import { describe, it, expect, vi } from "vitest";
import { ALL_TOOLS, wrapHandler, buildServer } from "../src/index.js";
import { IntigritiApiError } from "../src/errors.js";
import type { IntigritiClient } from "../src/client.js";

// ---------------------------------------------------------------------------
// Minimal stub client
// ---------------------------------------------------------------------------

function makeClient(impl?: Partial<IntigritiClient>): IntigritiClient {
  return {
    request: vi.fn().mockResolvedValue(undefined),
    requestRaw: vi.fn().mockResolvedValue({ status: 200, body: null }),
    ...impl,
  };
}

// ---------------------------------------------------------------------------
// 1. Tool count
// ---------------------------------------------------------------------------

describe("ALL_TOOLS", () => {
  it("registers exactly 50 tools", () => {
    expect(ALL_TOOLS).toHaveLength(50);
  });

  it("has no duplicate names", () => {
    const names = ALL_TOOLS.map((t) => t.name);
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });
});

// ---------------------------------------------------------------------------
// 2. Successful call shape
// ---------------------------------------------------------------------------

describe("wrapHandler — success", () => {
  it("returns structuredContent.data and content[0].text as JSON", async () => {
    const stubData = { id: "abc", value: 42 };
    const client = makeClient({
      request: vi.fn().mockResolvedValue(stubData),
    });

    const toolDef = ALL_TOOLS.find((t) => t.name === "intigriti_programs_list")!;
    const cb = wrapHandler(toolDef, client);
    const result = await cb({});

    expect(result).toMatchObject({
      structuredContent: { data: stubData },
      content: [{ type: "text" }],
    });
    expect(JSON.parse((result as any).content[0].text)).toEqual(stubData);
  });
});

// ---------------------------------------------------------------------------
// 3. Error path — IntigritiApiError
// ---------------------------------------------------------------------------

describe("wrapHandler — IntigritiApiError", () => {
  it("returns isError:true, includes status + method + url, omits plain-string body secrets", async () => {
    const leakSentinel = "this-is-the-leakable-body-string";
    const client = makeClient({
      request: vi.fn().mockRejectedValue(
        new IntigritiApiError({
          status: 404,
          body: leakSentinel,
          url: "https://api.example.com/v2.1/submissions/X1",
          method: "GET",
        })
      ),
    });

    const toolDef = ALL_TOOLS.find((t) => t.name === "intigriti_submissions_get")!;
    const cb = wrapHandler(toolDef, client);
    const result = await cb({ submissionCode: "X1" });

    expect(result).toMatchObject({ isError: true });
    const text: string = (result as any).content[0].text;
    expect(text).toContain("404");
    expect(text).toContain("GET");
    expect(text).toContain("api.example.com");
    expect(text).not.toContain(leakSentinel);
  });

  it("omits structured-object body secrets", async () => {
    const client = makeClient({
      request: vi.fn().mockRejectedValue(
        new IntigritiApiError({
          status: 403,
          body: { secret: "redacted-token" },
          url: "https://api.example.com/v2.1/submissions/X2",
          method: "GET",
        })
      ),
    });

    const toolDef = ALL_TOOLS.find((t) => t.name === "intigriti_submissions_get")!;
    const cb = wrapHandler(toolDef, client);
    const result = await cb({ submissionCode: "X2" });

    expect(result).toMatchObject({ isError: true });
    const text: string = (result as any).content[0].text;
    expect(text).not.toContain("redacted-token");
  });
});

// ---------------------------------------------------------------------------
// 4. Error path — generic error
// ---------------------------------------------------------------------------

describe("wrapHandler — generic Error", () => {
  it("returns isError:true with the error message", async () => {
    const client = makeClient({
      request: vi.fn().mockRejectedValue(new Error("boom")),
    });

    const toolDef = ALL_TOOLS.find((t) => t.name === "intigriti_programs_list")!;
    const cb = wrapHandler(toolDef, client);
    const result = await cb({});

    expect(result).toMatchObject({ isError: true });
    const text: string = (result as any).content[0].text;
    expect(text).toContain("boom");
  });
});

// ---------------------------------------------------------------------------
// 5. buildServer registers the right number of tools
// ---------------------------------------------------------------------------

describe("buildServer", () => {
  it("creates a server with 50 registered tools", () => {
    const client = makeClient();
    const server = buildServer(client);

    // The SDK stores tools in _registeredTools as a plain object (not a Map).
    const internalTools = (server as any)._registeredTools as Record<string, unknown>;
    expect(Object.keys(internalTools)).toHaveLength(50);
  });
});

// ---------------------------------------------------------------------------
// 6. Input validation — invalid input is rejected before reaching the handler
// The SDK validates against the inputSchema before calling our callback.
// We can verify by checking that our inputSchema rejects bad data directly,
// since the SDK delegates validation to the schema.
// ---------------------------------------------------------------------------

describe("input validation", () => {
  it("intigriti_submissions_get schema rejects missing submissionCode", () => {
    const toolDef = ALL_TOOLS.find((t) => t.name === "intigriti_submissions_get")!;
    // The schema is z.ZodObject — we can safeParse directly.
    const result = toolDef.inputSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("intigriti_submissions_get schema rejects extra fields (strict mode)", () => {
    const toolDef = ALL_TOOLS.find((t) => t.name === "intigriti_submissions_get")!;
    const result = toolDef.inputSchema.safeParse({
      submissionCode: "X1",
      unexpectedField: "oops",
    });
    expect(result.success).toBe(false);
  });

  it("intigriti_submissions_get schema accepts valid input", () => {
    const toolDef = ALL_TOOLS.find((t) => t.name === "intigriti_submissions_get")!;
    const result = toolDef.inputSchema.safeParse({ submissionCode: "X1" });
    expect(result.success).toBe(true);
  });
});
