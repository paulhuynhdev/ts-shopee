import { ShopeeError } from './ShopeeError';

export class ShopeeServerError extends ShopeeError {
  constructor(message: string, code: string, requestId?: string) {
    super(message, code, requestId);
    this.name = 'ShopeeServerError';
    Object.setPrototypeOf(this, ShopeeServerError.prototype);
  }
}
