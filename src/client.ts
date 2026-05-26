import { readFile } from "node:fs/promises";
import type { TokenSource } from "./auth/resolver.js";
import { IntigritiApiError } from "./errors.js";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface ClientOptions {
  baseUrl: string;
  tokenSource: TokenSource;
  fetchImpl?: typeof fetch;
  /** Milliseconds to wait before the single retry on 429/403. Default: 30_000. */
  retryDelayMs?: number;
  /** Pluggable sleep for tests. Default: real setTimeout. */
  sleep?: (ms: number) => Promise<void>;
}

export interface RequestArgs {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  pathParams?: Record<string, string | number>;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  multipart?: {
    fieldName: string;
    filePath: string;
    filename?: string;
    contentType?: string;
  };
}

export interface IntigritiClient {
  request<T = unknown>(args: RequestArgs): Promise<T>;
  requestRaw(args: RequestArgs): Promise<{ status: number; body: unknown }>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildUrl(
  baseUrl: string,
  path: string,
  pathParams: Record<string, string | number> | undefined,
  query: Record<string, string | number | boolean | undefined> | undefined
): string {
  // 1. Substitute {placeholders}
  let resolvedPath = path.replace(/\{([^}]+)\}/g, (_, key: string) => {
    const val = pathParams?.[key];
    if (val === undefined) {
      throw new Error(
        `URL placeholder {${key}} has no matching value in pathParams`
      );
    }
    return encodeURIComponent(String(val));
  });

  // 2. Check for any remaining placeholders
  const remaining = resolvedPath.match(/\{[^}]+\}/);
  if (remaining) {
    throw new Error(
      `URL placeholder ${remaining[0]} has no matching value in pathParams`
    );
  }

  // 3. Build query string
  const qs = new URLSearchParams();
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined) {
        qs.append(k, String(v));
      }
    }
  }

  const qsStr = qs.toString();
  const full = `${baseUrl}${resolvedPath}`;
  return qsStr ? `${full}?${qsStr}` : full;
}

function defaultSleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Response reading
// ---------------------------------------------------------------------------

async function readResponseBody(resp: Response): Promise<unknown> {
  const ct = resp.headers.get("content-type") ?? "";
  if (resp.status === 204) return null;

  const text = await resp.text();
  if (!text) return null;

  if (ct.includes("application/json")) {
    return JSON.parse(text) as unknown;
  }
  return text;
}

// ---------------------------------------------------------------------------
// Core fetch wrapper
// ---------------------------------------------------------------------------

async function buildInit(
  method: string,
  token: string,
  body: unknown,
  multipart: RequestArgs["multipart"]
): Promise<RequestInit> {
  if (body !== undefined && multipart !== undefined) {
    throw new Error(
      "body and multipart are mutually exclusive — set at most one"
    );
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    return { method, headers, body: JSON.stringify(body) };
  }

  if (multipart !== undefined) {
    const buf = await readFile(multipart.filePath);
    const blob = new Blob([buf], {
      type: multipart.contentType ?? "application/octet-stream",
    });
    const fd = new FormData();
    fd.append(multipart.fieldName, blob, multipart.filename ?? "upload");
    // Do NOT set Content-Type manually — fetch sets it with boundary automatically
    return { method, headers, body: fd };
  }

  return { method, headers };
}

// ---------------------------------------------------------------------------
// createClient
// ---------------------------------------------------------------------------

export function createClient(opts: ClientOptions): IntigritiClient {
  const fetchFn = opts.fetchImpl ?? fetch;
  const retryDelayMs = opts.retryDelayMs ?? 30_000;
  const sleepFn = opts.sleep ?? defaultSleep;

  async function executeRequest(
    args: RequestArgs,
    url: string,
    token: string
  ): Promise<Response> {
    const init = await buildInit(args.method, token, args.body, args.multipart);
    return fetchFn(url, init);
  }

  async function requestRaw(
    args: RequestArgs
  ): Promise<{ status: number; body: unknown }> {
    const url = buildUrl(opts.baseUrl, args.path, args.pathParams, args.query);
    const token = await opts.tokenSource.getAccessToken();
    const resp = await executeRequest(args, url, token);
    const body = await readResponseBody(resp);
    return { status: resp.status, body };
  }

  async function request<T = unknown>(args: RequestArgs): Promise<T> {
    const url = buildUrl(opts.baseUrl, args.path, args.pathParams, args.query);

    // Fetch with potential 429/403 retry
    async function attemptWithRetry(token: string): Promise<Response> {
      const init = await buildInit(args.method, token, args.body, args.multipart);
      let resp = await fetchFn(url, init);

      if (resp.status === 429 || resp.status === 403) {
        await sleepFn(retryDelayMs);
        const retryInit = await buildInit(args.method, token, args.body, args.multipart);
        resp = await fetchFn(url, retryInit);
      }

      return resp;
    }

    let token = await opts.tokenSource.getAccessToken();
    let resp = await attemptWithRetry(token);

    // Handle 401 with optional refresh
    if (resp.status === 401) {
      if (!opts.tokenSource.refresh) {
        const body = await readResponseBody(resp);
        throw new IntigritiApiError({ status: 401, body, url, method: args.method });
      }

      await opts.tokenSource.refresh();
      token = await opts.tokenSource.getAccessToken();
      resp = await attemptWithRetry(token);

      if (resp.status === 401) {
        const body = await readResponseBody(resp);
        throw new IntigritiApiError({ status: 401, body, url, method: args.method });
      }
    }

    if (!resp.ok) {
      const body = await readResponseBody(resp);
      throw new IntigritiApiError({ status: resp.status, body, url, method: args.method });
    }

    const body = await readResponseBody(resp);
    return body as T;
  }

  return { request, requestRaw };
}

// ---------------------------------------------------------------------------
// decodeBase64Field
// ---------------------------------------------------------------------------

export function decodeBase64Field(
  obj: unknown,
  field: string
): { bytes: Buffer; mimeType?: string } {
  const record = obj as Record<string, unknown>;
  const raw = record[field];

  if (typeof raw !== "string") {
    throw new Error(
      `decodeBase64Field: field "${field}" is not a string (got ${typeof raw})`
    );
  }

  const bytes = Buffer.from(raw, "base64");

  const mimeType =
    typeof record["mimeType"] === "string"
      ? record["mimeType"]
      : typeof record["contentType"] === "string"
        ? record["contentType"]
        : typeof record["type"] === "string"
          ? record["type"]
          : undefined;

  return { bytes, mimeType };
}
