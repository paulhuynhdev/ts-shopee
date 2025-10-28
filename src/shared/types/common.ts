export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  shopId: string;
}

export interface AuthorizationUrlOptions {
  redirectUrl: string;
  state?: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  shopId: string;
}

export interface SignatureParams {
  partnerId: string;
  partnerKey: string;
  path: string;
  timestamp: number;
  accessToken?: string;
  shopId?: string;
}
