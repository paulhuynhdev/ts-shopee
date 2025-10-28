export const BASE_URL_PRODUCTION = 'https://partner.shopeemobile.com';
export const BASE_URL_UAT = 'https://partner.test-stable.shopeemobile.com';

export const API_PATHS = {
  AUTH: {
    AUTH_PARTNER: '/api/v2/shop/auth_partner',
    TOKEN_GET: '/api/v2/auth/token/get',
    ACCESS_TOKEN_GET: '/api/v2/auth/access_token/get',
  },
  SHOP: {
    GET_SHOP_INFO: '/api/v2/shop/get_shop_info',
    GET_PROFILE: '/api/v2/shop/get_profile',
    UPDATE_PROFILE: '/api/v2/shop/update_profile',
  },
  PRODUCT: {
    GET_ITEM_LIST: '/api/v2/product/get_item_list',
    GET_ITEM_BASE_INFO: '/api/v2/product/get_item_base_info',
    ADD_ITEM: '/api/v2/product/add_item',
    UPDATE_ITEM: '/api/v2/product/update_item',
    DELETE_ITEM: '/api/v2/product/delete_item',
    UPDATE_STOCK: '/api/v2/product/update_stock',
    UPDATE_PRICE: '/api/v2/product/update_price',
  },
  ORDER: {
    GET_ORDER_LIST: '/api/v2/order/get_order_list',
    GET_ORDER_DETAIL: '/api/v2/order/get_order_detail',
    CANCEL_ORDER: '/api/v2/order/cancel_order',
    HANDLE_BUYER_CANCELLATION: '/api/v2/order/handle_buyer_cancellation',
  },
  LOGISTICS: {
    GET_CHANNEL_LIST: '/api/v2/logistics/get_channel_list',
    GET_SHIPPING_PARAMETER: '/api/v2/logistics/get_shipping_parameter',
    SHIP_ORDER: '/api/v2/logistics/ship_order',
    GET_TRACKING_INFO: '/api/v2/logistics/get_tracking_info',
  },
} as const;

export const HTTP_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  PARTNER_ID: 'partner-id',
  SHOP_ID: 'shop-id',
  ACCESS_TOKEN: 'access-token',
  TIMESTAMP: 'timestamp',
  SIGN: 'sign',
} as const;

export const CONTENT_TYPE_JSON = 'application/json';

export const TOKEN_REFRESH_BUFFER_SECONDS = 300;

export const DEFAULT_TIMEOUT_MS = 30000;
export const DEFAULT_MAX_RETRIES = 3;
export const DEFAULT_RETRY_DELAY_MS = 1000;
