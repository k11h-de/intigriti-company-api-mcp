export class IntigritiApiError extends Error {
  readonly status: number;
  readonly body: string | unknown;
  readonly url: string;
  readonly method: string;

  constructor(opts: { status: number; body: string | unknown; url: string; method: string }) {
    super(`${opts.method} ${opts.url} -> ${opts.status}`);
    this.name = "IntigritiApiError";
    this.status = opts.status;
    this.body = opts.body;
    this.url = opts.url;
    this.method = opts.method;
  }

  static isAuthError(err: unknown): err is IntigritiApiError {
    return err instanceof IntigritiApiError && err.status === 401;
  }
}
