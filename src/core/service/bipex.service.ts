import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import Decimal from 'decimal.js';
import FormData = require('form-data');

@Injectable()
export class BipexService {
  private authKey;
  private client;
  private btcAddress;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.authKey = this.configService.get<string>('BIPEX_AUTH_KEY');
    this.client = axios.create({
      method: 'POST',
      baseURL: 'https://bipex.net/dex/ajax.php',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    this.btcAddress = this.configService.get<string>('BTC_ADDRESS');
  }

  async getBIPSumToConvert(amountBTC: Decimal, symbol: string = 'BTC') {
    // get open order in bipex
    // calculate sum in BIP
    let sum = new Decimal(0);
    let maxPrice = new Decimal(0);
    let sumBip = new Decimal(0);

    try {
      const bodyFormData = new FormData();
      bodyFormData.append('getOrders', '1');
      bodyFormData.append('token', symbol);
      bodyFormData.append('authkey', this.authKey);

      const response = await this.client.request({
        data: bodyFormData,
        headers: bodyFormData.getHeaders(),
      });
      if (response.data && response.data.BUY && response.data.BUY.BTC) {
        // tslint:disable-next-line:forin
        for (const key in response.data.BUY.BTC) {
          const item = response.data.BUY.BTC[key];
          if (amountBTC.gte(sum)) {
            sum = sum.plus(new Decimal(item.volume).mul(item.price));
            maxPrice = item.price;
          } else {
            break;
          }
        }
      }
    } catch (error) {
      global.console.error(error);

      return null;
    }

    sumBip = amountBTC.div(maxPrice);
    // return it
    return {
      amountBTC,
      amountBIP: sumBip,
      price: maxPrice,
    };
  }

  async createBuyOrder(amountBIP: Decimal, priceBTC: Decimal, symbol: string = 'BTC') {
    try {
      const bodyFormData = new FormData();
      bodyFormData.append('type', 'buy');
      bodyFormData.append('addDial', '1');
      bodyFormData.append('token', symbol);
      bodyFormData.append('amount', amountBIP.toString());
      bodyFormData.append('price', priceBTC.toString());
      bodyFormData.append('authkey', this.authKey);

      const response = await this.client.request({
        method: 'POST',
        data: bodyFormData,
        headers: bodyFormData.getHeaders(),
      });

      if (response.data && response.data.OK) {
        return true;
      }

      global.console.error(response.data);
    } catch (error) {
      global.console.error(error);
    }
    return false;
  }

  async getDepositAddress() {
    return this.configService.get<string>('BIPEX_BIP_DEPOSIT_ADDRESS');
  }

  async withdrawalBTC(amountBTC, symbol: string = 'BTC') {
    try {
      const bodyFormData = new FormData();
      bodyFormData.append('withdraw', '1');
      bodyFormData.append('token', symbol);
      bodyFormData.append('amount', amountBTC.toString());
      bodyFormData.append('address', this.btcAddress);
      bodyFormData.append('authkey', this.authKey);

      const response = await this.client.request({
        method: 'POST',
        data: bodyFormData,
        headers: bodyFormData.getHeaders(),
      });

      if (response.data && response.data.OK) {
        return true;
      }

      global.console.error(response.data);
    } catch (error) {
      global.console.error(error);
    }
    return false;
  }
}
