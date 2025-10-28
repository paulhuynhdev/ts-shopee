export interface Order {
  orderId: string;
  orderStatus: string;
  cancelReason: string;
  cancelBy: string;
  fmTn: string;
  toName: string;
  toAddress: string;
  toPhone: string;
  totalAmount: number;
  actualShippingFee: number;
  goodsToDeclare: boolean;
  messageToSeller: string;
  note: string;
  noteUpdateTime: number;
  itemList: OrderItem[];
  payTime: number;
  dropshipper: string;
  dropshipperPhone: string;
  splitUp: boolean;
  buyerUserId: number;
  buyerUsername: string;
  estimatedShippingFee: number;
  recipientAddress: RecipientAddress;
  invoiceData: InvoiceData;
  checkoutShippingCarrier: string;
  reverseShippingFee: number;
  orderChargeFeeList: OrderChargeFee[];
  createTime: number;
  updateTime: number;
  daysToShip: number;
  shipByDate: number;
  buyerCancelReason: string;
  buyerCpfId: string;
  fulfillmentFlag: string;
  pickupDoneTime: number;
  packageList: OrderPackage[];
  shippingCarrier: string;
  paymentMethod: string;
  region: string;
  currency: string;
}

export interface OrderItem {
  itemId: number;
  itemName: string;
  itemSku: string;
  modelId: number;
  modelName: string;
  modelSku: string;
  modelQuantityPurchased: number;
  modelOriginalPrice: number;
  modelDiscountedPrice: number;
  wholesale: boolean;
  weight: number;
  addOnDeal: boolean;
  mainItem: boolean;
  addOnDealId: number;
  promotionType: string;
  promotionId: number;
  orderItemId: number;
  promotionGroupId: number;
  imageInfo: {
    imageUrl: string;
  };
  productLocationId: string[];
  isCancelledItem: boolean;
  isWholesale: boolean;
}

export interface RecipientAddress {
  name: string;
  phone: string;
  town: string;
  district: string;
  city: string;
  state: string;
  region: string;
  zipcode: string;
  fullAddress: string;
}

export interface InvoiceData {
  number: string;
  seriesNumber: string;
  accessKey: string;
  issueDate: number;
  totalValue: number;
  productsTotalValue: number;
  taxCode: string;
}

export interface OrderChargeFee {
  feeType: string;
  feeName: string;
  amount: number;
}

export interface OrderPackage {
  packageNumber: string;
  logisticsStatus: string;
  shippingCarrier: string;
  itemList: Array<{
    itemId: number;
    modelId: number;
    quantity: number;
  }>;
}

export interface OrderListParams {
  timeRangeField: 'create_time' | 'update_time';
  timeFrom: number;
  timeTo: number;
  pageSize?: number;
  cursor?: string;
  orderStatus?:
    | 'UNPAID'
    | 'READY_TO_SHIP'
    | 'PROCESSED'
    | 'SHIPPED'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'INVOICE_PENDING';
  responseOptionalFields?: string[];
}

export interface PaginatedOrderList {
  orderList: OrderListItem[];
  more: boolean;
  nextCursor: string;
}

export interface OrderListItem {
  orderId: string;
  orderStatus: string;
  createTime: number;
  updateTime: number;
}

export interface CancelOrderRequest {
  orderId: string;
  cancelReason: string;
  itemList?: Array<{
    itemId: number;
    modelId: number;
  }>;
}

export interface HandleReturnRequest {
  orderId: string;
  returnSn: string;
}

export interface OrderApiPort {
  getOrderList(params: OrderListParams): Promise<PaginatedOrderList>;
  getOrder(orderId: string): Promise<Order>;
  cancelOrder(request: CancelOrderRequest): Promise<void>;
  handleReturn(request: HandleReturnRequest): Promise<void>;
}
