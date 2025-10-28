import type { TokenPort, TokenData } from '../ports/TokenPort';

export class MemoryTokenAdapter implements TokenPort {
  private token: TokenData | null = null;

  async get(): Promise<TokenData | null> {
    return this.token;
  }

  async set(data: TokenData): Promise<void> {
    this.token = data;
  }

  async clear(): Promise<void> {
    this.token = null;
  }
}
