import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createClient, decodeBase64Field } from "../src/client.js";
import { IntigritiApiError } from "../src/errors.js";
import type { TokenSource } from "../src/auth/resolver.js";
import type { ClientOptions } from "../src/client.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeTokenSource(token = "test-token", refreshFn?: () => Promise<void>): TokenSource {
  return {
    kind: "file",
    getAccessToken: async () => token,
    refresh: refreshFn,
  };
}

function envTokenSource(token = "env-token"): TokenSource {
  return {
    kind: "env",
    getAccessToken: async () => token,
    // No refresh
  };
}

type FetchCall = { url: string; init: RequestInit };

/** Builds a fetch stub that records calls and returns the given responses in order. */
function makeFetch(responses: Array<{ status: number; body?: unknown; contentType?: string; bodyBytes?: Buffer }>) {
  const calls: FetchCall[] = [];

  const fetchImpl = async (url: string | URL | Request, init?: RequestInit): Promise<Response> => {
    const urlStr = typeof url === "string" ? url : url instanceof URL ? url.toString() : url.url;
    calls.push({ url: urlStr, init: init ?? {} });

    const resp = responses[calls.length - 1] ?? responses[responses.length - 1];
    if (!resp) throw new Error("makeFetch: no more responses configured");

    const headers = new Headers();
    if (resp.bodyBytes !== undefined) {
      // Raw-bytes response (e.g. application/pdf).
      headers.set("content-type", resp.contentType ?? "application/octet-stream");
      const bytes = resp.bodyBytes;
      return {
        ok: resp.status >= 200 && resp.status < 300,
        status: resp.status,
        headers,
        json: async () => undefined,
        text: async () => bytes.toString("utf8"),
        arrayBuffer: async () =>
          bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
      } as unknown as Response;
    }

    const isJson = resp.contentType === undefined || resp.contentType.includes("application/json");
    const bodyText =
      resp.body === undefined || resp.body === null ? "" : JSON.stringify(resp.body);
    if (resp.body !== undefined && resp.body !== null) {
      headers.set("content-type", resp.contentType ?? "application/json");
    }

    return {
      ok: resp.status >= 200 && resp.status < 300,
      status: resp.status,
      headers,
      json: async () => (isJson ? resp.body : undefined),
      text: async () => bodyText,
      arrayBuffer: async () => Buffer.from(bodyText, "utf8").buffer,
    } as unknown as Response;
  };

  return { fetchImpl, calls };
}

function makeOpts(
  overrides: Partial<ClientOptions> & { fetchImpl?: typeof fetch; responses?: Array<{ status: number; body?: unknown; contentType?: string; bodyBytes?: Buffer }> } = {}
): ClientOptions & { fetchImpl: typeof fetch } {
  const { responses, ...rest } = overrides;
  const fetch = rest.fetchImpl ?? makeFetch(responses ?? [{ status: 200, body: { ok: true } }]).fetchImpl;
  return {
    baseUrl: "https://api.example.com",
    tokenSource: makeTokenSource(),
    retryDelayMs: 0, // instant for tests
    sleep: async () => {},
    fetchImpl: fetch as typeof globalThis.fetch,
    ...rest,
  } as ClientOptions & { fetchImpl: typeof fetch };
}

let tmpDir: string;

beforeEach(async () => {
  tmpDir = await mkdtemp(join(tmpdir(), "client-test-"));
});

afterEach(async () => {
  await rm(tmpDir, { recursive: true, force: true });
});

// ---------------------------------------------------------------------------
// URL construction
// ---------------------------------------------------------------------------

