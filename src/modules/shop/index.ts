import { BaseModule } from '../../core/BaseModule';
import { ShopApiPort, ShopInfo, ShopProfile, UpdateProfileRequest } from './ports';

export class ShopModule extends BaseModule implements ShopApiPort {
  async getShopInfo(): Promise<ShopInfo> {
    return this.get<ShopInfo>('/api/v2/shop/get_shop_info');
  }

  async getProfile(): Promise<ShopProfile> {
    return this.get<ShopProfile>('/api/v2/shop/get_profile');
  }

  async updateProfile(data: UpdateProfileRequest): Promise<void> {
    await this.post('/api/v2/shop/update_profile', data);
  }
}

export * from './ports';
