import type { Config } from "../config.js";
import { readCredentials, writeCredentials, type Credentials } from "./credentials.js";
import { refreshAccessToken } from "./oauth.js";

export interface TokenSource {
  kind: "env" | "file";
  getAccessToken(): Promise<string>;
  refresh?(): Promise<void>;
}

export async function resolveTokenSource(
  config: Config,
  deps?: { fetchImpl?: typeof fetch }
): Promise<TokenSource> {
  if (config.envAccessToken) {
    return {
      kind: "env",
      getAccessToken: async () => config.envAccessToken!,
    };
  }

  const creds = await readCredentials(config.credentialsPath);

  if (!creds) {
    throw new Error(
      `No credentials found. Set INTIGRITI_ACCESS_TOKEN or run intigriti-mcp-login to authenticate.`
    );
  }

  // Mutable in-memory cache
  let cached: Credentials = creds;

  return {
    kind: "file",
    getAccessToken: async () => cached.access_token,

    async refresh() {
      if (!config.clientId) {
        throw new Error(
          `Cannot refresh token: client_id is required. Set INTIGRITI_CLIENT_ID or re-authenticate via intigriti-mcp-login.`
        );
      }
      if (!cached.refresh_token) {
        throw new Error(`Cannot refresh token: no refresh_token in stored credentials.`);
      }

      const updated = await refreshAccessToken({
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        refreshToken: cached.refresh_token,
        fetchImpl: deps?.fetchImpl,
      });

      // Preserve client_id from original credentials
      const next: Credentials = { ...updated, client_id: config.clientId };

      cached = next;
      await writeCredentials(config.credentialsPath, next);
    },
  };
}