describe("URL construction", () => {
  it("substitutes path params into {placeholders}", async () => {
    const { fetchImpl, calls } = makeFetch([{ status: 200, body: {} }]);
    const client = createClient({ ...makeOpts({ fetchImpl: fetchImpl as typeof fetch }), baseUrl: "https://api.example.com" });

    await client.request({ method: "GET", path: "/v2.1/submissions/{code}", pathParams: { code: "ABC-123" } });

    expect(calls[0]?.url).toContain("/v2.1/submissions/ABC-123");
  });

  it("URL-encodes path param values", async () => {
    const { fetchImpl, calls } = makeFetch([{ status: 200, body: {} }]);
    const client = createClient(makeOpts({ fetchImpl: fetchImpl as typeof fetch }));

    await client.request({ method: "GET", path: "/v2.1/items/{id}", pathParams: { id: "hello world/slash" } });

    expect(calls[0]?.url).toContain("/v2.1/items/hello%20world%2Fslash");
  });

  it("throws when a {placeholder} remains after substitution", async () => {
    const { fetchImpl } = makeFetch([{ status: 200, body: {} }]);
    const client = createClient(makeOpts({ fetchImpl: fetchImpl as typeof fetch }));

    await expect(
      client.request({ method: "GET", path: "/v2.1/submissions/{code}", pathParams: {} })
    ).rejects.toThrow(/placeholder/i);
  });

  it("throws when no pathParams provided but placeholder exists", async () => {
    const { fetchImpl } = makeFetch([{ status: 200, body: {} }]);
    const client = createClient(makeOpts({ fetchImpl: fetchImpl as typeof fetch }));

    await expect(
      client.request({ method: "GET", path: "/v2.1/submissions/{code}" })
    ).rejects.toThrow(/placeholder/i);
  });

  it("builds query string from query params, skipping undefined", async () => {
    const { fetchImpl, calls } = makeFetch([{ status: 200, body: {} }]);
    const client = createClient(makeOpts({ fetchImpl: fetchImpl as typeof fetch }));

    await client.request({
      method: "GET",
      path: "/v2.1/items",
      query: { page: 1, active: true, skip: undefined, name: "foo bar" },
    });

    const url = calls[0]?.url ?? "";
    expect(url).toContain("page=1");
    expect(url).toContain("active=true");
    expect(url).not.toContain("skip");
    expect(url).toContain("name=foo+bar");
  });

  it("omits query string entirely when all values are undefined", async () => {
    const { fetchImpl, calls } = makeFetch([{ status: 200, body: {} }]);
    const client = createClient(makeOpts({ fetchImpl: fetchImpl as typeof fetch }));

    await client.request({ method: "GET", path: "/v2.1/items", query: { skip: undefined } });

    expect(calls[0]?.url).not.toContain("?");
  });
});

// ---------------------------------------------------------------------------
// Auth header
// ---------------------------------------------------------------------------

describe("Auth header", () => {
  it("sends Authorization: Bearer <token> from tokenSource.getAccessToken()", async () => {
    const { fetchImpl, calls } = makeFetch([{ status: 200, body: {} }]);
    const source = makeTokenSource("my-secret-token");
    const client = createClient(makeOpts({ fetchImpl: fetchImpl as typeof fetch, tokenSource: source }));

    await client.request({ method: "GET", path: "/v2.1/items" });

    const authHeader = (calls[0]?.init.headers as Record<string, string> | undefined)?.["Authorization"]
      ?? (calls[0]?.init.headers as Headers | undefined)?.get?.("Authorization");
    expect(authHeader).toBe("Bearer my-secret-token");
  });
});

// ---------------------------------------------------------------------------
// JSON body
// ---------------------------------------------------------------------------

describe("JSON body", () => {
  it("sets Content-Type: application/json and serializes body", async () => {
    const { fetchImpl, calls } = makeFetch([{ status: 200, body: {} }]);
    const client = createClient(makeOpts({ fetchImpl: fetchImpl as typeof fetch }));

    await client.request({ method: "POST", path: "/v2.1/items", body: { name: "test", count: 3 } });

    const headers = calls[0]?.init.headers as Record<string, string> | undefined;
    const ct = headers?.["Content-Type"] ?? headers?.["content-type"];
    expect(ct).toContain("application/json");
    expect(JSON.parse(calls[0]?.init.body as string)).toEqual({ name: "test", count: 3 });
  });

  it("throws when both body and multipart are set", async () => {
    const { fetchImpl } = makeFetch([{ status: 200, body: {} }]);
    const client = createClient(makeOpts({ fetchImpl: fetchImpl as typeof fetch }));
    const filePath = join(tmpDir, "file.bin");
    await writeFile(filePath, "data");

    await expect(
      client.request({
        method: "POST",
        path: "/v2.1/upload",
        body: { foo: "bar" },
        multipart: { fieldName: "file", filePath },
      })
    ).rejects.toThrow(/mutually exclusive/i);
  });
});

