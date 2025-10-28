export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  shopId: string;
}

export interface TokenPort {
  get(): Promise<TokenData | null>;
  set(data: TokenData): Promise<void>;
  clear(): Promise<void>;
}
