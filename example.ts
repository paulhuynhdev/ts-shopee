import dotenv from 'dotenv';
import { ShopeeClient } from './src/index';

dotenv.config();
async function main() {
  const client = new ShopeeClient({
    partnerId: process.env.PARTNER_ID!,
    partnerKey: process.env.PARTNER_KEY!,
    shopId: process.env.SHOP_ID!,
    isUAT: process.env.IS_UAT === 'true',
  });

  try {
    const authUrl = client.auth.generateAuthUrl({
      redirectUrl: process.env.REDIRECT_URL!,
    });
    console.log('Auth URL:', authUrl);

    const shopInfo = await client.shop.getShopInfo();
    console.log('Shop Info:', shopInfo);

    const products = await client.product.getProductList({ pageSize: 10 });
    console.log('Products:', products);

    const orders = await client.order.getOrderList({
      timeFrom: Math.floor(Date.now() / 1000) - 86400,
      timeTo: Math.floor(Date.now() / 1000),
      timeRangeField: 'create_time',
    });
    console.log('Orders:', orders);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
