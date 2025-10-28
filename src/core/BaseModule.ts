import { HttpPort, SignerPort } from '../shared/ports';
import { ShopeeClientConfig, ShopeeResponse } from '../shared/types';
import { TokenManager } from './TokenManager';
import {
  BASE_URL_PRODUCTION,
  BASE_URL_UAT,
  HTTP_HEADERS,
  CONTENT_TYPE_JSON,
} from '../shared/constants';
import { buildUrl, getCurrentTimestamp } from '../shared/utils';

export abstract class BaseModule {
  constructor(
    protected readonly httpPort: HttpPort,
    protected readonly tokenManager: TokenManager,
    protected readonly signerPort: SignerPort,
    protected readonly config: ShopeeClientConfig
  ) {}

  protected async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    options?: { params?: Record<string, unknown>; body?: unknown }
  ): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    const headers = await this.buildHeaders(path);

    const response = await this.httpPort.request<ShopeeResponse<T>>({
      method,
      url,
      headers,
      body: options?.body,
    });

    return response.data.response;
  }

  protected async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    return this.request<T>('GET', path, { params });
  }

  protected async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('POST', path, { body });
  }

  protected async put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PUT', path, { body });
  }

  protected async delete<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    return this.request<T>('DELETE', path, { params });
  }

  protected buildUrl(path: string, params?: Record<string, unknown>): string {
    const baseUrl = this.config.isUAT ? BASE_URL_UAT : BASE_URL_PRODUCTION;
    return buildUrl(baseUrl, path, params);
  }

  protected async buildHeaders(path: string): Promise<Record<string, string>> {
    const token = await this.tokenManager.getAccessToken();
    const timestamp = getCurrentTimestamp();

    const signature = this.signerPort.sign({
      partnerId: this.config.partnerId,
      partnerKey: this.config.partnerKey,
      path,
      timestamp,
      accessToken: token || undefined,
      shopId: this.config.shopId,
    });

    return {
      [HTTP_HEADERS.CONTENT_TYPE]: CONTENT_TYPE_JSON,
      [HTTP_HEADERS.PARTNER_ID]: this.config.partnerId,
      [HTTP_HEADERS.SHOP_ID]: this.config.shopId || '',
      [HTTP_HEADERS.ACCESS_TOKEN]: token || '',
      [HTTP_HEADERS.TIMESTAMP]: String(timestamp),
      [HTTP_HEADERS.SIGN]: signature,
    };
  }
}
