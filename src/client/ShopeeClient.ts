import { ShopeeClientConfig, DEFAULT_CONFIG } from '../shared/types';
import { FetchHttpAdapter, MemoryTokenAdapter, SystemClock } from '../shared/adapters';
import { ShopeeV2Signer } from '../auth/signer/ShopeeV2Signer';
import { TokenManager } from '../core/TokenManager';
import { AuthModule } from '../auth';
import { ShopModule } from '../modules/shop';
import { ProductModule } from '../modules/product';
import { OrderModule } from '../modules/order';
import { LogisticsModule } from '../modules/logistics';

export class ShopeeClient {
  public readonly auth: AuthModule;
  public readonly shop: ShopModule;
  public readonly product: ProductModule;
  public readonly order: OrderModule;
  public readonly logistics: LogisticsModule;

  constructor(config: ShopeeClientConfig) {
    const mergedConfig = { ...DEFAULT_CONFIG, ...config };

    const httpAdapter =
      config.httpAdapter ||
      new FetchHttpAdapter({
        timeout: mergedConfig.timeout!,
        maxRetries: mergedConfig.maxRetries!,
        retryDelay: mergedConfig.retryDelay!,
      });

    const tokenAdapter = config.tokenAdapter || new MemoryTokenAdapter();
    const clockAdapter = config.clockAdapter || new SystemClock();
    const signerAdapter = config.signerAdapter || new ShopeeV2Signer();

    const tokenManager = new TokenManager(tokenAdapter, clockAdapter, mergedConfig);

    this.auth = new AuthModule(httpAdapter, tokenManager, signerAdapter, mergedConfig);

    tokenManager.setRefreshCallback(async (refreshToken: string, shopId: string) => {
      await this.auth.refreshAccessToken(refreshToken, shopId);
    });

    this.shop = new ShopModule(httpAdapter, tokenManager, signerAdapter, mergedConfig);
    this.product = new ProductModule(httpAdapter, tokenManager, signerAdapter, mergedConfig);
    this.order = new OrderModule(httpAdapter, tokenManager, signerAdapter, mergedConfig);
    this.logistics = new LogisticsModule(httpAdapter, tokenManager, signerAdapter, mergedConfig);
  }
}
