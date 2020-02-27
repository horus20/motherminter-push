import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import Decimal from 'decimal.js';

@Injectable()
export class BipexService {
  private authKey;
  private client;
  private btcAddress;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.authKey = this.configService.get<string>('BIPEX_AUTH_KEY');
    this.client = axios.create({ method: 'POST', baseURL: 'https://bipex.net/dex/ajax.php'});
    this.btcAddress = this.configService.get<string>('BTC_ADDRESS');
  }

  async getBIPSumToConvert(amountBTC: Decimal, symbol: string = 'BTC') {
    // get open order in bipex
    // calculate sum in BIP
    let sum = new Decimal(0);
    let maxPrice = new Decimal(0);
    let sumBip = new Decimal(0);

    try {
      const response = await this.client.request({ data: {
          getOrders: 1,
          token: symbol,
          authkey: this.authKey,
        }});
      if (response.data && response.data.BUY && response.data.BUY.BTC) {
        response.data.BUY.BTC.forEach((item) => {
          if (amountBTC.gte(sum)) {
            sum = sum.plus(new Decimal(item.volume).mul(item.price));
            maxPrice = item.price;
          }
        });
      }
    } catch (error) {
      global.console.error(error);

      return null;
    }

    sumBip = amountBTC.div(maxPrice);
    // return it
    return sumBip.toNumber();
  }

  async createBuyOrder(amountBIP: Decimal, priceBTC: Decimal, symbol: string = 'BTC') {
    try {
      const response = await this.client.request({ method: 'POST', data: {
          type: 'buy',
          addDial: 1,
          token: symbol,
          amount: amountBIP.toNumber(),
          price: priceBTC.toNumber(),
          authkey: this.authKey,
        }});

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
      const response = await this.client.request({ data: {
          withdraw: 1,
          token: symbol,
          amount: amountBTC.toNumber(),
          address: this.btcAddress,
          authkey: this.authKey,
        }});

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
