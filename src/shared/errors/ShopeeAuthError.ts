import { ShopeeClientError } from './ShopeeClientError';

export class ShopeeAuthError extends ShopeeClientError {
  constructor(message: string, code: string, requestId?: string) {
    super(message, code, requestId);
    this.name = 'ShopeeAuthError';
    Object.setPrototypeOf(this, ShopeeAuthError.prototype);
  }
}
