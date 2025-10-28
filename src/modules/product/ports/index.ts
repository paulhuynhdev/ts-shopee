export interface Product {
  itemId: number;
  itemName: string;
  description: string;
  categoryId: number;
  originalPrice: number;
  currentPrice: number;
  stock: number;
  itemStatus: 'NORMAL' | 'DELETED' | 'BANNED' | 'UNLIST';
  createTime: number;
  updateTime: number;
  images: string[];
  weight: number;
  dimension: {
    packageLength: number;
    packageWidth: number;
    packageHeight: number;
  };
  logisticInfo: Array<{
    logisticId: number;
    logisticName: string;
    enabled: boolean;
  }>;
  attributeList: Array<{
    attributeId: number;
    attributeName: string;
    attributeValue: string;
  }>;
  brandInfo?: {
    brandId: number;
    brandName: string;
  };
}

export interface ProductListItem {
  itemId: number;
  itemName: string;
  itemStatus: 'NORMAL' | 'DELETED' | 'BANNED' | 'UNLIST';
  createTime: number;
  updateTime: number;
}

export interface ProductListParams {
  offset?: number;
  pageSize?: number;
  itemStatus?: 'NORMAL' | 'DELETED' | 'BANNED' | 'UNLIST';
  updateTimeFrom?: number;
  updateTimeTo?: number;
}

export interface PaginatedProductList {
  item: ProductListItem[];
  total: number;
  hasMore: boolean;
  nextOffset: number;
}

export interface CreateProductRequest {
  itemName: string;
  description: string;
  categoryId: number;
  originalPrice: number;
  normalStock: number;
  weight: number;
  packageLength: number;
  packageWidth: number;
  packageHeight: number;
  logisticInfo: Array<{
    logisticId: number;
    enabled: boolean;
  }>;
  images: string[];
  attributeList?: Array<{
    attributeId: number;
    attributeValue: string;
  }>;
  brandId?: number;
}

export interface UpdateProductRequest {
  itemId: number;
  itemName?: string;
  description?: string;
  originalPrice?: number;
  weight?: number;
  packageLength?: number;
  packageWidth?: number;
  packageHeight?: number;
  logisticInfo?: Array<{
    logisticId: number;
    enabled: boolean;
  }>;
  images?: string[];
  attributeList?: Array<{
    attributeId: number;
    attributeValue: string;
  }>;
}

export interface UpdateStockRequest {
  itemId: number;
  stockList: Array<{
    modelId?: number;
    normalStock: number;
  }>;
}

export interface UpdatePriceRequest {
  itemId: number;
  priceList: Array<{
    modelId?: number;
    originalPrice: number;
  }>;
}

export interface ProductApiPort {
  getProductList(params?: ProductListParams): Promise<PaginatedProductList>;
  getProduct(itemId: number): Promise<Product>;
  createProduct(data: CreateProductRequest): Promise<{ itemId: number }>;
  updateProduct(data: UpdateProductRequest): Promise<void>;
  deleteProduct(itemId: number): Promise<void>;
  updateStock(data: UpdateStockRequest): Promise<void>;
  updatePrice(data: UpdatePriceRequest): Promise<void>;
}
