import { TokenPort, TokenData, ClockPort } from '../shared/ports';
import { ShopeeClientConfig } from '../shared/types/config';
import { ShopeeAuthError } from '../shared/errors';
import { TOKEN_REFRESH_BUFFER_SECONDS } from '../shared/constants';
import { isTokenExpired } from '../shared/utils';

export class TokenManager {
  private refreshPromise: Promise<void> | null = null;

  constructor(
    private readonly tokenPort: TokenPort,
    private readonly clockPort: ClockPort,
    private readonly config: ShopeeClientConfig
  ) {
    if (config.accessToken && config.refreshToken) {
      this.tokenPort.set({
        accessToken: config.accessToken,
        refreshToken: config.refreshToken,
        expiresAt: this.clockPort.now() + 14400,
        shopId: config.shopId || '',
      });
    }
  }

  async getAccessToken(): Promise<string | null> {
    const tokenData = await this.tokenPort.get();

    if (!tokenData) {
      return null;
    }

    if (isTokenExpired(tokenData.expiresAt, TOKEN_REFRESH_BUFFER_SECONDS)) {
      if (this.refreshPromise) {
        await this.refreshPromise;
      } else {
        this.refreshPromise = this.refreshToken().finally(() => {
          this.refreshPromise = null;
        });
        await this.refreshPromise;
      }

      const refreshedData = await this.tokenPort.get();
      return refreshedData?.accessToken || null;
    }

    return tokenData.accessToken;
  }

  async setTokens(data: TokenData): Promise<void> {
    await this.tokenPort.set(data);
  }

  async clearTokens(): Promise<void> {
    await this.tokenPort.clear();
  }

  setRefreshCallback(callback: (refreshToken: string, shopId: string) => Promise<void>): void {
    this.refreshCallback = callback;
  }

  private refreshCallback?: (refreshToken: string, shopId: string) => Promise<void>;

  private async refreshToken(): Promise<void> {
    const tokenData = await this.tokenPort.get();

    if (!tokenData) {
      throw new ShopeeAuthError('No refresh token available', 'NO_REFRESH_TOKEN');
    }

    if (!this.refreshCallback) {
      throw new ShopeeAuthError('Token refresh callback not set', 'NO_REFRESH_CALLBACK');
    }

    await this.refreshCallback(tokenData.refreshToken, tokenData.shopId);
  }
}
