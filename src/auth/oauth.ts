import { randomBytes, createHash } from "node:crypto";
import type { Credentials } from "./credentials.js";

export const AUTHORIZE_URL = "https://login.intigriti.com/connect/authorize";
export const TOKEN_URL = "https://login.intigriti.com/connect/token";
export const DEFAULT_SCOPES =
  "company_external_api offline_access core_platform:read core_platform:write reward_system:read reward_system:write";

export function generatePkcePair(): { verifier: string; challenge: string } {
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}

export function buildAuthorizeUrl(opts: {
  clientId: string;
  redirectUri: string;
  scope?: string;
  state: string;
  codeChallenge: string;
}): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: opts.clientId,
    redirect_uri: opts.redirectUri,
    scope: opts.scope ?? DEFAULT_SCOPES,
    state: opts.state,
    code_challenge: opts.codeChallenge,
    code_challenge_method: "S256",
  });
  return `${AUTHORIZE_URL}?${params.toString()}`;
}

export async function exchangeCode(opts: {
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  code: string;
  codeVerifier: string;
  fetchImpl?: typeof fetch;
}): Promise<Credentials> {
  const fetchFn = opts.fetchImpl ?? fetch;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: opts.code,
    redirect_uri: opts.redirectUri,
    client_id: opts.clientId,
    code_verifier: opts.codeVerifier,
  });
  if (opts.clientSecret) body.set("client_secret", opts.clientSecret);

  const resp = await fetchFn(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!resp.ok) {
    const text = await resp.text();
    const err = new Error(`Token exchange failed: HTTP ${resp.status}`);
    Object.assign(err, { body: text });
    throw err;
  }

  const data = (await resp.json()) as Record<string, unknown>;
  return buildCredentials(data, opts.clientId);
}

export async function refreshAccessToken(opts: {
  clientId: string;
  clientSecret?: string;
  refreshToken: string;
  fetchImpl?: typeof fetch;
}): Promise<Credentials> {
  const fetchFn = opts.fetchImpl ?? fetch;

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: opts.refreshToken,
    client_id: opts.clientId,
  });
  if (opts.clientSecret) body.set("client_secret", opts.clientSecret);

  const resp = await fetchFn(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!resp.ok) {
    const text = await resp.text();
    const err = new Error(`Token refresh failed: HTTP ${resp.status}`);
    Object.assign(err, { body: text });
    throw err;
  }

  const data = (await resp.json()) as Record<string, unknown>;
  const built = buildCredentials(data, opts.clientId);
  if (built.refresh_token === undefined) {
    built.refresh_token = opts.refreshToken;
  }
  return built;
}

function buildCredentials(data: Record<string, unknown>, clientId: string): Credentials {
  if (typeof data["access_token"] !== "string") {
    throw new Error("Token response missing access_token");
  }
  const creds: Credentials = {
    access_token: data["access_token"],
    client_id: clientId,
  };
  if (typeof data["refresh_token"] === "string") {
    creds.refresh_token = data["refresh_token"];
  }
  if (typeof data["expires_in"] === "number") {
    creds.expires_at = Date.now() + data["expires_in"] * 1000;
  }
  if (typeof data["scope"] === "string") {
    creds.scope = data["scope"];
  }
  return creds;
}
