#!/usr/bin/env node
import { randomBytes } from "node:crypto";
import { loadConfig } from "../config.js";
import { generatePkcePair, buildAuthorizeUrl, exchangeCode } from "../auth/oauth.js";
import { writeCredentials } from "../auth/credentials.js";
import { awaitCallback } from "./callback-server.js";

async function main(): Promise<void> {
  try {
    const config = loadConfig();
    const { clientId, clientSecret, loginPort, credentialsPath, loginScopes } = config;

    if (!clientId) {
      process.stderr.write(
        "INTIGRITI_CLIENT_ID is required for the login flow. Set it in your environment and re-run.\n"
      );
      process.exitCode = 1;
      return;
    }

    const { verifier: codeVerifier, challenge: codeChallenge } = generatePkcePair();
    const state = randomBytes(16).toString("base64url");
    const redirectUri = `http://localhost:${loginPort}/callback`;

    const authorizeUrl = buildAuthorizeUrl({
      clientId,
      redirectUri,
      state,
      codeChallenge,
      scope: loginScopes,
    });

    let code: string;
    try {
      const result = await awaitCallback({
        port: loginPort,
        expectedState: state,
        onListening: () => {
          // Print the URL only after the server is confirmed listening so the
          // browser never gets a connection-refused if the user clicks quickly.
          process.stderr.write("Open this URL in your browser to sign in:\n");
          process.stderr.write(`${authorizeUrl}\n`);
        },
      });
      code = result.code;
    } catch (err) {
      process.stderr.write(
        `Login failed: ${err instanceof Error ? err.message : String(err)}\n`
      );
      process.exitCode = 1;
      return;
    }

    const creds = await exchangeCode({
      clientId,
      clientSecret,
      redirectUri,
      code,
      codeVerifier,
    });

    await writeCredentials(credentialsPath, creds);

    process.stderr.write(`Saved credentials to ${credentialsPath}\n`);
    if (creds.scope) {
      process.stderr.write(`Granted scopes: ${creds.scope}\n`);
    }
    if (creds.expires_at !== undefined) {
      process.stderr.write(`Expires at: ${new Date(creds.expires_at).toISOString()}\n`);
    }
  } catch (err) {
    process.stderr.write(
      `Error: ${err instanceof Error ? err.message : String(err)}\n`
    );
    process.exitCode = 1;
  }
}

await main();
