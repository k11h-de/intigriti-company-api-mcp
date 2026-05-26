import { readFile, writeFile, mkdir, rename, chmod } from "node:fs/promises";
import { dirname } from "node:path";

export interface Credentials {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  scope?: string;
  client_id: string;
}

export async function readCredentials(path: string): Promise<Credentials | undefined> {
  let raw: string;
  try {
    raw = await readFile(path, "utf8");
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw err;
  }

  const parsed = JSON.parse(raw) as Record<string, unknown>;

  if (typeof parsed["access_token"] !== "string") {
    throw new Error(`Credentials file ${path} is missing required field: access_token`);
  }
  if (typeof parsed["client_id"] !== "string") {
    throw new Error(`Credentials file ${path} is missing required field: client_id`);
  }

  return parsed as unknown as Credentials;
}

export async function writeCredentials(path: string, creds: Credentials): Promise<void> {
  const dir = dirname(path);
  await mkdir(dir, { recursive: true });

  const tmp = `${path}.tmp`;
  await writeFile(tmp, JSON.stringify(creds, null, 2), "utf8");
  await chmod(tmp, 0o600);
  await rename(tmp, path);
}
