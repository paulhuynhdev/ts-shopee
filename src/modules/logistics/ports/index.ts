export interface ShippingProvider {
  logisticId: number;
  logisticName: string;
  enabled: boolean;
  shippingFeeType: string;
  sizeList: Array<{
    sizeId: number;
    name: string;
    defaultPrice: number;
  }>;
  weightLimit: {
    itemMaxWeight: number;
    itemMinWeight: number;
  };
  itemMaxDimension: {
    height: number;
    width: number;
    length: number;
    unit: string;
  };
  volumeLimit: {
    itemMaxVolume: number;
    itemMinVolume: number;
  };
  preferredDeliveryTime: boolean;
  codEnabled: boolean;
  maskChannelId: number;
}

export interface ShippingParameter {
  infoNeeded: {
    dropoff?: string[];
    pickup?: string[];
    nonIntegrated?: string[];
  };
  dropoff?: Array<{
    branchId: number;
    region: string;
    state: string;
    city: string;
    address: string;
    zipcode: string;
    district: string;
    town: string;
  }>;
  pickup?: {
    addressList: Array<{
      addressId: number;
      region: string;
      state: string;
      city: string;
      district: string;
      town: string;
      address: string;
      zipcode: string;
      addressFlag: string[];
    }>;
  };
}

export interface CreateShippingOrderRequest {
  orderId: string;
  packageNumber?: string;
  pickupAddress?: {
    addressId: number;
  };
  dropoffBranch?: {
    branchId: number;
    senderRealName: string;
    trackingNumber: string;
  };
  nonIntegrated?: {
    trackingNumber: string;
  };
}

export interface TrackingInfo {
  orderId: string;
  packageNumber: string;
  logisticsStatus: string;
  trackingNumber: string;
  updateTime: number;
  trackingHistory: Array<{
    updateTime: number;
    description: string;
    logisticsStatus: string;
  }>;
}

export interface GetShippingProvidersParams {
  orderId: string;
}

export interface GetShippingParameterParams {
  orderId: string;
  packageNumber?: string;
}

export interface GetTrackingInfoParams {
  orderId: string;
  packageNumber?: string;
}

export interface LogisticsApiPort {
  getShippingProviders(params: GetShippingProvidersParams): Promise<ShippingProvider[]>;
  getShippingParameter(params: GetShippingParameterParams): Promise<ShippingParameter>;
  createShippingOrder(request: CreateShippingOrderRequest): Promise<void>;
  getTrackingInfo(params: GetTrackingInfoParams): Promise<TrackingInfo>;
}
