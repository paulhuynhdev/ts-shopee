# Shopee Client Library

A modular, type-safe TypeScript client library for integrating with Shopee's Partner API.

## Features

- Simple, reliable, and elegant
- No need to generate authentication and timestamps by yourself, the wrapper does it for you
- Module format functionality the same as Shopee official document
- Full TypeScript support with type definitions
- Good response exception handling
- Token management with automatic refresh

## Installation

```bash
git clone https://github.com/paulhuynhdev/ts-shopee.git
cd ts-shopee
npm install
npm run build
```

Then link it to your project:

```bash
npm link
```

In your project:

```bash
npm link ts-shopee
```

## Requirements

- Node.js >= 18.0.0

## Quick Start

```typescript
import { ShopeeClient } from 'ts-shopee';

const client = new ShopeeClient({
  partnerId: 'YOUR_PARTNER_ID',
  partnerKey: 'YOUR_PARTNER_KEY',
  shopId: 'YOUR_SHOP_ID',
  isUAT: false,
});

const shopInfo = await client.shop.getShopInfo();
```

## Authentication Flow

```typescript
const authUrl = client.auth.generateAuthUrl({
  redirectUrl: 'https://yourapp.com/callback',
});

app.get('/callback', async (req, res) => {
  const { code, shop_id } = req.query;
  await client.auth.getAccessToken(code, shop_id);
  res.send('Authorization successful!');
});
```

## API Modules

### Shop

```typescript
const shopInfo = await client.shop.getShopInfo();
const profile = await client.shop.getProfile();
await client.shop.updateProfile({ shop_name: 'My Shop' });
```

### Product

```typescript
const products = await client.product.getProductList({ pageSize: 20 });
const product = await client.product.getProduct(12345);
await client.product.createProduct({ itemName: 'New Product', ... });
await client.product.updateProduct({ itemId: 12345, itemName: 'Updated' });
await client.product.deleteProduct(12345);
```

### Order

```typescript
const orders = await client.order.getOrderList({
  timeFrom: Math.floor(Date.now() / 1000) - 86400,
  timeTo: Math.floor(Date.now() / 1000),
});
const order = await client.order.getOrder('order_sn');
await client.order.cancelOrder('order_sn', 'Out of stock');
```

### Logistics

```typescript
const providers = await client.logistics.getShippingProviders();
await client.logistics.createShippingOrder('order_sn', { ... });
const tracking = await client.logistics.getTrackingInfo('order_sn');
```

## Configuration

```typescript
const client = new ShopeeClient({
  partnerId: 'YOUR_PARTNER_ID',
  partnerKey: 'YOUR_PARTNER_KEY',
  shopId: 'YOUR_SHOP_ID',
  isUAT: false,
  timeout: 30000,
  maxRetries: 3,
});
```

## Error Handling

```typescript
import { ShopeeAuthError, ShopeeRateLimitError, ShopeeClientError } from 'ts-shopee';

try {
  const shopInfo = await client.shop.getShopInfo();
} catch (error) {
  if (error instanceof ShopeeAuthError) {
    console.error('Authentication failed');
  } else if (error instanceof ShopeeRateLimitError) {
    console.error('Rate limited. Retry after:', error.retryAfter);
  }
}
```

## Custom Adapters

### Custom Token Storage (Redis)

```typescript
import { TokenPort, TokenData } from 'ts-shopee';

class RedisTokenAdapter implements TokenPort {
  constructor(private redis: Redis) {}

  async get(): Promise<TokenData | null> {
    const data = await this.redis.get('shopee:token');
    return data ? JSON.parse(data) : null;
  }

  async set(data: TokenData): Promise<void> {
    await this.redis.set('shopee:token', JSON.stringify(data));
  }

  async clear(): Promise<void> {
    await this.redis.del('shopee:token');
  }
}

const client = new ShopeeClient({
  partnerId: 'YOUR_PARTNER_ID',
  partnerKey: 'YOUR_PARTNER_KEY',
  tokenAdapter: new RedisTokenAdapter(redisClient),
});
```

### Custom HTTP Client

```typescript
import { HttpPort } from 'ts-shopee';

class AxiosHttpAdapter implements HttpPort {
  async request<T>(request: HttpRequest): Promise<HttpResponse<T>> {
    const response = await axios({
      method: request.method,
      url: request.url,
      headers: request.headers,
      data: request.body,
    });
    return { status: response.status, data: response.data };
  }
}

const client = new ShopeeClient({
  partnerId: 'YOUR_PARTNER_ID',
  partnerKey: 'YOUR_PARTNER_KEY',
  httpAdapter: new AxiosHttpAdapter(),
});
```

## TypeScript Support

Full type definitions included:

```typescript
import type { ShopeeClientConfig, ShopInfo, Product, Order } from 'ts-shopee';
```

## Official Documentation

This library implements the Shopee Open Platform API. For detailed API specifications and requirements:

- **Official API Documentation**: [https://open.shopee.com/documents](https://open.shopee.com/documents)
- **Partner Portal**: [https://partner.shopeemobile.com](https://partner.shopeemobile.com)
- **API Reference**: [https://open.shopee.com/documents/v2/v2.product.get_item_list](https://open.shopee.com/documents/v2/v2.product.get_item_list)

### Getting Started with Shopee API

1. Register as a Shopee Partner at the Partner Portal
2. Create an application to obtain Partner ID and Partner Key
3. Complete the app review process
4. Use UAT environment (`isUAT: true`) for testing
5. Switch to production environment after approval

### API Resources

- **Shop API**: Shop information and profile management
- **Product API**: Product listing, inventory, and pricing
- **Order API**: Order management and fulfillment
- **Logistics API**: Shipping and tracking operations
- **Auth API**: OAuth 2.0 authentication flow

For complete API specifications, rate limits, and field descriptions, refer to the official Shopee Open Platform documentation.

## License

MIT
