import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import Decimal from 'decimal.js';

@Injectable()
export class BitrefillService {
  private authKey;
  private authSecret;
  private authToken;
  private authEmail;
  private depositAddress;
  private client;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.authKey = this.configService.get<string>('BITREFILL_API_KEY');
    this.authSecret = this.configService.get<string>('BITREFILL_API_SECRET');
    this.authToken = this.configService.get<string>('BITREFILL_TOKEN');
    this.authEmail = this.configService.get<string>('BITREFILL_EMAIL');
    this.depositAddress = this.configService.get<string>('BITREFILL_DEPOSIT_ADDRESS');

    // this.client = axios.create({ method: 'POST', baseURL: 'https://api.bitrefill.com/v1'});
    this.client = axios.create({ baseURL: 'https://www.bitrefill.com/api/', headers: {
        authorization: `Token ${this.authToken}`,
      }});
  }

  /*async createOrder(params) {
    if (!params.operatorSlug || !params.valuePackage) {
      global.console.error('fail to create bitrefill order for', params);
      return false;
    }

    try {
      const response = await this.client.request({
        url: 'order',
        method: 'POST',
        data: params,
      });
      global.console.info(response.data);

      if (response.data && response.data.status === 'paid') {
        // store and return order information
        return response.data;
      }

      global.console.error(response.data);
    } catch (error) {
      global.console.error(error);
    }
    return null;
  }

  async paymentOrder(params) {
    if (!params.operatorSlug || !params.valuePackage) {
      global.console.error('fail to create bitrefill order for', params);
      return false;
    }

    try {
      const response = await this.client.request({
        url: 'purchase',
        method: 'POST',
        data: params,
      });
      global.console.info(response.data);

      if (response.data && response.data.status === 'success') {
        return true;
      }

      global.console.error(response.data);
    } catch (error) {
      global.console.error(error);
    }
    return false;
  }*/

  async checkList(slug) {
    try {
      const response = await this.client.request({
        url: `product/${slug}`,
        method: 'GET',
      });
      global.console.info(slug, response.data);

      if (response.data && response.data.packages) {
        return response.data.packages;
      }
    } catch (error) {
      global.console.error(slug, error);
    }
    return false;
  }

  async createOrder(orderParams) {
    try {
      const response = await this.client.request({
        url: 'accounts/invoice',
        method: 'POST',
        data: {
          items: [
            orderParams,
          ],
          email: this.authEmail,
          isSubscribing: false,
          paymentMethod: 'dashboard',
        },
      });
      global.console.info(orderParams, response.data);

      if (response.data && response.data.status === 'unpaid' && response.data.id) {
        return response.data;
      }
    } catch (error) {
      global.console.error(orderParams, error);
    }
    return false;
  }

  async payInvoice(orderId) {
    try {
      const response = await this.client.request({
        url: 'accounts/pay_invoice',
        method: 'POST',
        data: {
          invoiceId: orderId,
          currency: 'XBT',
        },
      });
      global.console.info(orderId, response.data);

      if (response.data) {
        return response.data;
      }
    } catch (error) {
      global.console.error(orderId, error);
    }
    return false;
  }
}
