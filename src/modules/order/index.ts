import { BaseModule } from '../../core/BaseModule';
import {
  OrderApiPort,
  Order,
  OrderListParams,
  PaginatedOrderList,
  CancelOrderRequest,
  HandleReturnRequest,
} from './ports';

export class OrderModule extends BaseModule implements OrderApiPort {
  async getOrderList(params: OrderListParams): Promise<PaginatedOrderList> {
    const queryParams: Record<string, unknown> = {
      time_range_field: params.timeRangeField,
      time_from: params.timeFrom,
      time_to: params.timeTo,
      page_size: params.pageSize || 50,
    };

    if (params.cursor) {
      queryParams.cursor = params.cursor;
    }

    if (params.orderStatus) {
      queryParams.order_status = params.orderStatus;
    }

    if (params.responseOptionalFields && params.responseOptionalFields.length > 0) {
      queryParams.response_optional_fields = params.responseOptionalFields.join(',');
    }

    const response = await this.get<{
      order_list: Array<{
        order_sn: string;
        order_status: string;
        create_time: number;
        update_time: number;
      }>;
      more: boolean;
      next_cursor: string;
    }>('/api/v2/order/get_order_list', queryParams);

    return {
      orderList: response.order_list.map((order) => ({
        orderId: order.order_sn,
        orderStatus: order.order_status,
        createTime: order.create_time,
        updateTime: order.update_time,
      })),
      more: response.more,
      nextCursor: response.next_cursor,
    };
  }

