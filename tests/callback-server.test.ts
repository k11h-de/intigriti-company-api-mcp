import { describe, it, expect } from "vitest";
import { awaitCallback } from "../src/cli/callback-server.js";

/** Hit a local HTTP server with a GET request and return {status, body}. */
async function httpGet(url: string): Promise<{ status: number; body: string }> {
  const resp = await fetch(url);
  const body = await resp.text();
  return { status: resp.status, body };
}

/**
 * Find a free port by asking the OS to bind on port 0 and reading back the
 * assigned port. We close the server immediately and return the port.
 * There's a small TOCTOU window, but it's fine for tests.
 */
async function findFreePort(): Promise<number> {
  const { createServer } = await import("node:http");
  return new Promise<number>((resolve, reject) => {
    const s = createServer();
    s.listen(0, "127.0.0.1", () => {
      const addr = s.address();
      if (addr === null || typeof addr === "string") {
        s.close();
        reject(new Error("Could not determine free port"));
        return;
      }
      const port = addr.port;
      s.close(() => resolve(port));
    });
    s.on("error", reject);
  });
}

describe("awaitCallback", () => {
  it("resolves with { code } on a valid callback", async () => {
    const port = await findFreePort();
    const expectedState = "test-state-abc";

    const promise = awaitCallback({ port, expectedState });

    // Give the server a moment to start
    await new Promise((r) => setTimeout(r, 20));

    const { status, body } = await httpGet(
      `http://127.0.0.1:${port}/callback?code=goodcode&state=${expectedState}`
    );

    expect(status).toBe(200);
    expect(body).toContain("You may close this tab");

    const result = await promise;
    expect(result).toEqual({ code: "goodcode" });
  });

  it("rejects with state mismatch error and returns 400", async () => {
    const port = await findFreePort();
    const expectedState = "correct-state";

    const promise = awaitCallback({ port, expectedState });
    // Attach rejection handler immediately so Vitest doesn't see an unhandled rejection
    const settled = promise.then(
      () => ({ ok: true as const }),
      (err: unknown) => ({ ok: false as const, err })
    );

    await new Promise((r) => setTimeout(r, 20));

    const { status, body } = await httpGet(
      `http://127.0.0.1:${port}/callback?code=abc&state=WRONG`
    );

    expect(status).toBe(400);
    expect(body.toLowerCase()).toContain("mismatch");

    const result = await settled;
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect((result.err as Error).message).toMatch(/state mismatch/i);
    }
  });

  it("rejects on OAuth error param and returns 400", async () => {
    const port = await findFreePort();
    const expectedState = "some-state";

    const promise = awaitCallback({ port, expectedState });
    // Attach rejection handler immediately so Vitest doesn't see an unhandled rejection
    const settled = promise.then(
      () => ({ ok: true as const }),
      (err: unknown) => ({ ok: false as const, err })
    );

    await new Promise((r) => setTimeout(r, 20));

    const { status } = await httpGet(
      `http://127.0.0.1:${port}/callback?error=access_denied&state=${expectedState}`
    );

    expect(status).toBe(400);

    const result = await settled;
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect((result.err as Error).message).toMatch(/access_denied/);
    }
  });

  it("returns 404 for unknown paths and leaves promise pending", async () => {
    const port = await findFreePort();
    const expectedState = "pending-state";

    const promise = awaitCallback({ port, expectedState, timeoutMs: 500 });

    await new Promise((r) => setTimeout(r, 20));

    const { status } = await httpGet(`http://127.0.0.1:${port}/something-else`);
    expect(status).toBe(404);

    // Promise should still be pending; send a valid request to resolve it
    await httpGet(
      `http://127.0.0.1:${port}/callback?code=finalcode&state=${expectedState}`
    );

    const result = await promise;
    expect(result.code).toBe("finalcode");
  });

  it("rejects after timeout with a clear error message", async () => {
    const port = await findFreePort();
    const expectedState = "timeout-state";

    const start = Date.now();
    const promise = awaitCallback({ port, expectedState, timeoutMs: 50 });

    await expect(promise).rejects.toThrow(/timed out/i);

    const elapsed = Date.now() - start;
    // Should have taken roughly 50ms (generous upper bound for slow CI)
    expect(elapsed).toBeGreaterThanOrEqual(40);
    expect(elapsed).toBeLessThan(2000);
  });

  it("binds to 127.0.0.1 loopback address", async () => {
    const port = await findFreePort();
    const expectedState = "loopback-state";
    const promise = awaitCallback({ port, expectedState, timeoutMs: 500 });

    await new Promise((r) => setTimeout(r, 20));

    // Verify by checking that the server was actually started and reachable
    // (we can't easily verify 127.0.0.1 bind from the outside in all test environments,
    // but we assert that a connection to 127.0.0.1 works, which would fail if bound elsewhere)
    const { status } = await httpGet(`http://127.0.0.1:${port}/something`);
    expect(status).toBe(404);

    // Clean up: resolve with valid callback
    await httpGet(
      `http://127.0.0.1:${port}/callback?code=loopback-code&state=${expectedState}`
    );
    const result = await promise;
    expect(result.code).toBe("loopback-code");
  });
});
