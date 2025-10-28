export interface SignatureParams {
  partnerId: string;
  partnerKey: string;
  path: string;
  timestamp: number;
  accessToken?: string;
  shopId?: string;
}

export interface SignerPort {
  sign(params: SignatureParams): string;
}
