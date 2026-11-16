/**
 * Strip a protobuf length-delimited wrapper (field 1, wire type 2) from a
 * binary payload, if — and only if — the payload is exactly such a wrapper.
 *
 * The Intigriti PDF-export endpoint returns the PDF wrapped this way: a
 * `0x0a` tag byte, a varint holding the PDF length, then the PDF itself
 * (verified 2026-11-16: `0a fa d9 72` + 1,879,290 bytes of `%PDF-1.4…`).
 * The wrapper is only removed when the varint matches the remaining length
 * exactly, so an unwrapped payload (or a future API fix) passes through
 * untouched.
 */
export function unwrapProtobufBytesField(buf: Buffer): Buffer {
  if (buf.length < 2 || buf[0] !== 0x0a) return buf;
  let len = 0;
  let shift = 0;
  let i = 1;
  // A varint for any realistic length fits in 5 bytes (< 2^35).
  while (i < buf.length && i <= 5) {
    const byte = buf[i]!;
    len += (byte & 0x7f) * 2 ** shift;
    i++;
    if ((byte & 0x80) === 0) {
      return i + len === buf.length ? buf.subarray(i) : buf;
    }
    shift += 7;
  }
  return buf;
}

/** Convert an ISO 8601 string to a Unix timestamp in whole seconds. */
export function isoToUnixSeconds(iso: string): number {
  return Math.floor(new Date(iso).getTime() / 1000);
}
