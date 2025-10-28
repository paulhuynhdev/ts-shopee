import { BaseModule } from '../../core/BaseModule';
import {
  LogisticsApiPort,
  ShippingProvider,
  ShippingParameter,
  CreateShippingOrderRequest,
  TrackingInfo,
  GetShippingProvidersParams,
  GetShippingParameterParams,
  GetTrackingInfoParams,
} from './ports';

export class LogisticsModule extends BaseModule implements LogisticsApiPort {
  async getShippingProviders(params: GetShippingProvidersParams): Promise<ShippingProvider[]> {
    const response = await this.get<{
      logistics_channel_list: Array<{
        logistics_channel_id: number;
        logistics_channel_name: string;
        enabled: boolean;
        shipping_fee_type: string;
        size_list: Array<{
          size_id: number;
          name: string;
          default_price: number;
        }>;
        weight_limit: {
          item_max_weight: number;
          item_min_weight: number;
        };
        item_max_dimension: {
          height: number;
          width: number;
          length: number;
          unit: string;
        };
        volume_limit: {
          item_max_volume: number;
          item_min_volume: number;
        };
        preferred_delivery_time: boolean;
        cod_enabled: boolean;
        mask_channel_id: number;
      }>;
    }>('/api/v2/logistics/get_shipping_parameter', { order_sn: params.orderId });

    return response.logistics_channel_list.map((channel) => ({
      logisticId: channel.logistics_channel_id,
      logisticName: channel.logistics_channel_name,
      enabled: channel.enabled,
      shippingFeeType: channel.shipping_fee_type,
      sizeList: channel.size_list.map((size) => ({
        sizeId: size.size_id,
        name: size.name,
        defaultPrice: size.default_price,
      })),
      weightLimit: {
        itemMaxWeight: channel.weight_limit.item_max_weight,
        itemMinWeight: channel.weight_limit.item_min_weight,
      },
      itemMaxDimension: {
        height: channel.item_max_dimension.height,
        width: channel.item_max_dimension.width,
        length: channel.item_max_dimension.length,
        unit: channel.item_max_dimension.unit,
      },
      volumeLimit: {
        itemMaxVolume: channel.volume_limit.item_max_volume,
        itemMinVolume: channel.volume_limit.item_min_volume,
      },
      preferredDeliveryTime: channel.preferred_delivery_time,
      codEnabled: channel.cod_enabled,
      maskChannelId: channel.mask_channel_id,
    }));
  }

  async getShippingParameter(params: GetShippingParameterParams): Promise<ShippingParameter> {
    const queryParams: Record<string, unknown> = {
      order_sn: params.orderId,
    };

    if (params.packageNumber) {
      queryParams.package_number = params.packageNumber;
    }

    const response = await this.get<{
      info_needed?: {
        dropoff?: string[];
        pickup?: string[];
        non_integrated?: string[];
      };
      dropoff?: Array<{
        branch_id: number;
        region: string;
        state: string;
        city: string;
        address: string;
        zipcode: string;
        district: string;
        town: string;
      }>;
      pickup?: {
        address_list: Array<{
          address_id: number;
          region: string;
          state: string;
          city: string;
          district: string;
          town: string;
          address: string;
          zipcode: string;
          address_flag: string[];
        }>;
      };
    }>('/api/v2/logistics/get_shipping_parameter', queryParams);

    return {
      infoNeeded: response.info_needed
        ? {
            dropoff: response.info_needed.dropoff,
            pickup: response.info_needed.pickup,
            nonIntegrated: response.info_needed.non_integrated,
          }
        : {},
      dropoff: response.dropoff?.map((branch) => ({
        branchId: branch.branch_id,
        region: branch.region,
        state: branch.state,
        city: branch.city,
        address: branch.address,
        zipcode: branch.zipcode,
        district: branch.district,
        town: branch.town,
      })),
      pickup: response.pickup
        ? {
            addressList: response.pickup.address_list.map((addr) => ({
              addressId: addr.address_id,
              region: addr.region,
              state: addr.state,
              city: addr.city,
              district: addr.district,
              town: addr.town,
              address: addr.address,
              zipcode: addr.zipcode,
              addressFlag: addr.address_flag,
            })),
          }
        : undefined,
    };
  }

  async createShippingOrder(request: CreateShippingOrderRequest): Promise<void> {
    const requestBody: Record<string, unknown> = {
      order_sn: request.orderId,
    };

    if (request.packageNumber) {
      requestBody.package_number = request.packageNumber;
    }

    if (request.pickupAddress) {
      requestBody.pickup = {
        address_id: request.pickupAddress.addressId,
      };
    }

    if (request.dropoffBranch) {
      requestBody.dropoff = {
        branch_id: request.dropoffBranch.branchId,
        sender_real_name: request.dropoffBranch.senderRealName,
        tracking_number: request.dropoffBranch.trackingNumber,
      };
    }

    if (request.nonIntegrated) {
      requestBody.non_integrated = {
        tracking_number: request.nonIntegrated.trackingNumber,
      };
    }

    await this.post('/api/v2/logistics/ship_order', requestBody);
  }

  async getTrackingInfo(params: GetTrackingInfoParams): Promise<TrackingInfo> {
    const queryParams: Record<string, unknown> = {
      order_sn: params.orderId,
    };

    if (params.packageNumber) {
      queryParams.package_number = params.packageNumber;
    }

    const response = await this.get<{
      order_sn: string;
      package_number: string;
      logistics_status: string;
      tracking_number: string;
      update_time: number;
      tracking_history: Array<{
        update_time: number;
        description: string;
        logistics_status: string;
      }>;
    }>('/api/v2/logistics/get_tracking_info', queryParams);

    return {
      orderId: response.order_sn,
      packageNumber: response.package_number,
      logisticsStatus: response.logistics_status,
      trackingNumber: response.tracking_number,
      updateTime: response.update_time,
      trackingHistory: response.tracking_history.map((history) => ({
        updateTime: history.update_time,
        description: history.description,
        logisticsStatus: history.logistics_status,
      })),
    };
  }
}

export * from './ports';
