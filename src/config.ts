import { homedir } from "node:os";
import { join } from "node:path";

export interface Config {
  baseUrl: string;
  envAccessToken: string | undefined;
  credentialsPath: string;
  loginPort: number;
  clientId: string | undefined;
  clientSecret: string | undefined;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const rawBaseUrl = env["INTIGRITI_BASE_URL"] ?? "https://api.intigriti.com/external/company";
  const baseUrl = rawBaseUrl.replace(/\/+$/, "");

  const envAccessToken = env["INTIGRITI_ACCESS_TOKEN"] || undefined;

  const credentialsPath =
    env["INTIGRITI_CREDENTIALS_PATH"] ??
    join(homedir(), ".intigriti-mcp", "credentials.json");

  const rawPort = env["INTIGRITI_LOGIN_PORT"];
  let loginPort = 8765;
  if (rawPort !== undefined) {
    const parsed = parseInt(rawPort, 10);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535 || String(parsed) !== rawPort.trim()) {
      throw new Error(
        `INTIGRITI_LOGIN_PORT must be an integer between 1 and 65535, got: ${rawPort}`
      );
    }
    loginPort = parsed;
  }

  const clientId = env["INTIGRITI_CLIENT_ID"] || undefined;
  const clientSecret = env["INTIGRITI_CLIENT_SECRET"] || undefined;

  return { baseUrl, envAccessToken, credentialsPath, loginPort, clientId, clientSecret };
}
