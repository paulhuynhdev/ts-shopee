export interface ShopeeResponse<T> {
  error: string;
  message: string;
  warning: string;
  request_id: string;
  response: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  hasMore: boolean;
  nextCursor?: string;
  nextOffset?: number;
}

export interface Timestamps {
  createTime: number;
  updateTime: number;
}
