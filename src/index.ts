export { ShopeeClient } from './client/ShopeeClient';

export { AuthModule } from './auth';
export { ShopModule } from './modules/shop';
export { ProductModule } from './modules/product';
export { OrderModule } from './modules/order';
export { LogisticsModule } from './modules/logistics';

export type { HttpPort, HttpRequest, HttpResponse } from './shared/ports/HttpPort';
export type { TokenPort, TokenData } from './shared/ports/TokenPort';
export type { ClockPort } from './shared/ports/ClockPort';
export type { SignerPort, SignatureParams } from './shared/ports/SignerPort';

export { FetchHttpAdapter } from './shared/adapters/FetchHttpAdapter';
export { MemoryTokenAdapter } from './shared/adapters/MemoryTokenAdapter';
export { SystemClock } from './shared/adapters/SystemClock';
export { ShopeeV2Signer } from './auth/signer/ShopeeV2Signer';

export {
  ShopeeError,
  ShopeeClientError,
  ShopeeServerError,
  ShopeeAuthError,
  ShopeeRateLimitError,
  ShopeeValidationError,
} from './shared/errors';

export type {
  ShopeeClientConfig,
  ShopeeResponse,
  PaginatedResponse,
  Timestamps,
  AuthorizationUrlOptions,
  TokenResponse,
} from './shared/types';

export {
  BASE_URL_PRODUCTION,
  BASE_URL_UAT,
  API_PATHS,
  HTTP_HEADERS,
  CONTENT_TYPE_JSON,
  TOKEN_REFRESH_BUFFER_SECONDS,
  DEFAULT_TIMEOUT_MS,
  DEFAULT_MAX_RETRIES,
  DEFAULT_RETRY_DELAY_MS,
} from './shared/constants';

export {
  buildUrl,
  serializeParam,
  getCurrentTimestamp,
  isTokenExpired,
  parseShopId,
  parsePartnerId,
  buildQueryString,
  delay,
  calculateExponentialBackoff,
} from './shared/utils';

export type {
  ShopInfo,
  ShopProfile,
  UpdateProfileRequest,
  ShopApiPort,
} from './modules/shop/ports';

export type {
  Product,
  ProductListItem,
  ProductListParams,
  PaginatedProductList,
  CreateProductRequest,
  UpdateProductRequest,
  UpdateStockRequest,
  UpdatePriceRequest,
  ProductApiPort,
} from './modules/product/ports';

export type {
  Order,
  OrderItem,
  RecipientAddress,
  InvoiceData,
  OrderChargeFee,
  OrderPackage,
  OrderListParams,
  PaginatedOrderList,
  OrderListItem,
  CancelOrderRequest,
  HandleReturnRequest,
  OrderApiPort,
} from './modules/order/ports';

export type {
  ShippingProvider,
  ShippingParameter,
  CreateShippingOrderRequest,
  TrackingInfo,
  GetShippingProvidersParams,
  GetShippingParameterParams,
  GetTrackingInfoParams,
  LogisticsApiPort,
} from './modules/logistics/ports';
