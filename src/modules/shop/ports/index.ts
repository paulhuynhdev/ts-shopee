export interface ShopInfo {
  shopId: number;
  shopName: string;
  region: string;
  status: string;
  sip_affi_shops: any[];
  is_cb: boolean;
  is_cnsc: boolean;
}

export interface ShopProfile {
  shopId: number;
  shopName: string;
  shopLogo: string;
  description: string;
  country: string;
  shopCbsc: boolean;
}

export interface UpdateProfileRequest {
  shopName?: string;
  description?: string;
  shopLogo?: string;
}

export interface ShopApiPort {
  getShopInfo(): Promise<ShopInfo>;
  getProfile(): Promise<ShopProfile>;
  updateProfile(data: UpdateProfileRequest): Promise<void>;
}
