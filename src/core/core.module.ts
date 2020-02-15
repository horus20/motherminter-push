import { Module  } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { CoreController } from './core.controller';
import { Account, Company, Wallet, Warehouse } from './entity';
import { AccountService, CompanyService, PartnerService, WalletService, WarehouseService } from './service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Warehouse, Company, Wallet, Account])],
  controllers: [CoreController],
  providers: [CompanyService, WarehouseService, WalletService, AccountService, PartnerService],
  // exports: [CoreService],
})
export class CoreModule {}
