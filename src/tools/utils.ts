/** Convert an ISO 8601 string to a Unix timestamp in whole seconds. */
export function isoToUnixSeconds(iso: string): number {
  return Math.floor(new Date(iso).getTime() / 1000);
}
