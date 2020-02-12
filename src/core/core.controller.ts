import {
  Get,
  Post,
  Body,
  Put,
  Delete,
  Query,
  Param,
  Controller,
  ClassSerializerInterceptor,
  UseInterceptors,
  HttpException, HttpStatus, HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Company, Wallet } from './entity';
import { CompanyDto, WalletDto } from './dto';
import { CompanyService, LINK, PartnerService, WalletService } from './service';
import { json } from 'express';

const API_LINK = 'https://p.motherminter.org/';

@ApiTags('api')
@Controller('api')
export class CoreController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly walletService: WalletService,
    private readonly partnerService: PartnerService,
  ) {
  }

  @Post('company')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Create company simple/complex'})
  async createCompany(@Body() company: CompanyDto): Promise<Company> {
    return this.companyService.create(company);
  }

  @Get('company/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Get information by company'})
  async getCompany(@Param() params, @Body() body): Promise<Company> {
    if (body && body.password) {
      return this.companyService.get(params.id, body.password);
    }
    throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
  }

  @Post('company/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Update company info'})
  async updateCompany(@Param() params, @Body() body): Promise<Company> {
    if (body && body.password) {
      return this.companyService.update(params.id, body.password, body);
    }
    throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
  }

  @Get('company/:id/wallets')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Get company wallet list'})
  async getCompanyWallets(@Param() params, @Body() body): Promise<Wallet[]> {
    if (body && body.password) {
      return this.companyService.walletList(params.id, body.password);
    }
    throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
  }

  @Get('company/:uid/get_wallet')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Get new wallet by company'})
  async getCompanyNewWallets(@Param() params, @Query() query): Promise<string[]> {
    if (params.uid && query.count) {
      return this.companyService.getWalletList(params.uid, query.count);
    }
    throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
  }

  @Post('company/:uid/email')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Send wallet list to company email'})
  async sentListToEmail(@Param() params, @Query() query) {
    if (params.uid) {
      const company = await this.companyService.getCompany(params.uid);
      const emailData = JSON.stringify({
        wallets: company.wallets
          .map((wallet) => `${LINK}${wallet.wallet}`),
      });

      await this.partnerService.sendEmail({
        to: company.email,
        subject: `Wallet list by multiple mode. Push #${company.uid}`, // Subject line
        text: emailData,
      });
      return true;
    }
    throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
  }

  @Post('company/:uid/email_link')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Send "one more wallet" link to compnany email'})
  async sentLinkToEmail(@Param() params, @Query() query) {
    if (params.uid) {
      const company = await this.companyService.getCompany(params.uid);
      const emailData = `${API_LINK}api/company/${company.uid}/get_wallet?count=1`;

      await this.partnerService.sendEmail({
        to: company.email,
        subject: `Api link for generate wallets. Push #${company.uid}`, // Subject line
        text: emailData,
      });
      return true;
    }
    throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Get wallet information by UID'})
  async getWallet(@Param() params): Promise<Wallet> {
    return this.walletService.get(params.id);
  }

  @Post(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Check login or activate wallet'})
  async activateWallet(@Param() params, @Body() walletData: WalletDto): Promise<Wallet> {
    if (walletData.custom) {
      const company = await this.companyService.getCustomCompany();

      return this.walletService.custom(company, params.id, walletData);
    }
    return this.walletService.login(params.id, walletData);
  }

  @Post(':id/complex')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Get wallet information before activation'})
  async complexParams(@Param() params, @Body() walletData: WalletDto) {
    const wallet = await this.walletService.get(params.id);
    const companyParams = wallet.company.getParams();

    return {
      notice: (companyParams && companyParams.notice) ? companyParams.notice : '',
      balance: (companyParams && companyParams.amount) ? companyParams.amount : '',
    };
  }

  @Post(':id/after')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Get wallet information after activation'})
  async afterActivate(@Param() params, @Body() walletData: WalletDto) {
    if (walletData.custom) {
      return {};
    }

    const wallet = await this.walletService.login(params.id, walletData);
    const companyParams = wallet.company.getParams();

    return {
      msg: (companyParams && companyParams.title) ? companyParams.title : '',
    };
  }

  @Post(':id/reply')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Send reply/activation info'})
  async replyActivate(@Param() params, @Body() walletData: WalletDto) {
    if (walletData.reply.length < 100) {
      return {
        status: 'error',
        msg: 'too short',
      };
    }

    const wallet = await this.walletService.login(params.id, walletData);
    await this.walletService.storeReply(wallet, walletData);
    if (wallet.company && wallet.company.email) {
      const email = '';
      await this.partnerService.sendEmail({
        to: wallet.company.email,
        subject: 'New reply', // Subject line
        text: `${wallet.wallet} - ${walletData.reply}`,
      });
    }

    return {
      status: 'ok',
    };
  }

  /*@Post(':id/balance')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Update wallet balance'})
  async updateWalletBalance(@Param() params, @Body() walletData: WalletDto): Promise<Wallet> {
    return this.walletService.setBalance(params.id, walletData);
  }*/

  @Post(':id/send')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Send raw signed transaction to network'})
  async send(@Param() params, @Body() walletData: WalletDto, @Body() body): Promise<string> {
    return this.walletService.send(params.id, walletData, body.rawTx);
  }

  /**
   * integrations
   */
  @Post(':id/services/phone')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ description: 'Send information to bipToPhone service'})
  async servicesPhone(@Param() params, @Body() walletData: WalletDto, @Body() body): Promise<string> {
    if (walletData.custom) {
      const wallet = await this.walletService.custom(null, params.id, walletData);
      if (!wallet) {
        throw new HttpException('need login', HttpStatus.UNAUTHORIZED);
      }
    } else {
      await this.walletService.login(params.id, walletData);
    }

    return this.partnerService.sendToPhone(body.phone);
  }
}
