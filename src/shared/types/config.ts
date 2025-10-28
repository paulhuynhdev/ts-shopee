import { HttpPort, TokenPort, ClockPort, SignerPort } from '../ports';
import { DEFAULT_TIMEOUT_MS, DEFAULT_MAX_RETRIES, DEFAULT_RETRY_DELAY_MS } from '../constants';

export interface ShopeeClientConfig {
  partnerId: string;
  partnerKey: string;
  shopId?: string;
  accessToken?: string;
  refreshToken?: string;
  isUAT?: boolean;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
  httpAdapter?: HttpPort;
  tokenAdapter?: TokenPort;
  clockAdapter?: ClockPort;
  signerAdapter?: SignerPort;
}

export const DEFAULT_CONFIG: Partial<ShopeeClientConfig> = {
  isUAT: false,
  timeout: DEFAULT_TIMEOUT_MS,
  maxRetries: DEFAULT_MAX_RETRIES,
  retryDelay: DEFAULT_RETRY_DELAY_MS,
};
