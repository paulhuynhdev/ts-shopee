import type { HttpPort, HttpRequest, HttpResponse } from '../ports/HttpPort';
import {
  ShopeeClientError,
  ShopeeServerError,
  ShopeeAuthError,
  ShopeeRateLimitError,
} from '../errors';
import { delay, calculateExponentialBackoff, buildQueryString } from '../utils';

interface FetchHttpAdapterConfig {
  timeout: number;
  maxRetries: number;
  retryDelay: number;
}

export class FetchHttpAdapter implements HttpPort {
  constructor(private readonly config: FetchHttpAdapterConfig) {}

  async request<T>(request: HttpRequest): Promise<HttpResponse<T>> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        let url = request.url;
        if (request.params) {
          const queryString = buildQueryString(request.params);
          url = queryString ? `${url}?${queryString}` : url;
        }

        const response = await fetch(url, {
          method: request.method,
          headers: request.headers,
          body: request.body ? JSON.stringify(request.body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const data = (await response.json()) as T;

        if (!response.ok) {
          throw this.createErrorFromResponse(response.status, data);
        }

        return {
          status: response.status,
          data,
          headers: Object.fromEntries(response.headers.entries()),
        };
      } catch (error) {
        lastError = error as Error;

        if (error instanceof ShopeeClientError && !(error instanceof ShopeeAuthError)) {
          throw error;
        }

        if (attempt === this.config.maxRetries) {
          throw error;
        }

        await delay(calculateExponentialBackoff(attempt, this.config.retryDelay));
      }
    }

    throw lastError!;
  }

  private createErrorFromResponse(status: number, data: unknown): Error {
    const errorData = data as Record<string, unknown>;
    const message =
      (errorData?.message as string) || (errorData?.error as string) || 'Unknown error';
    const code = (errorData?.error as string) || 'UNKNOWN_ERROR';
    const requestId = errorData?.request_id as string | undefined;

    if (status === 429) {
      const retryAfter = parseInt((errorData?.retry_after as string) || '60', 10);
      return new ShopeeRateLimitError(message, retryAfter, requestId);
    }

    if (status === 401 || status === 403) {
      return new ShopeeAuthError(message, code, requestId);
    }

    if (status >= 400 && status < 500) {
      return new ShopeeClientError(message, code, requestId);
    }

    if (status >= 500) {
      return new ShopeeServerError(message, code, requestId);
    }

    return new ShopeeClientError(message, code, requestId);
  }
}
