import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, rm, stat, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readCredentials, writeCredentials } from "../src/auth/credentials.js";
import type { Credentials } from "../src/auth/credentials.js";

const BASE_CREDS: Credentials = {
  access_token: "tok-abc",
  refresh_token: "ref-xyz",
  expires_at: Date.now() + 3600_000,
  scope: "company_external_api",
  client_id: "my-client",
};

let tmpDir: string;

beforeEach(async () => {
  tmpDir = await mkdtemp(join(tmpdir(), "creds-test-"));
});

afterEach(async () => {
  await rm(tmpDir, { recursive: true, force: true });
});

describe("writeCredentials", () => {
  it("creates parent directory and file", async () => {
    const path = join(tmpDir, "nested", "dir", "credentials.json");
    await writeCredentials(path, BASE_CREDS);
    const s = await stat(path);
    expect(s.isFile()).toBe(true);
  });

  it("sets file permissions to 0o600", async () => {
    const path = join(tmpDir, "credentials.json");
    await writeCredentials(path, BASE_CREDS);
    const s = await stat(path);
    // Mask off file type bits, keep permission bits
    expect(s.mode & 0o777).toBe(0o600);
  });

  it("writes valid JSON", async () => {
    const path = join(tmpDir, "credentials.json");
    await writeCredentials(path, BASE_CREDS);
    const raw = await readFile(path, "utf8");
    expect(() => JSON.parse(raw)).not.toThrow();
  });
});

describe("readCredentials", () => {
  it("returns the same object after a roundtrip", async () => {
    const path = join(tmpDir, "credentials.json");
    await writeCredentials(path, BASE_CREDS);
    const result = await readCredentials(path);
    expect(result).toEqual(BASE_CREDS);
  });

  it("returns undefined for a missing file", async () => {
    const result = await readCredentials(join(tmpDir, "does-not-exist.json"));
    expect(result).toBeUndefined();
  });

  it("throws on malformed JSON", async () => {
    const path = join(tmpDir, "bad.json");
    const { writeFile } = await import("node:fs/promises");
    await writeFile(path, "{ not valid json", "utf8");
    await expect(readCredentials(path)).rejects.toThrow();
  });

  it("throws when access_token is missing", async () => {
    const path = join(tmpDir, "credentials.json");
    const { writeFile } = await import("node:fs/promises");
    const bad = { client_id: "cid" }; // missing access_token
    await writeFile(path, JSON.stringify(bad), "utf8");
    await expect(readCredentials(path)).rejects.toThrow(/access_token/);
  });

  it("throws when client_id is missing", async () => {
    const path = join(tmpDir, "credentials.json");
    const { writeFile } = await import("node:fs/promises");
    const bad = { access_token: "tok" }; // missing client_id
    await writeFile(path, JSON.stringify(bad), "utf8");
    await expect(readCredentials(path)).rejects.toThrow(/client_id/);
  });
});

describe("atomic write", () => {
  it("final state equals second write, never garbled", async () => {
    const path = join(tmpDir, "credentials.json");
    const first: Credentials = { ...BASE_CREDS, access_token: "first-token" };
    const second: Credentials = { ...BASE_CREDS, access_token: "second-token" };

    await writeCredentials(path, first);
    await writeCredentials(path, second);

    const result = await readCredentials(path);
    expect(result?.access_token).toBe("second-token");
  });
});
