export function buildUrl(baseUrl: string, path: string, params?: Record<string, unknown>): string {
  const url = new URL(path, baseUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, serializeParam(value));
      }
    });
  }

  return url.toString();
}

export function serializeParam(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map(serializeParam).join(',');
  }
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value);
  }
  return String(value);
}

export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

export function isTokenExpired(expiresAt: number, bufferSeconds: number = 300): boolean {
  const now = getCurrentTimestamp();
  return expiresAt - bufferSeconds < now;
}

export function parseShopId(shopId: string | number): number {
  if (typeof shopId === 'number') {
    return shopId;
  }
  const parsed = parseInt(shopId, 10);
  if (isNaN(parsed)) {
    throw new Error(`Invalid shop ID: ${shopId}`);
  }
  return parsed;
}

export function parsePartnerId(partnerId: string | number): number {
  if (typeof partnerId === 'number') {
    return partnerId;
  }
  const parsed = parseInt(partnerId, 10);
  if (isNaN(parsed)) {
    throw new Error(`Invalid partner ID: ${partnerId}`);
  }
  return parsed;
}

export function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, serializeParam(value));
    }
  });

  return searchParams.toString();
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function calculateExponentialBackoff(attempt: number, baseDelay: number): number {
  return baseDelay * Math.pow(2, attempt);
}
