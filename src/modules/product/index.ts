import { BaseModule } from '../../core/BaseModule';
import {
  ProductApiPort,
  Product,
  ProductListParams,
  PaginatedProductList,
  CreateProductRequest,
  UpdateProductRequest,
  UpdateStockRequest,
  UpdatePriceRequest,
} from './ports';

export class ProductModule extends BaseModule implements ProductApiPort {
  async getProductList(params?: ProductListParams): Promise<PaginatedProductList> {
    const queryParams = {
      offset: params?.offset || 0,
      page_size: params?.pageSize || 50,
      ...(params?.itemStatus && { item_status: params.itemStatus }),
      ...(params?.updateTimeFrom && { update_time_from: params.updateTimeFrom }),
      ...(params?.updateTimeTo && { update_time_to: params.updateTimeTo }),
    };

    const response = await this.get<{
      item: Array<{ item_id: number; item_status: string }>;
      total_count: number;
      has_next_page: boolean;
      next_offset: number;
    }>('/api/v2/product/get_item_list', queryParams);

    return {
      item: response.item.map((item) => ({
        itemId: item.item_id,
        itemName: '',
        itemStatus: item.item_status as 'NORMAL' | 'DELETED' | 'BANNED' | 'UNLIST',
        createTime: 0,
        updateTime: 0,
      })),
      total: response.total_count,
      hasMore: response.has_next_page,
      nextOffset: response.next_offset,
    };
  }

  async getProduct(itemId: number): Promise<Product> {
    const response = await this.get<{
      item_id: number;
      item_name: string;
      description: string;
      category_id: number;
      original_price: number;
      current_price: number;
      stock: number;
      item_status: string;
      create_time: number;
      update_time: number;
      image: { image_url_list: string[] };
      weight: number;
      dimension: {
        package_length: number;
        package_width: number;
        package_height: number;
      };
      logistic_info: Array<{
        logistic_id: number;
        logistic_name: string;
        enabled: boolean;
      }>;
      attribute_list: Array<{
        attribute_id: number;
        attribute_name: string;
        attribute_value: string;
      }>;
      brand?: {
        brand_id: number;
        brand_name: string;
      };
    }>('/api/v2/product/get_item_base_info', { item_id: itemId });

    return {
      itemId: response.item_id,
      itemName: response.item_name,
      description: response.description,
      categoryId: response.category_id,
      originalPrice: response.original_price,
      currentPrice: response.current_price,
      stock: response.stock,
      itemStatus: response.item_status as 'NORMAL' | 'DELETED' | 'BANNED' | 'UNLIST',
      createTime: response.create_time,
      updateTime: response.update_time,
      images: response.image.image_url_list,
      weight: response.weight,
      dimension: {
        packageLength: response.dimension.package_length,
        packageWidth: response.dimension.package_width,
        packageHeight: response.dimension.package_height,
      },
      logisticInfo: response.logistic_info.map((info) => ({
        logisticId: info.logistic_id,
        logisticName: info.logistic_name,
        enabled: info.enabled,
      })),
      attributeList: response.attribute_list.map((attr) => ({
        attributeId: attr.attribute_id,
        attributeName: attr.attribute_name,
        attributeValue: attr.attribute_value,
      })),
      ...(response.brand && {
        brandInfo: {
          brandId: response.brand.brand_id,
          brandName: response.brand.brand_name,
        },
      }),
    };
  }

  async createProduct(data: CreateProductRequest): Promise<{ itemId: number }> {
    const requestBody = {
      item_name: data.itemName,
      description: data.description,
      category_id: data.categoryId,
      original_price: data.originalPrice,
      normal_stock: data.normalStock,
      weight: data.weight,
      dimension: {
        package_length: data.packageLength,
        package_width: data.packageWidth,
        package_height: data.packageHeight,
      },
      logistic_info: data.logisticInfo.map((info) => ({
        logistic_id: info.logisticId,
        enabled: info.enabled,
      })),
      image: {
        image_id_list: data.images,
      },
      ...(data.attributeList && {
        attribute_list: data.attributeList.map((attr) => ({
          attribute_id: attr.attributeId,
          attribute_value: attr.attributeValue,
        })),
      }),
      ...(data.brandId && { brand: { brand_id: data.brandId } }),
    };

    const response = await this.post<{ item_id: number }>('/api/v2/product/add_item', requestBody);

    return {
      itemId: response.item_id,
    };
  }

  async updateProduct(data: UpdateProductRequest): Promise<void> {
    const requestBody: Record<string, unknown> = {
      item_id: data.itemId,
    };

    if (data.itemName) {
      requestBody.item_name = data.itemName;
    }
    if (data.description) {
      requestBody.description = data.description;
    }
    if (data.originalPrice) {
      requestBody.original_price = data.originalPrice;
    }
    if (data.weight) {
      requestBody.weight = data.weight;
    }
    if (data.packageLength || data.packageWidth || data.packageHeight) {
      requestBody.dimension = {
        ...(data.packageLength && { package_length: data.packageLength }),
        ...(data.packageWidth && { package_width: data.packageWidth }),
        ...(data.packageHeight && { package_height: data.packageHeight }),
      };
    }
    if (data.logisticInfo) {
      requestBody.logistic_info = data.logisticInfo.map((info) => ({
        logistic_id: info.logisticId,
        enabled: info.enabled,
      }));
    }
    if (data.images) {
      requestBody.image = {
        image_id_list: data.images,
      };
    }
    if (data.attributeList) {
      requestBody.attribute_list = data.attributeList.map((attr) => ({
        attribute_id: attr.attributeId,
        attribute_value: attr.attributeValue,
      }));
    }

    await this.post('/api/v2/product/update_item', requestBody);
  }

  async deleteProduct(itemId: number): Promise<void> {
    await this.post('/api/v2/product/delete_item', { item_id: itemId });
  }

  async updateStock(data: UpdateStockRequest): Promise<void> {
    const requestBody = {
      item_id: data.itemId,
      stock_list: data.stockList.map((stock) => ({
        ...(stock.modelId && { model_id: stock.modelId }),
        normal_stock: stock.normalStock,
      })),
    };

    await this.post('/api/v2/product/update_stock', requestBody);
  }

  async updatePrice(data: UpdatePriceRequest): Promise<void> {
    const requestBody = {
      item_id: data.itemId,
      price_list: data.priceList.map((price) => ({
        ...(price.modelId && { model_id: price.modelId }),
        original_price: price.originalPrice,
      })),
    };

    await this.post('/api/v2/product/update_price', requestBody);
  }
}

export * from './ports';
