export class NotFoundError extends Error {
  constructor(message = 'Not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class RateLimitedError extends Error {
  constructor(message = 'Upstream rate limit reached') {
    super(message);
    this.name = 'RateLimitedError';
  }
}

export class UpstreamError extends Error {
  readonly status: number | null;

  constructor(status: number | null, message = 'Upstream request failed') {
    super(message);
    this.name = 'UpstreamError';
    this.status = status;
  }
}
