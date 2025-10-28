import { ShopeeClientError } from './ShopeeClientError';

export class ShopeeValidationError extends ShopeeClientError {
  constructor(
    message: string,
    public readonly field: string,
    requestId?: string
  ) {
    super(message, 'VALIDATION_ERROR', requestId);
    this.name = 'ShopeeValidationError';
    Object.setPrototypeOf(this, ShopeeValidationError.prototype);
  }
}
