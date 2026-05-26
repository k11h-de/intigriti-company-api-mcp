import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolveTokenSource } from "../src/auth/resolver.js";
import { writeCredentials } from "../src/auth/credentials.js";
import type { Credentials } from "../src/auth/credentials.js";
import type { Config } from "../src/config.js";

function makeConfig(overrides: Partial<Config> = {}): Config {
  return {
    baseUrl: "https://api.intigriti.com/external/company",
    envAccessToken: undefined,
    credentialsPath: "/nonexistent/path/credentials.json",
    loginPort: 8765,
    clientId: undefined,
    clientSecret: undefined,
    loginScopes: undefined,
    ...overrides,
  };
}

const BASE_CREDS: Credentials = {
  access_token: "file-access-token",
  refresh_token: "file-refresh-token",
  client_id: "the-client",
};

let tmpDir: string;

beforeEach(async () => {
  tmpDir = await mkdtemp(join(tmpdir(), "resolver-test-"));
});

afterEach(async () => {
  await rm(tmpDir, { recursive: true, force: true });
});

describe("env path", () => {
  it("returns kind=env when envAccessToken is set", async () => {
    const config = makeConfig({ envAccessToken: "env-token" });
    const source = await resolveTokenSource(config);
    expect(source.kind).toBe("env");
  });

  it("getAccessToken() returns the env token", async () => {
    const config = makeConfig({ envAccessToken: "env-token-123" });
    const source = await resolveTokenSource(config);
    expect(await source.getAccessToken()).toBe("env-token-123");
  });
});

describe("file path", () => {
  it("returns kind=file when only credentials file exists", async () => {
    const credsPath = join(tmpDir, "credentials.json");
    await writeCredentials(credsPath, BASE_CREDS);
    const config = makeConfig({ credentialsPath: credsPath });
    const source = await resolveTokenSource(config);
    expect(source.kind).toBe("file");
  });

  it("getAccessToken() returns the cached access_token", async () => {
    const credsPath = join(tmpDir, "credentials.json");
    await writeCredentials(credsPath, BASE_CREDS);
    const config = makeConfig({ credentialsPath: credsPath });
    const source = await resolveTokenSource(config);
    expect(await source.getAccessToken()).toBe("file-access-token");
  });
});

describe("missing both", () => {
  it("throws an error mentioning both setup options", async () => {
    const config = makeConfig({
      envAccessToken: undefined,
      credentialsPath: join(tmpDir, "nonexistent.json"),
    });
    await expect(resolveTokenSource(config)).rejects.toThrow(
      /INTIGRITI_ACCESS_TOKEN|intigriti-mcp-login/
    );
  });
});

describe("refresh()", () => {
  it("updates in-memory token and writes new credentials to disk", async () => {
    const credsPath = join(tmpDir, "credentials.json");
    await writeCredentials(credsPath, BASE_CREDS);

    const newTokenResponse = {
      access_token: "refreshed-access",
      refresh_token: "rotated-refresh",
      expires_in: 3600,
      scope: "company_external_api",
    };

    // fetchImpl stub that returns the new token response
    const fetchImpl = async (_url: string, _init?: RequestInit): Promise<Response> => ({
      ok: true,
      status: 200,
      json: async () => newTokenResponse,
      text: async () => JSON.stringify(newTokenResponse),
    } as Response);

    const config = makeConfig({
      credentialsPath: credsPath,
      clientId: "the-client",
    });

    const source = await resolveTokenSource(config, { fetchImpl });

    await source.refresh!();

    // In-memory token updated
    expect(await source.getAccessToken()).toBe("refreshed-access");

    // Credentials written to disk
    const { readCredentials } = await import("../src/auth/credentials.js");
    const persisted = await readCredentials(credsPath);
    expect(persisted?.access_token).toBe("refreshed-access");
    expect(persisted?.refresh_token).toBe("rotated-refresh");
  });

  it("refresh() throws when clientId is missing", async () => {
    const credsPath = join(tmpDir, "credentials.json");
    await writeCredentials(credsPath, BASE_CREDS);

    const config = makeConfig({
      credentialsPath: credsPath,
      clientId: undefined,
    });

    const source = await resolveTokenSource(config);
    await expect(source.refresh!()).rejects.toThrow(/client.?id/i);
  });
});
