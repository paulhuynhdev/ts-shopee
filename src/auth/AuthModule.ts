import { HttpPort, SignerPort } from '../shared/ports';
import { ShopeeClientConfig, ShopeeResponse } from '../shared/types';
import { TokenManager } from '../core/TokenManager';
import { ShopeeAuthError } from '../shared/errors';
import {
  BASE_URL_PRODUCTION,
  BASE_URL_UAT,
  API_PATHS,
  HTTP_HEADERS,
  CONTENT_TYPE_JSON,
} from '../shared/constants';
import { getCurrentTimestamp, parseShopId, parsePartnerId } from '../shared/utils';

export interface AuthorizationUrlOptions {
  redirectUrl: string;
  state?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expire_in: number;
  shop_id: number;
}

export class AuthModule {
  constructor(
    private readonly httpPort: HttpPort,
    private readonly tokenManager: TokenManager,
    private readonly signerPort: SignerPort,
    private readonly config: ShopeeClientConfig
  ) {}

  generateAuthUrl(options: AuthorizationUrlOptions): string {
    const path = API_PATHS.AUTH.AUTH_PARTNER;
    const baseUrl = this.config.isUAT ? BASE_URL_UAT : BASE_URL_PRODUCTION;

    const timestamp = getCurrentTimestamp();
    const signature = this.signerPort.sign({
      partnerId: this.config.partnerId,
      partnerKey: this.config.partnerKey,
      path,
      timestamp,
    });

    const params = new URLSearchParams({
      partner_id: this.config.partnerId,
      redirect: options.redirectUrl,
      timestamp: String(timestamp),
      sign: signature,
    });

    if (options.state) {
      params.append('state', options.state);
    }

    return `${baseUrl}${path}?${params.toString()}`;
  }

  async getAccessToken(code: string, shopId: string): Promise<TokenResponse> {
    const path = API_PATHS.AUTH.TOKEN_GET;
    const timestamp = getCurrentTimestamp();

    const signature = this.signerPort.sign({
      partnerId: this.config.partnerId,
      partnerKey: this.config.partnerKey,
      path,
      timestamp,
    });

    const url = this.buildUrl(path);
    const response = await this.httpPort.request<ShopeeResponse<TokenResponse>>({
      method: 'POST',
      url,
      headers: {
        [HTTP_HEADERS.CONTENT_TYPE]: CONTENT_TYPE_JSON,
        [HTTP_HEADERS.PARTNER_ID]: this.config.partnerId,
        [HTTP_HEADERS.TIMESTAMP]: String(timestamp),
        [HTTP_HEADERS.SIGN]: signature,
      },
      body: {
        code,
        shop_id: parseShopId(shopId),
        partner_id: parsePartnerId(this.config.partnerId),
      },
    });

    const tokenData = response.data.response;

    await this.tokenManager.setTokens({
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: getCurrentTimestamp() + tokenData.expire_in,
      shopId,
    });

    return tokenData;
  }

  async refreshAccessToken(refreshToken: string, shopId: string): Promise<TokenResponse> {
    const path = API_PATHS.AUTH.ACCESS_TOKEN_GET;
    const timestamp = getCurrentTimestamp();

    const signature = this.signerPort.sign({
      partnerId: this.config.partnerId,
      partnerKey: this.config.partnerKey,
      path,
      timestamp,
    });

    const url = this.buildUrl(path);

    try {
      const response = await this.httpPort.request<ShopeeResponse<TokenResponse>>({
        method: 'POST',
        url,
        headers: {
          [HTTP_HEADERS.CONTENT_TYPE]: CONTENT_TYPE_JSON,
          [HTTP_HEADERS.PARTNER_ID]: this.config.partnerId,
          [HTTP_HEADERS.TIMESTAMP]: String(timestamp),
          [HTTP_HEADERS.SIGN]: signature,
        },
        body: {
          refresh_token: refreshToken,
          shop_id: parseShopId(shopId),
          partner_id: parsePartnerId(this.config.partnerId),
        },
      });

      const tokenData = response.data.response;

      await this.tokenManager.setTokens({
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: getCurrentTimestamp() + tokenData.expire_in,
        shopId,
      });

      return tokenData;
    } catch (error) {
      if (error instanceof ShopeeAuthError) {
        throw error;
      }
      const errorObj = error as { requestId?: string };
      throw new ShopeeAuthError(
        'Failed to refresh access token',
        'REFRESH_TOKEN_FAILED',
        errorObj?.requestId
      );
    }
  }

  private buildUrl(path: string): string {
    const baseUrl = this.config.isUAT ? BASE_URL_UAT : BASE_URL_PRODUCTION;
    return `${baseUrl}${path}`;
  }
}