  async getOrder(orderId: string): Promise<Order> {
    const response = await this.get<{
      order_sn: string;
      order_status: string;
      cancel_reason: string;
      cancel_by: string;
      fm_tn: string;
      to_name: string;
      to_address: string;
      to_phone: string;
      total_amount: number;
      actual_shipping_fee: number;
      goods_to_declare: boolean;
      message_to_seller: string;
      note: string;
      note_update_time: number;
      item_list: Array<{
        item_id: number;
        item_name: string;
        item_sku: string;
        model_id: number;
        model_name: string;
        model_sku: string;
        model_quantity_purchased: number;
        model_original_price: number;
        model_discounted_price: number;
        wholesale: boolean;
        weight: number;
        add_on_deal: boolean;
        main_item: boolean;
        add_on_deal_id: number;
        promotion_type: string;
        promotion_id: number;
        order_item_id: number;
        promotion_group_id: number;
        image_info: {
          image_url: string;
        };
        product_location_id: string[];
        is_cancelled_item: boolean;
        is_wholesale: boolean;
      }>;
      pay_time: number;
      dropshipper: string;
      dropshipper_phone: string;
      split_up: boolean;
      buyer_user_id: number;
      buyer_username: string;
      estimated_shipping_fee: number;
      recipient_address: {
        name: string;
        phone: string;
        town: string;
        district: string;
        city: string;
        state: string;
        region: string;
        zipcode: string;
        full_address: string;
      };
      invoice_data: {
        number: string;
        series_number: string;
        access_key: string;
        issue_date: number;
        total_value: number;
        products_total_value: number;
        tax_code: string;
      };
      checkout_shipping_carrier: string;
      reverse_shipping_fee: number;
      order_charge_fee_list: Array<{
        fee_type: string;
        fee_name: string;
        amount: number;
      }>;
      create_time: number;
      update_time: number;
      days_to_ship: number;
      ship_by_date: number;
      buyer_cancel_reason: string;
      buyer_cpf_id: string;
      fulfillment_flag: string;
      pickup_done_time: number;
      package_list: Array<{
        package_number: string;
        logistics_status: string;
        shipping_carrier: string;
        item_list: Array<{
          item_id: number;
          model_id: number;
          quantity: number;
        }>;
      }>;
      shipping_carrier: string;
      payment_method: string;
      region: string;
      currency: string;
    }>('/api/v2/order/get_order_detail', { order_sn_list: orderId });

    return {
      orderId: response.order_sn,
      orderStatus: response.order_status,
      cancelReason: response.cancel_reason,
      cancelBy: response.cancel_by,
      fmTn: response.fm_tn,
      toName: response.to_name,
      toAddress: response.to_address,
      toPhone: response.to_phone,
      totalAmount: response.total_amount,
      actualShippingFee: response.actual_shipping_fee,
      goodsToDeclare: response.goods_to_declare,
      messageToSeller: response.message_to_seller,
      note: response.note,
      noteUpdateTime: response.note_update_time,
      itemList: response.item_list.map((item) => ({
        itemId: item.item_id,
        itemName: item.item_name,
        itemSku: item.item_sku,
        modelId: item.model_id,
        modelName: item.model_name,
        modelSku: item.model_sku,
        modelQuantityPurchased: item.model_quantity_purchased,
        modelOriginalPrice: item.model_original_price,
        modelDiscountedPrice: item.model_discounted_price,
        wholesale: item.wholesale,
        weight: item.weight,
        addOnDeal: item.add_on_deal,
        mainItem: item.main_item,
        addOnDealId: item.add_on_deal_id,
        promotionType: item.promotion_type,
        promotionId: item.promotion_id,
        orderItemId: item.order_item_id,
        promotionGroupId: item.promotion_group_id,
        imageInfo: {
          imageUrl: item.image_info.image_url,
        },
        productLocationId: item.product_location_id,
        isCancelledItem: item.is_cancelled_item,
        isWholesale: item.is_wholesale,
      })),
      payTime: response.pay_time,
      dropshipper: response.dropshipper,
      dropshipperPhone: response.dropshipper_phone,
      splitUp: response.split_up,
      buyerUserId: response.buyer_user_id,
      buyerUsername: response.buyer_username,
      estimatedShippingFee: response.estimated_shipping_fee,
      recipientAddress: {
        name: response.recipient_address.name,
        phone: response.recipient_address.phone,
        town: response.recipient_address.town,
        district: response.recipient_address.district,
        city: response.recipient_address.city,
        state: response.recipient_address.state,
        region: response.recipient_address.region,
        zipcode: response.recipient_address.zipcode,
        fullAddress: response.recipient_address.full_address,
      },
      invoiceData: {
        number: response.invoice_data.number,
        seriesNumber: response.invoice_data.series_number,
        accessKey: response.invoice_data.access_key,
        issueDate: response.invoice_data.issue_date,
        totalValue: response.invoice_data.total_value,
        productsTotalValue: response.invoice_data.products_total_value,
        taxCode: response.invoice_data.tax_code,
      },
      checkoutShippingCarrier: response.checkout_shipping_carrier,
      reverseShippingFee: response.reverse_shipping_fee,
      orderChargeFeeList: response.order_charge_fee_list.map((fee) => ({
        feeType: fee.fee_type,
        feeName: fee.fee_name,
        amount: fee.amount,
      })),
      createTime: response.create_time,
      updateTime: response.update_time,
      daysToShip: response.days_to_ship,
      shipByDate: response.ship_by_date,
      buyerCancelReason: response.buyer_cancel_reason,
      buyerCpfId: response.buyer_cpf_id,
      fulfillmentFlag: response.fulfillment_flag,
      pickupDoneTime: response.pickup_done_time,
      packageList: response.package_list.map((pkg) => ({
        packageNumber: pkg.package_number,
        logisticsStatus: pkg.logistics_status,
        shippingCarrier: pkg.shipping_carrier,
        itemList: pkg.item_list.map((item) => ({
          itemId: item.item_id,
          modelId: item.model_id,
          quantity: item.quantity,
        })),
      })),
      shippingCarrier: response.shipping_carrier,
      paymentMethod: response.payment_method,
      region: response.region,
      currency: response.currency,
    };
  }

  async cancelOrder(request: CancelOrderRequest): Promise<void> {
    const requestBody: Record<string, unknown> = {
      order_sn: request.orderId,
      cancel_reason: request.cancelReason,
    };

    if (request.itemList && request.itemList.length > 0) {
      requestBody.item_list = request.itemList.map((item) => ({
        item_id: item.itemId,
        model_id: item.modelId,
      }));
    }

    await this.post('/api/v2/order/cancel_order', requestBody);
  }

  async handleReturn(request: HandleReturnRequest): Promise<void> {
    const requestBody = {
      return_sn: request.returnSn,
    };

    await this.post('/api/v2/order/handle_buyer_cancellation', requestBody);
  }
}

export * from './ports';
