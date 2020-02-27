import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import Decimal from 'decimal.js';

@Injectable()
export class BitrefillService {
  private authKey;
  private authSecret;
  private depositAddress;
  private client;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.authKey = this.configService.get<string>('BITREFILL_API_KEY');
    this.authSecret = this.configService.get<string>('BITREFILL_API_SECRET');
    this.depositAddress = this.configService.get<string>('BITREFILL_DEPOSIT_ADDRESS');

    this.client = axios.create({ method: 'POST', baseURL: 'https://api.bitrefill.com/v1'});
  }

  async createOrder(params) {
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
  }
}
