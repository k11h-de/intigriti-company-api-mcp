import * as http from "node:http";

export interface AwaitCallbackOptions {
  port: number;
  expectedState: string;
  callbackPath?: string;
  timeoutMs?: number;
  onListening?: (info: { port: number; address: string }) => void;
}

export interface CallbackResult {
  code: string;
}

/**
 * Starts a local HTTP server on loopback (127.0.0.1) and waits for the OAuth
 * callback. Resolves with `{ code }` on success, rejects on error or timeout.
 * The server is always closed before the promise settles.
 *
 * The optional `onListening` callback is invoked once the server is confirmed
 * to be accepting connections — use this to print/open the authorize URL so
 * it is never shown before the server is ready.
 */
export function awaitCallback(opts: AwaitCallbackOptions): Promise<CallbackResult> {
  const {
    port,
    expectedState,
    callbackPath = "/callback",
    timeoutMs = 5 * 60 * 1000,
    onListening,
  } = opts;

  return new Promise<CallbackResult>((resolve, reject) => {
    let settled = false;
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

    function cleanup(): void {
      if (settled) return;
      settled = true;
      if (timeoutHandle !== undefined) {
        clearTimeout(timeoutHandle);
        timeoutHandle = undefined;
      }
      server.close();
    }

    const server = http.createServer((req, res) => {
      const rawUrl = req.url ?? "/";
      const parsedUrl = new URL(rawUrl, `http://127.0.0.1:${port}`);

      if (parsedUrl.pathname !== callbackPath) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not found");
        return;
      }

      const errorParam = parsedUrl.searchParams.get("error");
      if (errorParam !== null) {
        const errorDescription =
          parsedUrl.searchParams.get("error_description") ?? errorParam;
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end(
          htmlPage(
            "Authentication Error",
            `<p>The authorization server returned an error: <strong>${escapeHtml(errorParam)}</strong></p>` +
              `<p>${escapeHtml(errorDescription)}</p>` +
              `<p>You may close this tab.</p>`
          )
        );
        cleanup();
        reject(new Error(`OAuth error: ${errorParam} — ${errorDescription}`));
        return;
      }

      const receivedState = parsedUrl.searchParams.get("state");
      if (receivedState !== expectedState) {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end(
          htmlPage(
            "State Mismatch",
            `<p>State parameter mismatch. This request may have been forged.</p>` +
              `<p>You may close this tab.</p>`
          )
        );
        cleanup();
        reject(
          new Error(
            `State mismatch: expected "${expectedState}", received "${receivedState ?? "(none)"}"`
          )
        );
        return;
      }

      const code = parsedUrl.searchParams.get("code");
      if (!code) {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end(
          htmlPage(
            "Missing Code",
            `<p>The authorization code was missing from the callback. Please try again.</p>` +
              `<p>You may close this tab.</p>`
          )
        );
        cleanup();
        reject(new Error("Missing authorization code in callback"));
        return;
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(
        htmlPage(
          "Sign-in Successful",
          `<p>You have successfully signed in. You may close this tab.</p>`
        )
      );
      cleanup();
      resolve({ code });
    });

    timeoutHandle = setTimeout(() => {
      if (settled) return;
      cleanup();
      reject(
        new Error(
          `Login timed out after ${Math.round(timeoutMs / 1000)} seconds. Please try again.`
        )
      );
    }, timeoutMs);

    server.on("error", (err) => {
      if (settled) return;
      cleanup();
      reject(err);
    });

    server.listen(port, "127.0.0.1", () => {
      const addr = server.address();
      if (addr !== null && typeof addr !== "string" && onListening) {
        onListening({ port: addr.port, address: addr.address });
      }
    });
  });
}

function htmlPage(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
<style>body{font-family:sans-serif;max-width:600px;margin:4rem auto;line-height:1.5}</style>
</head>
<body><h1>${escapeHtml(title)}</h1>${body}</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
