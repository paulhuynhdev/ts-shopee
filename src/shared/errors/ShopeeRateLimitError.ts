import { ShopeeClientError } from './ShopeeClientError';

export class ShopeeRateLimitError extends ShopeeClientError {
  constructor(
    message: string,
    public readonly retryAfter: number,
    requestId?: string
  ) {
    super(message, 'RATE_LIMIT_EXCEEDED', requestId);
    this.name = 'ShopeeRateLimitError';
    Object.setPrototypeOf(this, ShopeeRateLimitError.prototype);
  }
}
