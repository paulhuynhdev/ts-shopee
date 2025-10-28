import { ShopeeError } from './ShopeeError';

export class ShopeeClientError extends ShopeeError {
  constructor(message: string, code: string, requestId?: string) {
    super(message, code, requestId);
    this.name = 'ShopeeClientError';
    Object.setPrototypeOf(this, ShopeeClientError.prototype);
  }
}
