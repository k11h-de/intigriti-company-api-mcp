# intigriti-company-api-mcp

An MCP server that exposes the Intigriti Company API to AI assistants, enabling programmatic management of bug bounty programs, submissions, reward system, and related workflows. Targets the v2.1 BETA of the Intigriti Company API — small breaking changes may land without a major version bump.

## Requirements

- Node.js >= 20
- An Intigriti Company account with an API integration registered. To create one: navigate to **Settings → Integrations → Create new external integration** in the Intigriti platform.

## Authentication

### Path A: Environment variable token (simplest)

Set `INTIGRITI_ACCESS_TOKEN` to a bearer token and start the server. No login helper needed.

```bash
export INTIGRITI_ACCESS_TOKEN=your_token_here
```

Required token scopes depend on which tools you use:

| Scope | Required for |
|-------|-------------|
| `company_external_api` | all tools |
| `core_platform:read` | read operations (submissions, programs, assets, groups, user) |
| `core_platform:write` | write operations (create/update submissions, program updates) |
| `reward_system:read` | reward request and payout read tools |
| `reward_system:write` | reward request and payout write tools |

The login helper (Path B) additionally requests `offline_access` so it can obtain a refresh token.

### Path B: OAuth login helper (PKCE)

Run the login helper once. It opens an OAuth Authorization Code + PKCE flow, exchanges the code, and persists credentials to disk. The MCP server reads those credentials automatically on startup and auto-refreshes on 401 or near-expiry.

**Prerequisites:**

- `INTIGRITI_CLIENT_ID` must be set in your environment.
- `INTIGRITI_CLIENT_SECRET` must be set if your integration is a confidential client.
- The integration must register `http://localhost:8765/callback` as a redirect URL (port is configurable via `INTIGRITI_LOGIN_PORT`).

**Run the login helper:**

```bash
npx intigriti-mcp-login
```

The helper prints an authorization URL to stderr — paste it into a browser. After you approve, it exchanges the authorization code for tokens and saves `access_token` and `refresh_token` to `~/.intigriti-mcp/credentials.json` with `0o600` permissions. The PKCE `code_verifier` is never persisted.

## Token resolution order

At startup the server resolves credentials in this order:

1. `INTIGRITI_ACCESS_TOKEN` environment variable
2. `~/.intigriti-mcp/credentials.json` (or the path in `INTIGRITI_CREDENTIALS_PATH`)
3. If neither is available, the server exits with an error pointing at the login helper.

## Configuration

All configuration is via environment variables.

| Variable | Purpose | Default | Used by |
|----------|---------|---------|---------|
| `INTIGRITI_ACCESS_TOKEN` | Bearer token; bypasses the credentials file | unset | server |
| `INTIGRITI_BASE_URL` | API base URL; override for UAT environments | `https://api.intigriti.com/external/company` | server |
| `INTIGRITI_CLIENT_ID` | OAuth client ID | unset | login helper |
| `INTIGRITI_CLIENT_SECRET` | OAuth client secret (confidential clients only) | unset | login helper |
| `INTIGRITI_LOGIN_PORT` | Local callback server port for the OAuth redirect | `8765` | login helper |
| `INTIGRITI_CREDENTIALS_PATH` | Override the credentials file location | `~/.intigriti-mcp/credentials.json` | both |

## Claude Desktop configuration

Add one of the following blocks to `claude_desktop_config.json`. See Claude Desktop's MCP config docs for the location of this file.

**Path A — env var token:**

```json
{
  "mcpServers": {
    "intigriti": {
      "command": "npx",
      "args": ["-y", "intigriti-company-api-mcp"],
      "env": { "INTIGRITI_ACCESS_TOKEN": "your_token_here" }
    }
  }
}
```

**Path B — credentials file (run the login helper first, no env vars needed at runtime):**

```json
{
  "mcpServers": {
    "intigriti": {
      "command": "npx",
      "args": ["-y", "intigriti-company-api-mcp"]
    }
  }
}
```

## Tools

50 tools across 9 tags. Tool names follow the convention `intigriti_<tag>_<action>`.

| Tag | Count | Coverage |
|-----|-------|----------|
| Submissions | 24 | list, get, create, update state/severity/tags, messages, attachments, exports (PDF, CSV) |
| Programs | 6 | list, get, list submissions/researchers/payouts, import submission (BETA — creates a real submission) |
| ProgramUpdates | 6 | list (all + per-program), create, update, delete, publish |
| RewardSystem | 5 | reward request CRUD, payout creation, budget |
| CompanyAssets | 3 | — |
| Groups | 2 | — |
| User | 2 | IP lookup, researcher access |
| Payouts | 1 | — |
| SubmissionTypes | 1 | — |

## Special-case behavior

**Binary exports (PDF, CSV)**

Export tools accept an optional `outputPath`. If provided, the server decodes the base64 response, writes the file, and returns `{ path, bytes, mimeType }`. If omitted, returns `{ base64, bytes, mimeType }` so the agent can handle the data directly.

**Multipart file upload**

Submission attachment tools accept a `filePath` string. The server reads the file and posts it as `multipart/form-data`. These endpoints are marked `[BETA]` in their tool descriptions.

**Pagination**

Only `intigriti_reward_system_list_reward_requests` paginates. Inputs are camelCase (`limit`, `offset`, `createdSince`, `updatedSince`); the server converts them to PascalCase query parameters on the wire (`Limit`, `Offset`, `CreatedSince`, `UpdatedSince`).

**Date parameters**

`updatedSince` and `createdSince` accept ISO 8601 strings in tool inputs. The client converts them to Unix seconds before sending.

**Rate limiting**

The client retries once on 429 or 403 responses after a 30-second delay. If the retry also fails, a clear error is surfaced.

**BETA endpoints**

Tools that call BETA endpoints include `[BETA]` in their description. These may change without a major version bump.

## Development

```bash
npm install
npm run generate-types   # fetch v2.1 OpenAPI spec and generate src/generated/api.d.ts
npm run build            # compile TypeScript to dist/
npm test                 # run vitest
```

## License

MIT
