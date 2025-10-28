export class ShopeeError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly requestId?: string
  ) {
    super(message);
    this.name = 'ShopeeError';
    Object.setPrototypeOf(this, ShopeeError.prototype);
  }
}