// ---------------------------------------------------------------------------
// Multipart upload
// ---------------------------------------------------------------------------

describe("Multipart upload", () => {
  it("sends a FormData body with the file content under fieldName", async () => {
    const capturedInits: RequestInit[] = [];
    const fetchImpl = async (_url: string | URL | Request, init?: RequestInit): Promise<Response> => {
      capturedInits.push(init ?? {});
      return {
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ uploaded: true }),
        text: async () => '{"uploaded":true}',
      } as unknown as Response;
    };

    const filePath = join(tmpDir, "upload.bin");
    await writeFile(filePath, "hello-file-content");

    const client = createClient(makeOpts({ fetchImpl: fetchImpl as typeof fetch }));
    const result = await client.request({
      method: "POST",
      path: "/v2.1/upload",
      multipart: { fieldName: "attachment", filePath, filename: "upload.bin" },
    });

    expect(result).toEqual({ uploaded: true });
    expect(capturedInits.length).toBe(1);
    const body = capturedInits[0]?.body;
    expect(body).toBeInstanceOf(FormData);

    const fd = body as FormData;
    const entry = fd.get("attachment");
    expect(entry).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Response handling
// ---------------------------------------------------------------------------

describe("Response handling", () => {
  it("returns parsed JSON for 2xx application/json responses", async () => {
    const { fetchImpl } = makeFetch([{ status: 200, body: { id: 42 } }]);
    const client = createClient(makeOpts({ fetchImpl: fetchImpl as typeof fetch }));

    const result = await client.request<{ id: number }>({ method: "GET", path: "/v2.1/items/1" });
    expect(result).toEqual({ id: 42 });
  });

  it("returns null for 204 No Content", async () => {
    const { fetchImpl } = makeFetch([{ status: 204 }]);
    const client = createClient(makeOpts({ fetchImpl: fetchImpl as typeof fetch }));

    const result = await client.request({ method: "DELETE", path: "/v2.1/items/1" });
    expect(result).toBeNull();
  });

  it("returns null for 2xx with no body", async () => {
    const noBodFetch = async (): Promise<Response> => ({
      ok: true,
      status: 200,
      headers: new Headers(),
      json: async () => { throw new Error("no json"); },
      text: async () => "",
    } as unknown as Response);

    const client = createClient(makeOpts({ fetchImpl: noBodFetch as typeof fetch }));
    const result = await client.request({ method: "GET", path: "/v2.1/items" });
    expect(result).toBeNull();
  });

  it("throws IntigritiApiError for non-2xx responses", async () => {
    const { fetchImpl } = makeFetch([{ status: 404, body: { message: "Not found" } }]);
    const client = createClient(makeOpts({ fetchImpl: fetchImpl as typeof fetch }));

    await expect(
      client.request({ method: "GET", path: "/v2.1/items/99" })
    ).rejects.toThrow(IntigritiApiError);
  });

  it("IntigritiApiError includes status, method, url, and body", async () => {
    const { fetchImpl } = makeFetch([{ status: 422, body: "Validation error" }]);
    const client = createClient(makeOpts({
      fetchImpl: fetchImpl as typeof fetch,
      baseUrl: "https://api.example.com",
    }));

    let caught: IntigritiApiError | undefined;
    try {
      await client.request({ method: "POST", path: "/v2.1/items" });
    } catch (e) {
      caught = e as IntigritiApiError;
    }

    expect(caught).toBeInstanceOf(IntigritiApiError);
    expect(caught?.status).toBe(422);
    expect(caught?.method).toBe("POST");
    expect(caught?.url).toContain("/v2.1/items");
    expect(caught?.body).toBe("Validation error");
  });
});

// ---------------------------------------------------------------------------
// Binary responseType
// ---------------------------------------------------------------------------

describe("Binary responseType", () => {
  // Bytes that aren't valid UTF-8 — would be replaced by U+FFFD if we
  // ever went through resp.text(). The test asserts they survive verbatim.
  const pdfBytes = Buffer.concat([
    Buffer.from("%PDF-1.4\n", "ascii"),
    Buffer.from([0xff, 0xfe, 0xfd, 0x00, 0x80, 0x81, 0x82]),
    Buffer.from("\n%%EOF\n", "ascii"),
  ]);

  it("returns the response as a Buffer when responseType is 'binary'", async () => {
    const { fetchImpl } = makeFetch([
      { status: 200, contentType: "application/pdf", bodyBytes: pdfBytes },
    ]);
    const client = createClient(makeOpts({ fetchImpl: fetchImpl as typeof fetch }));

    const result = await client.request<Buffer>({
      method: "POST",
      path: "/v2.1/exports/pdf",
      responseType: "binary",
    });

    expect(Buffer.isBuffer(result)).toBe(true);
    expect(result).toEqual(pdfBytes);
    // Magic bytes intact — not corrupted by UTF-8 round-trip.
    expect(result.subarray(0, 5).toString("latin1")).toBe("%PDF-");
  });

  it("preserves arbitrary binary bytes (no UTF-8 corruption)", async () => {
    const allBytes = Buffer.from(Array.from({ length: 256 }, (_, i) => i));
    const { fetchImpl } = makeFetch([
      { status: 200, contentType: "application/octet-stream", bodyBytes: allBytes },
    ]);
    const client = createClient(makeOpts({ fetchImpl: fetchImpl as typeof fetch }));

    const result = await client.request<Buffer>({
      method: "GET",
      path: "/v2.1/blob",
      responseType: "binary",
    });

    expect(result).toEqual(allBytes);
    expect(result.length).toBe(256);
  });

  it("falls back to text/JSON parsing on a non-2xx response so errors stay readable", async () => {
    const { fetchImpl } = makeFetch([
      { status: 403, body: { message: "Forbidden" } },
    ]);
    const client = createClient(makeOpts({ fetchImpl: fetchImpl as typeof fetch, retryDelayMs: 0 }));

    let caught: IntigritiApiError | undefined;
    try {
      await client.request({
        method: "POST",
        path: "/v2.1/exports/pdf",
        responseType: "binary",
      });
    } catch (e) {
      caught = e as IntigritiApiError;
    }

    expect(caught).toBeInstanceOf(IntigritiApiError);
    expect(caught?.status).toBe(403);
    expect(caught?.body).toEqual({ message: "Forbidden" });
  });
});

// ---------------------------------------------------------------------------
// Retry on 429
// ---------------------------------------------------------------------------

describe("Retry on 429", () => {
  it("waits retryDelayMs and retries once on 429, returning success", async () => {
    const { fetchImpl, calls } = makeFetch([
      { status: 429, body: "rate limited" },
      { status: 200, body: { ok: true } },
    ]);

    const sleepCalls: number[] = [];
    const client = createClient({
      baseUrl: "https://api.example.com",
      tokenSource: makeTokenSource(),
      fetchImpl: fetchImpl as typeof fetch,
      retryDelayMs: 500,
      sleep: async (ms: number) => { sleepCalls.push(ms); },
    });

    const result = await client.request({ method: "GET", path: "/v2.1/items" });

    expect(result).toEqual({ ok: true });
    expect(calls.length).toBe(2);
    expect(sleepCalls).toEqual([500]);
  });

  it("throws IntigritiApiError if second attempt is also 429", async () => {
    const { fetchImpl, calls } = makeFetch([
      { status: 429, body: "rate limited" },
      { status: 429, body: "still limited" },
    ]);

    const client = createClient({
      baseUrl: "https://api.example.com",
      tokenSource: makeTokenSource(),
      fetchImpl: fetchImpl as typeof fetch,
      retryDelayMs: 0,
      sleep: async () => {},
    });

    await expect(
      client.request({ method: "GET", path: "/v2.1/items" })
    ).rejects.toThrow(IntigritiApiError);

    expect(calls.length).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// Retry on 403
// ---------------------------------------------------------------------------

describe("Retry on 403", () => {
  it("waits retryDelayMs and retries once on 403, returning success", async () => {
    const { fetchImpl, calls } = makeFetch([
      { status: 403, body: "forbidden" },
      { status: 200, body: { ok: true } },
    ]);

    const client = createClient({
      baseUrl: "https://api.example.com",
      tokenSource: makeTokenSource(),
      fetchImpl: fetchImpl as typeof fetch,
      retryDelayMs: 0,
      sleep: async () => {},
    });

    const result = await client.request({ method: "GET", path: "/v2.1/items" });
    expect(result).toEqual({ ok: true });
    expect(calls.length).toBe(2);
  });

  it("throws IntigritiApiError if second attempt after 403 is also non-2xx", async () => {
    const { fetchImpl } = makeFetch([
      { status: 403, body: "forbidden" },
      { status: 403, body: "still forbidden" },
    ]);

    const client = createClient({
      baseUrl: "https://api.example.com",
      tokenSource: makeTokenSource(),
      fetchImpl: fetchImpl as typeof fetch,
      retryDelayMs: 0,
      sleep: async () => {},
    });

    await expect(
      client.request({ method: "GET", path: "/v2.1/items" })
    ).rejects.toThrow(IntigritiApiError);
  });
});

// ---------------------------------------------------------------------------
// Refresh on 401
// ---------------------------------------------------------------------------

describe("Refresh on 401", () => {
  it("calls tokenSource.refresh() then retries with new token on 401", async () => {
    let currentToken = "old-token";
    let refreshCalled = false;

    const tokenSource: TokenSource = {
      kind: "file",
      getAccessToken: async () => currentToken,
      refresh: async () => {
        refreshCalled = true;
        currentToken = "new-token";
      },
    };

    const capturedHeaders: Record<string, string>[] = [];
    const fetchImpl = async (_url: string | URL | Request, init?: RequestInit): Promise<Response> => {
      const headers = init?.headers as Record<string, string> | undefined;
      capturedHeaders.push(headers ?? {});

      const callNum = capturedHeaders.length;
      if (callNum === 1) {
        return {
          ok: false,
          status: 401,
          headers: new Headers(),
          json: async () => ({ error: "unauthorized" }),
          text: async () => '{"error":"unauthorized"}',
        } as unknown as Response;
      }
      return {
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ data: "secret" }),
        text: async () => '{"data":"secret"}',
      } as unknown as Response;
    };

    const client = createClient({
      baseUrl: "https://api.example.com",
      tokenSource,
      fetchImpl: fetchImpl as typeof fetch,
      sleep: async () => {},
    });

    const result = await client.request({ method: "GET", path: "/v2.1/items" });

    expect(result).toEqual({ data: "secret" });
    expect(refreshCalled).toBe(true);
    expect(capturedHeaders.length).toBe(2);
    expect(capturedHeaders[0]?.["Authorization"]).toBe("Bearer old-token");
    expect(capturedHeaders[1]?.["Authorization"]).toBe("Bearer new-token");
  });

  it("throws IntigritiApiError without retry when tokenSource has no refresh (env source)", async () => {
    const { fetchImpl, calls } = makeFetch([
      { status: 401, body: "unauthorized" },
    ]);

    const client = createClient({
      baseUrl: "https://api.example.com",
      tokenSource: envTokenSource("env-token"),
      fetchImpl: fetchImpl as typeof fetch,
      sleep: async () => {},
    });

    await expect(
      client.request({ method: "GET", path: "/v2.1/items" })
    ).rejects.toThrow(IntigritiApiError);

    expect(calls.length).toBe(1); // no retry
  });

  it("throws IntigritiApiError when refresh succeeds but retry is still 401", async () => {
    let token = "old";
    const tokenSource: TokenSource = {
      kind: "file",
      getAccessToken: async () => token,
      refresh: async () => { token = "refreshed"; },
    };

    const { fetchImpl, calls } = makeFetch([
      { status: 401, body: "unauthorized" },
      { status: 401, body: "still unauthorized" },
    ]);

    const client = createClient({
      baseUrl: "https://api.example.com",
      tokenSource,
      fetchImpl: fetchImpl as typeof fetch,
      sleep: async () => {},
    });

    await expect(
      client.request({ method: "GET", path: "/v2.1/items" })
    ).rejects.toThrow(IntigritiApiError);

    expect(calls.length).toBe(2); // tried twice, no infinite loop
  });
});

// ---------------------------------------------------------------------------
// requestRaw
// ---------------------------------------------------------------------------

describe("requestRaw", () => {
  it("returns { status, body } for any response", async () => {
    const { fetchImpl } = makeFetch([{ status: 200, body: { id: 1 } }]);
    const client = createClient(makeOpts({ fetchImpl: fetchImpl as typeof fetch }));

    const raw = await client.requestRaw({ method: "GET", path: "/v2.1/items" });
    expect(raw.status).toBe(200);
    expect(raw.body).toEqual({ id: 1 });
  });

  it("does not throw for non-2xx in requestRaw", async () => {
    const { fetchImpl } = makeFetch([{ status: 500, body: { error: "server error" } }]);
    const client = createClient(makeOpts({ fetchImpl: fetchImpl as typeof fetch }));

    const raw = await client.requestRaw({ method: "GET", path: "/v2.1/items" });
    expect(raw.status).toBe(500);
  });

  // -------------------------------------------------------------------------
  // requestRaw – 429 retry
  // -------------------------------------------------------------------------

  it("retries once on 429 and returns the final { status, body }", async () => {
    const { fetchImpl, calls } = makeFetch([
      { status: 429, body: "rate limited" },
      { status: 200, body: { ok: true } },
    ]);

    const sleepCalls: number[] = [];
    const client = createClient({
      baseUrl: "https://api.example.com",
      tokenSource: makeTokenSource(),
      fetchImpl: fetchImpl as typeof fetch,
      retryDelayMs: 500,
      sleep: async (ms: number) => { sleepCalls.push(ms); },
    });

    const raw = await client.requestRaw({ method: "GET", path: "/v2.1/items" });

    expect(raw.status).toBe(200);
    expect(raw.body).toEqual({ ok: true });
    expect(calls.length).toBe(2);
    expect(sleepCalls).toEqual([500]);
  });

  // -------------------------------------------------------------------------
  // requestRaw – 403 retry
  // -------------------------------------------------------------------------

  it("retries once on 403 and returns the final { status, body }", async () => {
    const { fetchImpl, calls } = makeFetch([
      { status: 403, body: "forbidden" },
      { status: 200, body: { allowed: true } },
    ]);

    const client = createClient({
      baseUrl: "https://api.example.com",
      tokenSource: makeTokenSource(),
      fetchImpl: fetchImpl as typeof fetch,
      retryDelayMs: 0,
      sleep: async () => {},
    });

    const raw = await client.requestRaw({ method: "GET", path: "/v2.1/items" });

    expect(raw.status).toBe(200);
    expect(raw.body).toEqual({ allowed: true });
    expect(calls.length).toBe(2);
  });

  // -------------------------------------------------------------------------
  // requestRaw – 401 with refresh, retry succeeds (200)
  // -------------------------------------------------------------------------

  it("calls refresh() on 401 and returns 200 result when retry succeeds", async () => {
    let currentToken = "old-token";
    let refreshCalled = false;

    const tokenSource: TokenSource = {
      kind: "file",
      getAccessToken: async () => currentToken,
      refresh: async () => {
        refreshCalled = true;
        currentToken = "new-token";
      },
    };

    const { fetchImpl, calls } = makeFetch([
      { status: 401, body: { error: "unauthorized" } },
      { status: 200, body: { data: "ok" } },
    ]);

    const client = createClient({
      baseUrl: "https://api.example.com",
      tokenSource,
      fetchImpl: fetchImpl as typeof fetch,
      retryDelayMs: 0,
      sleep: async () => {},
    });

    const raw = await client.requestRaw({ method: "GET", path: "/v2.1/items" });

    expect(raw.status).toBe(200);
    expect(raw.body).toEqual({ data: "ok" });
    expect(refreshCalled).toBe(true);
    expect(calls.length).toBe(2);
  });

  // -------------------------------------------------------------------------
  // requestRaw – 401 with refresh, retry still 401
  // -------------------------------------------------------------------------

  it("calls refresh() on 401 and returns { status: 401 } when retry is still 401", async () => {
    let currentToken = "old-token";
    let refreshCalled = false;

    const tokenSource: TokenSource = {
      kind: "file",
      getAccessToken: async () => currentToken,
      refresh: async () => {
        refreshCalled = true;
        currentToken = "new-token";
      },
    };

    const { fetchImpl, calls } = makeFetch([
      { status: 401, body: { error: "unauthorized" } },
      { status: 401, body: { error: "still unauthorized" } },
    ]);

    const client = createClient({
      baseUrl: "https://api.example.com",
      tokenSource,
      fetchImpl: fetchImpl as typeof fetch,
      retryDelayMs: 0,
      sleep: async () => {},
    });

    const raw = await client.requestRaw({ method: "GET", path: "/v2.1/items" });

    expect(raw.status).toBe(401);
    expect(refreshCalled).toBe(true);
    expect(calls.length).toBe(2);
  });

  // -------------------------------------------------------------------------
  // requestRaw – 401 without refresh (env source)
  // -------------------------------------------------------------------------

  it("returns { status: 401 } without calling refresh or extra fetches when no refresh exists", async () => {
    const { fetchImpl, calls } = makeFetch([
      { status: 401, body: { error: "unauthorized" } },
    ]);

    const client = createClient({
      baseUrl: "https://api.example.com",
      tokenSource: envTokenSource("env-token"),
      fetchImpl: fetchImpl as typeof fetch,
      retryDelayMs: 0,
      sleep: async () => {},
    });

    const raw = await client.requestRaw({ method: "GET", path: "/v2.1/items" });

    expect(raw.status).toBe(401);
    expect(calls.length).toBe(1); // no extra fetch
  });
});

// ---------------------------------------------------------------------------
// decodeBase64Field
// ---------------------------------------------------------------------------

describe("decodeBase64Field", () => {
  it("decodes a base64 field into a Buffer", () => {
    const original = "Hello, world!";
    const encoded = Buffer.from(original).toString("base64");
    const obj = { data: encoded };

    const { bytes } = decodeBase64Field(obj, "data");
    expect(bytes.toString("utf8")).toBe(original);
  });

  it("returns the mimeType sibling field if present as mimeType", () => {
    const encoded = Buffer.from("PNG_BYTES").toString("base64");
    const obj = { content: encoded, mimeType: "image/png" };

    const { bytes, mimeType } = decodeBase64Field(obj, "content");
    expect(bytes.toString("utf8")).toBe("PNG_BYTES");
    expect(mimeType).toBe("image/png");
  });

  it("returns the mimeType sibling field if present as contentType", () => {
    const encoded = Buffer.from("PDF").toString("base64");
    const obj = { file: encoded, contentType: "application/pdf" };

    const { mimeType } = decodeBase64Field(obj, "file");
    expect(mimeType).toBe("application/pdf");
  });

  it("returns the mimeType sibling field if present as type", () => {
    const encoded = Buffer.from("data").toString("base64");
    const obj = { bytes: encoded, type: "text/plain" };

    const { mimeType } = decodeBase64Field(obj, "bytes");
    expect(mimeType).toBe("text/plain");
  });

  it("returns mimeType undefined when no sibling mime field exists", () => {
    const encoded = Buffer.from("raw").toString("base64");
    const obj = { data: encoded };

    const { mimeType } = decodeBase64Field(obj, "data");
    expect(mimeType).toBeUndefined();
  });

  it("throws when the field is not a string", () => {
    const obj = { data: 42 };
    expect(() => decodeBase64Field(obj, "data")).toThrow(/not a string/i);
  });

  it("throws when the field is missing", () => {
    const obj = { other: "value" };
    expect(() => decodeBase64Field(obj, "data")).toThrow(/not a string|missing/i);
  });
});
